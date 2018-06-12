import os, sys, time, json, datetime
import argparse, threading

from flask import Flask, send_from_directory
from flask import request, make_response, abort 
from flask import jsonify, json

from eth import *

VERSION = 1
APP_ROOT = os.getcwd()
STATIC_DIR = [ 'public', os.path.join('..', 'pages') ]

parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int)
parser.add_argument('--contract')
parser.add_argument('--contractAddress')
parser.add_argument('--wallet')
parser.add_argument('--privateKey')
parser.add_argument('--wsProvider')

args = parser.parse_args()

app = Flask(__name__)

PORT = args.port if args.port else 3000

#TODO Exercies 0. Start of configuraiton
#Set the provider's URL
PROVIDER_URL = args.wsProvider if args.wsProvider else '__DEFAULT_PROVIDER_URL__'

#TODO Set your wallet's address
WALLET = args.wallet if args.wallet else '__DEFAULT_WALLET__'

#TODO Set your wallet's private key. Prefix with 0x 
#Note: For rinkeby only. DO NOT use your real private key
PRIVATE_KEY = args.privateKey if args.privateKey else '__DEFAULT_PRIVATE_KEY__'

#TODO Your contract ABI
CONTRACT_ABI = args.contract if args.contract else '__DEFAULT_CONTRACT_ABI__'

#TODO Your contract's address here
CONTRACT_ADDRESS = args.contractAddress if args.contractAddress else '__DEFAULT_CONTRACT_ADDRESS__'

#End of configuration

#TODO Exercise 1. Load Web3, WebsocketProvider (web3) and geth_poa_middleware (web3.middleware)
from web3 import Web3, WebsocketProvider
from web3.middleware import geth_poa_middleware

#TODO Exercise 2. Connect to the Blockchain, inject geth_poa_middleware 
rinkeby = Web3(WebsocketProvider(PROVIDER_URL))
rinkeby.middleware_stack.inject(geth_poa_middleware, layer=0)

#TODO Exercise 3. Load contract ABI
abiFile = open(os.path.join('public', CONTRACT_ABI), 'r').read()

#TODO Exercise 4. Instantiate an instance of the new contract
contract = rinkeby.eth.contract(address=CONTRACT_ADDRESS, abi=abiFile)

#End of setup

#TODO Exercise 5. Calling a pure/view method in your contract
@app.route('/api/v%d/viewOrder' %VERSION)
def viewOrder():

   address = request.args.get('address')
   orderId = int(request.args.get('orderId'))

   #TODO Call viewOrder() from your contract
   result = contract.functions.viewOrder(address, orderId).call()

   #Return result from viewOrder as JSON
   order = { 'customer': result[0], 'orderId': orderId
         , 'contents': json.loads(result[1])
         , 'total': float(rinkeby.fromWei(result[2], 'ether'))
         , 'time': time.strftime('%a %b %d %Y %H:%M:%S %Z', time.localtime(result[3])) }

   return jsonify(order)

#TODO Exercise 5. Optional - checking transaction hash
@app.route('/api/v%d/checkout/<transaction>' %VERSION, methods = ['POST', 'GET'])
def checkOut(transaction):

   print('payload = ', request.get_json())

   #TODO Call getTransaction() to get the transaction details
   #Your code below
   result = rinkeby.eth.getTransaction(transaction)

   #Return transaction details as JSON
   txResult = { 'transaction': transaction, 'from': result['from'], 'gas': result['gas']
         , 'gasPrice': result['gasPrice'], 'value': result['value'] }

   return jsonify(txResult)

#TODO Exercise 6. See events.py

#TODO Exercise 7. Signing a method
@app.route('/api/v%d/balance' %VERSION)
def balance():

   #TODO  Get the ABI for checkBalance() from the contract 
   checkBalance = contract.functions.checkBalance()

   #TODO Get nonce for your WALLET - required
   nonce = rinkeby.eth.getTransactionCount(WALLET)

   #TODO Create transaction object for checkBalance
   tx = checkBalance.buildTransaction({ 'from': WALLET
      , 'nonce': nonce, 'gas': 100000, 'chainId': 4 })

   #TODO Sign the transaction
   signed_tx = rinkeby.eth.account.signTransaction(tx, '0x%s' %PRIVATE_KEY)

   #TODO Send raw transaction
   tx_hash = rinkeby.eth.sendRawTransaction(signed_tx.rawTransaction)

   #TODO Wait for transaction receipt
   tx_receipt = rinkeby.eth.waitForTransactionReceipt(tx_hash, timeout=300)

   #TODO Get balance
   balance = contract.events.Balance().processReceipt(tx_receipt)
   result = balance[0]['args']

   #Return balance details as JSON
   bal_result = { 'balance': float(rinkeby.fromWei(result['balance'], 'ether'))
         , 'time': time.strftime('%a %b %d %Y %H:%M:%S %Z', time.localtime(result['date'])) }

   return jsonify(bal_result)


#End of workshop

@app.route('/')
def index():
   return send_from_directory(STATIC_DIR[0], 'index.html')

@app.route('/api/v%d/ethereum' %VERSION, defaults = { 'currencies': None })
@app.route('/api/v%d/ethereum/<currencies>' %VERSION)
def ethereum(currencies):
   curr = currencies if currencies else 'SGD'
   rate = eth(curr)
   resp = make_response(json.dumps(rate), 200)
   resp.headers['Content-Type'] = 'application/json'
   return resp

@app.route('/api/v%d/contract' %VERSION)
def contractInfo():
   result = { 'contract': CONTRACT_ABI, 'address': CONTRACT_ADDRESS }
   return jsonify(result)

@app.route('/api/v%d/contract/<abiName>' %VERSION)
def contractAbi(abiName):
   return send_from_directory(os.path.join(APP_ROOT, 'public'), abiName)

@app.route('/<path:path>')
def others(path):
   for p in STATIC_DIR:
      if os.path.isfile(os.path.join(APP_ROOT, p, path)):
         return send_from_directory(os.path.join(APP_ROOT, p), path)
   abort(404)

if __name__ == '__main__':
   now = datetime.datetime.now()
   print('Starting application on port at %s on port %d' %(now.isoformat(), PORT))
   print('\tprovider url: %s' %PROVIDER_URL)
   print('\tcontract: %s' %CONTRACT_ABI)
   print('\taddress: %s' %CONTRACT_ADDRESS)
   app.run(debug = True, port = PORT)

import os, sys, time, json, datetime
import argparse

from eth import *

parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int)
parser.add_argument('--contract')
parser.add_argument('--contractAddress')
parser.add_argument('--wallet')
parser.add_argument('--privateKey')
parser.add_argument('--wsProvider')

args = parser.parse_args()

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

#TODO Exercise 2. Load contract ABI
abiFile = open(os.path.join('public', CONTRACT_ABI), 'r').read()

#TODO Exercise 3. Connect to the Blockchain, inject geth_poa_middleware 
rinkeby = Web3(WebsocketProvider(PROVIDER_URL))
rinkeby.middleware_stack.inject(geth_poa_middleware, layer=0)

#TODO Exercise 4. Instantiae an instance of the new contract
contract = rinkeby.eth.contract(address=CONTRACT_ADDRESS, abi=abiFile)

print('Starting event listener')
print('\tprovider url: %s' %PROVIDER_URL)
print('\tcontract: %s' %CONTRACT_ABI)
print('\taddress: %s' %CONTRACT_ADDRESS)

#Bug in Pythons Web3 - not possible to listen to this event
#TODO Exercise 6. Listen to Checkout event

#TODO create Checkout event filter from the latest block
balance_event_filter = contract.events.Checkout.createFilter(fromBlock = 'latest')

while True:
   print('Polling for events')

   #TODO poll for new events
   evts = balance_event_filter.get_new_entries()

   print('Checkout events = ', evts)

   #Poll time
   time.sleep(5)

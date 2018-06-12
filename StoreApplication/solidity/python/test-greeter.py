import time
import json
from pprint import pprint
from web3 import Web3, HTTPProvider
from web3.contract import ConciseContract

contract_address     = '0xecfcab0a285d3380e488a39b4bb21e777f8a4eac'

w3 = Web3(HTTPProvider('http://localhost:9545'))

w3.eth.enable_unaudited_features()

#print(w3)

if __name__ == "__main__":
    with open('../build/contracts/Greeter.json') as f:
        data = json.load(f)
    
    GreeterContract = w3.eth.contract(
        address=Web3.toChecksumAddress(contract_address),
        abi=data['abi'],
        ContractFactoryClass=ConciseContract
    )
    
    pprint(GreeterContract)
    
    print('Initial contract greeting: {}'.format(
        GreeterContract.greet()
    ))
    

    #print('Setting the greeting to Nihao...')
    tx_hash = GreeterContract.setGreeting('你好', transact={'from': w3.eth.accounts[0]})

    # Wait for transaction to be mined...
    #w3.eth.waitForTransactionReceipt(tx_hash)

    print('Updated contract greeting: {}'.format(
        GreeterContract.greet()
    ))
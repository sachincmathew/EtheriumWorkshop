import time
import json
from pprint import pprint
from web3 import Web3, HTTPProvider
from web3.contract import ConciseContract

contract_address = '0x345ca3e014aaf5dca488057592ee47305d9b3e10'

w3 = Web3(HTTPProvider('http://localhost:9545'))

w3.eth.enable_unaudited_features()

def wait_for_receipt(w3, tx_hash, poll_interval):
       while True:
        tx_receipt = w3.eth.getTransactionReceipt(tx_hash)
        if tx_receipt:
         return tx_receipt
        time.sleep(poll_interval)

if __name__ == "__main__":
    with open('../build/contracts/Store.json') as f:
        data = json.load(f)
    
    StoreContract = w3.eth.contract(
        address=Web3.toChecksumAddress(contract_address),
        abi=data['abi'],
        ContractFactoryClass=ConciseContract
    )
    
    pprint(StoreContract)
    
    print('Initial contract getBalance: {}'.format(
        StoreContract.getBalance()
    ))
    

    print('Change store name...')
    my_str_as_bytes = str.encode('AAA store')
    tx_hash = StoreContract.renameStoreTo(my_str_as_bytes, transact={'from': w3.eth.accounts[0]})

    # Wait for transaction to be mined...
    w3.eth.waitForTransactionReceipt(tx_hash)

    print('Updated store name: {}'.format(
        StoreContract.store_name().decode()
    ))

    pprint(w3.eth.accounts[1])
    tx_hash_register_cust = StoreContract.registerCustomer(
        w3.eth.accounts[1], str.encode('Customer 1'), w3.eth.getBalance(w3.eth.accounts[1]), transact={'from': w3.eth.accounts[0]})
    
    pprint(tx_hash_register_cust)
    receipt_register_customer = wait_for_receipt(w3, tx_hash_register_cust, 1)
    print("Transaction receipt mined: \n")
    pprint(dict(receipt_register_customer))

    tx_hash_add_product = StoreContract.registerProduct(
        55, str.encode('Milo'), str.encode('Energy Drink'), 10000000000000000000, 10000000000000000000, transact={'from': w3.eth.accounts[0]})
    
    pprint(tx_hash_add_product)
    receipt_add_product = wait_for_receipt(w3, tx_hash_add_product, 1)
    print("Transaction receipt mined: \n")
    pprint(dict(receipt_add_product))

    pprint(w3.eth.getBalance(w3.eth.accounts[0]))
    pprint(w3.eth.getBalance(w3.eth.accounts[1]))

    tx_hash_insertProdToCart = StoreContract.insertProductIntoCart(55, transact={'from': w3.eth.accounts[0]})

    
    pprint(tx_hash_insertProdToCart)
    
    print('What is inside the cart ?: {}'.format(
        StoreContract.getCart()
    ))

    tx_hash_checkoutCart = StoreContract.checkoutCart(transact={'from': w3.eth.accounts[1]})
    
    pprint(tx_hash_checkoutCart)
    

    pprint(w3.eth.getBalance(w3.eth.accounts[0]))
    pprint(w3.eth.getBalance(w3.eth.accounts[1]))
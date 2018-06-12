pragma solidity ^0.4.22;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Store.sol";

contract TestStore {
    Store store;
    address defaultOwner;
    address dummy;
    address customerAddress;


    function beforeAll () public {
        store = new Store();
        defaultOwner = address(this);
        dummy = address(0x00FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFDEADBEEF);
        customerAddress = address(0x00FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFAA);
        store.registerProduct(0, "default test product", "default description", 50, 1);
        store.registerProduct(55, "default test product 55", "default desc 55", 55, 1);
    }

    function testInitialBalanceUsingDeployedContract() public {
        Store _store = Store(DeployedAddresses.Store());
        uint256 expected = 0;
        Assert.equal(_store.getBalance(), expected, "Store should have 0 in initial balance");
    }

    function testRenameStore() public {
        bool expected = true;
        bool result = store.renameStoreTo("hellostore");
        Assert.equal(result, expected, "Store name should be changeable");
    }

    function testTransferOwnership() public {
        Store _store = new Store();
        address previous_owner = _store.owner();
        _store.transferOwnership(address(0x00FFFFFFFFFFFFFFFFFFFFFFFFFFDFFFFFDEADBEEF));
        //_store.acceptOwnership();
        bool owner_changed = (_store.owner() != previous_owner);
        Assert.isTrue(owner_changed, "Store owner should be changeable");
    }

    function testStoreBalanceAfterCheckout() public {
        address owner = address(this);
        Store _store = new Store();
        _store.registerProduct(0, "t-shirt", "lacoste", 40, 1);
        bool _regOk = _store.registerCustomer(owner, "DummyCustomer1", 100);
        bool _insertOk;
        uint256 _prod_pos;
        (_insertOk, _prod_pos) = _store.insertProductIntoCart(0);
        // let's try to check out
        bool _chkOutOk = _store.checkoutCart();
        uint256 balance = _store.getStoreBalance();
        bool allOk = _regOk && _insertOk && (_prod_pos == 0) && _chkOutOk && (balance > 0);
        Assert.isTrue(allOk, "Store balance should increase after checkout");
    }

    function testRegisterProduct() public {
        bool expected = true;
        bool result = store.registerProduct(99, "t-shirt", "lacoste", 40, 1);
        Assert.equal(result, expected, "Store should register a product");
    }

    function testDeregisterProduct() public {
        bool expected = true;
        bool result = store.deregisterProduct(99);
        Assert.equal(result, expected, "Store should de-register a product");
    }


}
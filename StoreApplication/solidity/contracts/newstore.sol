pragma solidity ^0.4.22;

contract Ownable {
    address public owner;


    event OwnershipRenounced(address indexed previousOwner);
    event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
    );


    /**
    * @dev The Ownable constructor sets the original `owner` of the contract to the sender
    * account.
    */
    constructor() public {
        owner = msg.sender;
    }

    /**
    * @dev Throws if called by any account other than the owner.
    */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
    * @dev Allows the current owner to transfer control of the contract to a newOwner.
    * @param newOwner The address to transfer ownership to.
    */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    /**
    * @dev Allows the current owner to relinquish control of the contract.
    */
    function renounceOwnership() public onlyOwner {
        emit OwnershipRenounced(owner);
        owner = address(0);
    }
}

contract MyStore is Ownable {

    uint256 private store_balance;
    
	event Checkout(uint ordId, address customer, string contents, uint256 total, uint256 date);

	struct Order {
		address customer;
		string contents;
		uint256 total;
		uint256 date;
	}

	mapping(address => Order[]) public orders;

    constructor() public {
        owner = msg.sender;
        store_balance = 0;
        if(address(this).balance > 0) revert();
    }
    
	function checkStoreBalance() public view returns (uint256) {
        return store_balance;
    }

	function transferToOwner() public payable onlyOwner returns (bool) {
		owner.transfer(address(this).balance);
	}

	function checkout(address _customer, string _contents) public payable returns (uint) {

		require(address(0) != _customer);

		uint256 ordDate = now;

		uint ordId = orders[_customer].push(Order(_customer, _contents, msg.value, ordDate));
		_customer.transfer(msg.value);
        store_balance += msg.value;
		emit Checkout(ordId, _customer, _contents, msg.value, ordDate);

		return (ordId);
	}

	function viewOrder(address _customer, uint _ordId) public view 
			returns (address customer, string contents, uint256 total, uint256 date) {

		Order[] storage allOrders = orders[_customer];

		require(allOrders.length > _ordId);

		Order storage currOrder = allOrders[_ordId];

		return (currOrder.customer, currOrder.contents, currOrder.total, currOrder.date);
	}
}

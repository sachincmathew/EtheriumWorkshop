pragma solidity ^0.4.24;

//import "./ownable.sol";
//contract MyStore is Ownable {

contract MyStore {

	event Checkout(uint ordId, address indexed customer, string contents, uint256 total, uint256 date);
	 
	event Balance(uint256 balance, uint256 date);

	struct Order {
		address customer;
		string contents;
		uint256 total;
		uint256 date;
	}

	address public owner;

	mapping(address => Order[]) public orders;

	constructor() public {
		owner = msg.sender;
	}

	modifier onlyOwner {
		require (owner == msg.sender);
		_;
	}

	function checkBalance() public onlyOwner returns(uint256) {
		emit Balance(address(this).balance, now);

		return (address(this).balance);
	}

	function transferToOwner() public payable onlyOwner returns (bool) {
		owner.transfer(address(this).balance);
	}

	function checkout(address _customer, string _contents) external payable returns (uint) {

		require(address(0) != _customer);

		uint256 ordDate = now;

		uint ordId = orders[_customer].push(Order(_customer, _contents, msg.value, ordDate));

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

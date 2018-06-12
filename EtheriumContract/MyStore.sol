//step 1
pragma solidity ^0.4.24;

//step 2
contract MyStore{
    
    //step 3a
    struct Order{
        address customer;
        string contents;
        uint256 total; //wei
        uint256 date; //now block.timestamp
    }
    
    //step 3b
    mapping(address => Order[]) public orders;//by default storage
    
    //step 4
    function viewOrder(address _customer, uint _orderId) 
        public view returns(address, string, uint256, uint256)
    {
        Order[] storage allOrders = orders[_customer];//needs to be storage; not memory
        require(allOrders.length > _orderId);
        Order storage order = allOrders[_orderId];
        return (_customer, order.contents, order.total, order.date);
    }
    
    //step 5
    function checkout(address _customer, string _contents)
        external payable returns(uint)
    {
        require (address(0) != _customer);//genesis block checking
        uint256 ordDate = now;
        uint msgvalue = msg.value;//to reduce gas cost an each msg call required gas, this is used twice in this method
        uint ordId = orders[_customer].push(Order(_customer, _contents, msgvalue, ordDate));
        emit Checkout(ordId, _customer, _contents, msgvalue, ordDate);
        return ordId;
    }
    
    event Checkout(uint ordId, address indexed_customer, string contents, uint total, uint date);
    
    //step 6 
    address public owner;
    
    constructor() public{
        owner = msg.sender;
    }
    
    modifier onlyOwner(){
        require(owner == msg.sender);
        _;
    }
    
    //step 7
    function checkBalance() 
        public view onlyOwner returns(uint256)
    {
        return address(this).balance;
    }
    
}
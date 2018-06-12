pragma solidity ^0.4.22;

library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
          return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }
    
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a / b;
        return c;
    }
    
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }
    
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

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

contract Store is Ownable {

    /* Store internals */
    bytes32 public store_name; // store name
    uint256 private store_balance;  // store balance

    mapping (address => Customer) customers;
    mapping (uint256 => Product) products;

    /* Store Events */
    event CustomerRegistered(address customer);
    event CustomerRegistrationFailed(address customer);
    event CustomerDeregistered(address customer);
    event CustomerDeregistrationFailed(address customer);

    event ProductRegistered(uint256 productId);
    event ProductDeregistered(uint256 productId);
    event ProductRegistrationFailed(uint256 productId);
    event ProductDeregistrationFaled(uint256 productId);

    event CartProductInserted(address customer, uint256 prodId, uint256 prodPrice, uint256 completeSum);
    event CartProductInsertionFailed(address customer, uint256 prodId);
    event CartProductRemoved(address customer, uint256 prodId);
    event CartCheckoutCompleted(address customer, uint256 paymentSum);
    event CartCheckoutFailed(address customer, uint256 customerBalance, uint256 paymentSum);
    event CartEmptied(address customer);

    /**
        @notice every customer has an address, name,
        balance and a shopping cart
    */
    struct Customer {
        address adr;
        bytes32 name;
        uint256 balance;
        Cart cart;
    }

    /**
        @notice A shopping cart contains an array of product ids: @products
        and a sum of product prices: @completeSum
        The @completeSum gets automatically updated when customer
        adds or removes products.
    */
    struct Cart {
      uint256[] products;
      uint256 completeSum;
    }

    /**
        @notice Represents a product:
        Product id: @id
        Product name: @name
        Decription: @description
        Amount of items in a single product: @default_amount
    */
    struct Product {
        uint256 id;
        bytes32 name;
        bytes32 description;
        uint256 price;
        uint256 default_amount;
    }

    
    /**
        @notice Default constructor
    */
    constructor() public {
        owner = msg.sender;
        store_name = "kenken64 store";
        store_balance = 0;
        if(address(this).balance > 0) revert();
    }

    /**
          @notice Payable fallback
    */
    function() payable public {

    }

    /**
          @notice Register a single product
          @param id Product ID
          @param name Product Name
          @param description Product Description
          @param price Product Price
          @param default_amount Default amount of items in a single product
          @return success
    */
    function registerProduct(uint256 id, bytes32 name, bytes32 description,
                             uint256 price, uint256 default_amount)
                                         onlyOwner public returns (bool success) {
                                    
        Product memory product = Product(id, name, description, price, default_amount);
        if (checkProductValidity(product)) {
            products[id] = product;
            emit ProductRegistered(id);
            return true;
        }
        emit ProductRegistrationFailed(id);
        return false;
    }

    /**
          @notice Removes a product from the list
          @param id Product ID
          @return success
    */
    function deregisterProduct(uint256 id) onlyOwner public returns (bool success) {
      Product storage product = products[id];
      if (product.id == id) {
        delete products[id];
        emit ProductDeregistered(id);
        return true;
      }
      emit ProductDeregistrationFaled(id);
      return false;
    }

    /**
          @notice Registers a new customer (only store owners)
          @param _address Customer's address
          @param _name Customer's name
          @param _balance Customer's balance
          @return success
    */
    function registerCustomer(address _address, bytes32 _name, uint256 _balance)
                                        onlyOwner public returns (bool success) {
      if (_address != address(0)) {
        Customer memory customer = Customer({ adr: _address, name: _name,
                                              balance: _balance,
                                              cart: Cart(new uint256[](0), 0)
                                            });
        customers[_address] = customer;
        emit CustomerRegistered(_address);
        return true;
      }
      emit CustomerRegistrationFailed(_address);
      return false;
    }

    /**
        @notice Removes a customer (only store owners)
        @param _address Customer's address
        @return success
    */
    function deregisterCustomer(address _address) onlyOwner
                                                        public returns (bool success) {
      Customer storage customer = customers[_address];
      if (customer.adr != address(0)) {
        delete customers[_address];
        emit CustomerDeregistered(_address);
        return true;
      }
      emit CustomerDeregistrationFailed(_address);
      return false;
    }
    
    function getCustomerName(address _address)
                                                        public view returns (bytes32 name) {
      return customers[_address].name;
    }

    /**
        @notice Inserts a product into the shopping cart.
        This function returns a boolean and the position of the
        inserted product.
        The positional information can later be used to directly reference
        the product within the mapping. Solidity mappings aren't interable.
        @param id Product ID
        @return (success, pos_in_prod_mapping)
    */
    function insertProductIntoCart(uint256 id) public returns (bool success,
                                                  uint256 pos_in_prod_mapping) {
        Customer storage cust = customers[msg.sender];
        Product storage prod = products[id];
        uint256 prods_prev_len = cust.cart.products.length;
        cust.cart.products.push(prod.id);
        uint256 current_sum = cust.cart.completeSum;
        cust.cart.completeSum = SafeMath.add(current_sum, prod.price);
        if (cust.cart.products.length > prods_prev_len) {
          emit CartProductInserted(msg.sender, id, prod.price, cust.cart.completeSum);
          return (true, cust.cart.products.length - 1);
        }
        emit CartProductInsertionFailed(msg.sender, id);
        return (false, 0);
    }

    /**
        @notice Removes a product entry from the shopping cart
        @param prod_pos_in_mapping Product's position in the internal mapping
    */
    function removeProductFromCart(uint256 prod_pos_in_mapping) public {
      /*if (msg.sender != owner) {*/
        uint256[] memory new_product_list = new uint256[](customers[msg.sender]
                                               .cart.products.length - 1);
        uint256[] memory customerProds = customers[msg.sender].cart.products;
        for (uint256 i = 0; i < customerProds.length; i++) {
          if (i != prod_pos_in_mapping) {
            new_product_list[i] = customerProds[i];
          } else {
            customers[msg.sender].cart.completeSum -=
                                               products[customerProds[i]].price;
            emit CartProductRemoved(msg.sender, customerProds[i]);
          }
        }
        customers[msg.sender].cart.products = new_product_list;
      /*}*/
    }

    /**
        @notice Invokes a checkout process that'll use the current shopping cart to
        transfer balances between the current customer and the store
        @return success
    */
    function checkoutCart() public returns (bool success) {
        Customer storage customer = customers[msg.sender];
        uint256 paymentSum = customer.cart.completeSum;
        if ((customer.balance >= paymentSum) &&
            customer.cart.products.length > 0) {
            customer.balance -= paymentSum;
            customer.cart = Cart(new uint256[](0), 0);
            store_balance += paymentSum;
            emit CartCheckoutCompleted(msg.sender, paymentSum);
            return true;
        }
        emit CartCheckoutFailed(msg.sender, customer.balance, paymentSum);
        return false;
    }

    /**
          @notice Empties the shopping cart
          @return success
    */
    function emptyCart() public returns (bool success) {
      /*if (msg.sender != owner) {*/
        Customer storage customer = customers[msg.sender];
        customer.cart = Cart(new uint256[](0), 0);
        emit CartEmptied(customer.adr);
        return true;
      /*}*/
      /*return false;*/
    }

    /**
          @notice Changes the name of the store
          @param new_store_name New store name
          @return success
    */
    function renameStoreTo(bytes32 new_store_name) onlyOwner
                                                        public returns (bool success) {
        if (new_store_name.length != 0 &&
            new_store_name.length <= 32) {
            store_name = new_store_name;
            return true;
        }
        return false;
    }
    
    function stringToBytes32(string memory source) pure public returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
    
        assembly {
            result := mload(add(source, 32))
        }
    }

    /**
          @notice Returns a elements describing a product
          @param id Product ID
          @return (name, description, price, default_amount)
    */
    function getProduct(uint256 id) constant public returns (bytes32 name,
                                                      bytes32 description,
                                                      uint256 price,
                                                      uint256 default_amount) {
       return (products[id].name,
               products[id].description,
               products[id].price,
               products[id].default_amount);
    }

    /**
        @notice Returns a list of product ids and a complete sum.
        The caller address must be a registered customer.
        @return (product_ids, complete_sum)
    */
    function getCart() constant public returns (uint256[] memory product_ids,
                                                          uint256 complete_sum) {
      Customer storage customer = customers[msg.sender];
      uint256 len = customer.cart.products.length;
      uint256[] memory ids = new uint256[](len);
      for (uint256 i = 0; i < len; i++) {
        ids[i] = products[i].id;
      }
      return (ids, customer.cart.completeSum);
    }

    /**
          @notice Returns customer's balance
          @return _balance Customer's balance
    */
    function getBalance() constant public returns (uint256 _balance) {
      return customers[msg.sender].balance;
    }

    /**
          @notice Returns stores's own balance
          @return store_balance Store's current balance
    */
    function getStoreBalance() onlyOwner constant public returns (uint256) {
      return store_balance;
    }

    /**
          @notice Checks product validity
          @param product Product struct
          @return valid
    */
    function checkProductValidity(Product product) private pure returns (bool valid) {
       return (product.price > 0);
    }
}
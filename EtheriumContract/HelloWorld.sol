pragma solidity ^0.4.24;

contract HelloWorld{
    string public greetings;
    
    constructor() public{
        greetings = 'Hello World';
    }
    
    function setGreetingsMEssage(string _text) public{
        greetings = _text;
    }
    
    function greet() public view returns (string){
        return greetings;
    }
}
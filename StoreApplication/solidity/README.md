# NUS ISS Ethereum Blockchain Workshop

![](https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/256px-Ethereum_logo_2014.svg.png)

## What is Ethereum?
Ethereum is an open-source, public, blockchain-based distributed computing platform and operating system featuring smart contract (scripting) functionality.[3] It supports a modified version of Nakamoto consensus via transaction based state transitions.


## What is a Ethereum Smart Contract ?

A Smart Contract Example. Here is the code for a basic smart contract that was written on the Ethereum blockchain. Contracts can be encoded on any blockchain, but Ethereum is mostly used since it gives unlimited processing capability. An example smart contract on Ethereum.

## What is Solidity ? (https://github.com/bkrem/awesome-solidity)

Solidity is a contract-oriented, high-level language for implementing smart contracts. It was influenced by C++, Python and JavaScript and is designed to target the Ethereum Virtual Machine (EVM).

## What is Ethereum Virtual Machine ? (https://github.com/ethereum/wiki/wiki/Ethereum-Virtual-Machine-(EVM)-Awesome-List)

At the heart of it is the Ethereum Virtual Machine (“EVM”), which can execute code of arbitrary algorithmic complexity. In computer science terms, Ethereum is “Turing complete”. ... The Ethereum blockchain database is maintained and updated by many nodes connected to the network.

![](https://media.coindesk.com/uploads/2017/03/state-3-15-01.png)

## What is truffle framework?
Truffle is a world class development environment, testing framework and asset pipeline for Ethereum, aiming to make life as an Ethereum developer easier. With Truffle, you get:

* Built-in smart contract compilation, linking, deployment and binary management.
* Automated contract testing for rapid development.
* Scriptable, extensible deployment & migrations framework.

## Pre-requisite
* Download & Install NodeJS (https://nodejs.org/en/download/)
* Install truffle ( npm ). For MacOS and Linux it require admin rights
```
Windows : npm install truffle -g
MacOS/Linux : sudo npm install truffle -g 
```
* Download Ganache CLI (https://github.com/trufflesuite/ganache-cli)
* Able to access to the Ethereum Remix IDE (https://remix.ethereum.org)
* Web3 Py (http://web3py.readthedocs.io/en/stable/index.html)
```
pip install web3
```

##  Scaffolding Ethereum Smart Contract Project structure
```
mkdir example-solidity
cd example-solidity
truffle init
```

## Start truffle develop blockchain network locally
Run the geth client 

```
truffle develop
```
After running the geth client it will show the below terminal result

```
Truffle Develop started at http://127.0.0.1:9545/

Accounts:
(0) 0x627306090abab3a6e1400e9345bc60c78a8bef57
(1) 0xf17f52151ebef6c7334fad080c5704d77216b732
(2) 0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef
(3) 0x821aea9a577a9b44299b9c15c88cf3087f3b5544
(4) 0x0d1d4e623d10f9fba5db95830f7d3839406c6af2
(5) 0x2932b7a2355d6fecc4b5c0b6bd44cc31df247a2e
(6) 0x2191ef87e392377ec08e7c08eb105ef5448eced5
(7) 0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5
(8) 0x6330a553fc93768f612722bb8c2ec78ac90b3bbc
(9) 0x5aeda56215b167893e80b4fe645ba6d5bab767de

Private Keys:
(0) c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3
(1) ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f
(2) 0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1
(3) c88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c
(4) 388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418
(5) 659cbb0e2411a44db63778987b1e22153c086a95eb6b18bdf89de078917abc63
(6) 82d052c865f5763aad42add438569276c00d3d88a2d062d36b2bae914d58b8c8
(7) aa3680d5d48a8283413f7a108367c7299ca73f553735860a87b08f39395618b7
(8) 0f62d96d6675f32685bbdb8ac13cda7c23436f63efbb9d07700d8669ff12b7c4
(9) 8d5366123cb560bb606379f90a0bfd4769eecc0557f1b362dcae9012b548b1e5

Mnemonic: candy maple cake sugar pudding cream honey rich smooth crumble sweet treat

⚠️  Important ⚠️  : This mnemonic was created for you by Truffle. It is not secure.
Ensure you do not use it on production blockchains, or else you risk losing funds.

truffle(develop)> 

```

# What is truffle migration ?
Basically is a contract development process that we need to deploy the blockchain network for testing.

## Migrate smart contracts
* Rename the truffle-config.js to truffle.js before running the migration
(https://ethereum.stackexchange.com/questions/38117/truffle-configuration-file-name-is-it-truffle-js-or-truffle-config-js)

* Configure the truffle.js as below

```
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    }
  }
};

```
* Before migrating new solidity contract we have to reset the contrac deployment to reflect the new changes . Migrate the contract to the development test net
```
truffle migrate --reset
truffle migrate --network development
```

```
Compiling ./contracts/Store.sol...
Writing artifacts to ./build/contracts

Using network 'development'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0xcc26379d04c6354cb7cedfddf4803088abe878944f11213ce2849ca881be65ee
  Migrations: 0x8cdaf0cd259887258bc13a92c0a6da92698644c0
Saving successful migration to network...
  ... 0xd7bc86d31bee32fa3988f1c1eabce403a1b5d570340a3a9cdba53a472ee8c956
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying Store...
  ... 0x12d8269747ada072b99c2ad0e5c99c691dc987ea1f830bf2abfd663eaf986654
  Store: 0x345ca3e014aaf5dca488057592ee47305d9b3e10
Saving successful migration to network...
  ... 0xf36163615f41ef7ed8f4a8f192149a0bf633fe1a2398ce001bf44c43dc7bdda0
Saving artifacts...

```

## Verify the contract is deployed to the local test net

```
truffle(develop)> networks

Network: develop (id: 4447)
  Migrations: 0x8cdaf0cd259887258bc13a92c0a6da92698644c0
  Store: 0x345ca3e014aaf5dca488057592ee47305d9b3e10

truffle(develop)> 

```
This is the smart contract address <b>Store: 0x345ca3e014aaf5dca488057592ee47305d9b3e10</b>

## Let's model an e-commerce store in Ethereum Solidity

Define all the objects require for a store

* Customer

```
struct Customer {
        address adr;
        bytes32 name;
        uint256 balance;
        Cart cart;
}
```
* Product
```
struct Product {
        uint256 id;
        bytes32 name;
        bytes32 description;
        uint256 price;
        uint256 default_amount;
    }
```
* Cart

```
struct Cart {
      uint256[] products;
      uint256 completeSum;
    }
```


Define all the actions that a store need to have in order to function as a e-commerce store

* Add Product
* Remove Product
* Add Customer
* Remove customer
* Add Product to Cart
* Remove Product from Cart
* Checkout
* Empty Cart


# Solidity Cheat Sheet

(https://github.com/manojpramesh/solidity-cheatsheet)
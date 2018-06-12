var Store = artifacts.require("Store");
var Greeter = artifacts.require("Greeter");
var MyStore = artifacts.require("MyStore");

module.exports = function(deployer) {
  deployer.deploy(Store)
    // Option 2) Console log the address:
    .then(() => console.log(Store.address))

    // Option 3) Retrieve the contract instance and get the address from that:
    .then(() => Store.deployed())
    .then(_instance => console.log(_instance.address));

    deployer.deploy(Greeter)
    // Option 2) Console log the address:
    .then(() => console.log(Greeter.address))

    // Option 3) Retrieve the contract instance and get the address from that:
    .then(() => Greeter.deployed())
    .then(_instance => console.log(_instance.address));

    deployer.deploy(MyStore)
    // Option 2) Console log the address:
    .then(() => console.log(MyStore.address))

    // Option 3) Retrieve the contract instance and get the address from that:
    .then(() => MyStore.deployed())
    .then(_instance => console.log(_instance.address));
};
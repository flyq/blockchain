var HelloWorld = artifacts.require("./helo.sol");

module.exports = function(deployer) {
  deployer.deploy(HelloWorld);
};

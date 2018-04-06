var CryptoThreeKingdomsTokenPackage = artifacts.require("./CryptoThreeKingdomsTokenPackage");
module.exports = function(deployer) {
  deployer.deploy(CryptoThreeKingdomsTokenPackage);
};

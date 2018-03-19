var ConvertLib = artifacts.require("./ConvertLib.sol");
var Remittance = artifacts.require("./Remittance.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var limitDuration = 10;

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(Remittance, limitDuration);
};

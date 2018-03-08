var Remittance = artifacts.require("./Remittance.sol");

module.exports = function(deployer) {
    var limitDuration = 10;

    deployer.deploy(Remittance, limitDuration);
};
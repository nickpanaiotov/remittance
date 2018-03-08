var Remittance = artifacts.require("./Remittance.sol");
var keccak256 = require('js-sha3').keccak256;


contract("Remittance", function (accounts) {

    var limitDuration = 3;

    var alice = accounts[0];
    var carol = accounts[1];

    var contract;

    beforeEach(function () {
        return Remittance.new(limitDuration, {from: alice})
            .then(function (instance) {
                contract = instance;
            });
    });


    it('everyone should be able to submit transaction', function () {
        var wei = 10;
        var password = "0x" + keccak256("pesho+gosho");

        return contract.submitTransation.call(carol, 1, password, {from: alice, value: wei})
            .then(function (wasSubmitted) {
                assert.strictEqual(wasSubmitted, true, "Unable to submit valid transaction!");
            })
    });

    it('submitter should be able to get deadline for the submitted transaction', function () {
        var wei = 10;
        var password = "0x" + keccak256("pesho+gosho");

        return contract.submitTransation(carol, 1, password, {from: alice, value: wei})
            .then(function (tnx) {
                return contract.getDeadline("pesho+", "gosho", {from: alice})
                    .then(function (deadline) {
                        var blockNumber = web3.eth.blockNumber;
                        assert.isBelow(blockNumber, deadline.toString(), "Unable to submit valid transaction!");
                    });
            })
    });

    it('submit transaction should fail when transaction is submitted without a wei', function () {
        var wei = 0;
        var password = "0x" + keccak256("pesho+gosho");

        return contract.submitTransation.call(carol, 1, password, {from: alice, value: wei})
            .then(function (wasSubmitted) {
                assert.fail('should have thrown before');
            })
            .catch(function (reason) {

            })
    });

    it('submit transaction should fail when contract duration is less than the duration submitted in the transaction', function () {
        var wei = 0;
        var password = "0x" + keccak256("pesho+gosho");

        return contract.submitTransation.call(carol, limitDuration + 1, password, {from: alice, value: wei})
            .then(function (wasSubmitted) {
                assert.fail('should have thrown before');
            })
            .catch(function (reason) {

            })
    });

    it('receiver can withdraw if the deadline is met and the passwords are correct', function () {
        var wei = 10;
        var password = "0x" + keccak256("pesho+gosho");

        return contract.submitTransation(carol, 2, password, {from: alice, value: wei})
            .then(function (tnx) {
                return contract.withdraw.call("pesho+", "gosho", {from: carol})
                    .then(function (succeed) {
                        assert.strictEqual(true, succeed, "Unable to withdraw!");
                    });
            })
    });

    it('submitter should be able withdraw if the deadline is not met and the passwords are correct', function () {
        var wei = 10;
        var password = "0x" + keccak256("pesho+gosho");

        return contract.submitTransation(carol, 1, password, {from: alice, value: wei})
            .then(function (tnx) {
                // Submit one dummy transaction to block++;
                return contract.submitTransation(carol, 1, "invalidPassword", {from: alice, value: 1});
            }).then(function (tnx) {
                return contract.withdraw("pesho+", "gosho", {from: alice})
                    .then(function (tnx) {
                    })
                    .catch(function (reason) {
                        return contract.withdraw.call("pesho+", "gosho", {from: alice})
                            .then(function (succeed) {
                                assert.strictEqual(true, succeed, "Unable to withdraw!");
                            })
                    });
            });
    });

    it('submitter should not be able to withdraw if the deadline is not met and the passwords are correct', function () {
        var wei = 10;
        var password = "0x" + keccak256("pesho+gosho");

        return contract.submitTransation(carol, 1, password, {from: alice, value: wei})
            .then(function (tnx) {
                return contract.withdraw.call("pesho+", "gosho", {from: alice})
                    .then(function (tnx) {
                    })
                    .catch(function (reason) {
                        return contract.getDeadline("pesho+", "gosho", {from: alice})
                            .then(function (deadline) {
                                var blockNumber = web3.eth.blockNumber;
                                assert.isBelow(blockNumber, deadline.toString(), "Deadline is met already!");
                            });
                    });
            });
    });
});
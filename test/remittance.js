let Remittance = artifacts.require("./Remittance.sol");
let keccak256 = require('js-sha3').keccak256;


contract("Remittance", function (accounts) {

    let limitDuration = 3;

    let alice = accounts[0];
    let carol = accounts[1];

    let contract;

    beforeEach(async () => {
        contract = await Remittance.new(limitDuration, {from: alice});
    });

    it('everyone should be able to submit transaction', async () => {
        let wei = 10;
        let password = "0x" + keccak256("pesho+gosho");
        let result = await contract.submitTransaction.call(carol, 1, password, {from: alice, value: wei});

        assert.strictEqual(result, true, "Unable to submit valid transaction!");
    });

    it('submitter should be able to get deadline for the submitted transaction', async () => {
        let wei = 10;
        let password = "0x" + keccak256("pesho+gosho");

        await contract.submitTransaction(carol, 1, password, {from: alice, value: wei});
        let deadline = await contract.getDeadline("pesho+", "gosho", {from: alice});
        let blockNumber = web3.eth.blockNumber;

        assert.isBelow(blockNumber, deadline.toString(), "Unable to submit valid transaction!");
    });

    it('submit transaction should fail when transaction is submitted without a wei', async () => {
        let wei = 0;
        let password = "0x" + keccak256("pesho+gosho");

        try {
            await contract.submitTransaction.call(carol, 1, password, {from: alice, value: wei});
            assert.fail('exception should have been thrown before this line');
        } catch (error) {

        }
    });

    it('submit transaction should fail when contract duration is less than the duration submitted in the transaction', async () => {
        let wei = 0;
        let password = "0x" + keccak256("pesho+gosho");

        try {
            await contract.submitTransaction.call(carol, limitDuration + 1, password, {from: alice, value: wei});
            assert.fail('exception should have been thrown before this line');
        } catch (error) {
        }
    });

    it('receiver can withdraw if the deadline is met and the passwords are correct', async () => {
        let wei = 10;
        let password = "0x" + keccak256("pesho+gosho");

        await contract.submitTransaction(carol, 2, password, {from: alice, value: wei});
        let succeed = await contract.withdraw.call("pesho+", "gosho", {from: carol});

        assert.strictEqual(true, succeed, "Unable to withdraw!");
    });

    it('submitter should be able to withdraw after deadline with correct passwords', async () => {
        let wei = 10;
        let password = "0x" + keccak256("pesho+gosho");

        await contract.submitTransaction(carol, 2, password, {from: alice, value: wei});
        await contract.submitTransaction(carol, 1, "whatever-password", {from: alice, value: 1});

        try {
            await contract.withdraw("pesho+", "gosho", {from: alice});
            assert.fail('exception should have been thrown before this line');
        } catch (error) {
            await contract.withdraw("pesho+", "gosho", {from: alice});
        }
    });

    it('submitter should not be able to withdraw before the deadline with correct passwords', async () => {
        let wei = 10;
        let password = "0x" + keccak256("pesho+gosho");

        try {
            await contract.submitTransaction(carol, 2, password, {from: alice, value: wei});
            await contract.withdraw("pesho+", "gosho", {from: alice});
        } catch(error) {
            let deadline = await contract.getDeadline("pesho+", "gosho", {from: alice});

            let blockNumber = web3.eth.blockNumber;
            assert.isBelow(blockNumber, deadline.toString(), "Deadline is met already!");
        }
    });
});
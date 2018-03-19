pragma solidity ^0.4.19;

import "./Killable.sol";

contract Remittance is Killable {

    uint private limitDuration;

    struct Transation {
        address from;
        address to;
        uint amount;
        uint deadline;
    }

    function Remittance(uint _limitDuration) public {
        require(_limitDuration > 0);

        owner = msg.sender;
        limitDuration = _limitDuration;
    }

    mapping(bytes32 => Transation) private transactions;

    function submitTransaction(address to, uint duration, bytes32 passwordHash) public payable returns (bool) {
        require(msg.value > 0);
        require(limitDuration > duration);

        transactions[passwordHash] = Transation({from: msg.sender, to: to, amount: msg.value, deadline: block.number + duration});

        return true;
    }

    function withdraw(string cPassword, string bPassword) public returns (bool) {
        bytes32 key = keccak256(cPassword, bPassword);
        Transation memory transation = transactions[key];

        if (msg.sender == transation.from && block.number > transation.deadline) {
            transation.from.transfer(transation.amount);
            delete(transactions[key]);

            return true;
        }

        if (msg.sender == transation.to && block.number <= transation.deadline) {
            transation.to.transfer(transation.amount);
            delete(transactions[key]);

            return true;
        }

        revert();
    }

    function getLimitDuration() public view returns (uint){
        return limitDuration;
    }

    function getDeadline(string cPassword, string bPassword) public view returns (uint) {
        bytes32 key = keccak256(cPassword, bPassword);
        Transation memory transation = transactions[key];

        return transation.deadline;
    }
}

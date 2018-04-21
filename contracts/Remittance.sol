pragma solidity 0.4.21;

import "./Killable.sol";
import "./Validated.sol";

contract Remittance is Killable, Validated {

    uint private limitDuration;
    mapping(bytes32 => Transaction) private transactions;

    event SubmitTransactionEvent(bytes32 id, address to, uint amount, uint duration);
    event CompleteTransactionEvent(bytes32 id, address to, uint amount);

    struct Transaction {
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

    function submitTransaction(address to, uint duration, bytes32 passwordHash)
        isValid(to, passwordHash) public payable returns (bool) {
        require(limitDuration > duration);
        require(transactions[passwordHash].amount == 0);

        transactions[passwordHash] = Transaction({from: msg.sender, to: to, amount: msg.value, deadline: block.number + duration});

        emit SubmitTransactionEvent(passwordHash, to, msg.value, duration);
        return true;
    }

    function withdraw(string cPassword, string bPassword) public returns (bool) {
        bytes32 key = keccak256(cPassword, bPassword);
        Transaction memory transaction = transactions[key];

        if (msg.sender == transaction.from && block.number > transaction.deadline) {
            transaction.from.transfer(transaction.amount);
            delete(transactions[key]);

            emit CompleteTransactionEvent(key, transaction.from, transaction.amount);
            return true;
        }

        if (msg.sender == transaction.to && block.number <= transaction.deadline) {
            transaction.to.transfer(transaction.amount);
            delete(transactions[key]);

            emit CompleteTransactionEvent(key, transaction.to, transaction.amount);
            return true;
        }

        revert();
    }

    function getLimitDuration() public view returns (uint){
        return limitDuration;
    }

    function getDeadline(string cPassword, string bPassword) public view returns (uint) {
        bytes32 key = keccak256(cPassword, bPassword);
        Transaction memory transaction = transactions[key];

        return transaction.deadline;
    }
}
pragma solidity ^0.4.19;

contract Killable {

    address internal owner;

    function killMe() public returns (bool) {
        require(msg.sender == owner);
        selfdestruct(msg.sender);

        return true;
    }
}
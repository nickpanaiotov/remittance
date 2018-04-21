pragma solidity 0.4.21;

contract Validated {

    modifier isValid(address to, bytes32 passwordHash) {
        require(msg.value > 0);
        require(to != address(0));
        require(passwordHash != bytes32(uint256(address(0)) << 96));

        _;
    }
}
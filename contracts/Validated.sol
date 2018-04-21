pragma solidity 0.4.21;

contract Validated {

    modifier isValid(address to, bytes32 passwordHash) {
        require(msg.value > 0);
        require(to != address(0));
        require(passwordHash != bytes32(uint256(address(0)) << 96));

        _;
    }

    modifier withValidPasswords(string cPassword, string bPassword) {
        checkEmptyString(cPassword);
        checkEmptyString(bPassword);

        _;
    }

    function checkEmptyString(string checked) private pure{
        bytes memory tempEmptyStringTest = bytes(checked);
        require (tempEmptyStringTest.length != 0) ;
    }
}
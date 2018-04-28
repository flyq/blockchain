pragma solidity ^0.4.21;

contract reputation {
    mapping (address => int256) reputations;

    function changeReputation(address _address, bool _bool) public {
        if (_bool) {
            reputations[_address] += 1;
        } else {
            reputations[_address] -= 1;
        }
    }

    function returnReputation(address _address) public returns (int256 _reputation) {
        return reputations[_address];
    }

    function returnWeight(address _address) public returns (uint256 weight) {
        if (reputations[_address] < -40) {
            return 1; 
             }
        if (reputations[_address] >= -40 && reputations[_address] < -30) {
            return 2;
        }
        if (reputations[_address] >= -30 && reputations[_address] < -20) {
            return 3;
        }
        if (reputations[_address] >= -20 && reputations[_address] < -10) {
            return 4;
        }
        if (reputations[_address] >= -10 && reputations[_address] < 0) {
            return 5;
        }
        if (reputations[_address] >= 0 && reputations[_address] < 10) {
            return 6;
        }
        if (reputations[_address] >= 10 && reputations[_address] < 20) {
            return 7;
        }
        if (reputations[_address] >= 20 && reputations[_address] < 30) {
            return 8;
        }
        if (reputations[_address] >= 30 && reputations[_address] < 40) {
            return 9;
        }
        if (reputations[_address] >= 40) {
            return 10;
        }
    }

}
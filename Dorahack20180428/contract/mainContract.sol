pragma solidity ^0.4.22;

library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  /**
  * @dev Substracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

/**
 * Utility library of inline functions on addresses
 */
library AddressUtils {

    /**
     * Returns whether there is code in the target address
     * @dev This function will return false if invoked during the constructor of a contract,
     *  as the code is not actually created until after the constructor finishes.
     * @param addr address address to check
     * @return whether there is code in the target address
     */
    function isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly { size := extcodesize(addr) }
        return size > 0;
    }
}

contract Owned {
    address public owner;
    
    constructor () public { 
        owner = msg.sender; 
    }

    // This contract only defines a modifier but does not use
    // it: it will be used in derived contracts.
    // The function body is inserted where the special symbol
    // `_;` in the definition of a modifier appears.
    // This means that if the owner calls this function, the
    // function is executed and otherwise, an exception is
    // thrown.
    modifier onlyOwner {
        require(
            msg.sender == owner,
            "Only owner can call this function."
        );
        _;
    }
}

contract mainContract is Owned {
    using AddressUtils for address;
    using SafeMath for uint256;

    event CreateToken(uint256 indexed id, address indexed creator);
    event Sponsor(uint256 indexed id, uint256 value, address indexed sponsor, address indexed referrer);
    event Settlement(uint256 indexed id, uint256 value);
    
    struct Token {
        uint256 id;
        address creator;
        uint256 value;
        address [] sponsors;
        address [] oppositors;
        uint256 remainOfSponsors;
        uint256 remainOfOppositors;
        uint256 deadline;
    }

    reputation addressOfReputation;   
    Token[] public tokens;

    constructor() public {}

    function setInterface(address _address) onlyOwner {
        addressOfReputation = reputation(_address);
    }
    
    function create(uint256 duration) public payable {
        require(msg.value >= 0.1 * 10 ** 18);

        uint256 tokenId = tokens.length;
        uint256 _deadline = now.add(duration);

        
        Token memory token = Token({
            id: tokenId,
            creator: msg.sender,
            value: msg.value,
            sponsors: new address[](0),
            oppositors: new address[](0),
            remainOfSponsors: 0,
            remainOfOppositors: 0,
            deadline: _deadline    
        });        
        tokens.push(token);
        
        emit CreateToken(tokenId, msg.sender);
    }
    
    function sponsor(uint256 _id, address _referrer) public payable {
        
        require(msg.value > 0.01 * 10 ** 18);
        require(_id < tokens.length);
        require(_referrer != msg.sender);
        require(!_referrer.isContract());
        
        Token storage token = tokens[_id];
        require(now < token.deadline);

        token.sponsors.push(msg.sender); 
                
        emit Sponsor(_id, msg.value, msg.sender, _referrer);
        token.creator.transfer(msg.value.mul(2).div(10));
        _referrer.transfer(msg.value.mul(2).div(10));
        token.remainOfSponsors = msg.value.mul(6).div(10);
    }  
    
    function oppositor(uint256 _id, address _referrer) public payable {
        
        require(msg.value > 0.01 * 10 ** 18);
        require(_id < tokens.length);
        require(_referrer != msg.sender);
        require(!_referrer.isContract());
        require(now < tokens[_id].deadline);

        Token storage token = tokens[_id];
        token.oppositors.push(msg.sender); 
                
        emit Sponsor(_id, msg.value, msg.sender, _referrer);
        token.remainOfSponsors = msg.value;
    }   

    function settlement(uint256 _id) public {
        require(now > tokens[_id].deadline);
        Token storage token = tokens[_id];
        uint256 total = token.remainOfOppositors.add(token.remainOfSponsors);
        
        for(uint256 i = 0; i < tokens[_id].sponsors.length; i++) {
            uint256 totalWeightOfSponsor += addressOfReputation.returnWeight(tokens[_id].sponsors[i]);
        }

        for(uint256 j = 0; j < token[_id].oppositors.length; j++) {
            uint256 totalWeightOfOppositor +=addressOfReputation.returnWeight(tokens[_id].oppositors[j]);
        }


        uint256 averageOfSponsor = total.div(token.sponsors.length);
        uint256 averageOfOppositors = total.div(token.oppositors.length);
        uint256 averageOfTotal = total.div((token.sponsors.length.add(token.oppositors.length)));

        if(totalWeightOfSponsor > totalWeightOfOppositor) {
            for(uint256 i = 0; i < token.sponsors.length; i++) {
                token.sponsors[i].transfer(averageOfSponsor);
                addressOfReputation.changeReputation(token.sponsors[i], true);
            }
            for (uint256 j = 0; j < token.oppositors.length; j++) {
                addressOfReputation.changeReputation(token.oppositors[j], false);
            }
            addressOfReputation.changeReputation(token.creator, true);

        }

        if(totalWeightOfSponsor < totalWeightOfOppositor) {
            for (j = 0; j < token.oppositors.length; j++) {
                token.oppositors[j].transfer(averageOfOppositors);
                addressOfReputation.changeReputation(token.oppositors[j], true);
            }
            for (j = 0; j < token.sponsors.length; j++) {
                addressOfReputation.changeReputation(token.sponsors[j], false);
            }
            addressOfReputation.changeReputation(token.creator, false);
        } else {

            for(uint256 k = 0; k < token.sponsors.length; k++) {
                token.sponsors[i].transfer(averageOfTotal);
            }
            for (uint256 l = 0; l < token.oppositors.length; l++) {
                token.oppositors[l].transfer(averageOfTotal);
            }
        }
        Settlement(_id, token.value);
    }

    // read
    function returnCreator(uint256 _id) public view returns (address creator) {
        require(_id < tokens.length);
        return tokens[_id].creator;
    }
    
    function returnValue(uint256 _id) public view returns (uint256 value)  {
        require(_id < tokens.length);
        return tokens[_id].value;
    }
    
    function returnSponsors(uint256 _id) public view returns (address []) {
        require(_id < tokens.length);
        return tokens[_id].sponsors;
    }
    
    function returnOppositors(uint256 _id) public view returns (address []) {
        require(_id < tokens.length);
        return tokens[_id].oppositors;
    }

    function returnRemainOfSponsors(uint256 _id) public view returns (uint256 remainOfSponsors) {
        require(_id < tokens.length);
        return tokens[_id].remainOfSponsors;
    }

    function returnRemainOfOppositors(uint256 _id) public view returns (uint256 remainOfOppositors) {
        require(_id < tokens.length);
        return tokens[_id].remainOfOppositors;
    }

    function returnRemainTime(uint256 _id) public view returns (uint256 remainTime) {
        require(_id < tokens.length);
        require(now < tokens[_id].deadline);
        return tokens[_id].deadline.sub(now);
    }

    function totalSupply() public view  returns (uint256)  {
        return tokens.length;
    }
}

interface reputation {
    function returnWeight(address _address) external returns (uint256 weight);
    function changeReputation(address _address, bool _bool) external;
}
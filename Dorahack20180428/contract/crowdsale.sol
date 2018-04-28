
pragma solidity ^0.4.21;

interface token {
    function mintToken(address target, uint256 mintedAmount) external;
    function transfer(address receiver, uint256 amount) external;
}

interface erc721Token {
    function issueToken(uint256 l, uint256 r) external;
    function transfer(address _to, uint256 _tokenId) external;
}


// SafeMath
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
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() {
    owner = msg.sender;
  }


  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }


  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) onlyOwner public {
    require(newOwner != address(0));
    OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

}

/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 */
contract Pausable is Ownable {
  event Pause();
  event Unpause();

  bool public paused = false;


  /**
   * @dev Modifier to make a function callable only when the contract is not paused.
   */
  modifier whenNotPaused() {
    require(!paused);
    _;
  }

  /**
   * @dev Modifier to make a function callable only when the contract is paused.
   */
  modifier whenPaused() {
    require(paused);
    _;
  }

  /**
   * @dev called by the owner to pause, triggers stopped state
   */
  function pause() onlyOwner whenNotPaused public {
    paused = true;
    Pause();
  }

  /**
   * @dev called by the owner to unpause, returns to normal state
   */
  function unpause() onlyOwner whenPaused public {
    paused = false;
    Unpause();
  }
}

contract Crowdsale is Pausable {
    using SafeMath for uint256;

    address public beneficiary;
    uint256 public fundingGoal;
    uint256 public amountRaised;
    uint256 public deadline;
    uint256 public price;
    token public tokenReward;
    erc721Token public luckyTokenReward;
    erc721Token public heroTokenReward;
    erc721Token public sanguoTokenReward;

    mapping(address => uint256) public balanceOf;
    bool fundingGoalReached = false;
    bool crowdsaleClosed = false;

    event GoalReached(address recipient, uint256 totalAmountRaised);
    event FundTransfer(address backer, uint256 amount, bool isContribution);
    event LuckyTokenTransfer(address _to, uint256 _luckyTokenId);
    event HeroTokenTransfer(address _to, uint256 _heroTokenId);
    event SanguoTokenTransfer(address _to, uint256 _sanguoTokenId);
    /**
     * Constructor function
     *
     * Setup the owner
     */
    function Crowdsale(
        address ifSuccessfulSendTo,
        uint256 fundingGoalInEthers,
        uint256 durationInMinutes,
        uint256 etherCostOfEachToken,
        address addressOfTokenUsedAsReward,
        address addressOfLuckyToken,
        address addressOfHeroToken,
        address addressOfSanguoToken
    ) public {
        beneficiary = ifSuccessfulSendTo;
        fundingGoal = fundingGoalInEthers * 1 ether;
        deadline = now + durationInMinutes * 1 minutes;
        price = etherCostOfEachToken * 1 ether;
        tokenReward = token(addressOfTokenUsedAsReward);
        luckyTokenReward = erc721Token(addressOfLuckyToken);
        heroTokenReward = erc721Token(addressOfHeroToken);
        sanguoTokenReward = erc721Token(addressOfSanguoToken);

        
    }

    /**
     * Fallback function
     *
     * The function without name is the default function that is called whenever anyone sends funds to a contract
     */
    function () payable whenNotPaused public {
        require(!crowdsaleClosed);
        // 下面这句不知道要不要删，如果删了大户从这里支付的话
        // 就无法得到奖励，到时我们再人工给token吧
        // require(msg.value < 10 ** 18);
        uint256 amount = msg.value;
        balanceOf[msg.sender] = balanceOf[msg.sender].add(amount);
        amountRaised = amountRaised.add(amount);
        
        getToken(amount.div(price));
        FundTransfer(msg.sender, amount, true);
    }

    modifier afterDeadline() { if (now >= deadline) _; }

    /**
     * Check if goal was reached
     *
     * Checks if the goal or time limit has been reached and ends the campaign
     */
    function checkGoalReached() afterDeadline whenNotPaused public {
        if (amountRaised >= fundingGoal){
            fundingGoalReached = true;
            GoalReached(beneficiary, amountRaised);
        }
        crowdsaleClosed = true;
    }


    /**
     * Withdraw the funds
     *
     * Checks to see if goal or time limit has been reached, and if so, and the funding goal was reached,
     * sends the entire amount to the beneficiary. If goal was not reached, each contributor can withdraw
     * the amount they contributed.
     */
    function safeWithdrawal() afterDeadline whenNotPaused public {
        if (!fundingGoalReached) {
            uint256 amount = balanceOf[msg.sender];
            balanceOf[msg.sender] = 0;
            if (amount > 0) {
                if (msg.sender.send(amount)) {
                    FundTransfer(msg.sender, amount, false);
                } else {
                    balanceOf[msg.sender] = amount;
                }
            }
        }

        if (fundingGoalReached && beneficiary == msg.sender) {
            if (beneficiary.send(amountRaised)) {
                FundTransfer(beneficiary, amountRaised, false);
            } else {
                //If we fail to send the funds to beneficiary, unlock funders balance
                fundingGoalReached = false;
            }
        }
    }

    // read
    function returnAmountRaised() public returns (uint256) {
        return amountRaised;
    }

    function returnBalanceOf(address _address) public returns (uint256) {
        return balanceOf[_address];
    }

    function getToken(uint256 _mintedAmount) internal whenNotPaused {
        tokenReward.mintToken(msg.sender, _mintedAmount);
    }    

    function getLuckyToken(uint256 _luckyTokenId) payable public whenNotPaused {
        require(msg.value >= 10**18 && msg.value < 2*10**18);
        luckyTokenReward.issueToken(_luckyTokenId, _luckyTokenId);
        luckyTokenReward.transfer(msg.sender, _luckyTokenId);
        LuckyTokenTransfer(msg.sender, _luckyTokenId);
    }

    function getHeroToken(uint256 _heroTokenId) payable public whenNotPaused  {
        require(msg.value >= 2*10**18 && msg.value < 10*10**18);
        heroTokenReward.issueToken(_heroTokenId, _heroTokenId);
        heroTokenReward.transfer(msg.sender, _heroTokenId);
        HeroTokenTransfer(msg.sender, _heroTokenId);
    }

    function getSanguoToken(uint256 _sanguoTokenId) payable public whenNotPaused {
        require(msg.value >= 10*10**18);
        sanguoTokenReward.issueToken(_sanguoTokenId, _sanguoTokenId);
        sanguoTokenReward.transfer(msg.sender, _sanguoTokenId);
        SanguoTokenTransfer(msg.sender, _sanguoTokenId);
    }

}
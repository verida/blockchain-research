//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract MockToken is ERC20, ReentrancyGuard {
    string public constant TOKEN_NAME = "MockToken";
    string public constant TOKEN_SYMBOL = "MTK";

    uint256 public constant TOTAL_SUPPLY = 1_000_000_000_000 * (10 ** 18);

    // $A
    address[] public stakeAddressList;
    uint256 public stakeAddressCount;

    // $B 
    uint256 public stakeAmount = 100 ether;

    // $C
    uint256 public withdrawAmount = 10 ether;

    // $D
    uint256 public distributeFirstAmount = 2 ether;

    // $E
    uint16 public distributeFirstCount = 20;

    // $G
    uint16 public distributeSecondCount = 100;

    // $F
    uint256 public distributeSecondAmount = 8 ether;

    address[] public distributeAddressList;
    
    mapping (address => uint256) public stakedAmount;

    event Stake(address indexed to, uint256 amount);

    constructor() ERC20(TOKEN_NAME, TOKEN_SYMBOL) {
        _mint(address(this), TOTAL_SUPPLY);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    /**
     * @dev Stake ethers to contract
     */
    function stake() public payable nonReentrant {
        stakedAmount[msg.sender] += msg.value;

        stakeAddressList.push(msg.sender);
        stakeAddressCount = stakeAddressList.length;

        emit Stake(msg.sender, msg.value);
    }

    /**
     * @dev Set stake address list.
     * Not working well when array length is too large. Not working on 1000
     * @param _stakeList : staker's list
     */
    function setStakeAddressList(address[] memory _stakeList) public {
        stakeAddressList = _stakeList;
        stakeAddressCount = stakeAddressList.length;
    }

    /**
     * @dev Add stake address list.
     * This is for test purpose. When staking list is over 1000.
     * @param _stakeList : staker's list
     */
    function addStakeAddressList(address[] memory _stakeList) external {
        for (uint i = 0; i < _stakeList.length; i++)
            stakeAddressList.push(_stakeList[i]);

        stakeAddressCount = stakeAddressList.length;
    }

    /**
     * @dev Set address list for receivers.
     * This is for $E & $G.
     * @param _distributeList address list for receivers.
     */
    function setDistributeAddressList(address[] memory _distributeList) public {
        distributeAddressList = _distributeList;
    }

    /**
     * @dev set number of receivers.
     * set value of $A
     * @param _count number of receivers
     */
    function setDistributeFirstCount(uint16 _count) public {
        distributeFirstCount = _count;
    }

    /**
     * @dev Do distribute for 3 cases
     * 1. Withdraw $C(Eth) to stakers
     * 2. Distribute $D(Eth) to $E number of addresses
     * 3. Distribute $F(Eth) to $G number of addresses
     */
    function distribute() public payable nonReentrant {
        // console.log("Tx - gas", tx.gasprice);
        // console.log("Msg - gas", gasleft());

        uint256 startGas = gasleft();
        
        // Withdraw $C ETH from each address
        bool sent;
        for (uint i = 0; i < stakeAddressCount; i++) {
            // console.log(":: [to] = ", stakeAddressList[i]);
            (sent, ) = payable(stakeAddressList[i]).call{value: withdrawAmount}("");
            require(sent, "Failed to send Ether");
        }

        // Distribute $D to $e addresses
        require(
            address(this).balance >= distributeFirstAmount * distributeFirstCount,
            "Insufficient fund"
        );
        require(distributeAddressList.length >= distributeFirstCount, "Addresses not set");
        for (uint i = 0; i < distributeFirstCount; i++) {
            (sent, ) = payable(distributeAddressList[i]).call{value: distributeFirstAmount}("");
            require(sent, "Failed to send Ether");
        }

        // Distribute $F to $G addresses
        // console.log("Balance - ", address(this).balance);
        // console.log("Required - ", distributeSecondAmount * distributeSecondCount);
        require(
            address(this).balance >= distributeSecondAmount * distributeSecondCount,
            "Insufficient fund"
        );
        require(distributeAddressList.length >= distributeSecondCount, "Addresses not set");
        for (uint i = 0; i < distributeSecondCount; i++) {
            // console.log("Account - ", distributeAddressList[i].balance);
            (sent, ) = payable(distributeAddressList[i]).call{value: distributeSecondAmount}("");
            require(sent, "Failed to send Ether");
        }

        console.log("Gas Used : ", startGas - gasleft());
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CourseStaking is ERC721, Ownable {
    struct StakeInfo {
        uint256 amount;
        bool courseCompleted;
        bool nftMinted;
    }

    mapping(address => StakeInfo) public stakes;
    uint256 public totalStaked;
    uint256 public nftCounter;

    constructor() ERC721("CourseCompletionNFT", "CCNFT") Ownable(msg.sender) {}

    /// @notice Stake the native token
    function stake() external payable {
        require(msg.value > 0, "Must stake a positive amount");

        StakeInfo storage userStake = stakes[msg.sender];
        userStake.amount += msg.value;
        userStake.courseCompleted = false;
        userStake.nftMinted = false;

        totalStaked += msg.value;

        emit Staked(msg.sender, msg.value);
    }

    /// @notice Withdraw staked native tokens after course completion
    function withdraw() external {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No tokens staked");
        require(userStake.courseCompleted, "Course not completed yet");

        uint256 amount = userStake.amount;
        userStake.amount = 0;

        totalStaked -= amount;
        payable(msg.sender).transfer(amount);

        emit Withdrawn(msg.sender, amount);
    }

    /// @notice Mark the course as completed (Admin only)
    /// @param user Address of the user to mark as completed
    function markCourseCompleted(address user) external onlyOwner {
        StakeInfo storage userStake = stakes[user];
        require(userStake.amount > 0, "User has no stake");
        userStake.courseCompleted = true;

        emit CourseCompleted(user);
    }

    /// @notice Mint an NFT upon course completion
    function mintNFT() external {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.courseCompleted, "Course not completed yet");
        require(!userStake.nftMinted, "NFT already minted");

        userStake.nftMinted = true;
        _safeMint(msg.sender, nftCounter);
        nftCounter++;

        emit NFTMinted(msg.sender, nftCounter - 1);
    }

    /// @notice Get stake info for a user
    function getStakeInfo(address user) external view returns (StakeInfo memory) {
        return stakes[user];
    }

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event CourseCompleted(address indexed user);
    event NFTMinted(address indexed user, uint256 tokenId);
}

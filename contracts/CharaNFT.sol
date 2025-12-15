// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CharaNFT
 * @dev Soulbound ERC-721A NFT that evolves based on on-chain activity
 * @notice NFTs are non-transferable and bound to the minting wallet
 */
contract CharaNFT is ERC721A, Ownable, ReentrancyGuard {
    using Strings for uint256;

    // ============ State Variables ============

    /// @notice Base URI for token metadata
    string private _baseTokenURI;

    /// @notice Maximum supply of NFTs
    uint256 public maxSupply = 10000;

    /// @notice Minting price
    uint256 public mintPrice = 0.001 ether;

    /// @notice Whether minting is active
    bool public mintingActive = false;

    /// @notice Maximum mints per wallet
    uint256 public maxPerWallet = 1;

    /// @notice Mapping of token ID to evolution level
    mapping(uint256 => uint256) public evolutionLevel;

    /// @notice Mapping of token ID to custom metadata URI
    mapping(uint256 => string) public tokenMetadataURI;

    /// @notice Mapping of wallet to activity score
    mapping(address => uint256) public activityScore;

    /// @notice Mapping of wallet to last evolution timestamp
    mapping(uint256 => uint256) public lastEvolutionTime;

    /// @notice Authorized updaters who can trigger evolutions
    mapping(address => bool) public authorizedUpdaters;

    // ============ Reputation System ============

    /// @notice Reputation score components for each wallet
    struct ReputationScore {
        uint256 transactionVolume;    // Total DeFi transaction value
        uint256 loanHistory;          // Loan repayment score
        uint256 liquidityProvision;   // LP activity score
        uint256 protocolDiversity;    // Number of protocols used
        uint256 governanceScore;      // Governance participation
        uint256 accountAge;           // Time since first activity
        uint256 totalScore;           // Calculated total (0-1000)
        uint256 reputationLevel;      // Level (0-10)
        uint256 lastUpdated;          // Last score update timestamp
    }

    /// @notice Mapping of wallet to reputation score
    mapping(address => ReputationScore) public reputationScores;

    /// @notice Mapping of token ID to owner's reputation snapshot
    mapping(uint256 => uint256) public tokenReputationSnapshot;

    /// @notice Integrated protocols that can verify reputation
    mapping(address => bool) public integratedProtocols;

    /// @notice Score weights (in basis points, total = 10000)
    uint256 public constant WEIGHT_TRANSACTION_VOLUME = 2000;  // 20%
    uint256 public constant WEIGHT_LOAN_HISTORY = 2500;        // 25%
    uint256 public constant WEIGHT_LIQUIDITY = 2000;           // 20%
    uint256 public constant WEIGHT_PROTOCOL_DIVERSITY = 1500;  // 15%
    uint256 public constant WEIGHT_GOVERNANCE = 1000;          // 10%
    uint256 public constant WEIGHT_ACCOUNT_AGE = 1000;         // 10%

    // ============ Events ============

    event NFTMinted(address indexed minter, uint256 indexed tokenId, uint256 timestamp);
    event NFTEvolved(uint256 indexed tokenId, uint256 newLevel, uint256 timestamp);
    event MetadataUpdated(uint256 indexed tokenId, string newURI);
    event ActivityRecorded(address indexed wallet, uint256 activityType, uint256 score);
    event UpdaterAuthorized(address indexed updater, bool status);
    event ReputationUpdated(address indexed wallet, uint256 totalScore, uint256 level);
    event ProtocolIntegrated(address indexed protocol, bool status);

    // ============ Errors ============

    error MintingNotActive();
    error MaxSupplyReached();
    error InsufficientPayment();
    error MaxPerWalletReached();
    error TransferNotAllowed();
    error Unauthorized();
    error InvalidTokenId();
    error InvalidScore();
    error ProtocolNotIntegrated();

    // ============ Constructor ============

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) ERC721A(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseURI;
        authorizedUpdaters[msg.sender] = true;
    }

    // ============ Minting Functions ============

    /**
     * @notice Mint a new Chara NFT (soulbound)
     * @dev NFT is bound to the minting wallet and cannot be transferred
     */
    function mint() external payable nonReentrant {
        if (!mintingActive) revert MintingNotActive();
        if (_totalMinted() >= maxSupply) revert MaxSupplyReached();
        if (msg.value < mintPrice) revert InsufficientPayment();
        if (_numberMinted(msg.sender) >= maxPerWallet) revert MaxPerWalletReached();

        uint256 tokenId = _nextTokenId();
        _mint(msg.sender, 1);
        
        evolutionLevel[tokenId] = 0;
        lastEvolutionTime[tokenId] = block.timestamp;
        
        emit NFTMinted(msg.sender, tokenId, block.timestamp);
    }

    /**
     * @notice Owner mint for genesis collection
     * @param to Address to mint to
     * @param quantity Number of NFTs to mint
     */
    function ownerMint(address to, uint256 quantity) external onlyOwner {
        if (_totalMinted() + quantity > maxSupply) revert MaxSupplyReached();
        
        uint256 startTokenId = _nextTokenId();
        _mint(to, quantity);
        
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = startTokenId + i;
            evolutionLevel[tokenId] = 0;
            lastEvolutionTime[tokenId] = block.timestamp;
            emit NFTMinted(to, tokenId, block.timestamp);
        }
    }

    // ============ Evolution Functions ============

    /**
     * @notice Evolve an NFT to the next level
     * @param tokenId Token ID to evolve
     * @param newMetadataURI New metadata URI for evolved NFT
     */
    function evolveNFT(uint256 tokenId, string memory newMetadataURI) external {
        if (!authorizedUpdaters[msg.sender]) revert Unauthorized();
        if (!_exists(tokenId)) revert InvalidTokenId();

        evolutionLevel[tokenId]++;
        tokenMetadataURI[tokenId] = newMetadataURI;
        lastEvolutionTime[tokenId] = block.timestamp;

        emit NFTEvolved(tokenId, evolutionLevel[tokenId], block.timestamp);
        emit MetadataUpdated(tokenId, newMetadataURI);
    }

    /**
     * @notice Record on-chain activity for a wallet
     * @param wallet Wallet address
     * @param activityType Type of activity (1=swap, 2=LP, 3=mint, etc.)
     * @param score Score to add
     */
    function recordActivity(
        address wallet,
        uint256 activityType,
        uint256 score
    ) external {
        if (!authorizedUpdaters[msg.sender]) revert Unauthorized();
        
        activityScore[wallet] += score;
        emit ActivityRecorded(wallet, activityType, score);
    }

    // ============ Reputation Scoring Functions ============

    /**
     * @notice Update reputation score for a wallet
     * @param wallet Wallet address
     * @param transactionVolume Transaction volume score (0-100)
     * @param loanHistory Loan history score (0-100)
     * @param liquidityProvision LP score (0-100)
     * @param protocolDiversity Protocol diversity score (0-100)
     * @param governanceScore Governance score (0-100)
     * @param accountAge Account age score (0-100)
     */
    function updateReputationScore(
        address wallet,
        uint256 transactionVolume,
        uint256 loanHistory,
        uint256 liquidityProvision,
        uint256 protocolDiversity,
        uint256 governanceScore,
        uint256 accountAge
    ) external {
        if (!authorizedUpdaters[msg.sender]) revert Unauthorized();
        if (transactionVolume > 100 || loanHistory > 100 || liquidityProvision > 100 ||
            protocolDiversity > 100 || governanceScore > 100 || accountAge > 100) {
            revert InvalidScore();
        }

        ReputationScore storage score = reputationScores[wallet];
        score.transactionVolume = transactionVolume;
        score.loanHistory = loanHistory;
        score.liquidityProvision = liquidityProvision;
        score.protocolDiversity = protocolDiversity;
        score.governanceScore = governanceScore;
        score.accountAge = accountAge;
        score.lastUpdated = block.timestamp;

        // Calculate total score (0-1000)
        uint256 totalScore = _calculateTotalScore(
            transactionVolume,
            loanHistory,
            liquidityProvision,
            protocolDiversity,
            governanceScore,
            accountAge
        );
        
        score.totalScore = totalScore;
        score.reputationLevel = _calculateReputationLevel(totalScore);

        emit ReputationUpdated(wallet, totalScore, score.reputationLevel);
    }

    /**
     * @notice Calculate total reputation score based on weighted components
     * @return Total score (0-1000)
     */
    function _calculateTotalScore(
        uint256 transactionVolume,
        uint256 loanHistory,
        uint256 liquidityProvision,
        uint256 protocolDiversity,
        uint256 governanceScore,
        uint256 accountAge
    ) internal pure returns (uint256) {
        uint256 total = 0;
        total += (transactionVolume * WEIGHT_TRANSACTION_VOLUME) / 10000;
        total += (loanHistory * WEIGHT_LOAN_HISTORY) / 10000;
        total += (liquidityProvision * WEIGHT_LIQUIDITY) / 10000;
        total += (protocolDiversity * WEIGHT_PROTOCOL_DIVERSITY) / 10000;
        total += (governanceScore * WEIGHT_GOVERNANCE) / 10000;
        total += (accountAge * WEIGHT_ACCOUNT_AGE) / 10000;
        
        return (total * 10); // Scale to 0-1000
    }

    /**
     * @notice Calculate reputation level from total score
     * @param totalScore Total reputation score (0-1000)
     * @return Reputation level (0-10)
     */
    function _calculateReputationLevel(uint256 totalScore) internal pure returns (uint256) {
        if (totalScore >= 900) return 10;
        if (totalScore >= 800) return 9;
        if (totalScore >= 700) return 8;
        if (totalScore >= 600) return 7;
        if (totalScore >= 500) return 6;
        if (totalScore >= 400) return 5;
        if (totalScore >= 300) return 4;
        if (totalScore >= 200) return 3;
        if (totalScore >= 100) return 2;
        if (totalScore > 0) return 1;
        return 0;
    }

    /**
     * @notice Get reputation score for a wallet
     * @param wallet Wallet address
     * @return Reputation score struct
     */
    function getReputationScore(address wallet) external view returns (ReputationScore memory) {
        return reputationScores[wallet];
    }

    /**
     * @notice Verify reputation level for protocol integration
     * @param wallet Wallet address
     * @return level Reputation level (0-10)
     * @return score Total reputation score (0-1000)
     */
    function verifyReputation(address wallet) external view returns (uint256 level, uint256 score) {
        if (!integratedProtocols[msg.sender] && msg.sender != owner()) {
            revert ProtocolNotIntegrated();
        }
        
        ReputationScore memory rep = reputationScores[wallet];
        return (rep.reputationLevel, rep.totalScore);
    }

    /**
     * @notice Get reputation multiplier for rewards (100 = 1x, 200 = 2x, etc.)
     * @param wallet Wallet address
     * @return Multiplier in basis points
     */
    function getReputationMultiplier(address wallet) external view returns (uint256) {
        uint256 level = reputationScores[wallet].reputationLevel;
        // Level 0 = 100 (1x), Level 10 = 200 (2x)
        return 100 + (level * 10);
    }

    /**
     * @notice Check if wallet qualifies for undercollateralized loans
     * @param wallet Wallet address
     * @return qualified True if reputation level >= 7
     */
    function qualifiesForUndercollateralizedLoan(address wallet) external view returns (bool) {
        return reputationScores[wallet].reputationLevel >= 7;
    }

    /**
     * @notice Get suggested interest rate discount based on reputation
     * @param wallet Wallet address
     * @return Discount in basis points (e.g., 100 = 1% discount)
     */
    function getInterestRateDiscount(address wallet) external view returns (uint256) {
        uint256 level = reputationScores[wallet].reputationLevel;
        // Level 0 = 0%, Level 10 = 5%
        return level * 50; // 50 basis points per level
    }

    // ============ Metadata Functions ============

    /**
     * @notice Get token URI with custom or base metadata
     * @param tokenId Token ID
     * @return Token URI
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) revert InvalidTokenId();

        // Return custom metadata if set, otherwise use base URI
        if (bytes(tokenMetadataURI[tokenId]).length > 0) {
            return tokenMetadataURI[tokenId];
        }

        return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json"));
    }

    /**
     * @notice Set base URI for metadata
     * @param baseURI New base URI
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /**
     * @notice Get NFT evolution data
     * @param tokenId Token ID
     * @return level Evolution level
     * @return lastEvolution Last evolution timestamp
     * @return owner Owner address
     */
    function getEvolutionData(uint256 tokenId) external view returns (
        uint256 level,
        uint256 lastEvolution,
        address owner
    ) {
        if (!_exists(tokenId)) revert InvalidTokenId();
        
        return (
            evolutionLevel[tokenId],
            lastEvolutionTime[tokenId],
            ownerOf(tokenId)
        );
    }

    // ============ Soulbound Functions ============

    /**
     * @notice Override transfer functions to make NFTs soulbound
     * @dev Prevents all transfers except minting
     */
    function _beforeTokenTransfers(
        address from,
        address to,
        uint256 startTokenId,
        uint256 quantity
    ) internal virtual override {
        // Allow minting (from == address(0))
        // Block all other transfers
        if (from != address(0)) {
            revert TransferNotAllowed();
        }
        super._beforeTokenTransfers(from, to, startTokenId, quantity);
    }

    // ============ Admin Functions ============

    /**
     * @notice Toggle minting status
     */
    function toggleMinting() external onlyOwner {
        mintingActive = !mintingActive;
    }

    /**
     * @notice Set mint price
     * @param newPrice New price in wei
     */
    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
    }

    /**
     * @notice Set max supply
     * @param newMaxSupply New max supply
     */
    function setMaxSupply(uint256 newMaxSupply) external onlyOwner {
        maxSupply = newMaxSupply;
    }

    /**
     * @notice Authorize/deauthorize updater
     * @param updater Address to authorize
     * @param status Authorization status
     */
    function setAuthorizedUpdater(address updater, bool status) external onlyOwner {
        authorizedUpdaters[updater] = status;
        emit UpdaterAuthorized(updater, status);
    }

    /**
     * @notice Integrate/remove protocol for reputation verification
     * @param protocol Protocol address
     * @param status Integration status
     */
    function setIntegratedProtocol(address protocol, bool status) external onlyOwner {
        integratedProtocols[protocol] = status;
        emit ProtocolIntegrated(protocol, status);
    }

    /**
     * @notice Withdraw contract balance
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // ============ View Functions ============

    /**
     * @notice Get total minted count
     */
    function totalMinted() external view returns (uint256) {
        return _totalMinted();
    }

    /**
     * @notice Get number minted by address
     */
    function numberMinted(address minter) external view returns (uint256) {
        return _numberMinted(minter);
    }

    /**
     * @notice Check if token exists
     */
    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }
}

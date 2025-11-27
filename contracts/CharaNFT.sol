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

    // ============ Events ============

    event NFTMinted(address indexed minter, uint256 indexed tokenId, uint256 timestamp);
    event NFTEvolved(uint256 indexed tokenId, uint256 newLevel, uint256 timestamp);
    event MetadataUpdated(uint256 indexed tokenId, string newURI);
    event ActivityRecorded(address indexed wallet, uint256 activityType, uint256 score);
    event UpdaterAuthorized(address indexed updater, bool status);

    // ============ Errors ============

    error MintingNotActive();
    error MaxSupplyReached();
    error InsufficientPayment();
    error MaxPerWalletReached();
    error TransferNotAllowed();
    error Unauthorized();
    error InvalidTokenId();

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

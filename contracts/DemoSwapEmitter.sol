// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DemoSwapEmitter
 * @notice Emits UniswapV2-compatible Swap events for testnet demos.
 * @dev Used only to generate deterministic activity signals during demos.
 */
contract DemoSwapEmitter is Ownable {
    event Swap(
        address indexed sender,
        uint256 amount0In,
        uint256 amount1In,
        uint256 amount0Out,
        uint256 amount1Out,
        address indexed to
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Emit a swap-like event that Chara's monitor can detect.
     * @param amountOut Simulated output amount.
     */
    function demoSwap(uint256 amountOut) external payable {
        emit Swap(msg.sender, msg.value, 0, 0, amountOut, msg.sender);
    }

    function withdraw() external onlyOwner {
        uint256 bal = address(this).balance;
        (bool ok, ) = payable(owner()).call{value: bal}("");
        require(ok, "withdraw failed");
    }
}

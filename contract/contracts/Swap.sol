// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./LiquidityPool.sol";

contract Swap {
    event SwapExecuted(address indexed trader, uint256 amountIn, uint256 amountOut, address tokenIn, address tokenOut);

    function swap(address tokenIn, address tokenOut, uint256 amountIn, address poolAddress) external {
        LiquidityPool pool = LiquidityPool(poolAddress);
        require(tokenIn == pool.tokenA() || tokenIn == pool.tokenB(), "Invalid token");
        require(tokenOut == pool.tokenA() || tokenOut == pool.tokenB(), "Invalid token");
        require(tokenIn != tokenOut, "Tokens must be different");

        uint256 reserveIn = tokenIn == pool.tokenA() ? pool.reserveA() : pool.reserveB();
        uint256 reserveOut = tokenIn == pool.tokenA() ? pool.reserveB() : pool.reserveA();

        uint256 amountOut = (amountIn * reserveOut) / (reserveIn + amountIn);
        require(amountOut > 0, "Insufficient output amount");

        IERC20(tokenIn).transferFrom(msg.sender, poolAddress, amountIn);
        IERC20(tokenOut).transfer(msg.sender, amountOut);

        emit SwapExecuted(msg.sender, amountIn, amountOut, tokenIn, tokenOut);
    }
}

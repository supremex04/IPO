// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LiquidityPool.sol";

contract Swap {
    event SwapExecuted(address indexed trader, uint256 amountIn, uint256 amountOut, address tokenIn, address tokenOut);

    function executeSwap(
        LiquidityPool pool,
        address tokenIn,
        uint256 amountIn
    ) external returns (uint256 amountOut) {
        require(amountIn > 0, "Amount must be greater than zero");

        address tokenOut = (tokenIn == pool.tokenA()) ? pool.tokenB() : pool.tokenA();

        amountOut = pool.swap(tokenIn, amountIn);

        emit SwapExecuted(msg.sender, amountIn, amountOut, tokenIn, tokenOut);
    }
}


// pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
// import "./LiquidityPool.sol";

// contract Swap {
//     event SwapExecuted(address indexed trader, uint256 amountIn, uint256 amountOut, address tokenIn, address tokenOut);

//     function swap(address tokenIn, address tokenOut, uint256 amountIn, address poolAddress) external {
//     LiquidityPool pool = LiquidityPool(poolAddress);
//     require(tokenIn != tokenOut, "Tokens must be different");

//     (uint256 reserveIn, uint256 reserveOut) = tokenIn == pool.tokenA() 
//         ? (pool.reserveA(), pool.reserveB()) 
//         : (pool.reserveB(), pool.reserveA());

//     uint256 amountOut = (amountIn * reserveOut) / (reserveIn + amountIn);
//     require(amountOut > 0 && amountOut < reserveOut, "Insufficient output amount");

//     require(IERC20(tokenIn).transferFrom(msg.sender, poolAddress, amountIn), "Transfer failed");
//     require(IERC20(tokenOut).transfer(msg.sender, amountOut), "Transfer failed");

//     emit SwapExecuted(msg.sender, amountIn, amountOut, tokenIn, tokenOut);
// }

// }

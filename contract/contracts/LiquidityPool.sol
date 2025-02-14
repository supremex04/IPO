// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LiquidityPool {
    address public tokenA;
    address public tokenB;
    uint256 public reserveA;
    uint256 public reserveB;
    mapping(address => uint256) public liquidity;

    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB);
    event LiquidityRemoved(address indexed provider, uint256 amountA, uint256 amountB);
    event SwapTransfer(address indexed token, address indexed recipient, uint256 amount);

    constructor(address _tokenA, address _tokenB) {
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external {
        require(IERC20(tokenA).transferFrom(msg.sender, address(this), amountA), "Token A transfer failed");
        require(IERC20(tokenB).transferFrom(msg.sender, address(this), amountB), "Token B transfer failed");

        reserveA += amountA;
        reserveB += amountB;
        liquidity[msg.sender] += amountA + amountB;

        emit LiquidityAdded(msg.sender, amountA, amountB);
    }

    function removeLiquidity(uint256 amountA, uint256 amountB) external {
        require(liquidity[msg.sender] >= amountA + amountB, "Not enough liquidity");

        reserveA -= amountA;
        reserveB -= amountB;
        liquidity[msg.sender] -= amountA + amountB;

        IERC20(tokenA).transfer(msg.sender, amountA);
        IERC20(tokenB).transfer(msg.sender, amountB);

        emit LiquidityRemoved(msg.sender, amountA, amountB);
    }

    function swapTransfer(address token, address recipient, uint256 amount) external {
        require(token == tokenA || token == tokenB, "Invalid token");
        require(IERC20(token).transfer(recipient, amount), "Transfer failed");
        emit SwapTransfer(token, recipient, amount);
    }

    function updateReserves(uint256 newReserveA, uint256 newReserveB) external {
        reserveA = newReserveA;
        reserveB = newReserveB;
    }
}

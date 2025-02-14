// SPDX-License-Identifier: MIT


pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LiquidityPool {
    address public immutable tokenA;
    address public immutable tokenB;
    uint256 public reserveA;
    uint256 public reserveB;
    mapping(address => uint256) public liquidity;

    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB);
    event LiquidityRemoved(address indexed provider, uint256 amountA, uint256 amountB);
    event Swapped(address indexed trader, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);

    constructor(address _tokenA, address _tokenB) {
        require(_tokenA != _tokenB, "Identical tokens");
        (tokenA, tokenB) = _tokenA < _tokenB ? (_tokenA, _tokenB) : (_tokenB, _tokenA);
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external {
        require(amountA > 0 && amountB > 0, "Invalid amounts");
        
        if (reserveA > 0 || reserveB > 0) {
            require(amountA * reserveB == amountB * reserveA, "Invalid ratio");
        }

        transferToken(tokenA, msg.sender, address(this), amountA);
        transferToken(tokenB, msg.sender, address(this), amountB);
        
        reserveA += amountA;
        reserveB += amountB;
        liquidity[msg.sender] += amountA + amountB;

        emit LiquidityAdded(msg.sender, amountA, amountB);
    }

    function removeLiquidity(uint256 liquidityAmount) external {
        require(liquidity[msg.sender] >= liquidityAmount, "Insufficient liquidity");
        
        uint256 totalLiquidity = reserveA + reserveB;
        uint256 amountA = (liquidityAmount * reserveA) / totalLiquidity;
        uint256 amountB = (liquidityAmount * reserveB) / totalLiquidity;
        
        reserveA -= amountA;
        reserveB -= amountB;
        liquidity[msg.sender] -= liquidityAmount;

        transferToken(tokenA, address(this), msg.sender, amountA);
        transferToken(tokenB, address(this), msg.sender, amountB);

        emit LiquidityRemoved(msg.sender, amountA, amountB);
    }

    function swap(address tokenIn, uint256 amountIn) external returns (uint256 amountOut) {
        require(tokenIn == tokenA || tokenIn == tokenB, "Invalid token");
        require(amountIn > 0, "Invalid amount");

        (uint256 reserveIn, uint256 reserveOut) = tokenIn == tokenA 
            ? (reserveA, reserveB) 
            : (reserveB, reserveA);

        uint256 amountInWithFee = amountIn * 997 / 1000; // 0.3% fee
        amountOut = (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);
        require(amountOut > 0, "Insufficient output");

        transferToken(tokenIn, msg.sender, address(this), amountIn);
        transferToken(tokenOut(), address(this), msg.sender, amountOut);

        if (tokenIn == tokenA) {
            reserveA += amountIn;
            reserveB -= amountOut;
        } else {
            reserveB += amountIn;
            reserveA -= amountOut;
        }

        emit Swapped(msg.sender, tokenIn, tokenOut(), amountIn, amountOut);
    }

    function tokenOut() private view returns (address) {
        return msg.sender == tokenA ? tokenB : tokenA;
    }

    function transferToken(address token, address from, address to, uint256 amount) private {
        bool success = IERC20(token).transferFrom(from, to, amount);
        require(success, "Transfer failed");
    }
}

// pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// contract LiquidityPool {
//     address public immutable tokenA;
//     address public immutable tokenB;
//     uint256 public reserveA;
//     uint256 public reserveB;
//     mapping(address => uint256) public liquidity;

//     event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB);
//     event LiquidityRemoved(address indexed provider, uint256 amountA, uint256 amountB);
//     event Swapped(address indexed trader, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);

//     constructor(address _tokenA, address _tokenB) {
//         tokenA = _tokenA;
//         tokenB = _tokenB;
//     }

//     function addLiquidity(uint256 amountA, uint256 amountB) external {
//         require(amountA > 0 && amountB > 0, "Amounts must be greater than zero");

//         if (reserveA > 0 && reserveB > 0) {
//             require(amountA * reserveB == amountB * reserveA, "Must add liquidity proportionally");
//         }

//         require(IERC20(tokenA).transferFrom(msg.sender, address(this), amountA), "Token A transfer failed");
//         require(IERC20(tokenB).transferFrom(msg.sender, address(this), amountB), "Token B transfer failed");

//         reserveA += amountA;
//         reserveB += amountB;
//         liquidity[msg.sender] += amountA + amountB;

//         emit LiquidityAdded(msg.sender, amountA, amountB);
//     }

//     function removeLiquidity(uint256 liquidityAmount) external {
//         require(liquidity[msg.sender] >= liquidityAmount, "Insufficient liquidity");

//         uint256 amountA = (liquidityAmount * reserveA) / (reserveA + reserveB);
//         uint256 amountB = (liquidityAmount * reserveB) / (reserveA + reserveB);

//         reserveA -= amountA;
//         reserveB -= amountB;
//         liquidity[msg.sender] -= liquidityAmount;

//         IERC20(tokenA).transfer(msg.sender, amountA);
//         IERC20(tokenB).transfer(msg.sender, amountB);

//         emit LiquidityRemoved(msg.sender, amountA, amountB);
//     }

//     function swap(address tokenIn, uint256 amountIn) external returns (uint256 amountOut) {
//         require(tokenIn == tokenA || tokenIn == tokenB, "Invalid token");

//         address tokenOut = (tokenIn == tokenA) ? tokenB : tokenA;
//         (uint256 reserveIn, uint256 reserveOut) = tokenIn == tokenA ? (reserveA, reserveB) : (reserveB, reserveA);

//         require(amountIn > 0 && amountIn <= reserveIn, "Invalid swap amount");

//         // Constant Product Formula: x * y = k
//         uint256 amountInWithFee = amountIn * 997 / 1000; // 0.3% fee
//         uint256 newReserveOut = (reserveIn * reserveOut) / (reserveIn + amountInWithFee);
//         amountOut = reserveOut - newReserveOut;

//         require(amountOut > 0 && amountOut <= reserveOut, "Insufficient liquidity for swap");

//         require(IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn), "Transfer failed");
//         IERC20(tokenOut).transfer(msg.sender, amountOut);

//         if (tokenIn == tokenA) {
//             reserveA += amountIn;
//             reserveB -= amountOut;
//         } else {
//             reserveB += amountIn;
//             reserveA -= amountOut;
//         }

//         emit Swapped(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
//     }
// }




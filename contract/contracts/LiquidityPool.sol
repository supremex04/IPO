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
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external {
        require(amountA > 0 && amountB > 0, "Amounts must be greater than zero");

        if (reserveA > 0 && reserveB > 0) {
            require(amountA * reserveB == amountB * reserveA, "Must add liquidity proportionally");
        }

        require(IERC20(tokenA).transferFrom(msg.sender, address(this), amountA), "Token A transfer failed");
        require(IERC20(tokenB).transferFrom(msg.sender, address(this), amountB), "Token B transfer failed");

        reserveA += amountA;
        reserveB += amountB;
        liquidity[msg.sender] += amountA + amountB;

        emit LiquidityAdded(msg.sender, amountA, amountB);
    }

    function removeLiquidity(uint256 liquidityAmount) external {
        require(liquidity[msg.sender] >= liquidityAmount, "Insufficient liquidity");

        uint256 amountA = (liquidityAmount * reserveA) / (reserveA + reserveB);
        uint256 amountB = (liquidityAmount * reserveB) / (reserveA + reserveB);

        reserveA -= amountA;
        reserveB -= amountB;
        liquidity[msg.sender] -= liquidityAmount;

        IERC20(tokenA).transfer(msg.sender, amountA);
        IERC20(tokenB).transfer(msg.sender, amountB);

        emit LiquidityRemoved(msg.sender, amountA, amountB);
    }

    function swap(address tokenIn, uint256 amountIn) external returns (uint256 amountOut) {
        require(tokenIn == tokenA || tokenIn == tokenB, "Invalid token");

        address tokenOut = (tokenIn == tokenA) ? tokenB : tokenA;
        (uint256 reserveIn, uint256 reserveOut) = tokenIn == tokenA ? (reserveA, reserveB) : (reserveB, reserveA);

        require(amountIn > 0 && amountIn <= reserveIn, "Invalid swap amount");

        // Constant Product Formula: x * y = k
        uint256 amountInWithFee = amountIn * 997 / 1000; // 0.3% fee
        uint256 newReserveOut = (reserveIn * reserveOut) / (reserveIn + amountInWithFee);
        amountOut = reserveOut - newReserveOut;

        require(amountOut > 0 && amountOut <= reserveOut, "Insufficient liquidity for swap");

        require(IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn), "Transfer failed");
        IERC20(tokenOut).transfer(msg.sender, amountOut);

        if (tokenIn == tokenA) {
            reserveA += amountIn;
            reserveB -= amountOut;
        } else {
            reserveB += amountIn;
            reserveA -= amountOut;
        }

        emit Swapped(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }
}



// pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// contract LiquidityPool {
//     address public tokenA;
//     address public tokenB;
//     uint256 public reserveA;
//     uint256 public reserveB;
//     mapping(address => uint256) public liquidity;

//     event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB);
//     event LiquidityRemoved(address indexed provider, uint256 amountA, uint256 amountB);
//     event SwapTransfer(address indexed token, address indexed recipient, uint256 amount);

//     constructor(address _tokenA, address _tokenB) {
//         tokenA = _tokenA;
//         tokenB = _tokenB;
//     }
//     modifier onlySwapContract(address swapContract) {
//     require(msg.sender == swapContract, "Unauthorized");
//     _;
// }

//     function addLiquidity(uint256 amountA, uint256 amountB) external {
//         require(IERC20(tokenA).transferFrom(msg.sender, address(this), amountA), "Token A transfer failed");
//         require(IERC20(tokenB).transferFrom(msg.sender, address(this), amountB), "Token B transfer failed");

//         reserveA += amountA;
//         reserveB += amountB;
//         liquidity[msg.sender] += amountA + amountB;

//         emit LiquidityAdded(msg.sender, amountA, amountB);
//     }

//     function removeLiquidity(uint256 amountA, uint256 amountB) external {
//         require(liquidity[msg.sender] >= amountA + amountB, "Not enough liquidity");

//         reserveA -= amountA;
//         reserveB -= amountB;
//         liquidity[msg.sender] -= amountA + amountB;

//         IERC20(tokenA).transfer(msg.sender, amountA);
//         IERC20(tokenB).transfer(msg.sender, amountB);

//         emit LiquidityRemoved(msg.sender, amountA, amountB);
//     }

//     function swapTransfer(address token, address recipient, uint256 amount) external {
//         require(token == tokenA || token == tokenB, "Invalid token");
//         require(IERC20(token).transfer(recipient, amount), "Transfer failed");
//         emit SwapTransfer(token, recipient, amount);
//     }

//     function updateReserves(uint256 newReserveA, uint256 newReserveB) external {
//         reserveA = newReserveA;
//         reserveB = newReserveB;
//     }
// }

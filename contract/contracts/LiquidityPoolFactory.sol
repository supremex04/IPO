// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./LiquidityPool.sol";

contract LiquidityPoolFactory {
    mapping(address => mapping(address => address)) public getPool;
    address[] public allPools;

    event PoolCreated(address indexed tokenA, address indexed tokenB, address pool);

    function createPool(address tokenA, address tokenB) external returns (address) {
        require(tokenA != tokenB, "Tokens must be different");
        require(getPool[tokenA][tokenB] == address(0), "Pool already exists");

        LiquidityPool newPool = new LiquidityPool(tokenA, tokenB);
        getPool[tokenA][tokenB] = address(newPool);
        getPool[tokenB][tokenA] = address(newPool); // Ensure both mappings
        allPools.push(address(newPool));

        emit PoolCreated(tokenA, tokenB, address(newPool));
        return address(newPool);
    }

    function getAllPools() external view returns (address[] memory) {
        return allPools;
    }
}

// pragma solidity ^0.8.20;

// import "./LiquidityPool.sol";

// contract LiquidityPoolFactory {
//     mapping(address => mapping(address => address)) public getPool;
//     address[] public allPools;

//     event PoolCreated(address indexed tokenA, address indexed tokenB, address pool);

//     function createPool(address tokenA, address tokenB) external returns (address) {
//         require(tokenA != tokenB, "Tokens must be different");
//         require(getPool[tokenA][tokenB] == address(0), "Pool already exists");

//         LiquidityPool newPool = new LiquidityPool(tokenA, tokenB);
//         getPool[tokenA][tokenB] = address(newPool);
//         getPool[tokenB][tokenA] = address(newPool); // Ensure both ways mapping
//         allPools.push(address(newPool));

//         emit PoolCreated(tokenA, tokenB, address(newPool));
//         return address(newPool);
//     }

//     function getAllPools() external view returns (address[] memory) {
//         return allPools;
//     }
// }
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TGE is ERC20 {
    address public creator;

    constructor(string memory name, string memory symbol, uint256 initialSupply, address initialRecipient) ERC20(name, symbol) {
        creator = initialRecipient; 
        // _mint(creator, initialSupply * (10**decimals())); 
        _mint(creator, initialSupply);
    }
}

contract TokenFactory {
    address[] public createdTokens;

    // Event to notify when a new token is created
    event TokenCreated(address indexed creator, address tokenAddress, string name, string symbol);

    function createToken(string memory name, string memory symbol, uint256 initialSupply) public returns (address) {
        // Create the new token and pass the address of the user who initiated the call as the recipient
        TGE newToken = new TGE(name, symbol, initialSupply, msg.sender);
        createdTokens.push(address(newToken));

        emit TokenCreated(msg.sender, address(newToken), name, symbol);

        return address(newToken);
    }

    function getCreatedTokens() public view returns (address[] memory) {
        return createdTokens;
    }
}

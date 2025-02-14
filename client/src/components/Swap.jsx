import React, { useState } from "react";
import { ethers } from "ethers";
import SwapABI from "../assets/Swap.json"; // Ensure ABI is available

const SWAP_CONTRACT_ADDRESS = "0x50815A27CE6D5CC791c011DA2d1a6903A3430f69"; // Replace with deployed swap contract address

const Swap = ({ provider }) => {
  const [tokenIn, setTokenIn] = useState("");
  const [tokenOut, setTokenOut] = useState("");
  const [amountIn, setAmountIn] = useState("");
  const [poolAddress, setPoolAddress] = useState("");

  const signer = provider.getSigner();
  const swapContract = new ethers.Contract(SWAP_CONTRACT_ADDRESS, SwapABI.abi, signer);

  // Perform token swap
  const swapTokens = async () => {
    try {
      const tokenContract = new ethers.Contract(tokenIn, SwapABI.abi, signer);
      await tokenContract.approve(SWAP_CONTRACT_ADDRESS, amountIn);

      const tx = await swapContract.swap(tokenIn, tokenOut, amountIn, poolAddress);
      await tx.wait();
      alert("Swap Successful!");
    } catch (error) {
      console.error("Error swapping tokens:", error);
    }
  };

  return (
    <div className="swap-container">
      <h2>Swap Tokens</h2>
      <input type="text" placeholder="Token In Address" value={tokenIn} onChange={(e) => setTokenIn(e.target.value)} />
      <input type="text" placeholder="Token Out Address" value={tokenOut} onChange={(e) => setTokenOut(e.target.value)} />
      <input type="text" placeholder="Amount In" value={amountIn} onChange={(e) => setAmountIn(e.target.value)} />
      <input type="text" placeholder="Liquidity Pool Address" value={poolAddress} onChange={(e) => setPoolAddress(e.target.value)} />
      <button onClick={swapTokens}>Swap</button>
    </div>
  );
};

export default Swap;

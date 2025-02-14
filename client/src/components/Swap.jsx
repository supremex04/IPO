import React, { useState } from "react";
import { ethers } from "ethers";
import ERC20ABI from "../assets/ERC20.json"; // Standard ERC-20 ABI
import LiquidityPoolABI from "../assets/LiquidityPool.json"; // Liquidity pool ABI

const Swap = ({ provider }) => {
  const [poolAddress, setPoolAddress] = useState("");
  const [tokenIn, setTokenIn] = useState("");
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState(null);

  const signer = provider.getSigner();

  const swapTokens = async () => {
    if (!tokenIn || !amountIn || !poolAddress) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const amountInWei = ethers.utils.parseUnits(amountIn, 18);
      const tokenContract = new ethers.Contract(tokenIn, ERC20ABI, signer);
      const poolContract = new ethers.Contract(poolAddress, LiquidityPoolABI.abi, signer);
      const userAddress = await signer.getAddress();

      console.log("Token In:", tokenIn);
      console.log("Amount In (wei):", amountInWei.toString());
      console.log("Pool Address:", poolAddress);

      // Fetch tokens in the pool
      const tokenA = await poolContract.tokenA();
      const tokenB = await poolContract.tokenB();
      console.log("Pool Token A:", tokenA);
      console.log("Pool Token B:", tokenB);

      if (![tokenA, tokenB].includes(tokenIn)) {
        alert("Selected token is not part of the pool!");
        return;
      }

      const tokenOut = tokenIn === tokenA ? tokenB : tokenA;
      console.log("Token Out:", tokenOut);

      // Check pool reserves
      const reserveA = await poolContract.reserveA();
      const reserveB = await poolContract.reserveB();
      console.log("Reserve A:", ethers.utils.formatUnits(reserveA, 18));
      console.log("Reserve B:", ethers.utils.formatUnits(reserveB, 18));

      if (reserveA.eq(0) || reserveB.eq(0)) {
        alert("The selected pool has no liquidity.");
        return;
      }

      // Check user balance
      const userBalance = await tokenContract.balanceOf(userAddress);
      console.log("User Balance:", ethers.utils.formatUnits(userBalance, 18));

      if (userBalance.lt(amountInWei)) {
        alert("Insufficient token balance!");
        return;
      }

      // Check allowance
      const allowance = await tokenContract.allowance(userAddress, poolAddress);
      console.log("Allowance:", ethers.utils.formatUnits(allowance, 18));

      if (allowance.lt(amountInWei)) {
        console.log(`Approving ${amountIn} tokens...`);
        const approveTx = await tokenContract.approve(poolAddress, amountInWei);
        await approveTx.wait();
        console.log("Approval successful!");
      } else {
        console.log("Tokens already approved.");
      }

      console.log("Executing swap...");
      const tx = await poolContract.swap(tokenIn, amountInWei);
      const receipt = await tx.wait();

      // Extract swap event
      const event = receipt.events.find(e => e.event === "Swapped");
      if (event) {
        const swappedAmountOut = event.args.amountOut;
        setAmountOut(ethers.utils.formatUnits(swappedAmountOut, 18));
        alert(`Swap Successful! Received ${ethers.utils.formatUnits(swappedAmountOut, 18)} ${tokenOut}.`);
      } else {
        alert("Swap executed but no event found.");
      }

    } catch (error) {
      console.error("Error swapping tokens:", error);
      alert(`Swap failed: ${error.message || JSON.stringify(error)}`);
    }
  };

  return (
    <div className="swap-container">
      <h2>Swap Tokens</h2>
      <input type="text" placeholder="Liquidity Pool Address" value={poolAddress} onChange={(e) => setPoolAddress(e.target.value)} className="input-field" />
      <input type="text" placeholder="Token In Address" value={tokenIn} onChange={(e) => setTokenIn(e.target.value)} className="input-field" />
      <input type="text" placeholder="Amount In" value={amountIn} onChange={(e) => setAmountIn(e.target.value)} className="input-field"/>
      <button onClick={swapTokens}>Swap</button>
      {amountOut && <p>Received: {amountOut} tokens</p>}
    </div>
  );
};

export default Swap;

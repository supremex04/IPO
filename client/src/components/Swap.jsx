// Swap.jsx
import React, { useState } from "react";
import { ethers } from "ethers";
import ERC20ABI from "../assets/ERC20.json";
import LiquidityPoolABI from "../assets/LiquidityPool.json";
import {
  FaExchangeAlt,
  FaWallet,
  FaCoins,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import "../App.css";

const Swap = ({ provider }) => {
  const [poolAddress, setPoolAddress] = useState("");
  const [tokenIn, setTokenIn] = useState("");
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [poolTokens, setPoolTokens] = useState({
    tokenA: "",
    tokenB: "",
    reserveA: "0",
    reserveB: "0",
  });

  // Safely handle provider
  const signer = provider ? provider.getSigner() : null;

  const fetchPoolDetails = async (address) => {
    if (!provider || !address) return;
    try {
      const poolContract = new ethers.Contract(
        address,
        LiquidityPoolABI.abi,
        signer
      );
      const [tokenA, tokenB, reserveA, reserveB] = await Promise.all([
        poolContract.tokenA(),
        poolContract.tokenB(),
        poolContract.reserveA(),
        poolContract.reserveB(),
      ]);
      setPoolTokens({
        tokenA,
        tokenB,
        reserveA: ethers.utils.formatUnits(reserveA, 18),
        reserveB: ethers.utils.formatUnits(reserveB, 18),
      });
      setError(null);
    } catch (error) {
      console.error("Error fetching pool details:", error);
      setError(
        "Invalid pool address or network error. Please check and try again."
      );
    }
  };

  const swapTokens = async () => {
    if (!provider || !signer) {
      setError(
        "MetaMask is required to swap tokens. Please connect your wallet."
      );
      return;
    }
    if (!tokenIn || !amountIn || !poolAddress) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const amountInWei = ethers.utils.parseUnits(amountIn, 18);
      const tokenContract = new ethers.Contract(tokenIn, ERC20ABI, signer);
      const poolContract = new ethers.Contract(
        poolAddress,
        LiquidityPoolABI.abi,
        signer
      );
      const userAddress = await signer.getAddress();

      const tokenA = await poolContract.tokenA();
      const tokenB = await poolContract.tokenB();

      if (![tokenA, tokenB].includes(tokenIn)) {
        setError("Selected token is not part of the pool!");
        return;
      }

      const tokenOut = tokenIn === tokenA ? tokenB : tokenA;
      const reserveA = await poolContract.reserveA();
      const reserveB = await poolContract.reserveB();

      if (reserveA.eq(0) || reserveB.eq(0)) {
        setError("The selected pool has no liquidity.");
        return;
      }

      const userBalance = await tokenContract.balanceOf(userAddress);
      if (userBalance.lt(amountInWei)) {
        setError("Insufficient token balance!");
        return;
      }

      const allowance = await tokenContract.allowance(userAddress, poolAddress);
      if (allowance.lt(amountInWei)) {
        const approveTx = await tokenContract.approve(poolAddress, amountInWei);
        await approveTx.wait();
      }

      const tx = await poolContract.swap(tokenIn, amountInWei);
      const receipt = await tx.wait();

      const event = receipt.events.find((e) => e.event === "Swapped");
      if (event) {
        const swappedAmountOut = event.args.amountOut;
        const formattedAmountOut = ethers.utils.formatUnits(
          swappedAmountOut,
          18
        );
        setAmountOut(formattedAmountOut);
        alert(
          `Swap Successful! Received ${formattedAmountOut} tokens (${tokenOut}).`
        );
      } else {
        setError("Swap executed but no event found.");
      }

      fetchPoolDetails(poolAddress);
      setAmountIn("");
    } catch (error) {
      console.error("Error swapping tokens:", error);
      setError(`Swap failed: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePoolAddressChange = (e) => {
    const address = e.target.value;
    setPoolAddress(address);
    fetchPoolDetails(address);
  };

  return (
    <div className='swap-container'>
      <div className='swap-grid'>
        {/* Column 1: Pool Selection */}
        <div className='swap-section'>
          <h2 className='section-title'>
            <FaWallet className='section-icon' /> Pool Info
          </h2>
          <input
            type='text'
            placeholder='Liquidity Pool Address'
            value={poolAddress}
            onChange={handlePoolAddressChange}
            className='input-field'
            disabled={loading || !provider}
          />
          <div className='pool-info'>
            <p>Token A: {poolTokens.reserveA}</p>
            <p>Token B: {poolTokens.reserveB}</p>
          </div>
        </div>

        {/* Column 2: Token Input */}
        <div className='swap-section'>
          <h2 className='section-title'>
            <FaCoins className='section-icon' /> Swap Input
          </h2>
          <input
            type='text'
            placeholder='Token In Address'
            value={tokenIn}
            onChange={(e) => setTokenIn(e.target.value)}
            className='input-field'
            disabled={loading || !provider}
          />
          <input
            type='text'
            placeholder='Amount In'
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            className='input-field'
            disabled={loading || !provider}
          />
        </div>

        {/* Column 3: Swap Action */}
        <div className='swap-section'>
          <h2 className='section-title'>
            <FaExchangeAlt className='section-icon' /> Swap Output
          </h2>
          <button
            onClick={swapTokens}
            className='action-btn'
            disabled={loading || !provider}
          >
            {loading ? (
              <>
                <FaSpinner className='spin-icon' /> Swapping...
              </>
            ) : (
              <>
                <FaExchangeAlt className='btn-icon' /> Swap Tokens
              </>
            )}
          </button>
          {amountOut && (
            <div className='swap-result'>
              <p>Received: {amountOut} tokens</p>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className='error-message'>
          <FaExclamationCircle className='error-icon' /> {error}
        </div>
      )}
    </div>
  );
};

export default Swap;

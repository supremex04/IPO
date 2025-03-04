import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ERC20ABI from "../assets/ERC20.json";
import LiquidityPoolABI from "../assets/LiquidityPool.json";
import LiquidityPoolFactoryABI from "../assets/LiqFactory.json";
import {
  FaExchangeAlt,
  FaWallet,
  FaCoins,
  FaSpinner,
  FaExclamationCircle,
  FaArrowDown,
} from "react-icons/fa";
import "../App.css";

const FACTORY_ADDRESS = process.env.REACT_APP_LIQUIDITY_FACTORY_CONTRACT;

const Swap = ({ provider }) => {
  const [poolAddress, setPoolAddress] = useState("");
  const [tokenIn, setTokenIn] = useState("");
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState(null);
  const [loading, setLoading] = useState({ swap: false, fetch: false });
  const [error, setError] = useState(null);
  const [allPools, setAllPools] = useState([]);
  const [poolsWithSymbols, setPoolsWithSymbols] = useState([]);
  const [poolTokens, setPoolTokens] = useState({
    tokenA: "",
    tokenB: "",
    tokenASymbol: "",
    tokenBSymbol: "",
    reserveA: "0",
    reserveB: "0",
  });
  const [selectedTokenDir, setSelectedTokenDir] = useState(""); // "A" or "B" or empty

  // Safely handle provider
  const signer = provider ? provider.getSigner() : null;
  const factoryContract =
    provider && signer
      ? new ethers.Contract(
          FACTORY_ADDRESS,
          LiquidityPoolFactoryABI.abi,
          signer
        )
      : null;

  useEffect(() => {
    if (provider) fetchAllPools();
  }, [provider]);

  const fetchAllPools = async () => {
    if (!provider || !factoryContract) {
      setError(
        "MetaMask is required to fetch pools. Please connect your wallet."
      );
      return;
    }
    try {
      setLoading((prev) => ({ ...prev, fetch: true }));
      const pools = await factoryContract.getAllPools();
      setAllPools(pools);
      
      // Get symbols for all pools
      const poolDetailsPromises = pools.map(async (poolAddress) => {
        try {
          const poolContract = new ethers.Contract(
            poolAddress,
            LiquidityPoolABI.abi,
            signer
          );
          
          const [tokenAAddress, tokenBAddress] = await Promise.all([
            poolContract.tokenA(),
            poolContract.tokenB(),
          ]);
          
          const tokenAContract = new ethers.Contract(
            tokenAAddress,
            ERC20ABI,
            signer
          );
          
          const tokenBContract = new ethers.Contract(
            tokenBAddress,
            ERC20ABI,
            signer
          );
          
          const [symbolA, symbolB, reserveA, reserveB] = await Promise.all([
            tokenAContract.symbol(),
            tokenBContract.symbol(),
            poolContract.reserveA(),
            poolContract.reserveB(),
          ]);
          
          return {
            address: poolAddress,
            pairName: `${symbolA}/${symbolB}`,
            tokenA: tokenAAddress,
            tokenB: tokenBAddress,
            symbolA,
            symbolB,
            reserveA: ethers.utils.formatUnits(reserveA, 18),
            reserveB: ethers.utils.formatUnits(reserveB, 18),
          };
        } catch (error) {
          console.error(`Error getting symbols for pool ${poolAddress}:`, error);
          return {
            address: poolAddress,
            pairName: "Unknown Pair",
            tokenA: "",
            tokenB: "",
            symbolA: "???",
            symbolB: "???",
            reserveA: "0",
            reserveB: "0",
          };
        }
      });
      
      const poolsWithDetails = await Promise.all(poolDetailsPromises);
      setPoolsWithSymbols(poolsWithDetails);
      setError(null);
    } catch (error) {
      console.error("Error fetching pools:", error);
      setError("Failed to fetch pools. Please ensure MetaMask is connected.");
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  };

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

      // Get token symbols
      const tokenAContract = new ethers.Contract(tokenA, ERC20ABI, signer);
      const tokenBContract = new ethers.Contract(tokenB, ERC20ABI, signer);
      const [tokenASymbol, tokenBSymbol] = await Promise.all([
        tokenAContract.symbol(),
        tokenBContract.symbol(),
      ]);
      
      setPoolTokens({
        tokenA,
        tokenB,
        tokenASymbol,
        tokenBSymbol,
        reserveA: ethers.utils.formatUnits(reserveA, 18),
        reserveB: ethers.utils.formatUnits(reserveB, 18),
      });
      
      // Reset token selection when pool changes
      setSelectedTokenDir("");
      setTokenIn("");
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
      setLoading((prev) => ({ ...prev, swap: true }));
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
        
        // Get symbol for output token
        const outTokenContract = new ethers.Contract(tokenOut, ERC20ABI, signer);
        const outTokenSymbol = await outTokenContract.symbol();
        
        setAmountOut(formattedAmountOut);
        alert(
          `Swap Successful! Received ${formattedAmountOut} ${outTokenSymbol} tokens.`
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
      setLoading((prev) => ({ ...prev, swap: false }));
    }
  };

  const handlePoolSelect = (e) => {
    const address = e.target.value;
    setPoolAddress(address);
    if (address) {
      fetchPoolDetails(address);
      // Reset amount and output data
      setAmountIn("");
      setAmountOut(null);
      setSelectedTokenDir(""); // Reset token selection
      setTokenIn("");
    } else {
      setPoolTokens({
        tokenA: "",
        tokenB: "",
        tokenASymbol: "",
        tokenBSymbol: "",
        reserveA: "0",
        reserveB: "0",
      });
      setTokenIn("");
      setSelectedTokenDir("");
    }
  };

  const handleTokenSelect = (tokenDir) => {
    setSelectedTokenDir(tokenDir);
    if (tokenDir === "A") {
      setTokenIn(poolTokens.tokenA);
    } else {
      setTokenIn(poolTokens.tokenB);
    }
    setAmountIn("");
    setAmountOut(null);
  };

  const handleTokenToggle = () => {
    if (selectedTokenDir === "A") {
      setSelectedTokenDir("B");
      setTokenIn(poolTokens.tokenB);
    } else {
      setSelectedTokenDir("A");
      setTokenIn(poolTokens.tokenA);
    }
    setAmountIn("");
    setAmountOut(null);
  };

  // Calculate approximate output amount (frontend only, actual calculation happens on contract)
  const calculateEstimatedOutput = () => {
    if (!amountIn || amountIn <= 0) return "0";
    
    // Convert string to numbers for calculation
    const reserveA = parseFloat(poolTokens.reserveA);
    const reserveB = parseFloat(poolTokens.reserveB);
    const amount = parseFloat(amountIn);
    
    if (reserveA <= 0 || reserveB <= 0) return "0";
    
    // Simple constant product calculation with 0.3% fee
    const fee = 0.997; // 0.3% fee (100% - 0.3% = 99.7%)
    if (selectedTokenDir === "A") {
      // Swapping from token A to token B
      const amountWithFee = amount * fee;
      const numerator = amountWithFee * reserveB;
      const denominator = reserveA + amountWithFee;
      return (numerator / denominator).toFixed(6);
    } else {
      // Swapping from token B to token A
      const amountWithFee = amount * fee;
      const numerator = amountWithFee * reserveA;
      const denominator = reserveB + amountWithFee;
      return (numerator / denominator).toFixed(6);
    }
  };

  return (
    <div className='swap-container'>
      <div className='swap-grid'>
        {/* Column 1: Pool Selection */}
        <div className='swap-section'>
          <h2 className='section-title'>
            <FaWallet className='section-icon' /> Select Pool
          </h2>
          <select
            onChange={handlePoolSelect}
            className='select-field'
            disabled={loading.swap || loading.fetch || !provider}
            value={poolAddress}
          >
            <option value=''>Select a Trading Pair</option>
            {loading.fetch ? (
              <option value='' disabled>Loading pools...</option>
            ) : (
              poolsWithSymbols.map((pool, index) => (
                <option key={index} value={pool.address}>
                  {pool.pairName}
                </option>
              ))
            )}
          </select>
          {poolAddress && (
  <>
    <div className='pool-info'>
      <h3>Pool Liquidity</h3>
      <p>{poolTokens.tokenASymbol}: {poolTokens.reserveA}</p>
      <p>{poolTokens.tokenBSymbol}: {poolTokens.reserveB}</p>
    </div>
    
    {/* Updated Token Selection */}
    <div className='token-selection-container'>
      <h3>Select Token to Pay With</h3>
      <div className='token-selection-buttons'>
        <button 
          className={`token-select-btn ${selectedTokenDir === "A" ? 'active' : ''}`} 
          onClick={() => handleTokenSelect("A")}
          disabled={loading.swap}
        >
          Pay with {poolTokens.tokenASymbol}
        </button>
        <button 
          className={`token-select-btn ${selectedTokenDir === "B" ? 'active' : ''}`} 
          onClick={() => handleTokenSelect("B")}
          disabled={loading.swap}
        >
          Pay with {poolTokens.tokenBSymbol}
        </button>
      </div>
    </div>
  </>
)}
        </div>

        {/* Column 2: Token Input - Only shown if a token is selected */}
        <div className='swap-section'>
          <h2 className='section-title'>
            <FaCoins className='section-icon' /> Swap Tokens
          </h2>
          
          {!poolAddress ? (
            <div className='no-pool-selected'>
              Please select a pool first
            </div>
          ) : !selectedTokenDir ? (
            <div className='no-token-selected'>
              Please select a token to pay with
            </div>
          ) : (
            <>
              <div className='token-swap-card'>
                <div className='token-swap-header'>
                  <span>You Pay </span>
                  <span className='token-name'>
                    {selectedTokenDir === "A" ? poolTokens.tokenASymbol : poolTokens.tokenBSymbol}
                  </span>
                </div>
                <input
                  type='text'
                  placeholder='Amount'
                  value={amountIn}
                  onChange={(e) => setAmountIn(e.target.value)}
                  className='input-field'
                  disabled={loading.swap || !provider}
                />
              </div>
              
              <button 
                onClick={handleTokenToggle} 
                className='token-toggle-btn'
                disabled={loading.swap}
              >
                <FaArrowDown />
              </button>
              
              <div className='token-swap-card'>
                <div className='token-swap-header'>
                  <span>You Receive (estimated)</span>
                  <span className='token-name'>
                    {selectedTokenDir === "A" ? poolTokens.tokenBSymbol : poolTokens.tokenASymbol}
                  </span>
                </div>
                <div className='estimated-output'>
                  {amountIn ? calculateEstimatedOutput() : "0"}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Column 3: Swap Action */}
        <div className='swap-section'>
          <h2 className='section-title'>
            <FaExchangeAlt className='section-icon' /> Execute Swap
          </h2>
          <button
            onClick={swapTokens}
            className='action-btn'
            disabled={loading.swap || !provider || !poolAddress || !amountIn || !selectedTokenDir}
          >
            {loading.swap ? (
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
              <p>Received: {amountOut} {selectedTokenDir === "A" ? poolTokens.tokenBSymbol : poolTokens.tokenASymbol}</p>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className='error-message'>
          <FaExclamationCircle className='error-icon' /> {error}
        </div>
      )}
      {loading.fetch && (
        <div className='loading-message'>
          <FaSpinner className='spin-icon' /> Loading pool information...
        </div>
      )}
    </div>
  );
};

export default Swap;
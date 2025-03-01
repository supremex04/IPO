// import React, { useState } from "react";
// import { ethers } from "ethers";
// import ERC20ABI from "../assets/ERC20.json"; // Standard ERC-20 ABI
// import LiquidityPoolABI from "../assets/LiquidityPool.json"; // Liquidity pool ABI

// const Swap = ({ provider }) => {
//   const [poolAddress, setPoolAddress] = useState("");
//   const [tokenIn, setTokenIn] = useState("");
//   const [amountIn, setAmountIn] = useState("");
//   const [amountOut, setAmountOut] = useState(null);

//   const signer = provider.getSigner();

//   const swapTokens = async () => {
//     if (!tokenIn || !amountIn || !poolAddress) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     try {
//       const amountInWei = ethers.utils.parseUnits(amountIn, 18);
//       const tokenContract = new ethers.Contract(tokenIn, ERC20ABI, signer);
//       const poolContract = new ethers.Contract(poolAddress, LiquidityPoolABI.abi, signer);
//       const userAddress = await signer.getAddress();

//       console.log("Token In:", tokenIn);
//       console.log("Amount In (wei):", amountInWei.toString());
//       console.log("Pool Address:", poolAddress);

//       // Fetch tokens in the pool
//       const tokenA = await poolContract.tokenA();
//       const tokenB = await poolContract.tokenB();
//       console.log("Pool Token A:", tokenA);
//       console.log("Pool Token B:", tokenB);

//       if (![tokenA, tokenB].includes(tokenIn)) {
//         alert("Selected token is not part of the pool!");
//         return;
//       }

//       const tokenOut = tokenIn === tokenA ? tokenB : tokenA;
//       console.log("Token Out:", tokenOut);

//       // Check pool reserves
//       const reserveA = await poolContract.reserveA();
//       const reserveB = await poolContract.reserveB();
//       console.log("Reserve A:", ethers.utils.formatUnits(reserveA, 18));
//       console.log("Reserve B:", ethers.utils.formatUnits(reserveB, 18));

//       if (reserveA.eq(0) || reserveB.eq(0)) {
//         alert("The selected pool has no liquidity.");
//         return;
//       }

//       // Check user balance
//       const userBalance = await tokenContract.balanceOf(userAddress);
//       console.log("User Balance:", ethers.utils.formatUnits(userBalance, 18));

//       if (userBalance.lt(amountInWei)) {
//         alert("Insufficient token balance!");
//         return;
//       }

//       // Check allowance
//       const allowance = await tokenContract.allowance(userAddress, poolAddress);
//       console.log("Allowance:", ethers.utils.formatUnits(allowance, 18));

//       if (allowance.lt(amountInWei)) {
//         console.log(`Approving ${amountIn} tokens...`);
//         const approveTx = await tokenContract.approve(poolAddress, amountInWei);
//         await approveTx.wait();
//         console.log("Approval successful!");
//       } else {
//         console.log("Tokens already approved.");
//       }

//       console.log("Executing swap...");
//       const tx = await poolContract.swap(tokenIn, amountInWei);
//       const receipt = await tx.wait();

//       // Extract swap event
//       const event = receipt.events.find(e => e.event === "Swapped");
//       if (event) {
//         const swappedAmountOut = event.args.amountOut;
//         setAmountOut(ethers.utils.formatUnits(swappedAmountOut, 18));
//         alert(`Swap Successful! Received ${ethers.utils.formatUnits(swappedAmountOut, 18)} ${tokenOut}.`);
//       } else {
//         alert("Swap executed but no event found.");
//       }

//     } catch (error) {
//       console.error("Error swapping tokens:", error);
//       alert(`Swap failed: ${error.message || JSON.stringify(error)}`);
//     }
//   };

//   return (
//     <div className="swap-container">
//       <h2>Swap Tokens</h2>
//       <input type="text" placeholder="Liquidity Pool Address" value={poolAddress} onChange={(e) => setPoolAddress(e.target.value)} className="input-field" />
//       <input type="text" placeholder="Token In Address" value={tokenIn} onChange={(e) => setTokenIn(e.target.value)} className="input-field" />
//       <input type="text" placeholder="Amount In" value={amountIn} onChange={(e) => setAmountIn(e.target.value)} className="input-field"/>
//       <button onClick={swapTokens}>Swap</button>
//       {amountOut && <p>Received: {amountOut} tokens</p>}
//     </div>
//   );
// };

// export default Swap;


import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ERC20ABI from "../assets/ERC20.json"; // Standard ERC-20 ABI
import LiquidityPoolABI from "../assets/LiquidityPool.json"; // Liquidity pool ABI
import LiquidityPoolFactoryABI from "../assets/LiqFactory.json"; // Factory ABI to fetch pools

const FACTORY_ADDRESS = process.env.REACT_APP_LIQUIDITY_FACTORY_CONTRACT;

const Swap = ({ provider }) => {
  const [poolAddress, setPoolAddress] = useState("");
  const [tokenIn, setTokenIn] = useState("");
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState(null);
  const [allPools, setAllPools] = useState([]); // Stores all pools with their token details
  const [tokensInPool, setTokensInPool] = useState([]); // Stores tokens in the selected pool

  const signer = provider.getSigner();
  const factoryContract = new ethers.Contract(FACTORY_ADDRESS, LiquidityPoolFactoryABI.abi, signer);

  // Fetch all pools and their token details
  useEffect(() => {
    const fetchPools = async () => {
      try {
        const pools = await factoryContract.getAllPools();
        const poolDetails = await Promise.all(
          pools.map(async (poolAddress) => {
            const poolContract = new ethers.Contract(poolAddress, LiquidityPoolABI.abi, signer);
            const tokenA = await poolContract.tokenA();
            const tokenB = await poolContract.tokenB();

            const tokenAContract = new ethers.Contract(tokenA, ERC20ABI, signer);
            const tokenBContract = new ethers.Contract(tokenB, ERC20ABI, signer);

            const tokenASymbol = await tokenAContract.symbol();
            const tokenBSymbol = await tokenBContract.symbol();

            return {
              address: poolAddress,
              symbol: `${tokenASymbol}/${tokenBSymbol}`,
              tokenA: { address: tokenA, symbol: tokenASymbol },
              tokenB: { address: tokenB, symbol: tokenBSymbol },
            };
          })
        );

        setAllPools(poolDetails);
      } catch (error) {
        console.error("Error fetching pools:", error);
      }
    };

    if (provider) fetchPools();
  }, [provider]);

  // Handle pool selection
  const handlePoolChange = (e) => {
    const selectedPoolAddress = e.target.value;
    const selectedPool = allPools.find((pool) => pool.address === selectedPoolAddress);

    if (selectedPool) {
      setPoolAddress(selectedPoolAddress);
      setTokensInPool([selectedPool.tokenA, selectedPool.tokenB]); // Set tokens in the selected pool
      setTokenIn(""); // Reset token selection
    }
  };

  // Handle token selection
  const handleTokenChange = (e) => {
    setTokenIn(e.target.value);
  };

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
      const event = receipt.events.find((e) => e.event === "Swapped");
      if (event) {
        const swappedAmountOut = event.args.amountOut;
        setAmountOut(ethers.utils.formatUnits(swappedAmountOut, 18));
        alert(`Swap Successful! Received ${ethers.utils.formatUnits(swappedAmountOut, 18)} tokens.`);
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

      {/* Pool Selection Dropdown */}
      <select onChange={handlePoolChange} className="select-field">
        <option value="">Select a Pool</option>
        {allPools.map((pool, index) => (
          <option key={index} value={pool.address}>
            {pool.symbol}
          </option>
        ))}
      </select>

      {/* Token Selection Dropdown */}
      {poolAddress && (
        <select onChange={handleTokenChange} className="select-field">
          <option value="">Select a Token</option>
          {tokensInPool.map((token, index) => (
            <option key={index} value={token.address}>
              {token.symbol}
            </option>
          ))}
        </select>
      )}

      {/* Amount Input */}
      <input
        type="text"
        placeholder="Amount In"
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
        className="input-field"
      />

      {/* Swap Button */}
      <button onClick={swapTokens}>Swap</button>

      {/* Display Swap Output */}
      {amountOut && <p>Received: {amountOut} tokens</p>}
    </div>
  );
};

export default Swap;
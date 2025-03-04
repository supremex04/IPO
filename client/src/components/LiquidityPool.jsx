// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import LiquidityPoolFactoryABI from "../assets/LiqFactory.json";
// import LiquidityPoolABI from "../assets/LiquidityPool.json";
// import ERC20ABI from "../assets/ERC20.json";
// import "../App.css";

// const FACTORY_ADDRESS = process.env.REACT_APP_LIQUIDITY_FACTORY_CONTRACT;

// const LiquidityPool = ({ provider }) => {
//   const [tokenA, setTokenA] = useState("");
//   const [tokenB, setTokenB] = useState("");
//   const [allPools, setAllPools] = useState([]);
//   const [selectedPool, setSelectedPool] = useState("");
//   const [reserveA, setReserveA] = useState("0");
//   const [reserveB, setReserveB] = useState("0");
//   const [tokenASymbol, setTokenASymbol] = useState("");
//   const [tokenBSymbol, setTokenBSymbol] = useState("");
//   const [liquidityAmount, setLiquidityAmount] = useState("");

//   const signer = provider.getSigner();
//   const factoryContract = new ethers.Contract(FACTORY_ADDRESS, LiquidityPoolFactoryABI.abi, signer);

//   const createPool = async () => {
//     try {
//       const tx = await factoryContract.createPool(tokenA, tokenB);
//       await tx.wait();
//       alert("Liquidity Pool Created!");
//       fetchPools();
//     } catch (error) {
//       console.error("Error creating pool:", error);
//     }
//   };

//   const fetchPools = async () => {
//     try {
//       const pools = await factoryContract.getAllPools();
//       setAllPools(pools);
//     } catch (error) {
//       console.error("Error fetching pools:", error);
//     }
//   };

//   const fetchPoolDetails = async (poolAddress) => {
//     try {
//       if (!poolAddress) return;
//       const poolContract = new ethers.Contract(poolAddress, LiquidityPoolABI.abi, signer);

//       const tokenAAddress = await poolContract.tokenA();
//       const tokenBAddress = await poolContract.tokenB();

//       const tokenAContract = new ethers.Contract(tokenAAddress, ERC20ABI, signer);
//       const tokenBContract = new ethers.Contract(tokenBAddress, ERC20ABI, signer);

//       const tokenASymbol = await tokenAContract.symbol();
//       const tokenBSymbol = await tokenBContract.symbol();

//       const [reserveA, reserveB] = await Promise.all([
//         poolContract.reserveA(),
//         poolContract.reserveB(),
//       ]);

//       setTokenASymbol(tokenASymbol);
//       setTokenBSymbol(tokenBSymbol);
//       setReserveA(ethers.utils.formatUnits(reserveA, 18));
//       setReserveB(ethers.utils.formatUnits(reserveB, 18));
//     } catch (error) {
//       console.error("Error fetching pool details:", error);
//     }
//   };

//   const addLiquidity = async () => {
//     if (!selectedPool || !liquidityAmount) {
//       alert("Please select a pool and enter liquidity amount.");
//       return;
//     }

//     try {
//       const poolContract = new ethers.Contract(selectedPool, LiquidityPoolABI.abi, signer);
//       const tokenAAddress = await poolContract.tokenA();
//       const tokenBAddress = await poolContract.tokenB();

//       const tokenAContract = new ethers.Contract(tokenAAddress, ERC20ABI, signer);
//       const tokenBContract = new ethers.Contract(tokenBAddress, ERC20ABI, signer);

//       const amount = ethers.utils.parseUnits(liquidityAmount, 18);

//       const reserveA = await poolContract.reserveA();
//       const reserveB = await poolContract.reserveB();
//       const totalLiquidity = reserveA.add(reserveB);

//       const amountA = reserveA.eq(0) ? amount : amount.mul(reserveA).div(totalLiquidity);
//       const amountB = reserveB.eq(0) ? amount : amount.mul(reserveB).div(totalLiquidity);

//       const approveA = await tokenAContract.approve(selectedPool, amountA);
//       await approveA.wait();
//       const approveB = await tokenBContract.approve(selectedPool, amountB);
//       await approveB.wait();

//       const tx = await poolContract.addLiquidity(amountA, amountB);
//       await tx.wait();

//       alert("Liquidity Added!");
//       fetchPoolDetails(selectedPool);
//     } catch (error) {
//       console.error("Error adding liquidity:", error);
//     }
//   };

//   const handlePoolChange = async (e) => {
//     const poolAddress = e.target.value;
//     setSelectedPool(poolAddress);
//     fetchPoolDetails(poolAddress);
//   };

//   useEffect(() => {
//     if (provider) fetchPools();
//   }, [provider]);

//   return (
//     <div className="liquidity-container">
//       <h2>Create Liquidity Pool</h2>
//       <input type="text" placeholder="Token A Address" value={tokenA} onChange={(e) => setTokenA(e.target.value)} className="input-field"/>
//       <input type="text" placeholder="Token B Address" value={tokenB} onChange={(e) => setTokenB(e.target.value)} className="input-field"/>
//       <button onClick={createPool}>Create Pool</button>

//       <h3>Existing Pools</h3>
//       <select onChange={handlePoolChange} className="select-field">
//         <option value="">Select a Pool</option>
//         {allPools.map((pool, index) => (
//           <option key={index} value={pool}>
//             {pool}
//           </option>
//         ))}
//       </select>

//       {selectedPool && (
//         <div>
//           <h4>Selected Pool Address:</h4>
//           <p><strong>{selectedPool}</strong></p>

//           <h4>Pool Reserves</h4>
//           <p><strong>{tokenASymbol} Reserve:</strong> {reserveA}</p>
//           <p><strong>{tokenBSymbol} Reserve:</strong> {reserveB}</p>
//         </div>
//       )}

//       <h3>Add Liquidity</h3>
//       <input
//         type="text"
//         placeholder="Liquidity Amount"
//         value={liquidityAmount}
//         onChange={(e) => setLiquidityAmount(e.target.value)}
//         className="input-field"
//       />
//       <button onClick={addLiquidity}>Add Liquidity</button>
//     </div>
//   );
// };

// export default LiquidityPool;


// LiquidityPool.jsx

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import LiquidityPoolFactoryABI from "../assets/LiqFactory.json";
import LiquidityPoolABI from "../assets/LiquidityPool.json";
import ERC20ABI from "../assets/ERC20.json";

import {
  FaPlusCircle,
  FaSwimmingPool,
  FaCoins,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import "../App.css";

const FACTORY_ADDRESS = process.env.REACT_APP_LIQUIDITY_FACTORY_CONTRACT;

const LiquidityPool = ({ provider }) => {
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [allPools, setAllPools] = useState([]);
  const [poolsWithSymbols, setPoolsWithSymbols] = useState([]);
  const [selectedPool, setSelectedPool] = useState("");
  const [reserveA, setReserveA] = useState("0");
  const [reserveB, setReserveB] = useState("0");
  const [tokenASymbol, setTokenASymbol] = useState("");
  const [tokenBSymbol, setTokenBSymbol] = useState("");
  const [liquidityAmount, setLiquidityAmount] = useState("");
  const [loading, setLoading] = useState({ create: false, add: false, fetch: false });
  const [error, setError] = useState(null);

  const signer = provider ? provider.getSigner() : null;
  const factoryContract =
    provider && signer
      ? new ethers.Contract(
          FACTORY_ADDRESS,
          LiquidityPoolFactoryABI.abi,
          signer
        )
      : null;

  const createPool = async () => {
    if (!provider || !factoryContract) {
      setError(
        "MetaMask is required to create a pool. Please connect your wallet."
      );
      return;
    }
    if (!tokenA || !tokenB) {
      setError("Please enter both Token A and Token B addresses.");
      return;
    }
    try {
      setLoading((prev) => ({ ...prev, create: true }));
      setError(null);
      const tx = await factoryContract.createPool(tokenA, tokenB);
      await tx.wait();
      alert("Liquidity Pool Created Successfully!");
      fetchPools();
      setTokenA("");
      setTokenB("");
    } catch (error) {
      console.error("Error creating pool:", error);
      setError(
        `Failed to create pool: ${
          error.message || "Check inputs and try again."
        }`
      );
    } finally {
      setLoading((prev) => ({ ...prev, create: false }));
    }
  };

  const fetchPools = async () => {
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
          
          const [symbolA, symbolB] = await Promise.all([
            tokenAContract.symbol(),
            tokenBContract.symbol(),
          ]);
          
          return {
            address: poolAddress,
            pairName: `${symbolA}/${symbolB}`,
            symbolA,
            symbolB
          };
        } catch (error) {
          console.error(`Error getting symbols for pool ${poolAddress}:`, error);
          return {
            address: poolAddress,
            pairName: "Unknown Pair",
            symbolA: "???",
            symbolB: "???"
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

  const fetchPoolDetails = async (poolAddress) => {
    if (!provider || !poolAddress) return;
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

      const [tokenASymbol, tokenBSymbol, reserveA, reserveB] =
        await Promise.all([
          tokenAContract.symbol(),
          tokenBContract.symbol(),
          poolContract.reserveA(),
          poolContract.reserveB(),
        ]);

      setTokenASymbol(tokenASymbol);
      setTokenBSymbol(tokenBSymbol);
      setReserveA(ethers.utils.formatUnits(reserveA, 18));
      setReserveB(ethers.utils.formatUnits(reserveB, 18));
      setError(null);
    } catch (error) {
      console.error("Error fetching pool details:", error);
      setError(
        "Failed to fetch pool details. Check the pool address or MetaMask connection."
      );
    }
  };

  const addLiquidity = async () => {
    if (!provider || !selectedPool || !liquidityAmount) {
      setError(
        "Please select a pool, enter a liquidity amount, and ensure MetaMask is connected."
      );
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, add: true }));
      setError(null);
      const poolContract = new ethers.Contract(
        selectedPool,
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

      const amount = ethers.utils.parseUnits(liquidityAmount, 18);
      const [reserveA, reserveB] = await Promise.all([
        poolContract.reserveA(),
        poolContract.reserveB(),
      ]);
      const totalLiquidity = reserveA.add(reserveB);

      const amountA = reserveA.eq(0)
        ? amount
        : amount.mul(reserveA).div(totalLiquidity);
      const amountB = reserveB.eq(0)
        ? amount
        : amount.mul(reserveB).div(totalLiquidity);

      await Promise.all([
        tokenAContract.approve(selectedPool, amountA).then((tx) => tx.wait()),
        tokenBContract.approve(selectedPool, amountB).then((tx) => tx.wait()),
      ]);

      const tx = await poolContract.addLiquidity(amountA, amountB);
      await tx.wait();

      alert("Liquidity Added Successfully!");
      fetchPoolDetails(selectedPool);
      setLiquidityAmount("");
    } catch (error) {
      console.error("Error adding liquidity:", error);
      setError(
        `Failed to add liquidity: ${
          error.message || "Check inputs and try again."
        }`
      );
    } finally {
      setLoading((prev) => ({ ...prev, add: false }));
    }
  };

  const handlePoolChange = (e) => {
    const poolAddress = e.target.value;
    setSelectedPool(poolAddress);
    if (poolAddress) {
      fetchPoolDetails(poolAddress);
    } else {
      setTokenASymbol("");
      setTokenBSymbol("");
      setReserveA("0");
      setReserveB("0");
    }
  };

  useEffect(() => {
    if (provider) fetchPools();
  }, [provider]);

  return (
    <div className='liquidity-container'>
      <div className='liquidity-grid'>
        {/* Column 1: Create Pool */}
        <div className='liquidity-section'>
          <h2 className='section-title'>
            <FaPlusCircle className='section-icon' /> Create Pool
          </h2>
          <input
            type='text'
            placeholder='Token A Address'
            value={tokenA}
            onChange={(e) => setTokenA(e.target.value)}
            className='input-field'
            disabled={loading.create || !provider}
          />
          <input
            type='text'
            placeholder='Token B Address'
            value={tokenB}
            onChange={(e) => setTokenB(e.target.value)}
            className='input-field'
            disabled={loading.create || !provider}
          />
          <button
            onClick={createPool}
            className='action-btn'
            disabled={loading.create || !provider}
          >
            {loading.create ? (
              <>
                <FaSpinner className='spin-icon' /> Creating...
              </>
            ) : (
              <>
                <FaPlusCircle className='btn-icon' /> Create Pool
              </>
            )}
          </button>
        </div>

        {/* Column 2: Pool Selection */}
        <div className='liquidity-section'>
          <h2 className='section-title'>
            <FaSwimmingPool className='section-icon' /> Existing Pools
          </h2>
          <select
            onChange={handlePoolChange}
            className='select-field'
            disabled={loading.add || loading.fetch || !provider}
          >
            <option value=''>Select a Pool</option>
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
          {selectedPool && (
            <div className='pool-details'>
              <h3>Selected Pool</h3>
              <p className='pool-address'>{selectedPool}</p>
              <h3>Reserves</h3>
              <p>
                {tokenASymbol}: {reserveA}
              </p>
              <p>
                {tokenBSymbol}: {reserveB}
              </p>
            </div>
          )}
        </div>

        {/* Column 3: Add Liquidity */}
        <div className='liquidity-section'>
          <h2 className='section-title'>
            <FaCoins className='section-icon' /> Add Liquidity
          </h2>
          <input
            type='text'
            placeholder='Liquidity Amount'
            value={liquidityAmount}
            onChange={(e) => setLiquidityAmount(e.target.value)}
            className='input-field'
            disabled={loading.add || !provider}
          />
          <button
            onClick={addLiquidity}
            className='action-btn'
            disabled={loading.add || !selectedPool || !provider}
          >
            {loading.add ? (
              <>
                <FaSpinner className='spin-icon' /> Adding...
              </>
            ) : (
              <>
                <FaCoins className='btn-icon' /> Add Liquidity
              </>
            )}
          </button>
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

export default LiquidityPool;
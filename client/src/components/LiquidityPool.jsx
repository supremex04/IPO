import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import LiquidityPoolFactoryABI from "../assets/LiqFactory.json"; // LiquidityPoolFactory ABI
import LiquidityPoolABI from "../assets/LiquidityPool.json"; // LiquidityPool ABI
import ERC20ABI from "../assets/ERC20.json"; // Standard ERC-20 ABI

const FACTORY_ADDRESS = "0x15564f2D166dE7DC63b71a6CA684178412d26fa9"; // LiquidityPoolFactory contract address

const LiquidityPool = ({ provider }) => {
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [allPools, setAllPools] = useState([]);
  const [liquidityAmountA, setLiquidityAmountA] = useState("");
  const [liquidityAmountB, setLiquidityAmountB] = useState("");
  const [selectedPool, setSelectedPool] = useState("");
  const [reserveA, setReserveA] = useState("0");
  const [reserveB, setReserveB] = useState("0");
  const [tokenASymbol, setTokenASymbol] = useState("");
  const [tokenBSymbol, setTokenBSymbol] = useState("");

  const signer = provider.getSigner();
  const factoryContract = new ethers.Contract(FACTORY_ADDRESS, LiquidityPoolFactoryABI.abi, signer);

  // Create a new Liquidity Pool
  const createPool = async () => {
    try {
      const tx = await factoryContract.createPool(tokenA, tokenB);
      await tx.wait();
      alert("Liquidity Pool Created!");
      fetchPools();
    } catch (error) {
      console.error("Error creating pool:", error);
    }
  };

  // Fetch existing pools
  const fetchPools = async () => {
    try {
      const pools = await factoryContract.getAllPools();
      setAllPools(pools);
    } catch (error) {
      console.error("Error fetching pools:", error);
    }
  };

  // Fetch Reserves & Token Symbols of the Selected Pool
  const fetchPoolDetails = async (poolAddress) => {
    try {
      if (!poolAddress) return;
      const poolContract = new ethers.Contract(poolAddress, LiquidityPoolABI.abi, signer);

      // Get token addresses
      const tokenAAddress = await poolContract.tokenA();
      const tokenBAddress = await poolContract.tokenB();

      // Create ERC-20 contract instances
      const tokenAContract = new ethers.Contract(tokenAAddress, ERC20ABI, signer);
      const tokenBContract = new ethers.Contract(tokenBAddress, ERC20ABI, signer);

      // Fetch token symbols
      const tokenASymbol = await tokenAContract.symbol();
      const tokenBSymbol = await tokenBContract.symbol();

      // Fetch reserves
      const [reserveA, reserveB] = await Promise.all([
        poolContract.reserveA(),
        poolContract.reserveB(),
      ]);

      // Update state
      setTokenASymbol(tokenASymbol);
      setTokenBSymbol(tokenBSymbol);
      setReserveA(ethers.utils.formatUnits(reserveA, 18));
      setReserveB(ethers.utils.formatUnits(reserveB, 18));
    } catch (error) {
      console.error("Error fetching pool details:", error);
    }
  };

  // Add liquidity to an existing pool
  const addLiquidity = async () => {
    if (!selectedPool) {
      alert("Please select a liquidity pool.");
      return;
    }

    if (!liquidityAmountA || !liquidityAmountB) {
      alert("Please enter liquidity amounts.");
      return;
    }

    try {
      const poolContract = new ethers.Contract(selectedPool, LiquidityPoolABI.abi, signer);

      // Get token addresses from the pool
      const tokenA = await poolContract.tokenA();
      const tokenB = await poolContract.tokenB();

      // Create ERC-20 token instances
      const tokenAContract = new ethers.Contract(tokenA, ERC20ABI, signer);
      const tokenBContract = new ethers.Contract(tokenB, ERC20ABI, signer);

      // Convert liquidity amounts to BigNumber
      const amountA = ethers.utils.parseUnits(liquidityAmountA, 18);
      const amountB = ethers.utils.parseUnits(liquidityAmountB, 18);

      // Approve token transfers
      const approveA = await tokenAContract.approve(selectedPool, amountA);
      await approveA.wait();

      const approveB = await tokenBContract.approve(selectedPool, amountB);
      await approveB.wait();

      // Add liquidity
      const tx = await poolContract.addLiquidity(amountA, amountB);
      await tx.wait();

      alert("Liquidity Added!");
      fetchPoolDetails(selectedPool); // Refresh reserve and token data
    } catch (error) {
      console.error("Error adding liquidity:", error);
    }
  };

  // When user selects a pool, fetch pool details
  const handlePoolChange = async (e) => {
    const poolAddress = e.target.value;
    setSelectedPool(poolAddress);
    fetchPoolDetails(poolAddress);
  };

  useEffect(() => {
    if (provider) fetchPools();
  }, [provider]);

  return (
    <div className="liquidity-container">
      <h2>Create Liquidity Pool</h2>
      <input type="text" placeholder="Token A Address" value={tokenA} onChange={(e) => setTokenA(e.target.value)} />
      <input type="text" placeholder="Token B Address" value={tokenB} onChange={(e) => setTokenB(e.target.value)} />
      <button onClick={createPool}>Create Pool</button>

      <h3>Existing Pools</h3>
      <select onChange={handlePoolChange}>
        <option value="">Select a Pool</option>
        {allPools.map((pool, index) => (
          <option key={index} value={pool}>
            {pool}
          </option>
        ))}
      </select>

      {/* Display Pool Address & Reserves with Token Symbols */}
      {selectedPool && (
        <div>
          <h4>Selected Pool Address:</h4>
          <p><strong>{selectedPool}</strong></p>

          <h4>Pool Reserves</h4>
          <p>
            <strong>{tokenASymbol} Reserve:</strong> {reserveA}
          </p>
          <p>
            <strong>{tokenBSymbol} Reserve:</strong> {reserveB}
          </p>
        </div>
      )}

      <h3>Add Liquidity</h3>
      <input
        type="text"
        placeholder="Amount A"
        value={liquidityAmountA}
        onChange={(e) => setLiquidityAmountA(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount B"
        value={liquidityAmountB}
        onChange={(e) => setLiquidityAmountB(e.target.value)}
      />
      <button onClick={addLiquidity}>Add Liquidity</button>
    </div>
  );
};

export default LiquidityPool;

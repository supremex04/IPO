import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import LiquidityPoolFactoryABI from "../assets/LiqFactory.json";
import LiquidityPoolABI from "../assets/LiquidityPool.json";
import ERC20ABI from "../assets/ERC20.json";
import "../App.css";

const FACTORY_ADDRESS = process.env.REACT_APP_LIQUIDITY_FACTORY_CONTRACT;

const LiquidityPool = ({ provider }) => {
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [allPools, setAllPools] = useState([]);
  const [selectedPool, setSelectedPool] = useState("");
  const [reserveA, setReserveA] = useState("0");
  const [reserveB, setReserveB] = useState("0");
  const [tokenASymbol, setTokenASymbol] = useState("");
  const [tokenBSymbol, setTokenBSymbol] = useState("");
  const [liquidityAmount, setLiquidityAmount] = useState("");

  const signer = provider.getSigner();
  const factoryContract = new ethers.Contract(FACTORY_ADDRESS, LiquidityPoolFactoryABI.abi, signer);

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

  const fetchPools = async () => {
    try {
      const pools = await factoryContract.getAllPools();
      setAllPools(pools);
    } catch (error) {
      console.error("Error fetching pools:", error);
    }
  };

  const fetchPoolDetails = async (poolAddress) => {
    try {
      if (!poolAddress) return;
      const poolContract = new ethers.Contract(poolAddress, LiquidityPoolABI.abi, signer);

      const tokenAAddress = await poolContract.tokenA();
      const tokenBAddress = await poolContract.tokenB();

      const tokenAContract = new ethers.Contract(tokenAAddress, ERC20ABI, signer);
      const tokenBContract = new ethers.Contract(tokenBAddress, ERC20ABI, signer);

      const tokenASymbol = await tokenAContract.symbol();
      const tokenBSymbol = await tokenBContract.symbol();

      const [reserveA, reserveB] = await Promise.all([
        poolContract.reserveA(),
        poolContract.reserveB(),
      ]);

      setTokenASymbol(tokenASymbol);
      setTokenBSymbol(tokenBSymbol);
      setReserveA(ethers.utils.formatUnits(reserveA, 18));
      setReserveB(ethers.utils.formatUnits(reserveB, 18));
    } catch (error) {
      console.error("Error fetching pool details:", error);
    }
  };

  const addLiquidity = async () => {
    if (!selectedPool || !liquidityAmount) {
      alert("Please select a pool and enter liquidity amount.");
      return;
    }

    try {
      const poolContract = new ethers.Contract(selectedPool, LiquidityPoolABI.abi, signer);
      const tokenAAddress = await poolContract.tokenA();
      const tokenBAddress = await poolContract.tokenB();

      const tokenAContract = new ethers.Contract(tokenAAddress, ERC20ABI, signer);
      const tokenBContract = new ethers.Contract(tokenBAddress, ERC20ABI, signer);

      const amount = ethers.utils.parseUnits(liquidityAmount, 18);

      const reserveA = await poolContract.reserveA();
      const reserveB = await poolContract.reserveB();
      const totalLiquidity = reserveA.add(reserveB);

      const amountA = reserveA.eq(0) ? amount : amount.mul(reserveA).div(totalLiquidity);
      const amountB = reserveB.eq(0) ? amount : amount.mul(reserveB).div(totalLiquidity);

      const approveA = await tokenAContract.approve(selectedPool, amountA);
      await approveA.wait();
      const approveB = await tokenBContract.approve(selectedPool, amountB);
      await approveB.wait();

      const tx = await poolContract.addLiquidity(amountA, amountB);
      await tx.wait();

      alert("Liquidity Added!");
      fetchPoolDetails(selectedPool);
    } catch (error) {
      console.error("Error adding liquidity:", error);
    }
  };

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
      <input type="text" placeholder="Token A Address" value={tokenA} onChange={(e) => setTokenA(e.target.value)} className="input-field"/>
      <input type="text" placeholder="Token B Address" value={tokenB} onChange={(e) => setTokenB(e.target.value)} className="input-field"/>
      <button onClick={createPool}>Create Pool</button>

      <h3>Existing Pools</h3>
      <select onChange={handlePoolChange} className="select-field">
        <option value="">Select a Pool</option>
        {allPools.map((pool, index) => (
          <option key={index} value={pool}>
            {pool}
          </option>
        ))}
      </select>

      {selectedPool && (
        <div>
          <h4>Selected Pool Address:</h4>
          <p><strong>{selectedPool}</strong></p>

          <h4>Pool Reserves</h4>
          <p><strong>{tokenASymbol} Reserve:</strong> {reserveA}</p>
          <p><strong>{tokenBSymbol} Reserve:</strong> {reserveB}</p>
        </div>
      )}

      <h3>Add Liquidity</h3>
      <input
        type="text"
        placeholder="Liquidity Amount"
        value={liquidityAmount}
        onChange={(e) => setLiquidityAmount(e.target.value)}
        className="input-field"
      />
      <button onClick={addLiquidity}>Add Liquidity</button>
    </div>
  );
};

export default LiquidityPool;

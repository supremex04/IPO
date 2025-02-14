import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import LiquidityPoolFactory from "../assets/LiqFactory.json"; // Ensure ABI is available

const CONTRACT_ADDRESS = "0xBC7B7296D2d0723AE85112FedD4b432821f091c9"; // Replace with actual address
const LiquidityPoolFactoryABI = LiquidityPoolFactory.abi;

const LiquidityPool = ({ provider }) => {
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [poolAddress, setPoolAddress] = useState(null);
  const [allPools, setAllPools] = useState([]);

  const contract = new ethers.Contract(CONTRACT_ADDRESS, LiquidityPoolFactoryABI, provider.getSigner());

  const createPool = async () => {
    try {
      const tx = await contract.createPool(tokenA, tokenB);
      await tx.wait();
      alert("Liquidity Pool Created!");
    } catch (error) {
      console.error("Error creating pool:", error);
    }
  };

  const fetchPools = async () => {
    try {
      const pools = await contract.getAllPools();
      setAllPools(pools);
    } catch (error) {
      console.error("Error fetching pools:", error);
    }
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
      <ul>
        {allPools.map((pool, index) => (
          <li key={index}>{pool}</li>
        ))}
      </ul>
    </div>
  );
};

export default LiquidityPool;

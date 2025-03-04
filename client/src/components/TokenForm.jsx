// TokenForm.jsx
import React, { useState } from "react";
import { ethers } from "ethers";
import TokenFactoryJSON from "../assets/ABI.json";
import {
  FaPlusCircle,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import "../App.css";

const TokenFactoryABI = TokenFactoryJSON.abi;

const TokenForm = ({ contractAddress, provider }) => {
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    initialSupply: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");
  
    if (!provider) {
      setError("MetaMask is required to create a token. Please connect your wallet.");
      return;
    }
  
    try {
      setLoading(true);
      const signer = provider.getSigner();
      const tokenFactoryContract = new ethers.Contract(contractAddress, TokenFactoryABI, signer);
  
      const decimals = 18;
      const initialSupplyWei = ethers.utils.parseUnits(form.initialSupply, decimals);
  
      const tx = await tokenFactoryContract.createToken(form.name, form.symbol, initialSupplyWei);
  
      const receipt = await tx.wait();
      const tokenCreatedEvent = receipt.events?.find((event) => event.event === "TokenCreated");
  
      if (tokenCreatedEvent) {
        const newTokenAddress = tokenCreatedEvent.args.tokenAddress;
        const blockNumber = receipt.blockNumber;
  
        // Fetch block details for timestamp
        const block = await provider.getBlock(blockNumber);
        const timestamp = new Date(block.timestamp * 1000).toLocaleString();
  
        setSuccessMessage(
          `✅ Token created successfully!
          \n🔹 Address: ${newTokenAddress}
          \n🔹 Name: ${form.name}
          \n🔹 Symbol: ${form.symbol}
          \n🔹 Tx Hash: ${tx.hash}
          \n🔹 Block Number: ${blockNumber}
          \n🔹 Timestamp: ${timestamp}`
        );
      } else {
        setError("Token created, but address not found in event logs.");
      }
  
      setForm({ name: "", symbol: "", initialSupply: "" });
    } catch (err) {
      console.error("Error creating token:", err);
      setError(`Failed to create token: ${err.message || "Check inputs and try again."}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className='token-form-container'>
      <form className='token-form-grid' onSubmit={handleSubmit}>
        {/* Column 1: Token Name */}
        <div className='token-form-section'>
          <h2 className='section-title'>
            <FaPlusCircle className='section-icon' /> Token Name
          </h2>
          <div className='form-group'>
            <input
              type='text'
              id='name'
              name='name'
              value={form.name}
              onChange={handleChange}
              required
              className='form-input'
              placeholder='Stock Name'
              disabled={loading || !provider}
            />
          </div>
        </div>

        {/* Column 2: Token Symbol */}
        <div className='token-form-section'>
          <h2 className='section-title'>
            <FaPlusCircle className='section-icon' /> Token Symbol
          </h2>
          <div className='form-group'>
            <input
              type='text'
              id='symbol'
              name='symbol'
              value={form.symbol}
              onChange={handleChange}
              required
              className='form-input'
              placeholder='e.g. MTK'
              disabled={loading || !provider}
            />
          </div>
        </div>

        {/* Column 3: Initial Supply and Submit */}
        <div className='token-form-section'>
          <h2 className='section-title'>
            <FaPlusCircle className='section-icon' /> Initial Supply
          </h2>
          <div className='form-group'>
            <input
              type='number'
              id='initialSupply'
              name='initialSupply'
              value={form.initialSupply}
              onChange={handleChange}
              required
              className='form-input'
              placeholder='e.g. 1000000'
              disabled={loading || !provider}
            />
          </div>
          <button
            type='submit'
            className='submit-btn'
            disabled={loading || !provider}
          >
            {loading ? (
              <>
                <FaSpinner className='spin-icon' /> Creating...
              </>
            ) : (
              <>
                <FaPlusCircle className='btn-icon' /> Tokenize
              </>
            )}
          </button>
        </div>

        {/* Messages (spans all columns) */}
        {(successMessage || error) && (
          <div className='message-container'>
            {successMessage && (
              <div className='message success-message'>
                <FaCheckCircle className='message-icon' /> {successMessage}
              </div>
            )}
            {error && (
              <div className='message error-message'>
                <FaExclamationCircle className='message-icon' /> {error}
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default TokenForm;
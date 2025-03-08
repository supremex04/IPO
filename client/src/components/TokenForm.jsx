// TokenForm.jsx
import React, { useState } from "react";
import { ethers } from "ethers";
import TokenFactoryJSON from "../assets/ABI.json";
import {
  FaPlusCircle,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaLink,
  FaCube,
  FaTag,
  FaClock,
  FaReceipt
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
  const [successMessage, setSuccessMessage] = useState(null);

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
    setSuccessMessage(null);
  
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
  
        setSuccessMessage({
          tokenAddress: newTokenAddress,
          name: form.name,
          symbol: form.symbol,
          txHash: tx.hash,
          blockNumber: blockNumber,
          timestamp: timestamp
        });
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
    <div className='token-creation-wrapper'>
      <div className='token-form-container'>
        <div className='token-form-grid'>
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
              onClick={handleSubmit}
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
        </div>

        {/* Error Message */}
        {error && (
          <div className='error-message-container'>
            <div className='message error-message'>
              <FaExclamationCircle className='message-icon' /> {error}
            </div>
          </div>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className='success-message-container'>
          <div className='success-message-box'>
            <div className='success-message-title'>
              <FaCheckCircle className='message-icon' /> Token Created Successfully
            </div>
            <div className='success-message-details'>
              <div className='detail-row'>
                <span className='detail-label'>Token Address: {successMessage.tokenAddress}</span>
              </div>
              <div className='detail-row'>
                <span className='detail-label'>Name: {successMessage.name}</span>
              </div>
              <div className='detail-row'>
                <span className='detail-label'>Symbol: {successMessage.symbol}</span>
              </div>
              <div className='detail-row'>
                <span className='detail-label'>Tx Hash: {successMessage.txHash}</span>
              </div>
              <div className='detail-row'>
                <span className='detail-label'>Block Number: {successMessage.blockNumber}</span>
              </div>
              <div className='detail-row'>
                <span className='detail-label'>Timestamp: {successMessage.timestamp}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenForm;
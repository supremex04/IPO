import React, { useState } from "react";
import { ethers } from "ethers";
import TokenFactoryJSON from "../assets/ABI.json"; // Replace with actual ABI path

const TokenFactoryABI = TokenFactoryJSON.abi;
const TokenForm = ({ contractAddress }) => {
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    initialSupply: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");
  
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install it to use this feature.");
      return;
    }
  
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tokenFactoryContract = new ethers.Contract(contractAddress, TokenFactoryABI, signer);
  
      // Call the `createToken` function and retrieve the transaction response
      const tx = await tokenFactoryContract.createToken(
        form.name,
        form.symbol,
        ethers.utils.parseEther(form.initialSupply)
      );
  
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
  
      // Extract the token contract address from the event logs
      const tokenCreatedEvent = receipt.events?.find((event) => event.event === "TokenCreated");
  
      if (tokenCreatedEvent) {
        const newTokenAddress = tokenCreatedEvent.args.tokenAddress; // Access token address from event
        setSuccessMessage(`Token successfully created! Contract Address: ${newTokenAddress}`);
      } else {
        setError("Token creation successful, but no token address found in event logs.");
      }
  
      setForm({ name: "", symbol: "", initialSupply: "" }); // Reset form
    } catch (err) {
      console.error("Error creating token:", err);
      setError("Failed to create token. Please check the inputs and try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="token-form">
      <h2>Create a New Token</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Token Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="symbol">Token Symbol</label>
          <input
            type="text"
            id="symbol"
            name="symbol"
            value={form.symbol}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="initialSupply">Initial Supply (in tokens)</label>
          <input
            type="number"
            id="initialSupply"
            name="initialSupply"
            value={form.initialSupply}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="button" disabled={loading}>
          {loading ? "Creating..." : "Create Token"}
        </button>
      </form>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default TokenForm;

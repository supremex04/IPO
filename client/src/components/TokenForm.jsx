import React, { useState } from "react";
import { ethers } from "ethers";
import TokenFactoryJSON from "../assets/ABI.json";

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
      const decimals = 18; // Default ERC20 decimals
      const tx = await tokenFactoryContract.createToken(
        form.name,
        form.symbol,
        ethers.utils.parseUnits(form.initialSupply, decimals) 
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
  
      setForm({ name: "", symbol: "", initialSupply: "" }); 
    } catch (err) {
      console.error("Error creating token:", err);
      setError("Failed to create token. Please check the inputs and try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (

    
<div
  className="token-form"
  style={{
    backgroundColor: "#1e1e1e",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    margin: "0 auto",
    color: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  }}
>
  <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Create a New Token</h2>
  <form onSubmit={handleSubmit}>
    <div
      className="form-group"
      style={{ marginBottom: "15px" }}
    >
      <label
        htmlFor="name"
        style={{
          display: "block",
          marginBottom: "5px",
          fontSize: "14px",
          color: "#bbb",
        }}
      >
        Token Name
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #333",
          backgroundColor: "#2c2c2c",
          color: "#fff",
        }}
      />
    </div>

    <div
      className="form-group"
      style={{ marginBottom: "15px" }}
    >
      <label
        htmlFor="symbol"
        style={{
          display: "block",
          marginBottom: "5px",
          fontSize: "14px",
          color: "#bbb",
        }}
      >
        Token Symbol
      </label>
      <input
        type="text"
        id="symbol"
        name="symbol"
        value={form.symbol}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #333",
          backgroundColor: "#2c2c2c",
          color: "#fff",
        }}
      />
    </div>

    <div
      className="form-group"
      style={{ marginBottom: "15px" }}
    >
      <label
        htmlFor="initialSupply"
        style={{
          display: "block",
          marginBottom: "5px",
          fontSize: "14px",
          color: "#bbb",
        }}
      >
        Initial Supply (in tokens)
      </label>
      <input
        type="number"
        id="initialSupply"
        name="initialSupply"
        value={form.initialSupply}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #333",
          backgroundColor: "#2c2c2c",
          color: "#fff",
        }}
      />
    </div>

    <button
      type="submit"
      className="button"
      disabled={loading}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "5px",
        border: "none",
        backgroundColor: loading ? "#555" : "#28a745",
        color: "#fff",
        cursor: loading ? "not-allowed" : "pointer",
        fontSize: "16px",
      }}
    >
      {loading ? "Creating..." : "Create Token"}
    </button>
  </form>

  {successMessage && (
    <p
      className="success-message"
      style={{
        marginTop: "15px",
        fontSize: "14px",
        color: "#28a745",
        textAlign: "center",
      }}
    >
      {successMessage}
    </p>
  )}
  {error && (
    <p
      className="error-message"
      style={{
        marginTop: "15px",
        fontSize: "14px",
        color: "#ff4d4d",
        textAlign: "center",
      }}
    >
      {error}
    </p>
  )}
</div>
  )
};

export default TokenForm;
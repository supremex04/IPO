import React, { useState } from "react";
import { ethers } from "ethers";

const ERC20_ABI = [
  "function name() public view returns (string)",
  "function symbol() public view returns (string)",
  "function totalSupply() public view returns (uint256)"
];

const TokenDisplay = ({ factoryContractAddress, factoryABI }) => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch tokens from the factory
  const fetchTokens = async () => {
    setLoading(true);
    setError(null);

    if (!window.ethereum) {
      setError("MetaMask is not installed.");
      setLoading(false);
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Instantiate the TokenFactory contract
      const factoryContract = new ethers.Contract(factoryContractAddress, factoryABI, signer);

      // Fetch the list of created token addresses
      const createdTokenAddresses = await factoryContract.getCreatedTokens();

      // Fetch token details for each token
      const tokenDetails = await Promise.all(
        createdTokenAddresses.map(async (tokenAddress) => {
          const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

          // Fetch name, symbol, and totalSupply
          const name = await tokenContract.name();
          const symbol = await tokenContract.symbol();
          const totalSupply = await tokenContract.totalSupply();

          return {
            address: tokenAddress,
            name,
            symbol,
            totalSupply: ethers.utils.formatEther(totalSupply) // Adjust decimals (default: 18)
          };
        })
      );

      setTokens(tokenDetails);
    } catch (err) {
      console.error("Error fetching tokens:", err);
      setError("Failed to fetch token details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="token-display-container">
      <h2>Display Created Tokens</h2>
      <button onClick={fetchTokens} disabled={loading} className="fetch-button">
        {loading ? "Loading..." : "Display Tokens"}
      </button>
  
      {error && <p className="error-message">{error}</p>}
  
      {tokens.length > 0 && (
        <div className="token-list">
          {tokens.map((token, index) => (
            <div className="token-card" key={index}>
              <h3 className="token-name">{token.name} ({token.symbol})</h3>
              <p><strong>Address:</strong> {token.address}</p>
              <p><strong>Total Supply:</strong> {token.totalSupply}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default TokenDisplay;

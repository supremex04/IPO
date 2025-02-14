
import React, { useState } from "react";
import "../App.css"; // Import the separate CSS file

const WalletConnect= () => {
  const [account, setAccount] = useState(null);

  // Function to connect MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]); // Save connected wallet address
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this feature.");
    }
  };

  // Function to disconnect the wallet
  const disconnectWallet = () => {
    setAccount(null); // Clear the connected account
  };

  // Handler for the button click (connect or disconnect based on state)
  const handleWalletButton = () => {
    if (account) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  return (
    <div>
      <nav className="navbar"
      >
        <button
          onClick={handleWalletButton}
          className={account ? "button disconnect-button" : "button connect-button"}
        >
          {account
            ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)} (Disconnect)`
            : "Connect"}
        </button>
      </nav>
      <main className="main">
    
      </main>
    </div>
  );
};

//export default App;

export default WalletConnect;
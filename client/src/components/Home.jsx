import React, { useState } from "react";
import "../App.css";
import InfoSection from "./InfoSection";

const Home = () => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert(
        "MetaMask is not installed. Please install it to use this feature."
      );
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  return (
    <>
      <div className='home-container'>
        <div className='home-content'>
          <div className='home-text'>
            <h1 className='home-title'>Welcome to the dApp</h1>
            <p className='home-description'>
              Connect your wallet to start trading securely and efficiently on
              our platform.
            </p>
            <button
              onClick={account ? disconnectWallet : connectWallet}
              className='connect-wallet-btn'
            >
              {account
                ? `${account.slice(0, 6)}...${account.slice(-4)} (Disconnect)`
                : "Connect Wallet"}
            </button>
          </div>
        </div>
      </div>
    <InfoSection />
    </>
  );
};

export default Home;
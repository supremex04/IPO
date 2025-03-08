import React from "react";
import "../App.css";
import InfoSection from "./InfoSection";

const Home = ({ account, connectWallet, disconnectWallet }) => {
  return (
    <>
      <div className='home-container'>
        <div className='home-content'>
          <div className='home-text'>
            <h1 className='home-title'>Welcome to the dApp</h1>
            <p className='home-description'>
              Connect your wallet to start trading securely and efficiently on our platform.
            </p>
            <button onClick={account ? disconnectWallet : connectWallet} className='connect-wallet-btn'>
              {account ? `${account.slice(0, 6)}...${account.slice(-4)} (Disconnect)` : "Connect Wallet"}
            </button>
          </div>
        </div>
      </div>
      <InfoSection />
    </>
  );
};

export default Home;

import React from "react";
import WalletConnect from "./WalletConnect";

const Home = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Welcome to the Trading App</h2>
      <p>Connect your wallet to get started.</p>
      <WalletConnect />
    </div>
  );
};

export default Home;

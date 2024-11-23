import React, { useEffect } from "react";
import { FiLogIn } from "react-icons/fi";

const WalletConnect = ({ account, setAccount, setStatus }) => {
  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setAccount(accounts[0]);
          setStatus("Wallet connected successfully.");
        } catch (error) {
          setStatus("Error connecting to wallet: " + error.message);
        }
      } else {
        setStatus("Please install MetaMask to use this application.");
      }
    };

    connectWallet();
  }, [setAccount, setStatus]);

  return (
    <div className="flex items-center justify-between bg-white shadow-md p-4 rounded-lg">
      <p className="text-sm">
        {account
          ? `Connected Wallet: ${account.slice(0, 6)}...${account.slice(-4)}`
          : "No Wallet Connected"}
      </p>
      <button
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        onClick={() => window.ethereum && window.ethereum.request({ method: "eth_requestAccounts" })}
      >
        <FiLogIn />
        {account ? "Switch Wallet" : "Connect Wallet"}
      </button>
    </div>
  );
};

export default WalletConnect;

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { ethers } from "ethers";
import LoadingBar from "react-top-loading-bar";

import TokenForm from "./components/TokenForm.jsx";
import Home from "./components/Home.jsx";
import Navbar from "./components/Navbar";
import LiquidityPool from "./components/LiquidityPool";
import Swap from "./components/Swap";
import NotFound from "./components/NotFound.jsx";
import "./App.css";

const TGE = process.env.REACT_APP_TGE_CONTRACT;
const ADMIN_ADDRESS = process.env.REACT_APP_ADMIN_ADDRESS?.toLowerCase();

const AppContent = ({ provider, setLoadingProgress, walletError, account, connectWallet, disconnectWallet }) => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    setLoadingProgress(30);
    const timer = setTimeout(() => setLoadingProgress(100), 500);
    return () => {
      clearTimeout(timer);
      setLoadingProgress(0);
    };
  }, [location, navigationType, setLoadingProgress]);

  return (
    <div className='app-container'>
      <Navbar 
        provider={provider} 
        account={account} 
        connectWallet={connectWallet} 
        disconnectWallet={disconnectWallet} 
      />
      <div className='content'>
        {walletError && (
          <div className='wallet-error'>
            <p>{walletError}</p>
            <button onClick={() => window.location.reload()} className='retry-btn'>
              Retry
            </button>
            <p className='install-instruction'>
              Don’t have MetaMask?{" "}
              <a href='https://metamask.io/download.html' target='_blank' rel='noopener noreferrer' className='install-link'>
                Install it here
              </a>.
            </p>
          </div>
        )}
        <Routes>
          <Route path='/' element={<Home account={account} connectWallet={connectWallet} disconnectWallet={disconnectWallet} />} />
          {account === ADMIN_ADDRESS && (
            <Route path='/tokenform' element={<TokenForm contractAddress={TGE} provider={provider} />} />
          )}
          <Route path='/liquiditypool' element={<LiquidityPool provider={provider} />} />
          <Route path='/swap' element={<Swap provider={provider} />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [walletError, setWalletError] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setWalletError("MetaMask is not installed. Please install it.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0].toLowerCase());
      setWalletError(null);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setWalletError("Failed to connect. Try again.");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  useEffect(() => {
    const initializeProvider = async () => {
      if (!window.ethereum) {
        setWalletError("No Ethereum provider found.");
        return;
      }
      try {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);

        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0].toLowerCase());
        }
        setWalletError(null);
      } catch (err) {
        console.error("Error initializing provider:", err);
      }
    };

    initializeProvider();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts.length > 0 ? accounts[0].toLowerCase() : null);
      });
      window.ethereum.on("chainChanged", () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  return (
    <Router>
      <LoadingBar color='#2563eb' progress={loadingProgress} height={3} onLoaderFinished={() => setLoadingProgress(0)} />
      <AppContent 
        provider={provider} 
        setLoadingProgress={setLoadingProgress} 
        walletError={walletError} 
        account={account} 
        connectWallet={connectWallet} 
        disconnectWallet={disconnectWallet} 
      />
    </Router>
  );
};

export default App;

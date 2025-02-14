import React from "react";
import { Link } from "react-router-dom";
import WalletConnect from "./WalletConnect";
import "../App.css"; 

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-button">Home</Link>
        <Link to="/tokenform" className="nav-button">Tokenization Form</Link>
        <Link to="/liquiditypool" className="nav-button">Liquidity Pool</Link>
        <Link to="/swap" className="nav-button">Swap</Link>

      </div>

      <h1 className="app-title">Securities Exchange Platform</h1>

      <div className="nav-right">
        <WalletConnect />
      </div>
    </header>
  );
};

export default Navbar;

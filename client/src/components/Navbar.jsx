import React from "react";
import { Link } from "react-router-dom";
import WalletConnect from "./WalletConnect";
import "../App.css"; 

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-button">Home</Link>
        <Link to="/tokenform" className="nav-button">Token Form</Link>
        <Link to="/liquiditypool" className="nav-button">Liquidity Pool</Link>

      </div>

      <h1 className="app-title">Trading App</h1>

      <div className="nav-right">
        <WalletConnect />
      </div>
    </header>
  );
};

export default Navbar;

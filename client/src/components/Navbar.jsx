// Navbar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // Changed from Link to NavLink
import { FaBars, FaTimes, FaWallet } from "react-icons/fa";
import "../App.css"; // Using the provided Navbar.css

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const handleWalletButton = () => {
    if (account) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Tokenization Form", path: "/tokenform" },
    { name: "Liquidity Pool", path: "/liquiditypool" },
    { name: "Swap", path: "/swap" },
  ];

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        {/* Logo */}
        <NavLink to='/' className='navbar-logo-link' end>
          <div className='navbar-logo'>
            <h1>SEP</h1>
          </div>
        </NavLink>

        {/* Desktop Menu */}
        <div className='navbar-menu'>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `navbar-link ${isActive ? "navbar-link-active" : ""}`
              }
              end
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Connect Button - Desktop */}
        <div className='navbar-button-desktop'>
          <button className='connect-button' onClick={handleWalletButton}>
            <FaWallet className='wallet-icon' />
            {account
              ? `${account.slice(0, 6)}...${account.slice(-4)} (Disconnect)`
              : "Connect Wallet"}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className='navbar-mobile-toggle'>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='mobile-menu-button'
          >
            {isMobileMenuOpen ? (
              <FaTimes className='menu-icon' />
            ) : (
              <FaBars className='menu-icon' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='navbar-mobile-menu'>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `navbar-mobile-link ${
                  isActive ? "navbar-mobile-link-active" : ""
                }`
              }
              end
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
          <button
            className='connect-button mobile-connect'
            onClick={() => {
              handleWalletButton();
              setIsMobileMenuOpen(false);
            }}
          >
            <FaWallet className='wallet-icon' />
            {account
              ? `${account.slice(0, 6)}...${account.slice(-4)} (Disconnect)`
              : "Connect Wallet"}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
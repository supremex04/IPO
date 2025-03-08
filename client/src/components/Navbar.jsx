import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaWallet } from "react-icons/fa";
import "../App.css";

const Navbar = ({ account, connectWallet, disconnectWallet }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const ADMIN_ADDRESS = process.env.REACT_APP_ADMIN_ADDRESS?.toLowerCase();

  useEffect(() => {
    setIsAdmin(account === ADMIN_ADDRESS);
  }, [account, ADMIN_ADDRESS]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Liquidity Pool", path: "/liquiditypool" },
    { name: "Swap", path: "/swap" },
  ];

  if (isAdmin) {
    navLinks.splice(1, 0, { name: "Tokenization Form", path: "/tokenform" });
  }

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <NavLink to='/' className='navbar-logo-link' end>
          <div className='navbar-logo'><h1>SEP</h1></div>
        </NavLink>

        <div className='navbar-menu'>
          {navLinks.map((link) => (
            <NavLink key={link.name} to={link.path} className='navbar-link' end>
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className='navbar-button-desktop'>
          <button className='connect-button' onClick={account ? disconnectWallet : connectWallet}>
            <FaWallet className='wallet-icon' />
            {account ? `${account.slice(0, 6)}...${account.slice(-4)} (Disconnect)` : "Connect Wallet"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

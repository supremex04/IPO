import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ethers } from "ethers"; 

import TokenForm from "./components/TokenForm.jsx";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import LiquidityPool from "./components/LiquidityPool";
import Swap from "./components/Swap";


const TGE = process.env.REACT_APP_TGE_CONTRACT;
const provider = new ethers.providers.Web3Provider(window.ethereum);

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tokenform" element={<TokenForm contractAddress={TGE} />} />
            <Route path="/liquiditypool" element={<LiquidityPool provider={provider} />} /> 
            <Route path="/swap" element={<Swap provider={provider} />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

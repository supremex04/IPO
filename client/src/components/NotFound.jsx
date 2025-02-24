// NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const NotFound = () => {
  return (
    <div className='notfound-container'>
      <div className='notfound-content'>
        <h1 className='notfound-title'>404</h1>
        <h2 className='notfound-subtitle'>Page Not Found</h2>
        <p className='notfound-description'>
          Oops! It seems you've wandered off the path. The page you're looking
          for doesn't exist or has been moved.
        </p>
        <Link to='/' className='notfound-button'>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

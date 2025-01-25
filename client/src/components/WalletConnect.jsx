
// import React, { useState } from "react";
// import "../App.css"; // Import the separate CSS file

// const WalletConnect= () => {
//   const [account, setAccount] = useState(null);

//   // Function to connect MetaMask
//   const connectWallet = async () => {
//     if (window.ethereum) {
//       try {
//         const accounts = await window.ethereum.request({
//           method: "eth_requestAccounts",
//         });
//         setAccount(accounts[0]); // Save connected wallet address
//       } catch (error) {
//         console.error("Error connecting wallet:", error);
//       }
//     } else {
//       alert("MetaMask is not installed. Please install it to use this feature.");
//     }
//   };

//   // Function to disconnect the wallet
//   const disconnectWallet = () => {
//     setAccount(null); // Clear the connected account
//   };

//   // Handler for the button click (connect or disconnect based on state)
//   const handleWalletButton = () => {
//     if (account) {
//       disconnectWallet();
//     } else {
//       connectWallet();
//     }
//   };

//   return (
//     <div>
//       <nav className="navbar">
//         <h2 className="logo">TRADE</h2>
//         <button
//           onClick={handleWalletButton}
//           className={account ? "button disconnect-button" : "button connect-button"}
//         >
//           {account
//             ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)} (Disconnect)`
//             : "Connect"}
//         </button>
//       </nav>
//       <main className="main">
//         <h1>Welcome to Trading App</h1>
//         <p>
//           {account
//             ? "Wallet is connected. You can disconnect anytime."
//             : "Click 'Connect Wallet' to link your MetaMask wallet."}
//         </p>
//       </main>
//     </div>
//   );
// };

// //export default App;

// export default WalletConnect;




// import React, { useEffect } from "react";
// import { FiLogIn } from "react-icons/fi";

// const WalletConnect = ({ account, setAccount, setStatus }) => {
//   useEffect(() => {
//     const connectWallet = async () => {
//       if (window.ethereum) {
//         try {
//           const accounts = await window.ethereum.request({
//             method: "eth_requestAccounts",
//           });
//           setAccount(accounts[0]);
//           setStatus("Wallet connected successfully.");
//         } catch (error) {
//           setStatus("Error connecting to wallet: " + error.message);
//         }
//       } else {
//         setStatus("Please install MetaMask to use this application.");
//       }
//     };

//     connectWallet();
//   }, [setAccount, setStatus]);

//   return (
//     <div className="flex items-center justify-between bg-white shadow-md p-4 rounded-lg">
//       <p className="text-sm">
//         {account
//           ? `Connected Wallet: ${account.slice(0, 6)}...${account.slice(-4)}`
//           : "No Wallet Connected"}
//       </p>
//       <button
//         className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
//         onClick={() => window.ethereum && window.ethereum.request({ method: "eth_requestAccounts" })}
//       >
//         <FiLogIn />
//         {account ? "Switch Wallet" : "Connect Wallet"}
//       </button>
//     </div>
//   );
// };
import React, { useState } from "react";
import "../App.css"; // Import the separate CSS file

const WalletConnect= () => {
  const [account, setAccount] = useState(null);

  // Function to connect MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]); // Save connected wallet address
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this feature.");
    }
  };

  // Function to disconnect the wallet
  const disconnectWallet = () => {
    setAccount(null); // Clear the connected account
  };

  // Handler for the button click (connect or disconnect based on state)
  const handleWalletButton = () => {
    if (account) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  return (
    <div>
      <nav className="navbar"
      >
        <h2 className="logo">TRADE</h2>
        <button
          onClick={handleWalletButton}
          className={account ? "button disconnect-button" : "button connect-button"}
        >
          {account
            ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)} (Disconnect)`
            : "Connect"}
        </button>
      </nav>
      <main className="main">
       
        <p>
          {account
            ? "Wallet is connected. You can disconnect anytime."
            : "Click 'Connect Wallet' to link your MetaMask wallet."}
        </p>
      </main>
    </div>
  );
};

//export default App;

export default WalletConnect;
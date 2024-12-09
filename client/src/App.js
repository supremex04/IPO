import React from "react";
import TokenForm from "./components/TokenForm.jsx";
import WalletConnect from "./components/WalletConnect";

const App = () => {
  const TGE = "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9";
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <WalletConnect/>
      <TokenForm contractAddress={TGE}/>
    </div>
  );
};

export default App;

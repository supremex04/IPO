import React from "react";
import TokenForm from "./components/TokenForm.jsx";
import WalletConnect from "./components/WalletConnect";

const App = () => {
  const TGE = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <WalletConnect/>
      <TokenForm contractAddress={TGE}/>
    </div>
  );
};

export default App;

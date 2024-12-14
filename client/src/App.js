import React from "react";
import TokenForm from "./components/TokenForm.jsx";
import WalletConnect from "./components/WalletConnect";
import DisplayTokens from "./components/DisplayTokens";

import TokenFactoryABI from "./assets/ABI.json";

const App = () => {
  const TGE = "0x48aC8270F91A6B34C4ac60def5ff3B25514f5a6A";
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <WalletConnect/>
      <TokenForm contractAddress={TGE}/>
      <DisplayTokens
        factoryContractAddress={TGE}
        factoryABI={TokenFactoryABI.abi}
      />
    </div>
  );
};

export default App;

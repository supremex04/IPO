
import React from "react";
import TokenForm from "./components/TokenForm.jsx";
import WalletConnect from "./components/WalletConnect";




const App = () => {
  const TGE = "0x48aC8270F91A6B34C4ac60def5ff3B25514f5a6A";
  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "#fff" }}>
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px",
          borderBottom: "1px solid #333",
        }}
      >
        {/* Title */}
        <h1 style={{ margin: 0, fontSize: "24px", color: "#fff" }}>Welcome to Trading App</h1>

        
      </header>
      
      
          <WalletConnect/>
          <TokenForm contractAddress={TGE}/>
        
    </div>
  );
};

export default App;


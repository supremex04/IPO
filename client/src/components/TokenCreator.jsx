// import React, { useState } from "react";
// import WalletConnect from "./WalletConnect";
// import TokenForm from "./TokenForm";
// import TokenList from "./TokenList";

// const TokenCreator = () => {
//   const [account, setAccount] = useState(null);
//   const [formData, setFormData] = useState({
//     tokenName: "",
//     tokenSymbol: "",
//     initialSupply: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [status, setStatus] = useState("");
//   const [createdTokens, setCreatedTokens] = useState([]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setStatus("");

//     // Simulate the creation process
//     setTimeout(() => {
//       setCreatedTokens((prev) => [
//         ...prev,
//         `0x${Math.random().toString(16).slice(2, 42)}`,
//       ]);
//       setIsLoading(false);
//       setStatus("Token created successfully!");
//       setFormData({
//         tokenName: "",
//         tokenSymbol: "",
//         initialSupply: "",
//       });
//     }, 2000);
//   };

//   return (
//     <div className="max-w-2xl mx-auto space-y-6">
//       <WalletConnect account={account} setAccount={setAccount} setStatus={setStatus} />
//       <TokenForm
//         formData={formData}
//         setFormData={setFormData}
//         handleSubmit={handleSubmit}
//         isLoading={isLoading}
//       />
//       {status && (
//         <div className="text-center text-green-600 font-medium">{status}</div>
//       )}
//       <TokenList createdTokens={createdTokens} />
//     </div>
//   );
// };

// export default TokenCreator;

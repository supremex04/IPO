import React from "react";

const TokenList = ({ createdTokens }) => {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg mt-6">
      <h2 className="text-lg font-semibold mb-4">Created Tokens</h2>
      {createdTokens.length === 0 ? (
        <p className="text-gray-500">No tokens created yet.</p>
      ) : (
        <ul className="space-y-2">
          {createdTokens.map((address, index) => (
            <li
              key={index}
              className="p-2 bg-gray-100 rounded-lg text-sm font-mono"
            >
              {address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TokenList;

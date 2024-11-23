import React from "react";
import { FiPlusCircle } from "react-icons/fi";

const TokenForm = ({ formData, setFormData, handleSubmit, isLoading }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md p-6 rounded-lg space-y-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Token Name</label>
        <input
          type="text"
          name="tokenName"
          value={formData.tokenName}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg p-2"
          placeholder="e.g., My Token"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Token Symbol</label>
        <input
          type="text"
          name="tokenSymbol"
          value={formData.tokenSymbol}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg p-2"
          placeholder="e.g., MTK"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Initial Supply</label>
        <input
          type="number"
          name="initialSupply"
          value={formData.initialSupply}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg p-2"
          placeholder="e.g., 1000000"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {isLoading ? (
          <>
            <FiPlusCircle className="animate-spin" />
            Creating Token...
          </>
        ) : (
          <>
            <FiPlusCircle />
            Create Token
          </>
        )}
      </button>
    </form>
  );
};

export default TokenForm;

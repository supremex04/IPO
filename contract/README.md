1) Copy your private key to ./contract/.env file
2) npx hardhat ignition deploy ignition/modules/TGE.js --network ganache
3) npx hardhat ignition deploy ignition/modules/LiquidityPoolFactory.js --network ganache

and copy the TGE contract, Liquidity Factory contract and swap contract to .env file on client directory


If you create changes to contracts, you also need to update ABIs, copy the compiled abis (location: artifacts/contracts/<contracts you changed>/file.json) to client/src/asset/corresponding json

TGE.json = ABI.json
LiquidityFactory.json = LiqFactory.json
LiquidityPool.json = LiquidityPool.json
Swap.json = Swap.json

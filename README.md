
# running the project

inside contract folder - npx hardhat node (runs local blockchain)/ I am testing this on Ganache
# setup metamask
chainid - 31337

rpc - http://127.0.0.1:7545/ 

# inside contract

rm -rf artifacts cache 
npx hardhat ignition deploy ./ignition/modules/TGE.js --network ganache
npx hardhat ignition deploy ./ignition/modules/LiquidityPoolFactory.js --network ganache


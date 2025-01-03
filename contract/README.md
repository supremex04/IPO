npx hardhat node
rm -rf artifacts cache 
npx hardhat ignition deploy ./ignition/modules/TGE.js --network ganache

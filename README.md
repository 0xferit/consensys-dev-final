## Proof Of Existence

### What Good It Does?

This project stores given file along with a timestamp in the smart contract and records are immutable. So this provides an opportunity for users to prove a specific file existed at a certain point in time. 

Along with the file, users can optionally provide some tags describing the content.

Users can see their records and search for other records by providing the ID of the record.

### Technical Specifications

- Files are stored on **IPFS**. 
- Identity management is handled using **uPort**.
- User interface built with **React**.
- **Imports [Ownable](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol) library** from OpenZeppelin.
- Deployed onto the **Rinkeby** network at: [**`0xd35672f0d7d278cc37B5Fa3Ee4203A24d5e58BA4`**](https://rinkeby.etherscan.io/address/0xd35672f0d7d278cc37B5Fa3Ee4203A24d5e58BA4).
- Implemented **Emergency Stop** design pattern.

###  Usage

Only supported platform is Ubuntu 16.04. Others may or may not work.

 - **You don't need to** `yarn install`. All NodeJs dependencies are pre-installed under *node_modules* folder. 
 - **You don't need to** `truffle migrate`. All smart contracts compiled and migrated under *src/ethereum/build/* folder.
 
 **To start the web application:** All you need to do is `yarn start` (or `npm run start` if you don't have Yarn) to kick off the app. The app will automatically connect to the *ProofOfExistence* contract on Rinkeby.
 
 **To run tests:**
  - Start Ganache on port 8545
  - `cd src/ethereum`
  - `truffle test`

#### Requirements
 - NodeJs
 - Npm
 - Yarn
 - Truffle
 - uPort
 - Ganache

### Docs 

- [Deployed addresses](https://github.com/ferittuncer/consensys-dev-final/blob/master/src/ethereum/deployed_addresses.txt)
- [Design pattern decisions](https://github.com/ferittuncer/consensys-dev-final/blob/master/src/ethereum/design_pattern_decisions.md)
- [Avoiding common attacks](https://github.com/ferittuncer/consensys-dev-final/blob/master/src/ethereum/avoiding_common_attacks.md)

### Contact

**ferit@cryptolab.net**

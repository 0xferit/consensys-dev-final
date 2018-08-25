## Proof Of Existence

### What Good It Does?

This project stores given file along with a timestamp in the smart contract and records are immutable. So this provides an opportunity for users to prove a specific file existed at a certain point in time. 

Along with the file, users can optionally provide some tags describing the content.

Users can see their records and search for other records by providing the ID of the record.

### Technical Specifications

- Files are stored on **IPFS**. 
- Identity management is handled using **uPort**.
- User interface built with **React**.
- Contract imports [Ownable](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol) from OpenZeppelin and deployed to the **Rinkeby** network at: [**`0x8624f7187ad1e4fe36a403af63165c08c27114a2`**](https://etherscan.io/address/0x8624f7187ad1e4fe36a403af63165c08c27114a2)

-----


Install dependencies: 
```yarn install```

Compile contracts:
```truffle compile```

Run tests:
```truffle test```

Run the app:
```yarn start```

To be able to login, you need to install uPort.


You will submit a final project containing the following items:
●      A project README.md that explains your project
○      What does your project do?
○      How to set it up
■      Run a local development server

●      Your project should be a truffle project
○      All of your contracts should be in a contracts directory
■      Truffle compile should successfully compile contracts
○      Migration contract and migration scripts should work
■      Truffle migrate should successfully migrate contracts to a locally running ganache-cli test blockchain on port 8545
○      All tests should be in a tests directory
■      Running truffle test should migrate contracts and run your tests

●      Smart Contract code should be commented according to the specs in the documentation

●      Create at least 5 tests for each smart contract
○      Write a sentence or two explaining what the tests are covering, and explain why you wrote those tests

●      A development server to serve the front end interface of the application
○      It can be something as simple as the lite-server used in the truffle pet shop tutorial

●      A document called design_pattern_desicions.md that explains why you chose to use the design patterns that you did.
●      A document called avoiding_common_attacks.md that explains what measures you took to ensure that your contracts are not susceptible to common attacks. (Module 9 Lesson 3)

●      Implement a library or an EthPM package in your project
○      If your project does not require a library or an EthPM package, demonstrate how you would do that in a contract called LibraryDemo.sol

We ask that you develop your application and run the other projects during evaluation in a VirtualBox VM running Ubuntu 16.04 to reduce the chances of run time environment variables.

Requirements
●      User Interface Requirements:
○      Run the app on a dev server locally for testing/grading
○      You should be able to visit a URL and interact with the application
■      App recognizes current account
■      Sign transactions using MetaMask / uPort
■      Contract state is updated
■      Update reflected in UI

●      Test Requirements:
○      Write 5 tests for each contract you wrote
■      Solidity or JavaScript
○      Explain why you wrote those tests
○      Tests run with truffle test

●      Design Pattern Requirements:
○      Implement emergency stop
○      What other design patterns have you used / not used?
■      Why did you choose the patterns that you did?
■      Why not others?

●      Security Tools / Common Attacks:
○      Explain what measures you’ve taken to ensure that your contracts are not susceptible to common attacks

●      Use a library
○      Via EthPM or write your own


●      Stretch requirements (for bonus points, not required):
○      Deploy your application onto the Rinkeby test network. Include a document called deployed_addresses.txt that describes where your contracts live on the test net.
○      Integrate with an additional service, maybe even one we did not cover in this class

For example:
■      IPFS
■      uPort
■      Ethereum Name Service
■      Oracle

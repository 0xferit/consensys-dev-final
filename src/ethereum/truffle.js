var HDWalletProvider = require('truffle-hdwallet-provider');
var mnemonic = 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    rinkeby: {
      provider: new HDWalletProvider(
        mnemonic,
        'https://rinkeby.infura.io/v3/344bdb3c652c4ce6acc12f10a7557ba6',
        1
      ),
      network_id: 5,
      gas: 6712388,
      gasPrice: 2000000000
    },
  },
};

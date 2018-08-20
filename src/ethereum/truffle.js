var HDWalletProvider = require('truffle-hdwallet-provider');
var mnemonic = 'emerge cabbage panel need lens sweet assault benefit broken lunch insect differ';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    rinkeby: {
      provider: new HDWalletProvider(
        mnemonic,
        'https://rinkeby.infura.io/v3/344bdb3c652c4ce6acc12f10a7557ba6'
      ),
      network_id: 5,
      gas: 6712388,
      gasPrice: 20000000000
    },
  },
};

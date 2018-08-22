const IPFS = require('ipfs-mini');
const BS58 = require('bs58');
const ipfs = new IPFS({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
});

export const setJSON = async (obj) => {
  console.log("Trying to set: " + obj);
  return new Promise((resolve, reject) => {
    ipfs.addJSON(obj, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result);
      }
    });
  });
}

export const getJSON = async (hash) => {
  console.log("Trying to get: " + hash);
  return new Promise((resolve, reject) => {
    ipfs.catJSON(hash, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
        console.log("Successfully got: " + hash);
      }
    });
  });
}

export const decodeIPFSHash = (hash) => {
  return "0x" + BS58.decode(hash).toString('hex').substr(4);
}

export const encodeIPFSHash = (hash) => {
  const multihashPrefix = "1220";
  console.log("ipfs hash: " +hash);
  return BS58.encode(Buffer.from((multihashPrefix + hash.substr(2)).toString('hex'), 'hex'));
}

const IPFS = require('ipfs-api');
const BS58 = require('bs58');
const ipfs = new IPFS({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
});

export const setJSON = async (obj) => {
  console.log("Trying to set: " + obj);
  return new Promise((resolve, reject) => {
    ipfs.add(obj, (err, result) => {
      if (err) {
        console.log();
        reject("err: " + err)
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
}

export const getJSON = async (hash) => {
  console.log("Trying to get: " + hash);
  return new Promise((resolve, reject) => {
    ipfs.cat(hash, (err, result) => {
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
  console.log("encoding hash: " +hash);
  return BS58.encode(Buffer.from((multihashPrefix + hash.substr(2)).toString('hex'), 'hex'));
}

import { web3 } from "../util/Uport";
import contract from 'truffle-contract';
import ProofOfExistence from '../ethereum/build/contracts/ProofOfExistence.json';

const ProofOfExistenceContract = contract(ProofOfExistence);
ProofOfExistenceContract.setProvider(web3.currentProvider);

export const getInstance = async () => {
  const instance = await ProofOfExistenceContract.deployed();
  return instance;
}

export const getContractAddress = async () => {
  const instance = await ProofOfExistenceContract.deployed();
  return instance.address;
}

export const timestamp = async (hash, tags, account) => {
  const instance = await getInstance();
  const items = await instance.timestamp(hash, tags, { from: account });
  return items;
}

export const getTimestamp = async (hash) => {
  const instance = await getInstance();
  const items = await instance.hashToTimestamp(hash);
  return items;
}

export const getHash = async (id) => {
  const instance = await getInstance();
  const items = await instance.idToHash(id);
  return items;
}

export const getTags = async (hash) => {
  const instance = await getInstance();
  const items = await instance.hashToTags(hash);
  return items;
}

export const getId = async (account, index) => {
  const instance = await getInstance();
  const items = await instance.userToIds(account, index);
  return items;
}

export const getAllIds = async (account) => {
  const instance = await getInstance();
  const items = await instance.getAllIds(account);
  return items;
}

export const getAllHashes = async (ids) => {
  let hashes;
  try{
    hashes = await Promise.all(ids.map(async x => getHash(x)));
  }
  catch(e)
  {
    console.log(e);
  }

  return hashes;
}

export const getAllTags = async (hashes) => {
  const tags = await Promise.all(hashes.map(async x => getTags(x)));
  console.log("can we retrieve tags?");
  console.log(tags);
  return tags;
}

export const getStopped = async () => {
  const instance = await getInstance();
  console.log("stopped")
  console.log(await instance.stopped())
  return await instance.stopped();
}

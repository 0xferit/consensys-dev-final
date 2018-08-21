import { web3 } from "../util/Uport";
import contract from 'truffle-contract';
import ProofOfExistence from '../ethereum/build/contracts/ProofOfExistence.json';

const ProofOfExistenceContract = contract(ProofOfExistence);
ProofOfExistenceContract.setProvider(web3.currentProvider);

const getInstance = async () => {
  const instance = await ProofOfExistenceContract.deployed();
  return instance;
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

export const getAllHashes = async (account) => {
  let ids = await getAllIds(account);
  ids = ids.map(x => x.toNumber());
  let hashes = await Promise.all(ids.map(async x => getHash(x)));
  return hashes;
}

/* eslint-disable no-undef */ // Avoid the linter considering truffle elements as undef.
const {
  expectThrow
} = require('../helpers/utils');

const PROOF_OF_EXISTENCE = artifacts.require('ProofOfExistence.sol');

contract('ProofOfExistence', function(accounts) {

  const OWNER = accounts[0];
  const USER_1 = accounts[1];
  const USER_2 = accounts[2];
  const USER_3 = accounts[3];

  const ARBITRARY_TAGS = "TAGS";
  const ARBITRARY_CONTENT_1 = "CONTENT";
  const ARBITRARY_CONTENT_2 = "YET ANOTHER CONTENT";

  let registry;
  let startingID;

  beforeEach('setup the contract for each test', async () => {
    registry = await PROOF_OF_EXISTENCE.new({
      from: OWNER
    });

    await registry.timestamp("content1", "tags1", {
      from: USER_1,
    }); // ID 0
    await registry.timestamp("content2", "tags2", {
      from: USER_2,
    }); // ID 1
    await registry.timestamp("content3", "tags3", {
      from: USER_2,
    }); // ID 2

    startingID = 3; // 0, 1 and 2 used up above
  });

  /**
   * This test checks whether timestamp function correctly records given content.
   */
  it('should record content', async () => {
    await registry.timestamp(ARBITRARY_CONTENT_1, ARBITRARY_TAGS, {from: USER_3});
    const EXPECTED = ARBITRARY_CONTENT_1;

    const ACTUAL = await registry.idToHash(startingID);

    assert.equal(web3.toUtf8(ACTUAL), ARBITRARY_CONTENT_1);
  });

  /**
   * This test checks whether timestamp function correctly records given tags.
   */
  it('should record tags', async () => {
    await registry.timestamp(ARBITRARY_CONTENT_1, ARBITRARY_TAGS, {from: USER_3});
    const EXPECTED = ARBITRARY_TAGS;

    const HASH = await registry.idToHash(startingID);
    const ACTUAL = await registry.hashToTags(HASH);

    assert.equal(ACTUAL, EXPECTED);
  });

  /**
   * This test checks whether getAllIds function can retrieve all the IDs that belongs to given address.
   */
  it('should retrieve ids of users', async () => {
    const EXPECTED = [1, 2];

    const ACTUAL = (await registry.getAllIds(USER_2)).map(x => x.toNumber());

    assert.equal(ACTUAL[0], EXPECTED[0]);
    assert.equal(ACTUAL[1], EXPECTED[1]);
  });

  /**
   * This test checks whether contract is stoppable by users (except by the owner).
   */
  it('should not let others to stop contract', async () => {
    await expectThrow(registry.emergencyStop({from: USER_3}));
  });

  /**
   * This test checks whether contract is restorable by users (except by the owner).
   */
  it('should not let others to restore contract', async () => {
    await registry.emergencyStop({from: OWNER});
    assert(await registry.stopped(), "Registry is not stopped."); // Asserting pre-condition: Contract stopped.

    await expectThrow(registry.restoreFromEmergency({from: USER_3}));
  });

  /**
   * This test checks whether owner can stop and restore the contract.
   */
  it('should let owner to stop and to restore the contract', async () => {
    await registry.emergencyStop({from: OWNER});
    assert(await registry.stopped(), "Registry is not stopped.");

    await registry.restoreFromEmergency({from: OWNER});
    assert(!await registry.stopped(), "Registry is stopped.");
  });

  /**
   * This test checks whether the contract stores timestamps chronologically.
   */
  it('should record timestamps', async () => {
    await registry.timestamp(ARBITRARY_CONTENT_1, ARBITRARY_TAGS, {from: USER_3});
    const HASH_1 = await registry.idToHash(startingID); // ID 3
    const TIMESTAMP_1 = await registry.hashToTimestamp(HASH_1);

    await registry.timestamp(ARBITRARY_CONTENT_2, ARBITRARY_TAGS, {from: USER_3});
    const HASH_2 = await registry.idToHash(startingID + 1); // ID 4
    const TIMESTAMP_2 = await registry.hashToTimestamp(HASH_2);

    assert(TIMESTAMP_1.toNumber() <= TIMESTAMP_2.toNumber()); // Second timestamp should not be lesser than first timestamp if timestamps recorded correctly.
  });

  /**
   * This test checks whether contract prevents new records when stopped.
   */
  it('should not let new records when contract stopped', async () => {
    await registry.emergencyStop({from: OWNER});
    assert(await registry.stopped()); // Asserting pre-condition: Contract stopped.

    await expectThrow(registry.timestamp(ARBITRARY_CONTENT_1, ARBITRARY_TAGS, {from: USER_3}));
  });

  /**
   * This test checks whether it is possible to alter a record by trying to timestamp an existing hash.
   */
  it('should revert when trying to timestamp existing hash', async () => {
    await registry.timestamp(ARBITRARY_CONTENT_1, ARBITRARY_TAGS, {from: OWNER});

    await expectThrow(registry.timestamp(ARBITRARY_CONTENT_1, ARBITRARY_TAGS, {from: OWNER}));
  });

});

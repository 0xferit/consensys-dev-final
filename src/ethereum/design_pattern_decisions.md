## Design Pattern Decisions

### Upgradeable Pattern

I decided to not to implement this as my aim is to create an immutable registry that works without trusting the owner of the contract.
Upgradeability breaks immutability.

### Emergency Stop Pattern

I implemented this pattern as it was a project requirement. However it is not necessary as there are no unsafe operations in the ProofOfExistence contract. It only appends blockchain new records. There is no logic to delete or remove a record, so there is no way to corrupt the registry.

### Speed Bump Pattern

Again, as there are no unsafe operations, this pattern is not required for this project.

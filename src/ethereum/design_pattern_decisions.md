## Design Pattern Decisions

### Upgradeable Pattern

I decided to not to implement this as my aim is to create an immutable registry that works without trusting the owner of the contract.
Upgradeability breaks immutability.

### Emergency Stop Pattern

I implemented this pattern as it was a project requirement. However it is not necessary as there are no unsafe operations in the ProofOfExistence contract. It only appends new records to blockchain. There is no logic to delete or remove a record, so there is no way to corrupt the registry.

### Owner Pattern

I implemented this as it was required for implementing Emergency Stop pattern. Emergency functions should only be called by a privileged party such as a contract owner.

### Speed Bump Pattern

Again, as there are no unsafe operations, this pattern is not required for this project.
 
### Mutex Pattern

Timestamp function is vulnerable to concurrent calls. This can be patched by applying mutex pattern by avoiding subsequent calls until first call returns. However EVM doesn't let concurrent calls, so this vulnerability is not exploitable.

### Auto Deprecation and Mortal Patterns

This project needs to be immortal and run forever. So these two is an anti-pattern for this project.


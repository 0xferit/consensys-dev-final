## Avoiding Common Attacks

Measures taken to avoid common attacks:

- Tested with %100 statement coverage (coverage result from solidity-coverage)

- Wrote the contract as simply as possible to avoid bugs. Longest function has 8 statements.

- There is one function that writes to blockchain, timestamp(), so the attack surface is tiny.

- There are no recursive calls and no external calls to avoid possible reentrancy issues.

- There are only two arithmetic operations (Array.push() - 1) and they can't result with overflow/underflow (Array.push() returns new length and the minimum it can return is 1). 

- Contract owner has no privilege to alter records. Contract is trustless.

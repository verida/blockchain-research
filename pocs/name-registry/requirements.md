

# Name Registry (Proof of Concept)

This smart contract provides a mapping between a human readable name (ie: john-doe) and a Verida DID address (ie: 0x9d2777a89c515b4e2d034ec9c88d7a27b3f6b4d5). A name can only be linked to one DID and vice versa.

## Methods

- `register(name: string, did: string)` &mdash; Link a name to a DID
- `unregister(name: string)` &mdash; Unlink a name from a DID
- `findDid(name: string)` &mdash; Find the DID linked to a particular name
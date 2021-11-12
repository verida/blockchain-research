# Private Data Bridge

The private data bridge enables off-chain data to be submitted to a smart contract, which can then verify and trust the data.

Example use case:

1. A Verida Account (KYC provider) signs a verifiable credential and sends it to a user
2. A Verida Account (User) submits the signed verifiable credential to a smart contract
3. A Smart Contract can verify the signature of the verifiable credential has been signed by a KYC provider the contract trusts

This technical capability is one part of the larger Verida Trust Framework

## Key requirements

- Multi-chain. Data is signed in such a way it can be submitted to multiple blockchains.
- Efficient. Signatures can be efficiently be verified using built in encryption primatives (to minimize gas costs) supported by the most popular chains.
- Data encoding. Verida protocol generates signed JSON data that must be decodable by the most popular chains.

Note: Verida protocol signs data using `keccak256` hashing and `ed25519` signature scheme to maximise EVM compatibility.

## Initial research

### Blockchain support

We need to investigate the viability of developing a private data bridge for the following blockchains:

- Etherem (EVM compatible chains)
- Algorand
- Solana
- NEAR protocol

This needs to consider the following:

- Supported signature schemes
- Ability to decode the JSON data so the key / value pairs can be used as inputs into smart contracts
- Estimates of gas costs to verify the signature
- Estimates of gas costs to decode the JSON data

### Proof of concept

We require a proof of concept developed for Ethereum:

- Generate a Verida protocol signed data object
- Submit the signed data to a smart contract
- Determine the Verida DID that signed the data

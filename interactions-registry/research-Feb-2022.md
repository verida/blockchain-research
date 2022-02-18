

# Problem Overview

## Problem Statement

The Verida network:

1. MUST enable ~$0.05 token payments for messages flowing on the Verida network, this means the per transaction cost must be < $0.001.
2. MUST enable private messaging, so just having blockchain transactions going from one person to another is unacceptable.
3. SHOULD enable a payer to make a single payment to pay multiple recipients
4. SHOULD support linking payment to the delivery or access to a data payload

## Privacy Levels

It’s important to understand the different possible levels of privacy different solutions may offer. I’ve attempted to summarise them here:

|Privacy Level|Name|Notes|
|-|-|-|
|0|Zero Privacy|Cases where someone can use Etherscan to click a transaction and see who was messaging who, including cases where you can follow the transaction just by clicking links|
|1|Casual Privacy|Cases where custom programming can uncover irrefutable evidence of messaging flow.|
|2|Medium Privacy|Custom programming will not uncover evidence of messaging flow (bugs notwithstanding).  Correlation measures or other probabilistic techniques may provide some evidence towards messaging flow|
|3|Strong Privacy|Resistant against all forms of attacks|

- Verida will accept an approach that would only deliver level 0 or 1 privacy. 
- Strong privacy is the goal, but in some circumstances we may accept level 2 (Medium Privacy) depending on how trivially attacks can be implemented and if there is a credible roadmap to strong privacy. 
- Verida isn’t concerned about disclosing the fact that senders are sending messages or that receivers are receiving them. However we  don’t want to disclose who sends to who, so wherever possible we should minimise the disclosure of number of messages (since that increases the likelihood of correlation attacks).

## Decentralization Levels

@todo expand

1. Fully decentralized
2. Partially decentralized

# Implementation Options

- ZK tech
- Payment channels
- Verida micro payment solution

## Message payment pools using ZKsnarks for claims

@todo: Add Nick's notes

Touch on tornado cash and zcash

Issue: ZKsnark tech is very early and too computationally intensive right now.

## Payment channels

Payment channels enable fast and incredibly low cost token based payments between parties.

### How they work

At a basic level, two parties conduct blockchain transactions to "lock" tokens. Both parties exchange signed off chain messages where both parties agree on the new balance between each other. This allows unlimited near instant and near free transactions between the two parties, provided the balance of tokens doesn't exceed the balance locked on chain.

At any time, either party can submit the most recent signed message on chain and the smart contract will unlock each parties tokens, using the updated balances.

There are fraud preventention mechanisms in place to ensure neither party can submit incorrect balances.

They come in a number of flavours:

1. Uni-directional (Payments can only be sent in one direction)
2. Bi-directional (Payments can be sent an received by each party)
3. One to one (Payments can only be made to one party at a time)
4. One to many (One payment can be split and sent to multiple recipients)
5. Non-privacy preserving (External observers can see who is paying who)
6. Privacy preserving (Payments are routed through multiple participants, hiding the sender and receiver)

### Examples

- [Lightning Network](https://lightning.network/)
- [Raiden Network](https://raiden.network/)
- [µRaiden](https://raiden.network/micro.html)

**Lightning Network** is the most viable as of writing, however it uses bitcoin. Verida requires the ability to transfer ERC20 (or EVM equivalent) tokens, so lightning network is not an option.

**Raiden Network** is built on Ethereum, so supports the transfer of any ERC20 token. It appears to be a feature complete payment channel network that supports:

- Any ERC20 token
- Bi-directional payments
- One to one payments
- Privacy preserving

The project appears to have been around for many years, but appears to have limited resources.

The Raiden Network protocol consists of:

- Solidity Smart Contracts
- Python Client
- Typescript Light Client (that uses PouchDB, suitable for running in a browser)
- [Matrix protocol](https://matrix.org/) for network communications and discovery

**µRaiden** is a spin-off of the Raiden Network that was intended as a faster implementation. It supports Uni-directional payments, but appears to be abandoned in favour of the more robust Raiden Network.

## Verida micropayment solution

A lot of the complexity implementing payment channels relates to the "discovery" of other network participants and storing state in a decentralized way. Verida already provides this infrastructure through it's private data storage network and support for DID documents with service endpoints.

The concept of "locking" tokens in a smart contract, providing signed updates to balances and signature based fraud proofs is fairly well established.

Verida has additional objectives around linking payments to data transfers and facilitating one:many payments that are outside the scope of current payment protocols.

# Verida Micropayments

## Use cases

- Message sending (discard message if not paid for vs routing the message via the payment network)
- Data payments (Only access data if it's paid for)
- Paying dApp developers and community stakers (Paying multiple parties at once)

## A Hybrid Solution

Explore a hybrid centralized / decentralized solution; faster to implement, helps identify issues to help design long term decentralized solution.

Discuss implementation:

- Verida centralized API for Phase 1
- Participants "lock" tokens in a smart contract which adds credit to their virtual account in the Verida API
- Participants sign proofs to make payments using their private key
- Verida API debits virtual credits from the sender and credits new balance to recipient
- At any time a participant can request the API to close / reblance their account on chain
- Private, because everyone interacts with the same API and all on chain balance changes come from the Verida API
- Merkle roots could be pushed on chain, per participant, to enable fraud proofs and eliminate trust issues

Discuss decentralized implementation:

- Single payment pool for payers
- Merkle root with fraud proofs
- 1-1 direct is not private -- not suitable
- 1-1 via brokers is private -- possible, but requires onion routing or similar (see raiden network implementation)

## References

- [Interaction Workflow Scratchpad](https://docs.google.com/presentation/d/1jV3upmKUZNk-z4U4fCQAIdXOvqjGWHL3ZKn-YWrpN8s/edit#slide=id.g11538d461fc_0_40) - Scratch pad of ideas being explored

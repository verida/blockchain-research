

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

1. Instant micropayments
2. Pay to send messages
3. Paying dApp developers and community stakers
4. Pay to access / unlock data
5. A community pool can be funded from transaction fees
6. Network participants can charge a transaction fee

Use case (1) is critical for a MVP, while the other two use cases can come in the future. It's important to consider all the use cases when designing the architecture.

## Technical Requirements

Taking a closer look at these use cases, we have the following technical requirements:

1. Low cost (< $0.001) and fast (< 0.5 sec) micropayments
2. Private transactions between a sender and receiver
3. Public transactions
4. Atomic transactions that simultaneously trigger payment to multiple recipients
5. Atomic transactions that simultaneously trigger payment and transfer of data
6. Network level transaction fees
7. Participant level transaction fees

## Private Payments

A direct, on chain, payment between Jane and Bob is not privacy preserving as there is a public record of account for every transaction on the blockchain.

A direct payment channel betwen Jane and Bob can enable unlimited private transactions between the two, however there remains an on-chain settlement when the payment channel is closed. This hides the details of the transactions, but doesn't hide the fact transactions occurred between Jane and Bob.

A payment channel network (ie: Bitcoin's Lightning network or Raiden Network) introduces the ability for unlimited intermediaries to participate in a transaction. This allows Jane and Bob to conduct payments with one or more parties in between, creating no direct connection between them.

Any intermidiary that helps facilitate the transaction between Jane and Bob earns transaction fees.

While this solutions seems ideal at first glance, this network of payment channels introduces significant technical complexity and routing infrastruture to identify the payment route between Jane and Bob.

There is overhead and inefficieny introduced whereby each payment channel requires the same amount of value added by both party. A "super" node on a payment channel network needs to lock tokens for every channel they open, regardless of how much transaction volume goes through that channel.

This implementation has no concept of linking payment to data transfer or a mechanism for one:many atomic transactions.

## Privacy Preserving Payment Brokers

This paper proposes an alternative architecture based on the concept of payment brokers.

Under this model, Jane selects a payment broker (Broker J) to facilitate her transactions on the Verida payment network. Similarly, Bob selects a payment broker (Broker B) to facilitate his transactions.

Jane -> Broker J -> Broker B -> Bob

Jane opens a "private payment channel" with her payment broker by depositing tokens into a Verida smart contract and granting her broker access to those tokens. During a given time period (Payment Epoch), Jane can send and receive unlimited payments through her broker that remain within the balance of tokens deposited.

Jane -> deposit tokens -> Channel (Jane <> Broker J)
Bob -> deposit tokens -> Channel (Bob <> Broker B)

Note: This payment channel is private in that it's not possible to see the amounts or final destination of the her transactions. However, it is still public that she has deposited tokens with a particular payment broker.

Jane's payment broker deposits tokens into the same Verida smart contract to create a "public payment channel". The payment broker can facilitate transactions with any other "public payment channel" and any "private payment channel" that has deposited tokens with that broker.

Broker J -> deposit tokens -> Channel(Public)
Broker B -> deposit tokens -> Channel(Public)

Transactions are facilitated by routing payments from Jane to her payment broker, who routes payment to Bob's payment broker, who then pays Bob. This works in a similar way to current payment channels and leverages hash locks to ensure payments are unlocked all at once.

At the end of the payment epoch each payment broker settles their transactions on chain by debiting / crediting Jane (and any other linked private payment channels) and debiting / crediting any public channels the broker interacted with.

### Benefits

- Payment brokers introduce privacy, obfuscating the iniital sender and final recipient of a payment
- Payments have a maximum of four peer-to-peer messages, making them very fast and efficient
- On-chain transaction volume is significantly reduced
- End users can deposit tokens in a single payment channel and then pay anyone on the network

### Limitations

- All transactions must be completed within a given Epoch
- 

## Technical Implementation

The Payment Sender (Jane) maintains a private ledger of every transaction that debits / credits funds from her payment channel with her payment broker.

Example ledger transaction:

Example `pending` ledger transaction:

```
{
    id: <string>,                       // GUID of the transaction
    amount: <decimal>,                  // Transaction amount
    balance: <decimal>,                 // Payment Sender balance in the state channel
    previousId: <undefined | string>,   // ID of the previous pending transaction
    timestamp: <string>                 // ISOXXXX GMT of transaction
    signature: <string>                 // Signed hash of this object
}
```

Example `completed` ledger transaction:

```
{
    id: <string>,                       // GUID of the transaction (matches `pending`)
    hash: <string>,                     // Hash of the relevant pending transaction
    previousId: <undefined | string>    // ID of the previous completed transaction,
    signature: <string>                 // Signed hash of this object
}
```

Jane's Payment Broker maintains two ledgers. One contains a linked list of all `pending` transactions, while the other contains a linked list of all `completed` transactions.

Example `pending` ledger transaction:

```
{
    id: <string>,                       // GUID of the transaction
    amount: <decimal>,                  // Transaction amount
    balance: <decimal>,                 // Payment Sender balance in the state channel
    from: <string>,                     // Payment Sender address
    to: <string>,                       // Payment Broker address
    recipient: <string>,                // Recipient address (Bob)
    previousId: <undefined | string>,   // ID of the previous pending transaction
    timestamp: <string>                 // ISOXXXX GMT of transaction
}
```

Example `completed` ledger transaction:

```
{
    id: <string>,                       // GUID of the transaction (matches `pending`)
    hash: <string>,                     // Hash of the relevant pending transaction
    balance: 
    previousId: <undefined | string>    // ID of the previous completed transaction
}
```

## Attack Vectors

### Payment Sender (Jane)

A malicious payment sender may attempt to:

**1. Spend tokens they don't have**

The Payment Broker maintains a source of truth regarding how many tokens have been spent by the Payment Sender within the current epoch. This is compared with the number of tokens deposited by the Payment Sender in the payment channel.

The Payment Broker will not accept a payment request that exceeds the current balance of the Payent Sender.

#### Payment Broker

A malicious Payment Broker may attempt to:

**1. Spend tokens they don't have**

A Payment Broker must always remain net neutral. Every completed transaction granting them tokens must be matched with a completed transaction that distributes tokens to another address.

*The smart contract ensures the amount of tokens sent equals the total number of tokens received.*

**2. Avoid recording transactions**

**Payment Recipient (Bob)**

A payment recipient may:

1. Be sent tokens, but not claim them

---


## A Hybrid MVP Solution

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

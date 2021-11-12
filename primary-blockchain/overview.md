# Verida Primary Blockchain

Verida is developing a protocol that enables micro-payments for data transactions between account holders. This research project aims to investigate the most suitable blockchain that can support the required high-throughput expected by the Verida network at mass adoption.

## Key requirements

- Low cost
  - < $0.005 per transaction when the underlying chain is at a mature stage of global adoption
- Fast
  - A path to 10,000 TPS for Verida transactions (~1bn / day = 8 /day for 100m users)
  - Confirmation time less than 3 seconds, ideally less than 1
- Gasless
  - Users can conduct transactions at no cost (or sponsored)
- Infrastructure
  - We do not want to spin up our own blockchain nodes

## Other considerations

- Data storage
  - Chain can store small amounts of data for low cost
- Bridging
  - Has viable bridge to Ethereum
  - Has a pathway to bridge to other chains (ideally a direct bridge, not via Ethereum)
  - See [bridge research](https://docs.google.com/spreadsheets/d/1Dsa2kITJENhehLq3iyk0y9Er1aAQ535gTXnnKa_hc6k/edit#gid=0)
- VDA gas fees
  - Users can pay network gas fees using VDA
- Strong community support
  - Large investor backing or large treasury giving long term chance of success
  - Active developer community providing support and improving the technology
- Scalability
  - The TPS can scale as the network grows
  - The cost per transaction can remain low as the network grows
- Reliability and security
  - Look at history of hacks
  - Look at network uptime
  - Look at consensus model
  - Look at behaviour and actions of the team
  - Look at governance model
 
## Existing research

- **NEAR protocol:** The price of transactions is already too high. We had an external blockchain firm conduct a proof-of-concept with the results [summarized here](https://medium.com/verida/real-world-results-of-implementing-micropayments-on-near-ff0defd35c61).
- **SKALE:** An initial review indicates it could meet the TPS, cost and gasless requirements. Some concerns around adoption of the network and whether it is gaining traction. We have direct access to their engineering team when we're ready to look deeper.
- **Solana:** Low cost. Concerns about reliability and security.
- **Algorand:** Low cost. Strong, aligned community with enterprise focus. Still early in terms of projects building. Needs a deeper dive. Nona to provide support here with their Algorand experience.
- **Polkadot:** Too expensive, too much overhead, too much pricing risk.

Other L1 and L2's worth considering (not exhaustive):

- Avalanche
- Cosmos
- Arbitrum
- Polygon
- Starknet
- Ronin
 
## Outcome

A table of short-listed projects with an explanation of how the project stacks up for each key requirement and other consideration.

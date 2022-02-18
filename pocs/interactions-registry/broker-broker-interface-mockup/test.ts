import * as Interfaces from './interfaces'
import Broker from './broker'
import Network from './network'

const RECIPIENT_DID = 'vda:did:0xefca00000000000000000000'
const RECIPIENT_ADDRESS = '0xdd2c00000000000000000000'
const PAYER_ADDRESS = '0xc1ca00000000000000000000'

const BROKER_1 = 'Broker1'
const BROKER_1_PK = 'Broker1_PK'
const BROKER_2 = 'Broker2'
const BROKER_2_PK = 'Broker2_PK'

const network = new Network()
const broker1 = new Broker(BROKER_1, BROKER_1_PK, network)
const broker2 = new Broker(BROKER_2, BROKER_2_PK, network)

broker1.stake(PAYER_ADDRESS, 100)

const messageRequest: Interfaces.MessageRequest = {
    id: 'unique hash #1',
    message:  {
        payload: 'encrypted message'
    },
    paymentCommitment: {
        payerAddress: PAYER_ADDRESS,
        amount: 5,
        signature: 'TBA'
    },
    /*paymentRequest: {
        id: 'unique hash #1',
        recipientDid: RECIPIENT_DID
    },*/
}

broker1.submit(messageRequest)
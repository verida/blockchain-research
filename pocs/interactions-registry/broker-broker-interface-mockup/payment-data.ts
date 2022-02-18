function sign(message: any): string {
    return 'signed message'
}

/**
 * Now, to handle payment flow.
 * 
 * 1. client1 must pay broker1
 * 2. broker1 must pay broker2
 * 3. broker2 must pay client1
 * 
 */

const client1PayBroker1 = {
    address: '0xABC1',                  // broker1 address
    amount: 5,
    epoch: 0,
    signature: sign('this object')      // client1 signs
}

const broker1PayBroker2 = {
    address: '0xABC2',                  // broker2 address
    amount: 4,
    epoch: 0,
    signature: sign('this object')      // broker1 signs
}

const broker2PayClient1 = {
    address: '0xABC3',                  // client2 address
    amount: 4,
    epoch: 0,
    signature: sign('this object')      // broker2 signs
}

//////

const client2Data: EncryptedMessage = {
    payload: encrypt('hello world')
}

const broker2Data = {
    forwardPacket: {
        payment: broker2PayClient1,
        message: {
            payload: encrypt(client2Data)
        },
        recipientDid: 'did:vda:0xabcdefg123'        // client 2 DID
    }
}

const broker1DataOutput

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         const broker1DataInput = {
    payment: client1PayBroker1
    forwardPacket: {
        message: {
            payload: encrypt(broker2Data)
        },
        recipientDid: 'did:vda:0x123456abc'         // broker2 DID
    }
}

const broker1Message = {
    payload: encrypt(broker1Data)
}

/**
 * Next problems:
 * 
 * 1. How to facilitate the payment?
 *      The off-chain signed PaymentReceipt needs to be produced on-chain at the end of each epoch
 * 2. How to ensure any follow on payments are made?
 *      
 * 3. How to ensure the action being paid for is completed?
 *      That's hard
 */
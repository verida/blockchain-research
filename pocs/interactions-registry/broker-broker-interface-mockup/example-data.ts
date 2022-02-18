
function encrypt(data: any): string {
    return 'encrypted data'
}

/**
 * Data flow process
 */

const client2Data: EncryptedMessage = {
    payload: encrypt('hello world')
}

const broker2Data = {
    message: {
        payload: encrypt(client2Data)
    },
    recipientDid: 'did:vda:0xabcdefg123'        // client 2 DID
}

const broker1Data = {
    message: {
        payload: encrypt(broker2Data)
    },
    recipientDid: 'did:vda:0x123456abc'         // broker2 DID
}

const broker1Message = {
    payload: encrypt(broker1Data)
}

/**
 * 
 * Client1 process:
 * 
 * 1. client1 generates encrypted message for client2 (client2Data)
 * 2. client1 generates a message for broker2 (broker2Data)
 * 3. client1 generates a message for broker1 (broker1Data)
 * 4. client1 generates an encrypted message for broker1 (broker1Message)
 * 
 * Broker1:
 * 
 * 1. Receives encrypted message from client1 (broker1Message)
 * 2. Decryptes message from client1
 * 2. Forwards the message to recipient DID (broker 2)
 * 
 * Broker2:
 * 
 * 1. Receives encrypted message from broker 1
 * 2. Decrypts message from broker 1
 * 3. Drops the encrypted message into the inbox of client 2
 * 
 * 
 * This preserves privacy:
 * - There is no link between client 1 and client 2
 * - Broker 1 doesn't know client 2
 * - Broker 2 doesn't know client 1
 * - Broker 1 and Broker 2 could collude via a separate comms channel to know the identities of each
 * 
 */
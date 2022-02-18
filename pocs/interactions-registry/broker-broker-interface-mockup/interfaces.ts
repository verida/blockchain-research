

interface EncryptedMessage {
    payload: string
}

interface MessageBrokerRequest {
    type: string // forward, submit
}

interface MessageRequestPayment {
    id: string,
    recipientDid: string
    epoch: number,
}

interface PaymentCommitment {
    requestId: string,
    payerAddress: string,
    amount: number,
    epoch: number,
    signature: string
}

interface PaymentReceipt {
    amount: number,
    balance: number,
    epoch: number,
    signature: string
}

interface MessageRequest {
    id: string,
    message: EncryptedMessage
    //paymentRequest: MessageRequestPayment
    paymentCommitment: PaymentCommitment
    epoch: number
}


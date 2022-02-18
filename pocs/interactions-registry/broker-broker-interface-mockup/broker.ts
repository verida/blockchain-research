import * as Interfaces from './interfaces'
import Network from './network'

export default class Broker {

    private _id: string
    protected brokerBalance = 0
    protected balances = {}
    protected epoch: number = 0
    protected epochRequests = {}
    protected privateKey: string
    protected network: Network

    constructor(id: string, privateKey: string, network: Network) {
        this._id = id
        this.privateKey = privateKey
        this.network = network
        this.network.addBroker(this)
    }

    public id() {
        return this._id
    }

    public stake(address: string, amount: number) {
        if (this.balances[address]) {
            this.balances[address] = 0
        }

        this.balances[address] += amount
    }

    public pay(address: string, amount: number) {
        // @todo: lots of checks
        this.balances[address] -= amount
        this.brokerBalance += amount
    }

    /**
     * Submit a message request to be processed
     * 
     * @param messageRequest 
     */
    public submit(messageRequest: Interfaces.MessageRequest) {
        this.epochRequests[messageRequest.payerAddress] = messageRequest
        const paymentCommitment = messageRequest.paymentCommitment

        // decrypt the message
        const message = this.decryptMessage(messageRequest.message)

        // make payment
        this.pay(paymentCommitment.payerAddress, paymentCommitment.amount)

        // perform the requested action
        this.forward(messageRequest.message)

        // generate payment receipt
        const receipt: Interfaces.PaymentReceipt = {
            requestId: paymentCommitment,
            amount: paymentCommitment.amount,
            balance: this.balances[paymentCommitment.payerAddress],
            epoch: this.epoch,
            signature: 'TBA'
        }

        return receipt
    }

    /**
     * Forward a message to the intended recipient
     * 
     * @param message 
     */
    protected forward(message: Interfaces.EncryptedMessage) {
        // @todo: locate the recipient message broker
    }

    protected decryptMessage(encryptedMessage: EncryptedMessage): MessageBrokerRequest {
        return {
            
        }
    }

}
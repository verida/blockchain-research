import Broker from './broker'

export default class Network {

    protected brokers = {}

    public addBroker(broker: Broker) {
        this.brokers[broker.id()] = broker
    }

    public getBroker(id: string) {
        return this.brokers[id]
    }

}
/**
 * Simple Broker for messaging to increase decoupling, supports history in case
 * a consumer hasn't been registered, before messages are published to channel
 * @example
 * let broker = new MuBroker({})
 * broker.subscribe('test:echo',(msg,success)=>{ console.log(msg); success('it worked')})
 * broker.publish('test:echo','this will be echoed').then((result)=>{console.log(result)})
 */
export class MuBroker {
    /**
     * Requires at least empty object {}
     * @param {Object} config - configuration
     * @param {integer} config.historyLimit - max messages to store
     */
    constructor({historyLimit = 20}){
        this._channels = {}
        this._historyLimit = historyLimit
    }
    /**
     * Mainly internal use
     * @private
     * @param {Object} config - configuration
     * @param {string} config.name - channel name
     * @param {string} config.type - one of [MuBroker.SINGLE, MuBroker.PROGRESSIVE]
     * @returns {Channel}
     */
    createChannel({name = ()=>{ throw 'No name provided'},type}){
        if (this._channels[name] && !(this._channels[name].type)) {
            this._channels[name].type = type
        } else {
            this._channels[name] = { subscribers: [], type: type, queue: []}
        }
        return this._channels[name]
    }
    /**
     * Method for consumers to register - will create channel if it doesn't exist
     * @param {String} name - channel name to subscribe to
     * @param {Function} receiver - function handling reply
     * @param {String} type - one of [MuBroker.SINGLE, MuBroker.PROGRESSIVE] if you know
     * or think the channel might not exist already and need to specify type. Defaults to
     * MuBroker.SINGLE
     */
    subscribe(name,receiver,type = MuBroker.SINGLE) {
        let channel = this._channels[name]
        if (!channel) {
            channel = this.createChannel({name,type})
        }
        // we're first here, drain the queue
        if (!channel.subscribers.length && channel.queue.length) {
            channel.subscribers.push(receiver)
            let again = ()=> {
                if (channel.queue.length) {
                    window.setTimeout(()=>{
                        let bundle = channel.queue.shift()
                        this.publish(name,bundle.msg)
                            .then((x)=>{
                                bundle.resolve(x)
                            })
                        again()},0)
                }
            }
            again()
        } else {
            switch(channel.type) {
            case MuBroker.SINGLE:
                channel.subscribers[0] = receiver
                break
            default:
                channel.subscribers.push(receiver)
            }
        }
    }
    /**
     * Stop consuming messages with given receiver on given channel
     * @param {String} name - channel name being unsubscribed from
     * @param {Function} receiver - original function handling reply
     */
    unsubscribe(name,receiver) {
        if (! (name in this._channels)) {return}
        this._channels[name].splice(this._channels[name].indexOf(receiver),1)
    }
    /**
     * Publish a message to a channel - will create channel if it doesn't exist
     * @param {String} name - channel name being published to
     * @param {Object} msg - Anything that you want passed to the consumer. If
     * msg.property is defined and a function then it will be given as callback to consumer.
     * @param {String} type -  one of [MuBroker.SINGLE, MuBroker.PROGRESSIVE] if you know
     * or think the channel might not exist already and NEED to specify type. Defaults to
     * MuBroker.SINGLE
     * @returns {Promise}
     */
    publish(name,msg,type = MuBroker.SINGLE) {
        let channel = this._channels[name]
        if (!channel) {
            channel = this.createChannel({name,type})
        }

        // return a promise...of a future promise when we have a consumer
        if (!channel.subscribers.length) {
            let p
            if (channel.queue.length < this._historyLimit) {
                p = new window.Promise((resolve,reject)=>{
                    channel.queue.push({
                        resolve: resolve,
                        reject: reject,
                        msg: msg
                    })
                })

            }
            return p
        }

        let sub
        let promise
        switch(channel.type) {
        case MuBroker.SINGLE:
            sub = channel.subscribers[0]
            break
        case MuBroker.PROGRESSIVE:
            sub = channel.subscribers[channel.subscribers.length - 1]
            break
        }

        if (!msg.resolve || (msg.resolve && typeof msg.resolve != 'function')) {
            promise = new window.Promise((resolve,reject)=>{
                sub(msg,resolve)
            })
        } else {
            promise = sub(msg.msg,msg.resolve)
        }

        return promise
    }

}

MuBroker.SINGLE = 'single'
MuBroker.PROGRESSIVE = 'progressive'

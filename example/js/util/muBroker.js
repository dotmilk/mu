class MuBroker {
    constructor({historyLimit = 20}){
        this._channels = {}
        this._historyLimit = historyLimit
    }
    createChannel({name = ()=>{ throw 'No name provided'},type}){
        if (this._channels[name] && !(this._channels[name].type)) {
            this._channels[name].type = type
        } else {
            this._channels[name] = { subscribers: [], type: type, queue: []}
        }
        return this._channels[name]
    }
    subscribe(name,receiver,type = MuBroker.SINGLE) {
        let channel = this._channels[name]
        if (!channel) {
            channel = this.createChannel({name,type})
        }
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
    unsubscribe(name,receiver) {
        if (! (name in this._channels)) {return}
        this._channels[name].splice(this._channels[name].indexOf(receiver),1)
    }
    publish(name,msg,type = MuBroker.SINGLE) {
        let channel = this._channels[name]
        if (!channel) {
            channel = this.createChannel({name,type})
        }
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

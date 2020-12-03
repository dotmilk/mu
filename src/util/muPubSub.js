class MuPubSub {

    constructor() {
        console.log('called')
        this.channels = {}
    }

    sub(name,listener) {
        let channel = this.ensureChannel(name)
        channel.push(listener)
    }

    pub(name,...rest) {
        let channel = this.ensureChannel(name)
        channel.forEach((fn)=>{
            fn(...rest)
        })
    }

    ensureChannel(name) {
        let channel = this.channels[name]
        if (!channel) {
            this.channels[name] = []
        }
        return this.channels[name]
    }

}

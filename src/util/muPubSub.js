class MuPubSub {

    constructor() {
        console.log('called')
        this.channels = {}
    }

    sub(name,listener) {
        console.log('sub')
        let channel = this.ensureChannel(name)
        channel.push(listener)
        console.log(this)
    }

    pub(name,...rest) {
        let channel = this.ensureChannel(name)
        console.log(this)
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

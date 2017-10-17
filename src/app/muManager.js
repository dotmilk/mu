class MuManager extends MuEvent {
    constructor(opts = {}) {
        super()
    }

    add(name,opts = {}) {
        if (opts['classDef'] && typeof opts['classDef'] === 'function') {
            let fn = opts['classDef']
            // clear classDef so rest of opts can be passed to fn
            delete opts.classDef
            this[name] = new fn(opts)
        } else {
            this[name] = opts
        }
    }

    get(name){
        return this[name]
    }

}

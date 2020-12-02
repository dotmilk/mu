class MuManager {
    constructor() {
    }
    add(name,opts = {}) {
        if (opts['classDef'] && typeof opts['classDef'] === 'function') {
            let fn = opts['classDef']
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

/**
 * A simple place to store anything if so desired, if an object is stored with
 * a property 'classDef', it will be treated as a reference to a class / called with new
 * and stored under the given key, with remaining properties passed in as options.
 * Use it or don't, I have no feelings either way. Good place to keep shit out of global scope.
 *
 */
class MuManager extends MuEvent {
    /**
     * Make a manager object
     */
    constructor() {
        super()
    }
    /**
     * Add a property
     * @param {String} name - key to store whatever you are storing under
     * @param {*} opts - Whatever you are storing, if it has a property classDef, that property
     * will be called with new, and the rest of the object as arguments to it.
     */
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
    /**
     * Retrieve a thing you have stored
     * @param {String} name - key to retrieve
     */
    get(name){
        return this[name]
    }

}

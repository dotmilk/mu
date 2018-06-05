/**
 * Very simple no frills Event Emitter so to speak, might add emitter.once later
 * @example
 * let emitter = new MuEvent()
 * emitter.on('whatever',()=>{console.log(whatever)})
 * emitter.emit('whatever')
 */
class MuEvent {
    /**
     * Takes no arguments
     */
    constructor(){
        this._events = {}
    }
    /**
     * Method to register a listener
     * @param {String} event - Name of event to listen for
     * @param {Function} fn - Fn to call when event heard
     */
    on(event, fn) {
        this._events[event] = this._events[event] || []
        this._events[event].push(fn)
    }
    off(event, fn) {
        if (this._events[event]) {
            this._events[event] = this._events[event].filter((x)=>{
                return x != fn
            })
        }
    }
    /**
     * May or may not work, usually just clear all listeners if anything
     * @param {String} event - Name of event to listen for
     * @param {Function} fn - Fn to call when event heard
     */
    removeListener(event, fn) {
        if (! (event in this._events)) {return}
        this._events[event].splice(this._events[event].indexOf(fn),1)
    }
    /**
     * Clears all listeners
     */
    clearListeners() {
        this._events = []
    }
    /**
     * Emit event
     * @param {String} event - Name of event to emit
     */
    emit(event) {
        if (! (event in this._events)) {return}
        for (let listener of this._events[event]) {
            listener.apply(this,Array.prototype.slice.call(arguments, 1))
        }
    }
}

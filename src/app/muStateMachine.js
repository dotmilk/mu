/**
 * Abstract State class for use in {@link MuStateMachine}
 */
class MuState {
    constructor(){}
    onEnter(){}
    onExit(){}
}
/**
 * Super neat statemachine, very loosely based on [machina.js]{@link http://machina-js.org/},
 * this is no where near as frilly, this does not have a kitchen sink, nor will it
 * keep your beverages cold.
 */
class MuStateMachine extends MuEvent {
    /**
     * So basically you only need to define some states, of which there is
     * one 'special' state you can add 'uninitialized' if you don't add it
     * a blank {@link MuState} is used.
     *
     * Each state can also have its own '\*' handler as well to respond to
     * calls not specifically covered in that state's definition.
     *
     * Every property not under states:{}, becomes a property of the instance.
     *
     * @param {Object} options - options for your stateMachine, everything not under
     * options.state becomes a property of the instance
     * @param {Object} options.states - defines the states your machine can transition to
     */
    constructor(opts){
        super()
        Object.assign(this,opts)
        if (!this.states) {
            throw 'State machine lacking state definitions'
        }
        if (!this.catchAll) {
            this.catchAll = function(){}
        }
        if (!this.states['uninitialized']) {
            this.states['uninitialized'] = new MuState()
        }
        if (this.init) {
            this.init()
        }
        this.currentState = 'uninitialized'
        this.initialState = this.initialState || 'unitialized'
        this.transition(this.initialState)
    }
    /**
     * Attempt to transition to a state. Should probably be called
     * from the api / internally, but again whatever it's your code.
     * @param {String} name - Name of state to transition to.
     */
    transition(name) {
        let old = this.currentState
        let args = Array.prototype.slice.call(arguments, 1)
        if (old) {
            this.handle('onExit')
        }
        if (name && this.states[name]) {
            this.currentState = name
            this.handle('onEnter')
            this.emit('transition',old,name)
        }

    }
    /**
     * Attempts to call 'name' on current state. Should probably be called
     * from your provided api, instead of attempting to call directly from outside
     * @param {String} name - state's method you are attempting to call
     */
    handle(name) {
        let state = this.states[this.currentState]
        if (typeof state[name] === 'string') {
            this.transition(state[name])
            return
        }
        let fn = state[name] || state['*'] || this.catchAll
        Reflect.apply(fn, this, Array.prototype.slice.call(arguments, 1))
    }

}

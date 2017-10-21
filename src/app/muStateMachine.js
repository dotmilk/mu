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

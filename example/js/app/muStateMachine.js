class MuState {
    constructor(){}
    onEnter(){}
    onExit(){}
}
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
        this.previousState = 'uninitialized'
        this.initialState = this.initialState || 'uninitialized'
        this.transition(this.initialState)
    }
    addState(name,stateDef) {
        if (!this.states) {
            throw 'Initialize state machine before adding states'
        }
        this.states[name] = stateDef
    }
    transition(name) {
        let old = this.currentState
        let args = Array.prototype.slice.call(arguments, 1)
        if (old) {
            this.handle('onExit')
            this.previousState = old
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
            return undefined
        }
        let fn = state[name] || state['*'] || this.catchAll
        Reflect.apply(fn, this, Array.prototype.slice.call(arguments, 1))
    }
}

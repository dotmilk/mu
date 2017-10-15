class MuEvent {
    constructor(){
        this._events = {}
    }

    on(event, fn) {
        this._events[event] = this._events[event] || []
        this._events[event].push(fn)
    }

    removeListener(event, fn) {
        if (! (event in this._events)) {return}
        this._events[event].splice(this._events[event].indexOf(fn),1)
    }

    clearListeners() {
        this._events = []
    }

    emit(event) {
        if (! (event in this._events)) {return}
        for (let listener of this._events[event]) {
            listener.apply(this,Array.prototype.slice.call(arguments, 1))
        }
    }
}

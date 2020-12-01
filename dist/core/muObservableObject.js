import { MuEvent } from '../util/muEvent.js'
export { MuObservableObject }
function arrayClone(a) {
    return [].concat[a]
}
function objectClone(o) {
    return JSON.parse(JSON.stringify(o))
}
function MuObservableObject(opts) {
    let internalProps = Object.keys(MuEvent.__proto__)
    internalProps.push('_eventsCount')
    internalProps.push('_state')
    let namedProps = opts.props || []
    let derivedProps = opts.derived || {}
    let derivedKeys = Object.keys(derivedProps)
    class State extends MuEvent {
        constructor(data) {
            super()
            this._state = {}
            Object.assign(this._state,data)
            this.on('change',function (changed){
                this.emit(`change:${changed.key}`,changed.value,changed.old)
            })
            let out =  new Proxy(this,{
                set: (target, key, value) => {
                    if (internalProps.includes(key)) {
                        this[key] = value
                        return true
                    }
                    let old
                    if (Array.isArray(this._state[key])) {
                        old = arrayClone(this._state[key])
                    } else if (typeof(this._state[key]) === 'object') {
                        old = objectClone(this._state[key])
                    } else {
                        old = this._state[key]
                    }
                    this._state[key] = value
                    this.emit('change',{key: key, value: value, old: old},target)
                    return true
                },
                get: (target, key, value) => {
                    if (internalProps.includes(key) || ['on','removeListener','emit','_events','clearListeners'].includes(key)) {
                        return this[key]
                    }
                    return this._state[key] ? this._state[key] : data[key]
                }
            })
            for (let d in derivedProps) {
                let fn = derivedProps[d]['fn']
                if (fn && typeof fn === 'function') {
                    for (let k of derivedProps[d]['deps']) {
                        out.on(`change:${k}`,(newV,oldV)=>{
                            if (newV !== oldV) {
                                out[d] = fn.apply(out._state)
                            }
                        })
                    }
                    out[d] = fn.apply(out._state)
                }
            }
            return out
        }
        static props() {
            return Reflect.ownKeys(namedProps) || {}
        }
        static derivedProps() {
            return Reflect.ownKeys(derivedProps) || {}
        }
        static dump(instance) {
            return instance._state
        }
        toJSON() {
            return this._state
        }
    }
    return State
}

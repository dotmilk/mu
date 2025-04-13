import { MuEvent } from '../util'
/**
 * A mystical thing, uses traps to watch for changes to an object,
 * also has derived properties.
 * @example
 * let person = MuObservableObject(
 *    {props: ['firstName','lastName'],
 *     derived: {
 *         fullName: {
 *             deps: ['firstName','lastName'],
 *             fn: function(){
 *                 return `${this.firstName} ${this.lastName}`
 *             }
 *         }
 *     }})
 * let dude = new person({firstName: 'jim', lastName: 'smith'})
 * console.log(dude.fullName)
 * // Magically fullName is 'jim smith' and if you change first or last...magic
 * // fullName updates...crazy
 * person.on('change:fullName',doSomething)
 * // can also listen for changes on any property.
 */
export function MuObservableObject(opts) {
    function arrayClone(a) {
        return [].concat[a]
    }

    function objectClone(o) {
        return JSON.parse(JSON.stringify(o))
    }

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
            // later filter this for known props if opt set for such
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
                    // lets avoid sending out an old value by reference
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

                    // else if (derivedKeys.includes(key)) {
                    //     return derivedProps[key]
                    // }
                    return this._state[key] ? this._state[key] : data[key]
                }
            })
            // we must refer to 'out' since we need the traps
            // set up before we can register the derived listeners
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

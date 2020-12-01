import { MuEvent } from '../util/muEvent.js'
export { MuWrapperView, MuView, muView }
class MuWrapperView extends MuEvent{
    constructor({el,parent}) {
        super()
        this.el = el
        this.rootWrapped = muDom(el)
        this.parent = parent
    }
    init(){}
    render(){}
    remove(){ throw 'Remove not overridden'}
}
class MuView extends MuEvent {
    constructor(opts = {}){
        super()
        this.isMuView = true
        this.template = opts.template
        if (opts.model) {
            this.model = opts.model
        }
        if (typeof this.template === 'function') {
            this.template = this.template.call(this)
        }
        this.custom = opts.custom
        this.setup = opts.setup || function (){}
        this._onRemove = opts.onRemove || function (){}
        this._references = opts.references || {}
        this._bindings = opts.bindings || {}
        this._events = opts.events || {}
        this._boundEvents = {}
        this.rootWrapped = muDom(this.template)
        this.root = this.el = this.rootWrapped.elements[0]
        this.references()
        this.parseBindings()
        if (opts.autoRender) {
            this.render()
        }
    }
    references(refs = this._references){
        if (refs) {
            for (let ref in refs) {
                this[ref] = muDom(refs[ref],this.root)
            }
        }
    }
    parseBindings(bindings = this._bindings) {
        for (let binding in bindings) {
            if (binding == '*') {
                let toBind = bindings[binding]
                let onChange = (newVal)=>{
                    this.model[toBind.name] = newVal.map((prop)=>{
                        return this.model[prop]
                    })
                }
                toBind.model.on(`change:${toBind.prop}`,onChange)
                let toModel = []
                onChange(toBind.model[toBind.prop])
                bindings[toBind.name] = toBind.action 
            }
        }
    }
    bindings(bindings = this._bindings){
        if (this.model && bindings) {
            let render = true 
            for (let binding in bindings) {
                if (binding == '*') { continue }
                let element = bindings[binding].selector == '' ?
                    muDom(this.root) : muDom(bindings[binding].selector,this.root)
                let options = bindings[binding]
                let changeHandler
                if (!options.type) { options.type = 'text'}
                switch (options.type) {
                case "text":
                    changeHandler = (newVal,oldVal)=>{
                        let theText = newVal || ''
                        if (options.parse) {
                            theText = options.parse(theText)
                        }
                        theText = `${options.prepend || ''}${theText}${options.append || ''}`
                        element.text(theText || '')
                    }
                    if (this.model.on) {
                        this.model.on(`change:${binding}`,changeHandler)
                    }
                    if (render) { changeHandler(this.model[binding]) }
                    break
                case "class":
                    if (this.model.on) {
                        this.model.on(`change:${binding}`,(newVal,oldVal)=>{
                            if (oldVal) {
                                element.removeClass(oldVal)
                            }
                            element.addClass(newVal || '')
                        })
                    }
                    if (render) { element.addClass(this.model[binding]) }
                    break
                case "attribute":
                    if (this.model.on) {
                        this.model.on(`change:${binding}`,(newVal,oldVal)=>{
                            element.setAttribute(options.name,newVal || '')
                        })
                    }
                    if (render) { element.setAttribute(options.name,this.model[binding]) }
                    break
                case "value":
                    if (this.model.on) {
                        this.model.on(`change:${binding}`,(newVal,oldVal)=>{
                            element.value(newVal || '')
                        })
                    }
                    if (render) { element.value(this.model[binding])  }
                    break
                case "html":
                    changeHandler = (newVal,oldVal)=>{
                        if (!Array.isArray(newVal)) { newVal = [newVal]}
                        element.clear()
                        for (let item of newVal) {
                            element.append(options.template(item))
                        }
                    }
                    if (this.model.on) {
                        this.model.on(`change:${binding}`,changeHandler)
                    }
                    if (render) { changeHandler(this.model[binding])}
                    break
                }
            }
        }
    }
    events(events = this._events){
        for (let eventsAndSelectors in events || {}) {
            let selector = eventsAndSelectors.split(' ')
            let event = selector.shift()
            selector = selector.join(' ')
            let existingEvents = this._boundEvents[event]
            if (existingEvents) {
                existingEvents.push({selector: selector,
                                     handle: events[eventsAndSelectors]})
            } else {
                this._boundEvents[event] = [{selector: selector,
                                             handle: events[eventsAndSelectors]}]
            }
        }
        for (let eventName in this._boundEvents) {
            this._boundEvents[eventName].reverse()
            this.rootWrapped.on(eventName,(e)=>{
                e.stopPropagation()
                if (e.target && this._boundEvents[e.type]) {
                    for (let handler of this._boundEvents[e.type]) {
                        if (handler.selector === '') {
                            handler.handle.call(this,e)
                            break
                        } else if (e.target.matches(handler.selector)) {
                            handler.handle.call(this,e)
                            break
                        }
                    }
                }
            })
        }
    }
    addCollection({collection, view, target, viewOptions, lookup, name}) {
        let vc
        let el
        if (target == '') {
            el = this.el
        } else {
            el = this.rootWrapped.find(target).elements[0]
        }
        if (collection.paginated) {
            vc = new MuPaginatedCollectionView({
                collection: collection,
                el: el,
                view: view,
                lookup: lookup,
                viewOptions: viewOptions
            })
        } else {
            vc = new MuCollectionView({
                collection: collection,
                el: el,
                view: view,
                lookup: lookup,
                viewOptions: viewOptions
            })
        }
        if (name) {
            this[name] = this[name] || vc
        }
        this.registerSubview(vc)
    }
    registerSubview(view) {
        this.subViews = this.subViews || []
        this.subViews.push(view)
        if (!view.parent) { view.parent = this}
        return view
    }
    renderSubviews() {
        if (this.subViews && this.subViews.length) {
            this.subViews.forEach((sv)=>{
                if (sv.init) {
                    sv.init()
                }
                sv.render()
            })
        }
    }
    remove(){
        if (this.subViews && this.subViews.length) {
            this.subViews.forEach((sv)=>{
                sv.remove()
            })
        }
        this._onRemove()
        if (this.el.parentNode) {
            this.el.parentNode.removeChild(this.el)
        }
    }
    render(){
        this.events()
        this.bindings()
        this.renderSubviews()
        this.setup()
    }
}
function muView(op) {
    return (o)=>{
        Object.assign(o,op)
        return new MuView(o)
    }
}

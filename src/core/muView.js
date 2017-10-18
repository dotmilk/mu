/** Abstract class for wrapping more complex constructs.
    @extends MuEvent
 */
class MuWrapperView extends MuEvent{
    /**
       Should only be called by super in extending class
       @param {Object} options - References to parent and root el
       @param options.el - The node this view manipulates
       @param options.parent - The view rendering this
     */
    constructor({el,parent}) {
        super()
        this.el = el
        this.rootWrapped = muDom(el)
        this.parent = parent
    }
    /** Stub function, extending class may implement*/
    init(){}
    /** Stub function, extending class may implement*/
    render(){}
    /** Stub function, extending class must implement*/
    remove(){ throw 'Remove not overridden'}
}

/** Main class for for a 'view'
    @extends MuEvent
 */
class MuView extends MuEvent {
        /**
           @param {Object} options - various options
           @param {(Function|String)} options.template - Template to become this.el
           @param {MuModel} options.model - Model that bindings will use
           @param {Object} options.bindings - An object with model properties to watch as keys
           @param {Object} options.events - An object with 'event-type element > .foo' as keys
           and fn as value, to be bound to this.el
           @param {Boolean} options.autoRender - Call render at end of constructor
         */
        constructor(opts = {}){
            super()
            this.isMuView = true
            this.template = opts.template

            if (opts.model) {
                this.model = opts.model
            }

            // if fn must return dom node or html string
            if (typeof this.template === 'function') {
                this.template = this.template.call(this)
            }

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

        /**
           @param {Object} references - An object describing dom references
           bound to 'this', and the selectors to use. Called internally.
           The references are mainly  used inside of your event bindings,
           for easy access without excessive dom queries.
           Will handle a selector or muDom instance.

           @example
           myView.references({aBtn: 'button #myButton'}); myView.aBtn.on('click',()=>{console.log('button clicked')});
        */
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
                    // for (let prop of toBind.model[toBind.prop]) {
                    //     toModel.push(this.model[prop])
                    // }

                    onChange(toBind.model[toBind.prop])
                    bindings[toBind.name] = toBind.action // toModel
                }
            }

        }

        bindings(bindings = this._bindings){
            if (this.model && bindings) {
                let render = true // fix this later
                for (let binding in bindings) {
                    if (binding == '*') { continue }
                    let element = bindings[binding].selector == '' ? muDom(this.root) : muDom(bindings[binding].selector,this.root)

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
                // snag the first item as the event name
                let selector = eventsAndSelectors.split(' ')
                let event = selector.shift()

                // reassamble selector string
                selector = selector.join(' ')
                // add to our eventName: [[selector strings],...] hash
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
                // reverse the array so that more generic / non selectors are processed last
                this._boundEvents[eventName].reverse()
                // bind generic handlers for each event given
                this.rootWrapped.on(eventName,(e)=>{
                    if (e.target && this._boundEvents[e.type]) {
                        for (let handler of this._boundEvents[e.type]) {
                            // '' is root: we have exhausted all other selectors
                            // event meant for root
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

        addCollection({collection, view, target, viewOptions, lookup}) {
            let vc
            if (collection.paginated) {
                vc = new MuPaginatedCollectionView({
                    collection: collection,
                    el: this.rootWrapped.find(target).elements[0],
                    view: view,
                    lookup: lookup
                })
            } else {
                vc = new MuCollectionView({
                    collection: collection,
                    el: this.rootWrapped.find(target).elements[0],
                    view: view,
                    lookup: lookup
                })
            }

            this.registerSubview(vc)
        }

        registerSubview(view) {
            this.subViews = this.subViews || []
            this.subViews.push(view)

            if (!view.parent) { view.parent = this}
            return view
        }

        renderSubviews(v) {
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
                    sv.remove
                })

                this.subViews = []
            }

            if (this.model && this.model.on) {
                console.log(this.model)
                this.model.clearListeners()
            }
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el)
            }
        }

        render(v){
            this.events()
            this.bindings()
            this.renderSubviews()
        }

    }


// Use to create view factory
function muView(op) {
    return (o)=>{
        Object.assign(o,op)
        return new MuView(o)
    }
}

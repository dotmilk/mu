class MuCollectionView {
    constructor({collection,el,view,parent,viewOptions={}}) {
        this.collection = collection
        this.el = el
        this.rootWrapped = muDom(el)
        this.view = view
        this.parent = parent
        this.viewOptions = viewOptions
        Object.assign(this.viewOptions,{autoRender: true})
        this.collectionViews = {}
        this.modelWrapper = MuObservableObject({})
    }

    init(){
        console.log(this)
        this.collection.on('add',(idx)=>{
            console.log('added')
            let item = this.collection.get(idx)
            let view = this.view(Object.assign({model: item.on ? item : new this.modelWrapper(item)},this.viewOptions))

            this.collectionViews[idx] = view
            this.el.appendChild(view.el)
        })
        this.collection.on('remove',(idx)=>{
            let view = this.collectionViews[idx]
            view.remove()
            delete this.collectionViews[idx]
        })
        this.collection.on('sort',(newOrder)=>{
            for (let viewIdx of newOrder ) {
                let view = this.collectionViews[viewIdx]
                view.remove()
                this.el.appendChild(view.el)
            }
        })
    }

    render(){
        //throw 'stop'
        console.log('RENNNNNNNNNNNN')
    }

    remove(){
        //console.log('clear')
        this.collection.each((item,idx)=>{
            let view = this.collectionViews[idx]
            view.remove()
            delete this.collectionViews[idx]
        })
        this.collection.clearListeners()
        if (this.el.parentNode) {
            this.el.parentNode.removeChild(this.el)
        }
    }
}

class MuPaginatedCollectionView extends MuCollectionView{
    constructor(opts){
        super(opts)
        console.log('right view')

        this.lookup = opts.lookup
    }

    init(){
        let handler = (page)=>{
            this.rootWrapped.clear()
            page.forEach((idx)=>{
                let item = this.collection.get(idx)

                item = this.lookup ? this.lookup(item) : item

                let view = this.view(Object.assign({model: item.on ? item :
                                                    new this.modelWrapper(item)},this.viewOptions))
                this.collectionViews[idx] = view
                this.el.appendChild(view.el)
            })

        }
        this.collection.on('newPage',handler)
        this.collection.on('restructure',handler)
    }

    render(){}
    remove(){}
}

class MuWrapperView {
    constructor({el,view,parent,viewOptions}) {
        this.el = el || parent.el
        this.rootWrapped = muDom(el)
        this.view = view
        this.parent = parent
        this.viewOptions = viewOptions
    }

    init(){}
    render(){}
    remove(){}
}

function muView(op) {

    class MuView extends MuEvent {
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
            this._boundEvents = this._boundEvents || {}
            this.rootWrapped = muDom(this.template)
            this.root = this.el = this.rootWrapped.elements[0]

            this.references()
            this.parseBindings()
            if (opts.autoRender) {
                this.render()
            }
            //this.render()
        }

        /*
          Handle:
          A selector
          muDom instance
          Bare element
          {foo: '#foo'} = this.foo element reference to avoid later dom queries
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

    return (o)=>{
        Object.assign(o,op)
        return new MuView(o)
    }
}

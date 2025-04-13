import { MuEvent } from '../util'
import { MuPaginatedCollectionView, MuCollectionView } from './muCollectionViews'
import { muDom } from '../dom'

/**
 * Main class for for a 'view', examples in example folder
 * @extends MuEvent
 * @example
 * // overly simple non working example
 * let myView = new MuView({bindings: {foo: {valid action schema}...},
 *                          model: someModelWithFoo,
 *                          events: {'click some selector that exists within this.el': someFn},
 *                          references: {aDomRef: '.bar'}})
 *
 * someModelWithFoo.foo = 'bar'
 * // result is action schema is called with new value of someModelWithFoo.foo
 * // clicking on element inside view.el with 'some selector that exists within this.el'
 * // calls someFn, someFn might use this.aDomRef to manipulate something
 */
export class MuView extends MuEvent {
    /**
     * @param {Object} options - various options
     * @param {(Function|String)} options.template - Template to become this.el
     * @param {MuModel} options.model - Model that bindings will use
     * @param {Object} options.bindings - An object with model properties to watch as keys
     * @param {Object} options.events - An object with 'event-type element > .foo' as keys
     * and fn as value, to be bound to this.el
     * @param {Boolean} options.autoRender - Call render at end of constructor
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

    /**
     * @param {Object} references - An object describing dom references
     * bound to 'this', and the selectors to use. Called internally.
     * The references are mainly  used inside of your event bindings,
     * for easy access without excessive dom queries.
     * Will handle a selector or muDom instance.
     *
     * @example
     * myView.references({aBtn: 'button #myButton'})
     * myView.aBtn.on('click',()=>{console.log('button clicked')})
     */
    references(refs = this._references){
        if (refs) {
            for (let ref in refs) {
                this[ref] = muDom(refs[ref],this.root)
            }
        }
    }

    /**
     * Checks for special case of '\*' right now. In the future, there might be more.
     * '*' creates a new essentially derived property on the 'model' passed in.
     * Naming said property according to the 'name' key, based of some property
     * of the model 'prop' which should be an array. Essentially flattening a sequence
     * of model properties to an array: [key1,key2] comes out ['foo','bar'] of a
     * model {key1: 'foo', key2: 'bar', key3: 'baz'} this array is added to the bindings
     * ['foo','bar'] and if [key1,key2] is changed then the binding is called again with
     * the resulting mapped array, see rowCollectionView in muTable for use. Called internally.
     * @param {Object} bindings - List of bindings defaults to this._bindings
     */
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
    /**
     * Method for binding changes in the model to actions, called internally.
     * Currently accepts text, html, attribute and value actions on
     * changed model prop. As well as special case '\*' which is mentioned
     * in documentation for {@link MuView#parseBindings}.
     *
     * Empty string selector is view.el. Selector is required to exist.
     * @param {Object} bindings - List of model props to bind to actions
     * @example
     * myView.bindings({foo: {selector: 'div.foo',
     *                        type: html,
     *                        template: someFnTakingNewValueReturningHtml }})
     * modelPassedIntoMyViewConstructor.foo = 'bar'
     * // result is myView.el's div.foo is replaced with template function output
     */
    bindings(bindings = this._bindings){
        if (this.model && bindings) {
            let render = true // fix this later
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
    /**
     * Uses event delegation to respond to events on view.el and its children.
     * keys should follow pattern 'eventName selector'. A string with no selector,
     * only eventName refers to view.el itself and not some child.
     *
     * Place more generically selected things first:
     * {'click': fn, 'click button': fn, 'click button.foo': fn}
     * Called internally.
     *
     * @example
     * myView.events({'click button.foo': ()=>{console.log('foo was clicked')}})
     * //clicking on button.foo logs the click to console
     */
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
                e.stopPropagation()
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

    /**
     * Adds a collection as a subview of this view, wrapping it in either a
     * {@link MuCollectionView} or if the collection is paginated a
     * {@link MuPaginatedCollectionView}
     * @param {Object} options - Set of options for the collection
     * @param {Collection} options.collection - An object conforming to collection contract
     * @param {(MuView | MuWrapperView)} options.view - The result of calling {@link muView}
     * curried function is called by {@link MuCollectionView} or {@link MuPaginatedCollectionView}
     * per item in collection
     * @param {Object} options.viewOptions - Merged before view is instantiated per item
     * @param {Function} options.lookup - If present is called with value of item, what it returns
     * is used in place of item for view per item
     * @param {String} options.target - IF supplied must be selector of some node in parent
     * @example
     * myView.addCollection({view: someView, collection someCollection, target: 'div.foo'})
     */
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
    /**
     * Registers a subview that knows where to insert itself into this view
     * @param {MuWrapperView} view - A wrapped view of some kind
     */
    registerSubview(view) {
        this.subViews = this.subViews || []
        this.subViews.push(view)

        if (!view.parent) { view.parent = this}
        return view
    }
    /**
     * Attempts to call render on all subviews
     */
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
    /**
     * Attempts to remove first all subviews and then self from the dom
     */
    remove(){
        //look into a scrub function later to ensure this is can be collected
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
    /**
     * Slaps events and model bindings onto this.el and then renders subviews
     */
    render(){
        this.events()
        this.bindings()
        this.renderSubviews()
        this.setup()
    }

}


/**
 * Factory function for {@link MuView}, uses currying to allow default options,
 * calling result with final options to produce instances.
 * @example
 * let personView = muView({template: '<div></div>'})
 * let personOne = personView({model: personOneModel })
 * let personTwo = personView({model: personTwoModel })
 */
export function muView(op) {
    return (o)=>{
        Object.assign(o,op)
        return new MuView(o)
    }
}

import { MuEvent } from '../util'
import { muDom } from '../dom'

/**
 * Super fun tool here. Designate by default some element with the attribute
 * mu-root, and one or more elements inside that one mu-page='pagename'
 * mu-controller='someFnWithHandlers'. Then fire this badboy up, and call load with
 * 'pagename' bam
 * @extends MuEvent
 */
export class MuPageManager extends MuEvent {
    /**
     * @param {Object} options - Options
     * @param {String} options.root - The name of the attribute denoting the root of your page. Where to find pages, and where page
     * swapping will occur in essence. Defaults to 'mu-root'.
     * @param {String} options.pageAttribute - The name of the attribute denoting a page. These will be cloned and removed from the dom.
     * Defaults to 'mu-page'.
     * @param {String} options.controllerAttribute - Placed on same element you denoted as a page. This should be a class name,
     * to be instantiated by {@link MuPageManager} during init.
     * @param {Object} options.options - Options you want passed in to each page controller, in addition to the defaults passed into each
     * pageManager: a reference to this, and name: its name
     */
    constructor({context=document,
                 options={},
                 root='mu-root',
                 pageAttribute='mu-page',
                 controllerAttribute='mu-controller'} = {}) {
        super()
        this.pages = {}
        this.loaded = []
        this.currentPage = undefined
        this.rootName = root
        this.root = muDom(`[${this.rootName}]`).elements[0]
        this.pageAttributeName = pageAttribute
        this.pageAttribute = `[${this['pageAttributeName']}]`
        this.controllerAttributeName = controllerAttribute
        muDom(this.pageAttribute, this.context).each((el)=>{
            let name = el.getAttribute(this.pageAttributeName)
            let controllerName = el.getAttribute(this.controllerAttributeName)
            let PageClass
            if (!name || name == '') {
                throw "Pages must be named"
            }
            if (this.pages[name]) {
                throw `${name} already exists as page name`
            }
            this.pages[name] = {}
            this.pages[name]['dom'] = el.cloneNode(true)
            el.parentNode.removeChild(el)

            if (controllerName && window[controllerName]) {
                PageClass = window[controllerName]
            } else {
                PageClass = MuPage
            }
            this.pages[name]['controller'] = new PageClass(Object.assign({
                pageManager: this,
                pageName: name
            },options))
            this.on(`load:${name}`,(page)=>{
                this.getController(name).onLoad(page)
            })
            this.on(`hide:${name}`,(page)=>{
                let controller = this.getController(name)
                controller.onHide.call(controller,page)
            })
            this.on(`show:${name}`,(page)=>{
                let controller = this.getController(name)
                controller.onShow.call(controller,page)
            })
        })
    }
    /**
     * Get a list of attributes of the page
     * @param {String} name - Name of page to get attributes of.
     */
    getAttributes(name) {
        let ref = this.getDOM(name)
        if (!ref) { return ref }
        return Array.from(ref.attributes)
    }
    /**
     * Get a reference to the DOM node tied to specified page
     * @param {String} name - Name of page
     */
    getDOM(name) {
        return this.pages[name]['dom']
    }
    /**
     * Get the controller instance bound to specified page
     * @param {String} name - Name of page
     */
    getController(name){
        return this.pages[name]['controller']
    }
    /**
     * After construction, this is probably the only method you will be using. Removes old page if any emitting hide:pageName
     * so that it knows it is being removed from the dom. If it is the first time this page has been loaded load:pageName is
     * emitted in place of show:pageName, allowing your controller to do prep work if needed, you might want to call show yourself
     * at the end of your handler for show, depending on how all your shit is setup.
     * @param {String} name - Name of page
     */
    load(name) {
        let old
        let newEl = this.getDOM(name)
        if (this.currentPage) {
            old = muDom(`[${this.pageAttributeName}=${this.currentPage}]`,this.context)
        }
        if (old) {
            old.swap(newEl)
            this.emit(`hide:${this.currentPage}`,this.getDOM(this.currentPage))
        } else {
            this.root.appendChild(newEl)
        }

        this.currentPage = name
        this.page = this.getDOM(this.currentPage)
        this.controller = this.getController(this.currentPage)
        if (! this.loaded.includes(name)) {
            this.emit(`load:${name}`,this.getDOM(this.currentPage))
            this.loaded.push(name)
        }
        this.emit(`show:${name}`,this.getDOM(this.currentPage))

        this.emit('pageChange',name)
    }
}

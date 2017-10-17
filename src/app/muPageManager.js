class MuPageManager extends MuEvent {
    constructor(opts = {}) {
        super()
        this.pages = {}
        this.loaded = []
        this.currentPage = undefined
        this.context = opts['context'] || document
        this.rootName = opts['root'] || 'mu-root'
        this.root = muDom(`[${this.rootName}]`).elements[0]

        this.pageAttributeName = opts['pageAttribute'] || 'mu-page'
        this.pageAttribute = `[${this['pageAttributeName']}]`

        this.controllerAttributeName = opts['controllerAttribute'] || 'mu-controller'
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
            },opts.options || {}))
            this.on(`load:${name}`,(page)=>{
                this.getController(name).onLoad(page)
            })
            this.on(`hide:${name}`,this.getController(name).onHide)
            this.on(`show:${name}`,this.getController(name).onShow)
        })
    }

    getAttributes(name) {
        let ref = this.getDOM(name)
        if (!ref) { return ref }
        return Array.from(ref.attributes)
    }

    getDOM(name) {
        return this.pages[name]['dom']
    }

    getController(name){
        return this.pages[name]['controller']
    }

    load(name) {

        let old
        let newEl = this.getDOM(name)
        if (this.currentPage) {
            old = muDom(`[${this.pageAttributeName}=${this.currentPage}]`,this.context)
        }
        if (old) {
            old.swap(newEl)
            this.emit(`hide:${name}`,this.getDOM(this.currentPage))
        } else {
            this.root.appendChild(newEl)
        }

        this.currentPage = name
        if (! this.loaded.includes(name)) {
            this.emit(`load:${name}`,this.getDOM(this.currentPage))
            this.loaded.push(name)
        } else {
            this.emit(`show:${name}`,this.getDOM(this.currentPage))
        }


    }

}

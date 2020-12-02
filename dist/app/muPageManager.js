class MuPageManager extends MuEvent {
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

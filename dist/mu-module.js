export { muCss,
         muDom,
         MuTagen }
function muCss(style,id) {
    let sheet = document.createElement('style')
    if (id) {
        sheet.id = id
    }
    sheet.innerHTML = style
    document.body.appendChild(sheet)
}
function muDom(s,c) {
    if (!window.muDomInjected) {
        let css =`.muHide { display: none !important}`
        if (document.readyState == 'complete' || document.readyState == 'interactive') {
            muCss(css,'muDom')
        } else {
            document.addEventListener('DOMContentLoaded',()=>{
                muCss(css,'muDom')
            })
        }
        window.muDomInjected = true
    }
    function toDomNode(t) {
        return document.createRange().createContextualFragment(`<template>${t}</template>`)
            .children[0].content.children[0]
    }
    let proto = {
        html(newHtml){
            this.elements.forEach(element => {
                element.innerHTML = newHtml
            })
            return this
        },
        value(value){
            if (value || value == '') {
                this.elements.forEach(element => {
                    element.value = value
                })
                return this
            } else if (this.count == 1) {
                return this.elements[0].value
            }
            return this.elements.map((element)=>{
                return element.value
            })
        },
        text(newTxt){
            this.elements.forEach(element => {
                element.innerText = newTxt
            })
            return this
        },
        setAttribute(name,value){
            this.elements.forEach(element => {
                element.setAttribute(name, value)
            })
            return this
        },
        each(fn){
            this.elements.forEach(fn)
            return this
        },
        some(fn){
            return this.elements.some(fn)
        },
        map(fn){
            return this.elements.map(fn)
        },
        siblings(){
            let siblings = []
            let el = this.elements[0].parentNode.firstChild
            do { if (el != this.elements[0] && el.nodeType != 3 )
                 { siblings.push(el)} }
            while ((el = el.nextSibling))
            return muDom(siblings,this.context)
        },
        is(selector){
            return this.elements.some((el)=>{
                return el.matches(selector)
            })
        },
        focus(){
            if (this.elements.length == 1) {
                this.elements[0].focus()
            }
            return this
        },
        blur(){
            this.each((e)=>{
                e.blur()
            })
            return this
        },
        toggle(className = 'muHide'){
            this.each((e)=>{
                if (e.classList.contains(className)) {
                    e.classList.remove(className)
                } else {
                    e.classList.add(className)
                }
            })
            return this
        },
        hide(){
            this.each((e)=>{
                e.classList.add('muHide')
            })
            return this
        },
        show(){
            this.each((e)=>{
                e.classList.remove('muHide')
            })
            return this
        },
        addClass(cl){
            this.each((e)=>{
                e.classList.add(cl)
            })
            return this
        },
        removeClass(cl){
            this.each((e)=>{
                e.classList.remove(cl)
            })
            return this
        },
        swap(el){
            this.each((element)=>{
                element.parentNode.replaceChild(el,element)
            })
            return this
        },
        swap_(el){
            let element = this.elements[0]
            element.parentNode.replaceChild(el,element)
            return element
        },
        on(event, handler, options){
            this.each((element)=>{
                element.addEventListener(event, handler, options)
            })
            return this
        },
        off(event, handler, options){
            this.each((element)=>{
                element.removeEventListener(event, handler, options)
            })
            return this
        },
        find(selector){
            if (this.count) {
                return muDom(selector,this.context)
            }
            this.elements =  Array.from(this.context.querySelectorAll(selector))
            this.count = this.elements.length
            return this
        },
        append(node){
            if (typeof node === 'string') {
                node = toDomNode(node)
            }
            return this.each((e)=>{
                e.append(node)
            })
        },
        prepend(node){
            if (typeof node === 'string') {
                node = toDomNode(node)
            }
            return this.each((e)=>{
                e.prepend(node.cloneNode(true))
            })
        },
        remove(){
            return this.each((e)=>{
                e.parentNode.removeChild(e)
            })
        },
        clear(){
            this.each((element)=>{
                while (element.firstChild) {
                    element.removeChild(element.firstChild)
                }
            })
            return this
        }
    }
    function md(context) {
        Object.assign(this,proto)
        this.context = context
        this.elements = []
        this.count = 0
        this.isMudom = true
    }
    if (s.isMudom) {
        return s
    }
    if (typeof s === 'string') {
        if (s[ 0 ] === "<" &&
	    s[ s.length - 1 ] === ">" &&
	    s.length >= 3) {
            s = toDomNode(s)
        }
    }
    if (Array.isArray(s)){
        let m = new md(c)
        m.elements = s
        m.count = s.length
        return m
    }
    if (s.nodeType && !c){
        let out = new md(s)
        out.elements.push(s)
        out.count = 1
        return out
    } else if (typeof s === 'string' && !c) {
        return new md(document).find(s)
    } else if (typeof s === 'string' && c){
        return new md(c).find(s)
    } else {
        console.log(s,c)
        throw 'WTF are you trying to do'
    }
}
class MuTagen {
    constructor(fullPrefix,parent) {
        this.fullPrefix = fullPrefix || []
        this.parent = parent
        this.children = []
        this.elem
        this.attributes = []
        this.compiledString
        this.template
        this.innerText
        return this
    }
    tag(name,prefix) {
        if (this.elem) {
            let childPrefix
            if (this.fullPrefix.length) {
                childPrefix = [].concat(this.fullPrefix)
                if (prefix){
                    childPrefix.push(prefix)
                }
            } else if (prefix) {
                childPrefix = [prefix]
            }
            let child = new MuTagen(childPrefix,this).tag(name)
            this.children.push(child)
            return child
        }
        if (prefix) {
            this.fullPrefix.push(prefix)
        }
        this.elem = {
            open: `<${name}`,
            afterOpen: '>',
            close: `</${name}>`
        }
        return this
    }
    attribute(name,prop = name) {
        if (!(name in this.attributes)) {
            this.attributes.push([name,prop])
        }
        return this
    }
    class(prop = 'class') {
        return this.attribute('class',prop)
    }
    id(prop = 'id') {
        return this.attribute('id',prop)
    }
    text(prop = 'text') {
        this.innerText = prop
        return this
    }
    close() {
        if (this.parent) {
            return this.parent
        }
        return this
    }
    closeAll() {
        let parent = this.parent
        while (parent.parent) {
            parent = parent.parent
        }
        return parent
    }
    compileAttributes() {
        let out = ''
        for (let attr of this.attributes) {
            out += ` ${attr[0]}="`
            out += '${'
            if (this.fullPrefix.length) {
                out += `opts.${this.fullPrefix.join('.')}["${attr[1]}"]`
            } else {
                out += `opts.${attr[1]}`
            }
            out += '}"'
        }
        return out
    }
    compile(down) {
        let childrenString
        let attributes = ''
        if (this.parent && !down) {
            return this.parent.compile()
        }
        let childTmp = this.children.map((child)=>{
            child.compile(true)
            return child.compiledString
        })
        attributes = this.compileAttributes()
        childrenString = childTmp.join('')
        if (this.innerText) {
            this.compiledString = this.elem.open +
                attributes +
                this.elem.afterOpen +
                '${opts' + `${this.fullPrefix.length ? '.' + this.fullPrefix.join('.') : ''}`
                + '['+ `'${this.innerText}'` +']}' +
                childrenString +
                this.elem.close
        } else {
            this.compiledString = this.elem.open +
                attributes + this.elem.afterOpen +
                childrenString + this.elem.close
        }
        this.template = new Function('opts',`return \`${this.compiledString}\``)
        return this
    }
    render(opts) {
        if (!this.template) { throw 'No template compiled'}
        return document.createRange()
            .createContextualFragment(`<template>${this.template(opts)}</template>`)
            .children[0].content.children[0]
    }
}
class MuBroker {
    constructor({historyLimit = 20}){
        this._channels = {}
        this._historyLimit = historyLimit
    }
    createChannel({name = ()=>{ throw 'No name provided'},type}){
        if (this._channels[name] && !(this._channels[name].type)) {
            this._channels[name].type = type
        } else {
            this._channels[name] = { subscribers: [], type: type, queue: []}
        }
        return this._channels[name]
    }
    subscribe(name,receiver,type = MuBroker.SINGLE) {
        let channel = this._channels[name]
        if (!channel) {
            channel = this.createChannel({name,type})
        }
        if (!channel.subscribers.length && channel.queue.length) {
            channel.subscribers.push(receiver)
            let again = ()=> {
                if (channel.queue.length) {
                    window.setTimeout(()=>{
                        let bundle = channel.queue.shift()
                        this.publish(name,bundle.msg)
                            .then((x)=>{
                                bundle.resolve(x)
                            })
                        again()},0)
                }
            }
            again()
        } else {
            switch(channel.type) {
            case MuBroker.SINGLE:
                channel.subscribers[0] = receiver
                break
            default:
                channel.subscribers.push(receiver)
            }
        }
    }
    unsubscribe(name,receiver) {
        if (! (name in this._channels)) {return}
        this._channels[name].splice(this._channels[name].indexOf(receiver),1)
    }
    publish(name,msg,type = MuBroker.SINGLE) {
        let channel = this._channels[name]
        if (!channel) {
            channel = this.createChannel({name,type})
        }
        if (!channel.subscribers.length) {
            let p
            if (channel.queue.length < this._historyLimit) {
                p = new window.Promise((resolve,reject)=>{
                    channel.queue.push({
                        resolve: resolve,
                        reject: reject,
                        msg: msg
                    })
                })
            }
            return p
        }
        let sub
        let promise
        switch(channel.type) {
        case MuBroker.SINGLE:
            sub = channel.subscribers[0]
            break
        case MuBroker.PROGRESSIVE:
            sub = channel.subscribers[channel.subscribers.length - 1]
            break
        }
        if (!msg.resolve || (msg.resolve && typeof msg.resolve != 'function')) {
            promise = new window.Promise((resolve,reject)=>{
                sub(msg,resolve)
            })
        } else {
            promise = sub(msg.msg,msg.resolve)
        }
        return promise
    }
}
MuBroker.SINGLE = 'single'
MuBroker.PROGRESSIVE = 'progressive'
class MuEvent {
    constructor(){
        this._events = {}
    }
    on(event, fn) {
        this._events[event] = this._events[event] || []
        this._events[event].push(fn)
    }
    off(event, fn) {
        if (this._events[event]) {
            this._events[event] = this._events[event].filter((x)=>{
                return x != fn
            })
        }
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
let muMultiInherit = (baseClass, ...mixins) => {
    class base extends baseClass {
        constructor (...args) {
            super(...args);
            mixins.forEach((mixin) => {
                copyProps(this,(new mixin));
            });
        }
    }
    let copyProps = (target, source) => {  
        Object.getOwnPropertyNames(source)
            .concat(Object.getOwnPropertySymbols(source))
            .forEach((prop) => {
                if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
                    Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
            })
    }
    mixins.forEach((mixin) => { 
        copyProps(base.prototype, mixin.prototype);
        copyProps(base, mixin);
    });
    return base;
}
class MuNodeManager {
    constructor(){
        this.nodes = {}
    }
    add(name,selector,context=document,clone=true){
        let node = muDom(selector,context).elements[0]
        if (clone) {
            this.nodes[name] = node.cloneNode(true)
        } else {
            this.nodes[name] = node
        }
        return node
    }
    addAndRemove(name,selector,context,clone){
        let node = this.add(name,selector,context,clone)
        node.parentNode.removeChild(node)
        return node
    }
    getCloned(name){
        return this.nodes[name].cloneNode(true)
    }
    get(name){
        return this.nodes[name]
    }
    getCurried(name, cloned = true) {
        return ()=>{
            return cloned ? this.getCloned(name) : this.get(name)
        }
    }
}
class MuPaginator {
    constructor({pageSize, data}) {
        if (!Array.isArray(data)) {
            throw "Data must be array"
        }
        this.data = data
        this.pageSize = pageSize
        this.currentPage = 1
    }
    * paginator(start) {
        let newIndex
        let doIt
        for (let i = start || 0; true; i++) {
            if (i - start == this.pageSize || doIt) {
                doIt = false
                newIndex = yield 'PaGeDoNe'
                if (newIndex || newIndex == 0) {
                    start = newIndex
                    i = newIndex - 1
                }
            }
            if (this.data[i] || this.data[i] == 0 || this.data[i] == false) {
                yield this.data[i]
            } else {
                doIt = true
            }
        }
    }
    getPage(pageNumber = this.currentPage) {
        this.currentPage = pageNumber
        let page = []
        let startingIndex = (pageNumber - 1) * this.pageSize
        if (!this.paginate) {
            this.paginate = this.paginator(startingIndex)
        } else {
            this.paginate.next(startingIndex)
        }
        let val
        while (true) {
            val = this.paginate.next().value
            if (val == 'PaGeDoNe') { break }
            page.push(val)
        }
        return page
    }
    maxPage() {
        return Math.ceil(this.data.length/this.pageSize)
    }
    isLastPage() {
        return !(this.maxPage() > this.currentPage)
    }
    lastPage() {
        this.currentPage = Math.ceil(this.data.length/this.pageSize)
        return this.getPage()
    }
    firstPage() {
        this.currentPage = 1
        return this.getPage()
    }
    nextPage() {
        if (!this.isLastPage()) {
            this.currentPage++
        }
        return this.getPage()
    }
    previousPage() {
        this.currentPage--
        if (this.currentPage < 1) {
            this.currentPage = 1
        }
        return this.getPage()
    }
}
class MuDialogue {
    constructor(){
    }
    onBeforeShow(){}
    onShow(){}
    onBeforeClose(){}
    onClose(){}
    render(){ return muDom("<div></div>").elements[0] }
}
class MuDialogueManager {
    constructor(broker,div,id) {
        this.overlay = MuDialogueManager._ensureOverlay(div,id)
        this.overlayNative = this.overlay.elements[0]
        this.stack = []
        this.dialogues = {closed: new MuDialogue()} 
        this.broker = broker
        broker.subscribe('dialogueManager:register',this.register.bind(this))
        broker.subscribe('dialogueManager:open',this.open.bind(this))
        broker.subscribe('dialogueManager:close',this.close.bind(this))
    }
    currentDialogue(){
        return this.stack.slice(-1)
    }
    register(def,success) {
        this.dialogues[def.name] = def.constructor
        success()
    }
    open(cfg,success) {
        let dialogue = this.dialogues[cfg.name]
        if (!dialogue) { throw `No dialogue named ${cfg.name} exists` }
        dialogue = new dialogue(cfg)
        let current = {reference: dialogue, callback: success,
                       name: cfg.name, content: dialogue.render(cfg)}
        this.stack.push(current)
        this.overlay.append(current.content)
        dialogue.onBeforeShow(cfg)
        this.overlay.addClass('mu-overlay-show')
        dialogue.onShow(Object.assign({},cfg,{beforeShowResult: result}))
    }
    close(cfg,success) {
        let current = this.stack.pop()
        if (current) {
            let dialogueOutput = current.reference.dialogueOutput(cfg)
            current.reference.onBeforeClose(cfg)
            this.overlayNative.removeChild(this.overlayNative.lastChild)
            current.reference.onClose(cfg)
            current.callback(dialogueOutput)
        }
        if (!this.stack.length) {
            this.overlay.removeClass('mu-overlay-show')
        }
        success()
    }
    static _ensureOverlay(div,id) {
        let overlay =  muDom( id || '#mu-overlay')
        if (overlay.count >= 1) { return overlay }
        if (!div) {
            div = new MuTagen()
                .tag('div')
                .id()
                .compile()
                .render({id: id || 'mu-overlay'})
        }
        muDom('body').prepend(div)
        return  muDom( id || '#mu-overlay')
    }
}
class MuManager {
    constructor() {
    }
    add(name,opts = {}) {
        if (opts['classDef'] && typeof opts['classDef'] === 'function') {
            let fn = opts['classDef']
            delete opts.classDef
            this[name] = new fn(opts)
        } else {
            this[name] = opts
        }
    }
    get(name){
        return this[name]
    }
}
class MuPage {
    constructor({pageName, pageManager}) {
        this.pageName = pageName
        this.pageManager = pageManager
    }
    onLoad() {}
    onShow() {}
    onHide() {}
}
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
class MuState {
    constructor(){}
    onEnter(){}
    onExit(){}
}
class MuStateMachine extends MuEvent {
    constructor(opts){
        super()
        Object.assign(this,opts)
        if (!this.states) {
            throw 'State machine lacking state definitions'
        }
        if (!this.catchAll) {
            this.catchAll = function(){}
        }
        if (!this.states['uninitialized']) {
            this.states['uninitialized'] = new MuState()
        }
        if (this.init) {
            this.init()
        }
        this.currentState = 'uninitialized'
        this.previousState = 'uninitialized'
        this.initialState = this.initialState || 'uninitialized'
        this.transition(this.initialState)
    }
    addState(name,stateDef) {
        if (!this.states) {
            throw 'Initialize state machine before adding states'
        }
        this.states[name] = stateDef
    }
    transition(name) {
        let old = this.currentState
        let args = Array.prototype.slice.call(arguments, 1)
        if (old) {
            this.handle('onExit')
            this.previousState = old
        }
        if (name && this.states[name]) {
            this.currentState = name
            this.handle('onEnter')
            this.emit('transition',old,name)
        }
    }
    handle(name) {
        let state = this.states[this.currentState]
        if (typeof state[name] === 'string') {
            this.transition(state[name])
            return undefined
        }
        let fn = state[name] || state['*'] || this.catchAll
        Reflect.apply(fn, this, Array.prototype.slice.call(arguments, 1))
    }
}
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
class MuSelects {
    constructor(config) {
        this.ensureOverlay()
        let overlay = this.overlay
        this.cfg = Object.assign(this.defaults(),config)
        let multiple = this.cfg.multiple
        let changeEventSring = this.changeEventString()
        let logicEventString = this.logicEventString()
        let changeHandler = this.changeHandler()
        let logicHandler = this.logicHandler()
        let buttonClickString = `click button.${this.cfg.buttonClass}`
        let reselect = function () {
            this.model.selected.forEach((e)=>{
                this.options.find(`[muvalue="${e}"]`).setAttribute('selected','true')
            })
        }
        let selectOptions = `.${this.cfg.modalClass} .${this.cfg.mainClass} [selected="true"]`
        let selectLogic = `.${this.cfg.modalClass} .${this.cfg.logicClass} [selected="true"]`
        let viewConstructor = muView({
            autoRender: true,
            template: this.viewTemplate(),
            events: {
                [changeEventSring]: changeHandler,
                [logicEventString]: logicHandler,
                [buttonClickString]: this.showModal,
                'click footer :first-child': function(){
                    this.options.find(selectOptions).each((el)=>{
                        el.setAttribute('selected','false')
                    })
                    this.model.selected = []
                    this.model.confirmed = -this.model.confirmed
                },
                'click footer :last-child': function(){
                    let allSelected = this.options.find(selectOptions).map((ele)=>{
                        return ele.getAttribute('muvalue')
                    })
                    let logicSelected = this.logic.find(selectLogic).map((ele)=>{
                        return ele.getAttribute('muvalue')
                    })
                    if (JSON.stringify(this.model.selected) !== JSON.stringify(allSelected) ||
                        JSON.stringify(this.model.selectedLogic) !== JSON.stringify(logicSelected)) {
                        this.model.selected = allSelected
                        this.model.selectedLogic = logicSelected
                        this.model.confirmed = -this.model.confirmed
                    }
                    this.modal.toggle('mu-modal-show')
                    overlay.toggle('mu-select-show')
                    if (this.model.selected.length) {
                        this.mainButton.addClass('hasSelection')
                        if (this.externalControl) {
                            this.externalControl.addClass('hasSelection')
                        }
                    } else {
                        this.mainButton.removeClass('hasSelection')
                        if (this.externalControl) {
                            this.externalControl.removeClass('hasSelection')
                        }
                    }
                },
                'keyup .muSearch>input': function(e){
                    let search = e.target.value
                    if (search == '') {
                        this.options.find('.muNoResults').hide()
                        if (this.model.options.length == this.model.shownOptions.length) { return }
                        this.model.shownOptions = this.model.options.slice()
                        reselect.call(this)
                        return
                    }
                    let newShown = this.model.options.filter((val)=>{
                        return val.toLowerCase().indexOf(search.toLowerCase()) > -1
                    })
                    if (newShown.length) {
                        this.options.find('.muNoResults').hide()
                        this.model.shownOptions = newShown
                        reselect.call(this)
                    } else {
                        this.model.shownOptions = []
                        this.options.find('.muNoResults').show()
                    }
                }
            },
            references: {
                modal: `.${this.cfg.modalClass}`,
                options:  `.${this.cfg.modalClass} .${this.cfg.mainClass}`,
                logic: `.${this.cfg.modalClass} .${this.cfg.logicClass}`,
                mainButton: `.${this.cfg.buttonClass}`
            },
            bindings: {
                shownOptions: {
                    selector: `.${this.cfg.modalClass} .${this.cfg.mainClass}`,
                    type: 'html',
                    template: this.optionTemplate()
                },
                logicOptions: {
                    selector: `.${this.cfg.modalClass} .${this.cfg.logicClass}`,
                    type: 'html',
                    template: this.optionTemplate()
                }
            }
        })
        let modelConstructor =  MuObservableObject({
            props: ['options','selected','shownOption','confirm','multiple']
        })
        this.model = new modelConstructor({options: this.cfg.selectOptions || [],
                                           selected: this.cfg.selected || [],
                                           shownOptions: this.cfg.selectOptions.slice(),
                                           confirmed: 1,
                                           multiple: this.cfg.multiple,
                                           logicOptions: this.cfg.logicOptions || [],
                                           selectedLogic: this.cfg.selectedLogic || []})
        this.view = viewConstructor({
            model: this.model
        })
        this.view.overlay = overlay
        this.modal = this.view.modal
        let quickRef = muDom(this.view.el)
        if (!this.cfg.search) {
            quickRef.find(`.${this.cfg.searchClass}`).hide()
        }
        if (!this.model.logicOptions.length) {
            quickRef.find(`.${this.cfg.logicClass}`).hide()
        }
        if (this.cfg.noButton) {
            quickRef.find(`button.${this.cfg.buttonClass}`).remove()
        }
        this.view.options.find('[muvalue]').each((ele)=>{
            if (this.model.selected.includes(ele.getAttribute('muvalue'))){
                ele.setAttribute('selected','true')
            } else {
                ele.setAttribute('selected','false')
            }
        })
    }
    logicHandler(){
        return function(e) {
            let selected = e.target.getAttribute('selected')
            if (selected && selected == 'true') {
                e.target.setAttribute('selected','false')
            } else {
                e.target.setAttribute('selected','true')
            }
        }
    }
    changeHandler(){
        return function (e) {
            let selected = e.target.getAttribute('selected')
            if (this.model.multiple) {
                if (selected && selected == 'true') {
                    e.target.setAttribute('selected','false')
                } else {
                    e.target.setAttribute('selected','true')
                }
            } else {
                if (selected && selected == 'true') {
                    e.target.setAttribute('selected','false')
                    return
                } else {
                    this.options.find('[selected="true"]').each((ele)=>{
                        ele.setAttribute('selected','false')
                    })
                    e.target.setAttribute('selected','true')
                }
            }
        }
    }
    registerExternalControl(control) {
        this.externalControl = this.view.externalControl = muDom(control)
        this.externalControl.on('click',()=>{
            this.showModal()
        })
        if (this.model.selected.length) {
            control.addClass('hasSelection')
        }
    }
    showModal(){
        this.modal.toggle('mu-modal-show')
        this.overlay.toggle('mu-select-show')
    }
    optionTemplate(){
        return (item)=>{
            return new MuTagen()
                .tag('div').attribute('muvalue').class().text()
                .tag('span').class('decoration')
                .compile()
                .render({muvalue: item,
                         text: item,
                         class: 'muOption',
                         decoration: 'muCircle'})
        }
    }
    viewTemplate(){
        return ()=>{
            return new MuTagen().tag('section').class('wrapperClass')
                .tag('button').class('buttonClass').text('buttonText').close()
                .tag('section').class('modalClass')
                .tag('header').text('headerText').close()
                .tag('div').class('logicClass').close()
                .tag('div').class('searchClass')
                .tag('input').attribute('type','inputType').close().close()
                .tag('div').class('noResultsClass').text('noResultsText').close()
                .tag('section').class('mainClass').close()
                .tag('footer')
                .tag('button').text('clearButtonText').close()
                .tag('button').text('confirmButtonText').close()
                .compile()
                .render(this.cfg)
        }
    }
    defaults(){
        return {
            search: false,
            noResults: 'No Results',
            multiple: false,
            multipleConfirmTxt: "OK",
            wrapperClass: 'muSelectWrapper',
            modalClass: 'muModal',
            buttonClass: 'muSelectButton',
            buttonText: 'You need button text',
            confirmButtonText: 'Ok',
            clearButtonText: 'Clear',
            headerText: 'Choose wisely',
            tagClass: 'muSelectTag',
            noResultsClass: 'muNoResults muHide',
            noResultsText: 'No results',
            searchClass: 'muSearch',
            inputType: 'text',
            mainClass: 'muModalMain',
            logicClass: 'muLogic'
        }
    }
    ensureOverlay(){
        let overlay = muDom('.mu-select-overlay')
        if (overlay.count == 0) {
            let elem = new MuTagen()
                .tag('div')
                .class()
                .compile()
                .render({class: 'mu-select-overlay'})
            muDom('body').prepend(elem)
            overlay = muDom('.mu-select-overlay')
        }
        this.overlay = overlay
    }
    changeEventString(){
        return `click .${this.cfg.mainClass} .muOption, .${this.cfg.mainClass} .muOption *`
    }
    logicEventString(){
        return `click .${this.cfg.logicClass} .muOption, .${this.cfg.logicClass} .muOption *`
    }
}
class MuTable extends MuEvent{
    constructor(config){
        super()
        this.cfg = config = Object.assign(this.defaults(),config)
        let tableMetaModelConstructor = MuObservableObject({
            props: ['headers']
        })
        this.tableMetaModel = new tableMetaModelConstructor({
            headerKeys: config.headerKeys
        })
        let viewConstructor = muView({
            template: this.tableTemplate(),
            references: {
                first: `.${this.cfg.tableCfg.controlClass} button.first`,
                previous: `.${this.cfg.tableCfg.controlClass} button.previous`,
                next: `.${this.cfg.tableCfg.controlClass} button.next`,
                last: `.${this.cfg.tableCfg.controlClass} button.last`,
                pageCount: `.${this.cfg.tableCfg.controlClass} input.pagerInput`
            },
            bindings: {
                headerKeys: {
                    selector: `.${this.cfg.tableCfg.tableHeaderClass}`,
                    type: 'html',
                    template: this.headerTemplate()
                }
            },
            events: {
                [`click .${this.cfg.tableCfg.controlClass} button.first`]: function (e){
                    config.rows.firstPage()
                    this.pageCount.value(config.rows.currentPageNumber())
                },
                [`click .${this.cfg.tableCfg.controlClass} button.previous`]: function (e){
                    config.rows.previousPage()
                    this.pageCount.value(config.rows.currentPageNumber())
                },
                [`click .${this.cfg.tableCfg.controlClass} button.next`]: function (e){
                    config.rows.nextPage()
                    this.pageCount.value(config.rows.currentPageNumber())
                },
                [`click .${this.cfg.tableCfg.controlClass} button.last`]: function (e){
                    config.rows.lastPage()
                    this.pageCount.value(config.rows.currentPageNumber())
                },
                [`click .${this.cfg.tableCfg.tableClass} tbody td`]: (e)=>{
                    if (this.cfg.markSelection) {
                        muDom(e.target.parentNode).addClass('selected')
                            .siblings().removeClass('selected')
                    }
                    this.emit('selection',e.target.parentNode.getAttribute('muid'))
                },
                [`change .${this.cfg.tableCfg.controlClass} input.pagerInput`]: function(e){
                    if (e.target.value > config.rows.maxPage()) {
                        e.target.value = config.rows.maxPage()
                    } else if ( e.target.value < 1) {
                        e.target.value = 1
                    }
                    config.rows.getPage(e.target.value)
                },
                [`change .${this.cfg.tableCfg.controlClass} input.perPageInput`]: function(e){
                    if (e.target.value < 1) {
                        e.target.value = 1
                    }
                    if (config.rows.getPageSize != e.target.value) {
                        config.rows.setPageSize(e.target.value)
                        config.rows.currentPage()
                        this.pageCount.value(config.rows.currentPageNumber())
                    }
                }
            }
        })
        this.view = viewConstructor({model: this.tableMetaModel})
        let rowCollectionView = muView({
            autoRender: true,
            template: this.rowTemplate(),
            bindings: {
                '*': {
                    action: {selector: '',
                             type: 'html',
                             template: this.cellTemplate()
                            },
                    model: this.tableMetaModel,
                    prop: 'headerKeys',
                    name: 'all'
                }
            }
        })
        this.view.addCollection({
            view: rowCollectionView,
            collection: config.rows,
            target: 'tbody',
            lookup: config.lookup
        })
        muDom(`.${this.cfg.tableCfg.controlClass} input.pagerInput`,this.view.el)
            .value(config.rows.currentPageNumber())
        muDom(`.${this.cfg.tableCfg.controlClass} input.perPageInput`,this.view.el)
            .value(config.rows.getPageSize())
        if (this.cfg.fixedPageSize) {
            muDom(`.${this.cfg.tableCfg.controlClass} input.perPageInput`,this.view.el).toggle()
        }
        this.view.render()
        this.el = this.view.el
        this.paginatorControls = this.view.subViews[0].collection
    }
    tableTemplate(){
        return ()=>{
            return new MuTagen()
                .tag('section').class('wrapperClass')
                .tag('header').class('controlClass')
                .tag('button').class('firstClass').text('firstText').close()
                .tag('button').class('previousClass').text('previousText').close()
                .tag('input').class('pagerInputClass').attribute('type','inputType').close()
                .tag('button').class('nextClass').text('nextText').close()
                .tag('button').class('lastClass').text('lastText').close()
                .tag('input').class('perPageClass').attribute('type','inputType').close()
                .tag('div').class('perPageInfoClass').close()
                .close()
                .tag('table').class('tableClass')
                .tag('thead')
                .tag('tr').class('tableHeaderClass').close().close()
                .tag('tbody')
                .compile()
                .render(this.cfg.tableCfg)
        }
    }
    headerTemplate(){
        return (header)=>{
            return new MuTagen()
                .tag('th').text()
                .compile()
                .render({text: this.cfg.headers[header]})
        }
    }
    rowTemplate(){
        let field = this.cfg.rows.idField
        return function (foo){
            return new MuTagen()
                .tag('tr').attribute('muId','id')
                .compile()
                .render({id: this.model[field]})
        }
    }
    cellTemplate(){
        return (content)=>{
            return new MuTagen()
                .tag('td').text()
                .compile()
                .render({text: content || 'N/A'})
        }
    }
    defaults(){
        return {
            tableCfg: {
                wrapperClass: 'muTable',
                controlClass: 'muTableControls',
                firstClass: 'first',
                firstText: '<<',
                previousClass: 'previous',
                previousText: '<',
                pagerInputClass: 'pagerInput',
                inputType: 'number',
                pagerInfoClass: 'pagerInfo',
                nextClass: 'next',
                nextText: '>',
                lastClass: 'last',
                lastText: '>>',
                perPageClass: 'perPageInput',
                perPageInfoClass: 'perPageInfo',
                tableClass: 'table',
                tableHeaderClass: 'tableHeaders'
            }
        }
    }
}
class MuCollection extends MuEvent {
    constructor({flat,idField,model,comparator,contents} = {}){
        super()
        let defaultCompare = (a,b) => {
            if (this.flat) {
                if (typeof a === 'string') {
                    return a < b ? -1 : 1 }
                else {
                    return a - b
                }
            } else {
                if (typeof this.collection[a] === 'string') {
                    return this.collection[a] < this.collection[b] ? -1 : 1 }
                else {
                    return this.collection[a] - this.colletion[b]
                }
            }
        }
        this.flat = flat
        this.collection = this.flat ? [] : {}
        this.idx = []
        this.idField = idField || 'id'
        this.model = model || MuObservableObject({})
        this.comparator = comparator || defaultCompare
        if (contents) {
            this.add(contents)
        }
    }
    addBulk(items) {
        this.add(items,true)
    }
    add(items,bulk = false) {
        if (!Array.isArray(items)) { items = [items] }
        if (this.flat) {
            if (bulk) {
                this.collection = this.collection.concat(items)
            } else {
                for (let item of items) {
                    this.collection.push(item)
                    this.emit('add', item)
                }
            }
        } else {
            for (let item of items) {
                let old = this.collection[item[this.idField] || item]
                this.collection[item[this.idField] || item] = item
                if (old) {
                    this.emit('replace',item[this.idField])
                    this.collection[item[this.idField] || item] = item
                } else {
                    this.idx.push(item[this.idField] || item)
                    if (!bulk) {this.emit('add',item[this.idField] || item)}
                }
            }
        }
        if (bulk) {
            this.emit('bulk')
        }
    }
    sort(comparator = this.comparator, reverse = false) {
        reverse ? this.idx.sort((a,b)=>{return comparator(a,b) * -1}) : this.idx.sort(comparator)
        this.emit('sort',this.idx.slice())
    }
    remove(idxs) {
        if (this.flat) {throw 'No remove on flat collection, use reset'}
        if (!Array.isArray(idxs)) { idxs = [idxs] }
        for (let toRemove of idxs) {
            let ref = this.collection[toRemove]
            if (ref) {
                delete this.collection[toRemove]
                let idxLocation = this.idx.indexOf(toRemove)
                if (idxLocation >= 0) {
                    this.idx.splice(idxLocation,1)
                }
                this.emit('remove',toRemove,ref)
            }
        }
    }
    get(id) {
        return this.collection[id]
    }
    each(fn) {
        if (this.flat) {
            this.collection.forEach(fn)
        } else {
            for (let idx of this.idx) {
                fn.call(this,this.collection[idx],idx)
            }
        }
    }
    reset(items = [],bulk){
        if (this.flat) {
            this.collection = []
            this.emit('reset')
            this.add(items,bulk)
        } else {
            let old = Object.assign({},this.collection)
            this.remove(this.idx.slice())
            this.emit('reset',old)
            this.add(items,bulk)
        }
    }
}
class MuPagedCollection extends MuCollection {
    constructor(opts){
        super(opts)
        this.paginated = true
        this.on('add',this.changeHandler)
        this.on('bulk',this.changeHandler)
        this.on('remove',this.changeHandler)
        this.paginator = new MuPaginator({pageSize: opts.pageSize || 16,
                                          data: this.flat ? this.collection : this.idx})
    }
    changeHandler(event,data){
        this.paginator.paginate = undefined
        if (this.flat) {
            this.paginator.data = this.collection
        }
        this.emit('restructure',this.currentPage())
    }
    setPageSize(n) {
        if (n != this.paginator.pageSize) {
            this.paginator.pageSize = n
            this.getPage(1)
            this.changeHandler()
        }
    }
    getPageSize() {
        return this.paginator.pageSize
    }
    maxPage() {
        return this.paginator.maxPage()
    }
    currentPageNumber() {
        return this.paginator.currentPage
    }
    currentPage() {
        let page = this.paginator.getPage()
        return page
    }
    getPage(n){
        let page = this.paginator.getPage(n)
        this.emit('newPage',page)
        return page
    }
    nextPage(){
        let page = this.paginator.nextPage()
        this.emit('newPage',page)
        return page
    }
    previousPage(){
        let page = this.paginator.previousPage()
        this.emit('newPage',page)
        return page
    }
    lastPage(){
        let page = this.paginator.lastPage()
        this.emit('newPage',page)
        return page
    }
    firstPage(){
        let page = this.paginator.firstPage()
        this.emit('newPage',page)
        return page
    }
}
class MuCollectionView extends MuWrapperView{
    constructor({collection,el,view,parent,viewOptions={}}) {
        super({el,parent})
        this.collection = collection
        this.rootWrapped = muDom(el)
        this.view = view
        this.viewOptions = viewOptions
        Object.assign(this.viewOptions,{autoRender: true})
        this.collectionViews = {}
        this.modelWrapper = MuObservableObject({})
    }
    init(){
        this.collection.on('add',(idx)=>{
            let item = this.collection.get(idx)
            let view = this.view(Object.assign({
                model: item.on ? item : new this.modelWrapper(item)},
                                               this.viewOptions))
            this.collectionViews[idx] = view
            if (this.currentMask) {
                if (this.currentMask(view.model)){
                    this.el.appendChild(view.el)
                }
            } else {
                this.el.appendChild(view.el)
            }
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
                if (this.currentMask) {
                    if (this.currentMask(view.model)){
                        this.el.appendChild(view.el)
                    }
                } else {
                    this.el.appendChild(view.el)
                }
            }
        })
        this.collection.on('mask',(fn)=>{
            let idxs = this.collection.flat ? this.collection.collection : this.collection.idx
            for (let viewIdx of idxs) {
                let view = this.collectionViews[viewIdx]
                view.remove()
                if (!this.currentMask || (this.currentMask && this.currentMask(view.model))) {
                    this.el.appendChild(view.el)
                }
            }
        })
    }
    mask(fn){
        this.currentMask = fn
        this.collection.emit('mask')
    }
    remask(){
        this.collection.emit('mask')
    }
    unmask(){
        this.mask(undefined)
    }
    remove(){
        if (this.el.parentNode) {
            this.el.parentNode.removeChild(this.el)
        }
    }
}
class MuPaginatedCollectionView extends MuCollectionView{
    constructor(opts){
        super(opts)
        this.lookup = opts.lookup
    }
    init(){
        let handler = (page)=>{
            this.rootWrapped.clear()
            page.forEach((idx)=>{
                let item = this.collection.flat ? idx : this.collection.get(idx)
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
}
function MuObservableObject(opts) {
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

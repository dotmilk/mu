/**
 * Inject a style sheet, if you feel so inclined
 * @param {String} style - some string of css
 * @param {String} id - optional id for the style node you are about to inject
 * @example
 * muCss('.someClass {background-color: red}')
 */
function muCss(style,id) {
    let sheet = document.createElement('style')
    if (id) {
        sheet.id = id
    }
    sheet.innerHTML = style
    document.body.appendChild(sheet)
}

/**
 * A cheap, light weight jquery-ish knockoff
 * @example
 * muDom('.foo')
 * // shorthand for
 * muDom(document).find('foo')
 * @param {(String | DomNode)} selector - If text it's a selector, or if the text looks
 * like html, muDom will turn it into a fragment and treat it as the context,
 * or if it is a DomNode of some kind, muDom will treat it as the context
 * @param {DomNode} context - the context find and subsequent operations will be run under
 * defaults to document
 */
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
        /**
         * Sets the innerHTML of matched elements. Chainable.
         * @memberof muDom
         * @param newHtml - the new html for matched elements.
         */
        html(newHtml){
            this.elements.forEach(element => {
                element.innerHTML = newHtml
            })
            return this
        },
        /**
         * Sets the value of matched elements. Chainable.
         * @memberof muDom
         * @param value - the new value for matched elements.
         */
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
        /**
         * Sets the innerText of matched elements. Chainable.
         * @memberof muDom
         * @param newTxt - the new text for matched elements.
         */
        text(newTxt){
            this.elements.forEach(element => {
                element.innerText = newTxt
            })
            return this
        },
        /**
         * Sets an attribute of matched elements. Chainable.
         * @memberof muDom
         * @param name - name of attribute to set
         * @param value - value of attribute
         */
        setAttribute(name,value){
            this.elements.forEach(element => {
                element.setAttribute(name, value)
            })
            return this
        },
        /**
         * Helper: Sets 'src' of element. Chainable.
         * @memberof muDom
         * @param src - value of src attributed desired
         */
        src(value){
            return this.setAttribute('src',value)
        },
        /**
         * Calls fn for each matched element. Chainable.
         * @memberof muDom
         * @param fn - some function
         */
        each(fn){
            this.elements.forEach(fn)
            return this
        },
        /**
         * Determines if some element in matched elements passes fn. Not chainable.
         * Basically Array.some()
         * @memberof muDom
         * @param fn - some function
         */
        some(fn){
            return this.elements.some(fn)
        },
        /**
         * Map over matched elements. Not chainable.
         * @memberof muDom
         * @param fn - some function
         */
        map(fn){
            return this.elements.map(fn)
        },
        /**
         * Get siblings. Chainable on siblings.
         * @memberof muDom
         */
        siblings(){
            let siblings = []
            let el = this.elements[0].parentNode.firstChild
            do { if (el != this.elements[0] && el.nodeType != 3 )
                 { siblings.push(el)} }
            while ((el = el.nextSibling))
            return muDom(siblings,this.context)
        },
        /**
         * Fool it's probably like the is() from jquery
         * @param selector - some selector
         */
        is(selector){
            return this.elements.some((el)=>{
                return el.matches(selector)
            })
        },
        /**
         * Focus an element. Only works if this has one matching element. Chainable.
         * @memberof muDom
         */
        focus(){
            if (this.elements.length == 1) {
                this.elements[0].focus()
            }
            return this
        },
        /**
         * Get ref to dom element (assumes there is only one match, returning first)
         * obviously non-chainable
         * @memberof muDom
         */
        element(){
            return this.elements[0]
        },
        /**
         * Remove focus from matched elements, if one of them happens to have focus. Chainable.
         * @memberof muDom
         */
        blur(){
            this.each((e)=>{
                e.blur()
            })
            return this
        },
        /**
         * Toggles a class on matched elements. Defaults to '.muHide' which as
         * its name suggests hides the element. Chainable.
         * @memberof muDom
         * @param className - class to toggle
         */
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
        /**
         * Hides matched elements. Chainable.
         * @memberof muDom
         */
        hide(){
            this.each((e)=>{
                e.classList.add('muHide')
            })
            return this
        },
        /**
         * Shows matched elements. Chainable.
         * @memberof muDom
         */
        show(){
            this.each((e)=>{
                e.classList.remove('muHide')
            })
            return this
        },
        /**
         * Adds a class to matched elements. Chainable.
         * @memberof muDom
         * @param class - class name to add
         */
        addClass(cl){
            this.each((e)=>{
                e.classList.add(cl)
            })
            return this
        },
        /**
         * Removes a class from matched elements. Chainable.
         * @memberof muDom
         * @param class - class name to add
         */
        removeClass(cl){
            this.each((e)=>{
                e.classList.remove(cl)
            })
            return this
        },
        /**
         * Swaps matched elements with new element. Chainable.
         * @memberof muDom
         * @param el - new element
         */
        swap(el){
            this.each((element)=>{
                element.parentNode.replaceChild(el,element)
            })
            return this
        },
        /**
         * Special case of swap, assumes one match, returns element being swapped out
         */
        swap_(el){
            let element = this.elements[0]
            element.parentNode.replaceChild(el,element)
            return element
        },
        /**
         * Listen to some event on matched elements. Chainable.
         * @memberof muDom
         * @param event - event to listen for
         * @param handler - some fn
         * @param options - options for addEventListener
         */
        on(event, handler, options){
            this.each((element)=>{
                element.addEventListener(event, handler, options)
            })
            return this
        },
        /**
         * Removes some event listener from matched elements. Chainable.
         * @memberof muDom
         * @param event - event to listen for
         * @param handler - some fn
         * @param options - options for addEventListener
         */
        off(event, handler, options){
            this.each((element)=>{
                element.removeEventListener(event, handler, options)
            })
            return this
        },
        /**
         * Find some matching element/elements in current context. Chainable.
         * @memberof muDom
         * @param selector - some selector
         */
        find(selector){
            if (this.count) {
                return muDom(selector,this.context)
            }
            this.elements =  Array.from(this.context.querySelectorAll(selector))
            this.count = this.elements.length
            return this
        },
        /**
         * Append some element to matched elements. Chainable.
         * @memberof muDom
         * @param node - some dom node to append
         */
        append(node){
            if (typeof node === 'string') {
                node = toDomNode(node)
            }
            return this.each((e)=>{
                e.append(node)
            })

        },
        /**
         * Prepend some element to matched elements. Chainable.
         * @memberof muDom
         * @param node - some dom node to prepend
         */
        prepend(node){
            if (typeof node === 'string') {
                node = toDomNode(node)
            }
            return this.each((e)=>{
                e.prepend(node.cloneNode(true))
            })

        },
        /**
         * Remove matched elements from their parents. Not chainable.
         * @memberof muDom
         */
        remove(){
            return this.each((e)=>{
                e.parentNode.removeChild(e)
            })
        },
        /**
         * Clear the contents of matched elements. Chainable.
         * @memberof muDom
         */
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

/**
 * Programmatically create some html fragment template
 */
class MuTagen {
    /**
     * Get the party started
     * @example
     * let frag = new MuTagen().tag('div').class().tag('p').text('aParagraph').compile()
     * frag.render({class: 'foo',aParagraph: 'Some text for the paragraph'})
     * // returns
     * // <div class="foo"><p>Some text for the paragraph</p></div>
     * //For now lets just assume
     * frag = new MuTagen()
     */
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
    /**
     * Now that the party is started, lets make a tag
     * @example
     * frag.tag('div')
     * // optionally
     * frag.tag('div','foo')
     * // When render is called later all future properties must be found under {foo:{}}
     * // for any tag under this level, more robust example being
     * frag.tag('div').class().tag('section','profile').class()
     *                        .tag('p').text('name').close()
     *                        .tag('p').text('info').close().close()
     *                .tag('p').text('status')
     * frag.render({class:'foo',status:'online',profile:{ name: 'John Smith',
     *              info: 'age: 34, likes: long walks', class: 'profile'}})
     * <div class="foo">
     *  <section class="profile">
     *   <p>John Smith</p>
     *   <p>age: 34, likes: long walks</p>
     *  </section>
     *  <p>online</p>
     * </div>
     * @param {String} name - Name of the tag you trying to create
     * @param {String} prefix - Where in the data to find values for
     * attributes / text / etc for this and nested tags
     */
    tag(name,prefix) {
        /*
          If there is already a tag in 'this' make a new instance and pass it intended tag
         */
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
    /**
     * Now we have a tag so lets add an attribute to it
     * @example
     * frag.attribute('class')
     * // By default it will look up the value for the attribute later under the
     * // key with the same name as that attribute, or you can specify what prop
     * frag.attribute('class','keyToFindClassUnder')
     * @param {String} name - Name of the attribute you trying to create
     * @param {String} prop - Where in the data to get value for this attribute, defaults to
     * name of attribute
     */
    attribute(name,prop = name) {
        if (!(name in this.attributes)) {
            // todo maybe filter out undefined things
            this.attributes.push([name,prop])
        }
        return this
    }
    /**
     * Convenience function for frag.attribute('class')
     * @param {String} prop - Where in the data to get value for this class, defaults to
     * 'class'
     */
    class(prop = 'class') {
        return this.attribute('class',prop)
    }
    /**
     * Convenience function for frag.attribute('id')
     * @param {String} prop - Where in the data to get value for this id, defaults to
     * 'id'
     */
    id(prop = 'id') {
        return this.attribute('id',prop)
    }
    /**
     * Set the text for this node
     * @param {String} prop - Where in the data to get the value for this text,
     * defaults to 'text'
     */
    text(prop = 'text') {
        this.innerText = prop
        return this
    }
    /**
     * Close this tag level
     */
    close() {
        if (this.parent) {
            return this.parent
        }
        return this
    }
    /**
     * Go all the way back to the first tag that was opened
     */
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
    /**
     * Now you are done adding tags and attributes etc
     */
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
    /**
     * Call render now as many times as you want with data that matches what
     * you described previously
     * @param {Object} props - Data shaped as described by your calls to tag and attribute
     */
    render(opts) {
        if (!this.template) { throw 'No template compiled'}
        // allows generation of th and other tags that normally vanish out of the fragment
        return document.createRange()
            .createContextualFragment(`<template>${this.template(opts)}</template>`)
            .children[0].content.children[0]
    }

}

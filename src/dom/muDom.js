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
        let css =`.muHide { display: none} .muSlow { transition: 1s; }}`
        if (document.readyState != 'interactive') {
            document.addEventListener('DOMContentLoaded',()=>{
                muCss(css,'muDom')
            })
        } else {
            muCss(css,'muDom')
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

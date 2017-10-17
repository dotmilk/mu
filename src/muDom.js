function muDom(s,c) {
    if (!window.muDomInjected) {
        muCss('.muHide { display: none} .muSlow { transition: 1s; } .muRed { background-color: #FF0000;}','muDom')
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
            if (value) {
                this.elements.forEach(element => {
                    element.value = value
                })
                return this
            }
            if (this.count == 1) {
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
        siblings(fn){
            let siblings = []
            let el = this.elements[0].parentNode.firstChild
            do { if (el != this.elements[0] && el.nodeType != 3 ){ siblings.push(el)} } while (el = el.nextSibling)
            return muDom(siblings,this.context)
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

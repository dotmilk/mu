export { MuTagen }
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

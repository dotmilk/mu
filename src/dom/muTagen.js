/**
 * Programmatically create some html fragment template
 * @example
 * let frag = new MuTagen().tag('div').class().tag('p').text('aParagraph').compile()
 * frag.render({class: 'foo',aParagraph: 'Some text for the paragraph'})
 * // returns
 * // <div class="foo"><p>Some text for the paragraph</p></div>
 */
class MuTagen {
    /**
     * Get the party started
     * @example
     * let frag = new MuTagen()
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
     */
    tag(name,prefix) {
        /*
          If there is already a tag in 'this' make a new instance and pass it intended tag
         */
        if (this.elem) {
            let childPrefix
            if (this.fullPrefix.length) {
                childPrefix = [].concat(this.fullPrefix)
                childPrefix.push(prefix)
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
     * // key with the same name as that attribute, or you can specify
     */
    attribute(name,prop = name) {
        if (!(name in this.attributes)) {
            // todo maybe filter out undefined things
            this.attributes.push([name,prop])
        }
        return this
    }

    class(prop = 'class') {
        return this.attribute('class',prop)
    }

    id(prop = 'id') {
        return this.attributes('id',prop)
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
        //console.log('attr',attributes)
        childrenString = childTmp.join('')
        if (this.innerText) {
            this.compiledString = this.elem.open +
                attributes +
                this.elem.afterOpen +
                '${opts['+ `'${this.innerText}'` +']}' +
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
        // allows generation of th and other tags that normally vanish out of the fragment
        return document.createRange()
            .createContextualFragment(`<template>${this.template(opts)}</template>`)
            .children[0].content.children[0]
    }

}

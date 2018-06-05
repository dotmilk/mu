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

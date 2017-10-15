// document.createRange().createContextualFragment(string)
let muTagen = function muTagen() {
    let tag
    let closeTag
    let tagFirstClose = '>'
    let attributes = []
    let propPre = '${props.'
    let propPost = '}'
    let tExist = 'Tag already started'
    let tNotExist = 'Tag doesn\'t exist'
    let template

    function interpolate(params) {
        console.log(names,vals,`return \`${template}\``)
        return new Function(...names, `return \`${template}\``)
    }

    function compileAttributes() {
        let out = ''
        for (let attr of attributes) {
            out += ` ${attr}="`
            out += '${'
            out += `opts.${attr}`
            out += '}"'
        }
        return out
    }

    return {
        div(){
            if (tag) { throw tExist }
            tag = '<div'
            closeTag = '</div>'
            return this
        },
        attribute(name){
            attributes.push(name)
            return this
        },
        class(){
            return this.attribute('class')
        },
        dump(){
            console.log('dump',attributes)
        },
        compile(){
            let string
            if (!tag) { throw tNotExist}
            string = tag + compileAttributes()  + tagFirstClose
            template = new Function('opts',`return \`${string}\``)
            return this
        },
        render(opts) {
            if (!template) { throw 'No template compiled'}
            return document.createRange().createContextualFragment(template(opts))
        }

    }

}

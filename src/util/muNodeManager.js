class MuNodeManager {
    constructor(){
        this.nodes = {}
    }
    add(name,selector,context,clone){
        let node = muDom(selector,context).elements[0]
        if (clone) {
            this.nodes[name] = node.cloneNode(true)
        } else {
            this.nodes[name] = node
        }

        return node
    }
    addAndRemove(name,selector,context=document){
        let node = this.add(name,selector,context,true)
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

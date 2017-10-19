/**
 * Name, store and possibly clone / possibly remove arbitrary nodes of
 * your document for later retrieval. Pretty fancy right?
 */
class MuNodeManager {
    /**
     * Nothing to see here, pretty standard instance constructor...
     */
    constructor(){
        this.nodes = {}
    }
    /**
     * This is the heavy lifter here
     * @param {String} name - The name you want to store it under
     * @param {String} selector - Where to find your node
     * @param {SomethingDomish?} context - Defaults to document
     * @param {Boolean?} clone - Clone it or just store reference, defaults to true
     */
    add(name,selector,context=document,clone=true){
        let node = muDom(selector,context).elements[0]
        if (clone) {
            this.nodes[name] = node.cloneNode(true)
        } else {
            this.nodes[name] = node
        }
        return node
    }
    /**
     * Like {@link MuNodeManager#add} but it removes the node from the document after jacking it
     */
    addAndRemove(name,selector,context,clone){
        let node = this.add(name,selector,context,clone)
        node.parentNode.removeChild(node)
        return node
    }
    /**
     * Get a clone of something you stored earlier!!
     */
    getCloned(name){
        return this.nodes[name].cloneNode(true)
    }
    /**
     * Get a direct reference to something you stored earlier!
     * Not as exciting as {@link MuNodeManager#getCloned} so only one !
     */
    get(name){
        return this.nodes[name]
    }
    /**
     * Maybe you know what you want now, but later you won't,
     * but you'll like, still want it, later, when you want it.
     * @param {String} name - Name of the node you want
     * @param {Boolean} cloned - Defaults to true, if false gets raw node reference, not clone...
     */
    getCurried(name, cloned = true) {
        return ()=>{
            return cloned ? this.getCloned(name) : this.get(name)
        }
    }
}

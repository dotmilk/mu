/**
 * A collection emitting events on certain actions
 * @extends MuEvent
 */
class MuCollection extends MuEvent {
    /**
     * Create a new collection, in the future will optionally wrap items in a model.
     * for exceptionally large collections, use flat, so as to not add each 'item' to
     * this.collection[item.idField] = item. Can be very slow. Flat instead stores
     * this.collection as an array, no removal of elements, just reset.
     * @param {Object} options - Options for the collection
     * @param {Boolean} options.flat - Store as array, not k:v
     * @param {String} options.idField - The field to use as k when not flat, defaults to 'id'
     * @param {MuObservableObject} options.model - Future: non instantiated model to wrap each item
     * @param {Function} options.comparator - Some fn to aid in sorting
     * @param {Array} options.content - Initial items in collection, will fire add events,
     * but you will be unable to listen
     * @example
     * myCollection = new MuCollection({idField: 'customId'})
     * // or
     * myCollection = new MuCollection({flat: true})
     * myCollection.on('add',someFn)
     * myCollection.add([{foo: 'a'},{foo: 'b'}])
     * // someFn called twice with item, or
     * myCollection.add([{foo: 'a'},{foo: 'b'}],true)
     * // no add event fired, instead 'bulk' event fired after all items added
     */
    constructor({flat,idField,model,comparator,contents}){
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
    /**
     * Convenience function for add(stuff,true)
     * @param {(Array | SingleItem)} items - Stuff to add
     */
    addBulk(items) {
        this.add(items,true)
    }
    /**
     * Perhaps the most useful method on a collection, adding things to the collection
     * @param {(Array | SingleItem)} items - Stuff to add
     * @param {Boolean} bulk - Skip emitting add for each item, emit 'bulk'
     */
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
                //item = new this.model(item)
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
    /**
     * Sort the collection, may or may not work, haven't test it lol
     * @param {Function} comparator - Some function that sorts things
     * @param {Boolean} reverse - Sorting direction
     */
    sort(comparator = this.comparator, reverse = false) {
        reverse ? this.idx.sort((a,b)=>{return comparator(a,b) * -1}) : this.idx.sort(comparator)
        this.emit('sort',this.idx.slice())
    }
    /**
     * Removes item / items from collection, throws an error if collection is flat
     * @param {(Array | SingleItem)} idxs - A single index/key or array of them
     */
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
    /**
     * Get Item from collection by idField or by index if flat
     * @param {(String | Number)} id - A string key for idField lookup or number for flat index
     */
    get(id) {
        //console.log('get',this)
        return this.collection[id]
    }
    /**
     * Do something with each thing in this collection...duh
     * @param {Function} fn - A thing to do to each item in this collection
     */
    each(fn) {
        if (this.flat) {
            this.collection.forEach(fn)
        } else {
            for (let idx of this.idx) {
                fn.call(this,this.collection[idx],idx)
            }
        }

    }
    /**
     * Reset internal state to a collection with no items or with items passed in
     * @param {(Array | SingleItem)} items - Stuff to add to newly cleared collection
     */
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
/**
 * Uses {@link MuPaginator} to paginate a {@link MuCollection}, why would you want to do this?
 * I dunno, you're the one using it.
 * @extends Mucollection
 */
class MuPagedCollection extends MuCollection {
    /**
     * This is where shit gets real, ok that might be an overstatement. Basically this provides
     * an api for {@link MuPaginator} and special events pertaining to a paged collection
     * @param {Object} options - Options for the collection
     * @param {Boolean} options.flat - Store as array, not k:v
     * @param {String} options.idField - The field to use as k when not flat, defaults to 'id'
     * @param {MuObservableObject} options.model - Future: non instantiated model to wrap each item
     * @param {Function} options.comparator - Some fn to aid in sorting
     * @param {Array} options.content - Initial items in collection, will fire add events,
     * but you will be unable to listen
     */
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
    /**
     * Sets the number of items per 'page'
     * @param {Integer} n - Number of items per page
     */
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
        //console.log('page is ',page,this.paginator)
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

import { MuEvent } from '../util/muEvent.js'
export { MuCollection, MuPagedCollection }
class MuCollection extends MuEvent {
    constructor({flat,idField,model,comparator,contents} = {}){
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
    addBulk(items) {
        this.add(items,true)
    }
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
    sort(comparator = this.comparator, reverse = false) {
        reverse ? this.idx.sort((a,b)=>{return comparator(a,b) * -1}) : this.idx.sort(comparator)
        this.emit('sort',this.idx.slice())
    }
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
    get(id) {
        return this.collection[id]
    }
    each(fn) {
        if (this.flat) {
            this.collection.forEach(fn)
        } else {
            for (let idx of this.idx) {
                fn.call(this,this.collection[idx],idx)
            }
        }
    }
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
class MuPagedCollection extends MuCollection {
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

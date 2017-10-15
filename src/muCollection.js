class MuCollection extends MuEvent {
    constructor(opts = {}){
        super()
        this.collection = {}
        this.idx = []
        this.idField = opts.idField || 'id'
        this.model = opts.model || MuObservableObject({})
        this.comparator = opts.comparator || function (a,b)  {
            if (typeof a === 'string') {
                return a < b ? -1 : 1 }
            else {
                return a - b
            }
        }

        if (opts.contents) {
            this.add(opts.contents)
        }
    }

    add(items) {
        if (!Array.isArray(items)) { items = [items] }
        for (let item of items) {
            //item = new this.model(item)
            let old = this.collection[item[this.idField]]
            this.collection[item[this.idField]] = item
            if (old) {
                this.emit('replace',item[this.idField])
                this.collection[item[this.idField]] = item
            } else {
                this.idx.push(item[this.idField])
                this.emit('add',item[this.idField])
            }
        }
    }

    sort(comparator = this.comparator, reverse = false) {
        reverse ? this.idx.sort((a,b)=>{return comparator(a,b) * -1}) : this.idx.sort(comparator)

        this.emit('sort',this.idx.slice())
    }

    remove(idxs) {
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
        for (let idx of this.idx) {
            fn.call(this,this.collection[idx],idx)
        }
    }

    reset(items = []){
        let old = Object.assign({},this.collection)
        this.remove(this.idx.slice())
        this.emit('reset',old)
        this.add(items)
    }
}

class MuPagedCollection extends MuCollection {
    constructor(opts){
        super(opts)
        let metaHandler = (event,data) => {
            this.emit('restructure',data)
        }
        this.paginated = true
        this.on('add',this.changeHandler)
        this.on('remove',this.changeHandler)
        this.paginator = new MuPaginator({pageSize: opts.pageSize || 3, data: this.idx})
    }

    changeHandler(event,data){
        console.log('change')
        this.paginator.paginate = undefined
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

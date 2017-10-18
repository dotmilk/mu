/**
 * Generic view wrapper for a collection
 * @extends MuWrapperView
 */
class MuCollectionView extends MuWrapperView{
    constructor({collection,el,view,parent,viewOptions={}}) {
        super({el,parent})
        this.collection = collection
        this.rootWrapped = muDom(el)
        this.view = view
        this.viewOptions = viewOptions
        Object.assign(this.viewOptions,{autoRender: true})
        this.collectionViews = {}
        this.modelWrapper = MuObservableObject({})
    }

    init(){
        console.log(this)
        this.collection.on('add',(idx)=>{
            console.log('added')
            let item = this.collection.get(idx)
            let view = this.view(Object.assign({
                model: item.on ? item : new this.modelWrapper(item)},
                                               this.viewOptions))

            this.collectionViews[idx] = view
            this.el.appendChild(view.el)
        })
        this.collection.on('remove',(idx)=>{
            let view = this.collectionViews[idx]
            view.remove()
            delete this.collectionViews[idx]
        })
        this.collection.on('sort',(newOrder)=>{
            for (let viewIdx of newOrder ) {
                let view = this.collectionViews[viewIdx]
                view.remove()
                this.el.appendChild(view.el)
            }
        })
    }

    render(){}
    remove(){
        if (this.el.parentNode) {
            this.el.parentNode.removeChild(this.el)
        }
    }
}
/**
 * View wrapper for a paginated collection
 * @extends MuCollectionView
 */
class MuPaginatedCollectionView extends MuCollectionView{
    constructor(opts){
        super(opts)
        console.log('right view')

        this.lookup = opts.lookup
    }
    init(){
        let handler = (page)=>{
            this.rootWrapped.clear()
            page.forEach((idx)=>{
                let item = this.collection.get(idx)
                item = this.lookup ? this.lookup(item) : item
                let view = this.view(Object.assign({model: item.on ? item :
                                                    new this.modelWrapper(item)},this.viewOptions))
                this.collectionViews[idx] = view
                this.el.appendChild(view.el)
            })

        }
        this.collection.on('newPage',handler)
        this.collection.on('restructure',handler)
    }
    render(){}
    remove(){
        super.remove()
    }
}

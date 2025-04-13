import { MuObservableObject } from './muObservableObject'
import { MuEvent } from '../util'
import { muDom } from '../dom'

/**
 * Abstract class for wrapping more complex constructs.
 * @extends MuEvent
 */
export class MuWrapperView extends MuEvent{
    /**
     * Should only be called by super in extending class
     * @param {Object} options - References to parent and root el
     * @param options.el - The node this view manipulates
     * @param options.parent - The view rendering this
     */
    constructor({el,parent}) {
        super()
        this.el = el
        this.rootWrapped = muDom(el)
        this.parent = parent
    }
    /** Stub function, extending class may implement*/
    init(){}
    /** Stub function, extending class may implement*/
    render(){}
    /** Stub function, extending class must implement
     * @abstract
     */
    remove(){ throw 'Remove not overridden'}
}

/**
 * Generic view wrapper for a collection
 * @extends MuWrapperView
 */
export class MuCollectionView extends MuWrapperView {
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
        this.collection.on('add',(idx)=>{
            let item = this.collection.get(idx)
            let view = this.view(Object.assign({
                model: item.on ? item : new this.modelWrapper(item)},
                                               this.viewOptions))
            this.collectionViews[idx] = view
            if (this.currentMask) {
                if (this.currentMask(view.model)){
                    this.el.appendChild(view.el)
                }
            } else {
                this.el.appendChild(view.el)
            }

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
                if (this.currentMask) {
                    if (this.currentMask(view.model)){
                        this.el.appendChild(view.el)
                    }
                } else {
                    this.el.appendChild(view.el)
                }
            }
        })
        this.collection.on('mask',(fn)=>{
            let idxs = this.collection.flat ? this.collection.collection : this.collection.idx
            for (let viewIdx of idxs) {
                let view = this.collectionViews[viewIdx]
                view.remove()
                if (!this.currentMask || (this.currentMask && this.currentMask(view.model))) {
                    this.el.appendChild(view.el)
                }
            }
        })
    }

    mask(fn){
        this.currentMask = fn
        this.collection.emit('mask')
    }

    remask(){
        this.collection.emit('mask')
    }

    unmask(){
        this.mask(undefined)
    }

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
export class MuPaginatedCollectionView extends MuCollectionView {
    constructor(opts){
        super(opts)
        this.lookup = opts.lookup
    }
    init(){
        let handler = (page)=>{
            this.rootWrapped.clear()
            page.forEach((idx)=>{

                let item = this.collection.flat ? idx : this.collection.get(idx)
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
}

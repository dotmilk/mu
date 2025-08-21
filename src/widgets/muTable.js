import { MuEvent } from '../util'
import { MuObservableObject, muView } from '../core'
import { muDom, MuTagen } from '../dom'
export class MuTable extends MuEvent{
    constructor(config){
        super()
        this.cfg = config = Object.assign(this.defaults(),config)

        let tableMetaModelConstructor = MuObservableObject({
            props: ['headers']
        })

        this.tableMetaModel = new tableMetaModelConstructor({
            headerKeys: config.headerKeys

        })

        let viewConstructor = muView({
            template: this.tableTemplate(),
            references: {
                first: `.${this.cfg.tableCfg.controlClass} button.first`,
                previous: `.${this.cfg.tableCfg.controlClass} button.previous`,
                next: `.${this.cfg.tableCfg.controlClass} button.next`,
                last: `.${this.cfg.tableCfg.controlClass} button.last`,
                pageCount: `.${this.cfg.tableCfg.controlClass} input.pagerInput`
            },
            bindings: {
                headerKeys: {
                    selector: `.${this.cfg.tableCfg.tableHeaderClass}`,
                    type: 'html',
                    template: this.headerTemplate()
                }
            },
            events: {
                [`click .${this.cfg.tableCfg.controlClass} button.first`]: function (e){
                    config.rows.firstPage()
                    this.pageCount.value(config.rows.currentPageNumber())
                },
                [`click .${this.cfg.tableCfg.controlClass} button.previous`]: function (e){
                    config.rows.previousPage()
                    this.pageCount.value(config.rows.currentPageNumber())
                },
                [`click .${this.cfg.tableCfg.controlClass} button.next`]: function (e){
                    config.rows.nextPage()
                    this.pageCount.value(config.rows.currentPageNumber())
                },
                [`click .${this.cfg.tableCfg.controlClass} button.last`]: function (e){
                    config.rows.lastPage()
                    this.pageCount.value(config.rows.currentPageNumber())
                },
                [`click .${this.cfg.tableCfg.tableClass} tbody td`]: (e)=>{
                    if (this.cfg.markSelection) {
                        muDom(e.target.parentNode).addClass('selected')
                            .siblings().removeClass('selected')
                    }
                    this.emit('selection',e.target.parentNode.getAttribute('muid'))
                },
                [`change .${this.cfg.tableCfg.controlClass} input.pagerInput`]: function(e){
                    if (e.target.value > config.rows.maxPage()) {
                        e.target.value = config.rows.maxPage()
                    } else if ( e.target.value < 1) {
                        e.target.value = 1
                    }
                    config.rows.getPage(e.target.value)
                },
                [`change .${this.cfg.tableCfg.controlClass} input.perPageInput`]: function(e){
                    if (e.target.value < 1) {
                        e.target.value = 1
                    }

                    if (config.rows.getPageSize != e.target.value) {
                        config.rows.setPageSize(e.target.value)
                        config.rows.currentPage()
                        this.pageCount.value(config.rows.currentPageNumber())


                    }
                }

            }
        })

        this.view = viewConstructor({model: this.tableMetaModel})

        let rowCollectionView = muView({
            autoRender: true,
            template: this.rowTemplate(),
            bindings: {
                '*': {
                    action: {selector: '',
                             type: 'html',
                             template: this.cellTemplate()
                            },
                    model: this.tableMetaModel,
                    prop: 'headerKeys',
                    name: 'all'
                }
            }
        })

        this.view.addCollection({
            view: rowCollectionView,
            collection: config.rows,
            target: 'tbody',
            lookup: config.lookup
        })

        muDom(`.${this.cfg.tableCfg.controlClass} input.pagerInput`,this.view.el)
            .value(config.rows.currentPageNumber())
        muDom(`.${this.cfg.tableCfg.controlClass} input.perPageInput`,this.view.el)
            .value(config.rows.getPageSize())
        if (this.cfg.fixedPageSize) {
            muDom(`.${this.cfg.tableCfg.controlClass} input.perPageInput`,this.view.el).toggle()
        }
        this.view.render()
        this.el = this.view.el
        this.paginatorControls = this.view.subViews[0].collection
    }

    tableTemplate(){
        return ()=>{
            return new MuTagen()
                .tag('section').class('wrapperClass')
                .tag('header').class('controlClass')
                .tag('button').class('firstClass').text('firstText').close()
                .tag('button').class('previousClass').text('previousText').close()
                .tag('input').class('pagerInputClass').attribute('type','inputType').close()
                //.tag('div').class('pagerInfoClass').close()
                .tag('button').class('nextClass').text('nextText').close()
                .tag('button').class('lastClass').text('lastText').close()
                .tag('input').class('perPageClass').attribute('type','inputType').close()
                .tag('div').class('perPageInfoClass').close()
                .close()
                .tag('table').class('tableClass')
                .tag('thead')
                .tag('tr').class('tableHeaderClass').close().close()
                .tag('tbody')
                .compile()
                .render(this.cfg.tableCfg)

        }
    }

    headerTemplate(){
        return (header)=>{
            return new MuTagen()
                .tag('th').text()
                .compile()
                .render({text: this.cfg.headers[header]})
        }
    }

    rowTemplate(){
        let field = this.cfg.rows.idField
        return function (foo){
            return new MuTagen()
                .tag('tr').attribute('muId','id')
                .compile()
                .render({id: this.model[field]})
        }
    }

    cellTemplate(){
        return (content)=>{
            return new MuTagen()
                .tag('td').text()
                .compile()
                .render({text: content || 'N/A'})
        }
    }

    defaults(){
        return {
            tableCfg: {
                wrapperClass: 'muTable',
                controlClass: 'muTableControls',
                firstClass: 'first',
                firstText: '<<',
                previousClass: 'previous',
                previousText: '<',
                pagerInputClass: 'pagerInput',
                inputType: 'number',
                pagerInfoClass: 'pagerInfo',
                nextClass: 'next',
                nextText: '>',
                lastClass: 'last',
                lastText: '>>',
                perPageClass: 'perPageInput',
                perPageInfoClass: 'perPageInfo',
                tableClass: 'table',
                tableHeaderClass: 'tableHeaders'
            }
        }
    }
}

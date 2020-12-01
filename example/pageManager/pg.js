import { MuPage } from "../js/mu.js"
// classes have to be manually put on 'window' object for the
// page manager magic to dynamically call them
window.PageOne = class PageOne extends MuPage {
    onLoad(page){
        // onLoad is only ever called once
        let button = muDom('button',page).on('click',()=>{
            this.pageManager.load('pageTwo')
        })
    }
    onShow(page){
        // this is called each time page is revisited after onLoad
        console.log('shown',page)
    }
}

window.PageTwo = class PageTwo extends MuPage {
    onLoad(){
        let button = muDom('button').on('click',()=>{
            this.pageManager.load('pageOne')
        })
    }
    onHide(){
        // this is called when this page is being swapped out
        console.log('page two going away')
    }
}

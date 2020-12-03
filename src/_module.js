// function muStrap() {
//     let link = document.createElement('link')
//     link.rel = 'stylesheet'
//     link.type = 'text/css'
//     link.href = '/styles.css'
//     muDom('head').append(link)
// }

// let link = document.createElement('link')
// link.rel = 'stylesheet'
// link.type = 'text/css'
// link.href = '/styles.css'
// muDom('head').append(link)
function muInjectCss() {
    muCss(muCssString,'muCss')
}

export { muInjectCss,
         muCss,
         muDom,
         MuTagen,
         MuDialogue,
         MuDialogueManager,
         MuManager,
         MuPage,
         MuPageManager,
         MuState,
         MuStateMachine,
         MuCollection,
         MuPagedCollection,
         MuCollectionView,
         MuPaginatedCollectionView,
         MuWrapperView,
         MuView,
         muView,
         MuObservableObject,
         MuBroker,
         MuEvent,
         muMultiInherit,
         MuNodeManager,
         MuPaginator,
         MuSelects,
         MuTable,
         MuPubSub
       }

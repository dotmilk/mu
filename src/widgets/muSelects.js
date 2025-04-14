import { MuObservableObject, muView } from '../core'
import { muDom, MuTagen } from '../dom'

/**
 * A customizable dropdown/select UI component with enhanced functionality beyond native HTML select elements,
 * including search capabilities, multi-select options, and custom styling.
 * @class
 * @example
 * // Basic usage
 * const simpleSelect = new MuSelects({
 *     selectOptions: ['Option 1', 'Option 2', 'Option 3'],
 *     buttonText: 'Select an option',
 *     headerText: 'Choose an option'
 * });
 * 
 * // Multi-select with search
 * const multiSelect = new MuSelects({
 *     selectOptions: ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'],
 *     selected: ['Apple', 'Cherry'],
 *     multiple: true,
 *     search: true,
 *     buttonText: 'Select fruits',
 *     headerText: 'Choose fruits'
 * });
 * 
 * // With logic options
 * const logicSelect = new MuSelects({
 *     selectOptions: ['Red', 'Green', 'Blue'],
 *     logicOptions: ['AND', 'OR', 'NOT'],
 *     buttonText: 'Select colors',
 *     headerText: 'Choose colors'
 * });
 */
export class MuSelects {
    /**
     * Creates a new MuSelects component
     * @param {Object} config - Configuration options for the select component
     * @param {boolean} [config.search=false] - Enables search functionality within the dropdown
     * @param {boolean} [config.multiple=false] - Allows selection of multiple options
     * @param {string[]} [config.selectOptions=[]] - Array of options to display in the dropdown
     * @param {string[]} [config.selected=[]] - Array of pre-selected option values
     * @param {string} [config.buttonText='You need button text'] - Text displayed on the dropdown button
     * @param {string} [config.headerText='Choose wisely'] - Text displayed in the modal header
     * @param {string} [config.confirmButtonText='Ok'] - Text for the confirmation button
     * @param {string} [config.clearButtonText='Clear'] - Text for the clear button
     * @param {string[]} [config.logicOptions=[]] - Secondary options for additional filtering/logic
     * @param {string[]} [config.selectedLogic=[]] - Pre-selected logic options
     * @param {boolean} [config.noButton=false] - When true, removes the main button
     * @param {string} [config.wrapperClass='muSelectWrapper'] - CSS class for the wrapper element
     * @param {string} [config.modalClass='muModal'] - CSS class for the modal container
     * @param {string} [config.buttonClass='muSelectButton'] - CSS class for the dropdown button
     * @param {string} [config.noResultsClass='muNoResults muHide'] - CSS class for no results message
     * @param {string} [config.noResultsText='No results'] - Text displayed when search yields no results
     * @param {string} [config.searchClass='muSearch'] - CSS class for the search input container
     * @param {string} [config.mainClass='muModalMain'] - CSS class for the main options container
     * @param {string} [config.logicClass='muLogic'] - CSS class for the logic options container
     */
    constructor(config) {

        this.ensureOverlay()
        let overlay = this.overlay
        this.cfg = Object.assign(this.defaults(),config)

        let multiple = this.cfg.multiple
        let changeEventSring = this.changeEventString()
        let logicEventString = this.logicEventString()
        let changeHandler = this.changeHandler()
        let logicHandler = this.logicHandler()
        let buttonClickString = `click button.${this.cfg.buttonClass}`

        /**
         * @private
         * @function reselect
         * @description Reselects options based on the current model's selected values
         */
        let reselect = function () {
            this.model.selected.forEach((e)=>{
                this.options.find(`[muvalue="${e}"]`).setAttribute('selected','true')
            })
        }
        let selectOptions = `.${this.cfg.modalClass} .${this.cfg.mainClass} [selected="true"]`
        let selectLogic = `.${this.cfg.modalClass} .${this.cfg.logicClass} [selected="true"]`
        
        /**
         * @private
         * @type {Function}
         * @description View constructor function created by muView
         */
        let viewConstructor = muView({
            autoRender: true,
            template: this.viewTemplate(),
            events: {
                [changeEventSring]: changeHandler,
                [logicEventString]: logicHandler,
                [buttonClickString]: this.showModal,
                /**
                 * @private
                 * @event click-footer-first-child
                 * @description Clears all selected options
                 */
                'click footer :first-child': function(){
                    this.options.find(selectOptions).each((el)=>{
                        el.setAttribute('selected','false')
                    })
                    this.model.selected = []
                    this.model.confirmed = -this.model.confirmed
                },
                /**
                 * @private
                 * @event click-footer-last-child
                 * @description Confirms selections and closes the modal
                 */
                'click footer :last-child': function(){
                    let allSelected = this.options.find(selectOptions).map((ele)=>{
                        return ele.getAttribute('muvalue')
                    })
                    let logicSelected = this.logic.find(selectLogic).map((ele)=>{
                        return ele.getAttribute('muvalue')
                    })

                    if (JSON.stringify(this.model.selected) !== JSON.stringify(allSelected) ||
                        JSON.stringify(this.model.selectedLogic) !== JSON.stringify(logicSelected)) {
                        this.model.selected = allSelected
                        this.model.selectedLogic = logicSelected
                        /*
                          twiddle the number between 1 and -1
                          to fire change event on confirmation spo
                          anything listening outside can just bind to
                          this.model.on('change:confirmed') to get
                          selection confirmation
                        */
                        this.model.confirmed = -this.model.confirmed
                    }

                    this.modal.toggle('mu-modal-show')

                    overlay.toggle('mu-select-show')
                    if (this.model.selected.length) {
                        this.mainButton.addClass('hasSelection')
                        if (this.externalControl) {
                            this.externalControl.addClass('hasSelection')
                        }
                    } else {
                        this.mainButton.removeClass('hasSelection')
                        if (this.externalControl) {
                            this.externalControl.removeClass('hasSelection')
                        }
                    }
                },
                /**
                 * @private
                 * @event keyup-search-input
                 * @description Handles search input for filtering options
                 * @param {Event} e - DOM keyboard event
                 */
                'keyup .muSearch>input': function(e){
                    let search = e.target.value
                    if (search == '') {
                        this.options.find('.muNoResults').hide()
                        if (this.model.options.length == this.model.shownOptions.length) { return }
                        this.model.shownOptions = this.model.options.slice()
                        reselect.call(this)
                        return
                    }

                    let newShown = this.model.options.filter((val)=>{
                        return val.toLowerCase().indexOf(search.toLowerCase()) > -1
                    })

                    if (newShown.length) {
                        this.options.find('.muNoResults').hide()
                        this.model.shownOptions = newShown
                        reselect.call(this)
                    } else {
                        this.model.shownOptions = []
                        this.options.find('.muNoResults').show()
                    }
                }
            },
            references: {
                modal: `.${this.cfg.modalClass}`,
                options:  `.${this.cfg.modalClass} .${this.cfg.mainClass}`,
                logic: `.${this.cfg.modalClass} .${this.cfg.logicClass}`,
                mainButton: `.${this.cfg.buttonClass}`
            },
            bindings: {
                shownOptions: {
                    selector: `.${this.cfg.modalClass} .${this.cfg.mainClass}`,
                    type: 'html',
                    template: this.optionTemplate()
                },
                logicOptions: {
                    selector: `.${this.cfg.modalClass} .${this.cfg.logicClass}`,
                    type: 'html',
                    template: this.optionTemplate()
                }
            }

        })
        
        /**
         * @private
         * @type {Function}
         * @description Model constructor function created by MuObservableObject
         */
        let modelConstructor =  MuObservableObject({
            props: ['options','selected','shownOption','confirm','multiple']
        })
        
        /**
         * @public
         * @type {Object}
         * @description The observable model for this component
         */
        this.model = new modelConstructor({options: this.cfg.selectOptions || [],
                                           selected: this.cfg.selected || [],
                                           shownOptions: this.cfg.selectOptions.slice(),
                                           confirmed: 1,
                                           multiple: this.cfg.multiple,
                                           logicOptions: this.cfg.logicOptions || [],
                                           selectedLogic: this.cfg.selectedLogic || []})

        /**
         * @public
         * @type {Object}
         * @description The view for this component
         */
        this.view = viewConstructor({
            model: this.model
        })
        this.view.overlay = overlay
        this.modal = this.view.modal
        let quickRef = muDom(this.view.el)
        if (!this.cfg.search) {
            quickRef.find(`.${this.cfg.searchClass}`).hide()
        }
        if (!this.model.logicOptions.length) {
            quickRef.find(`.${this.cfg.logicClass}`).hide()
        }
        if (this.cfg.noButton) {
            quickRef.find(`button.${this.cfg.buttonClass}`).remove()
        }

        this.view.options.find('[muvalue]').each((ele)=>{
            if (this.model.selected.includes(ele.getAttribute('muvalue'))){
                ele.setAttribute('selected','true')
            } else {
                ele.setAttribute('selected','false')
            }
        })
    }

    /**
     * Creates the logic handler event function
     * @returns {Function} Event handler for logic option selection
     * @private
     */
    logicHandler(){
        return function(e) {
            let selected = e.target.getAttribute('selected')
            if (selected && selected == 'true') {
                e.target.setAttribute('selected','false')
            } else {
                e.target.setAttribute('selected','true')
            }
        }
    }

    /**
     * Creates the change handler event function
     * @returns {Function} Event handler for option selection changes
     * @private
     */
    changeHandler(){
        return function (e) {
            let selected = e.target.getAttribute('selected')
            if (this.model.multiple) {
                if (selected && selected == 'true') {
                    e.target.setAttribute('selected','false')
                } else {
                    e.target.setAttribute('selected','true')
                }
                //this.model.selected = [...this.model.selected,e.target.getAttribute('muvalue')]
            } else {
                if (selected && selected == 'true') {
                    e.target.setAttribute('selected','false')
                    //this.model.selected = []
                    return
                } else {
                    this.options.find('[selected="true"]').each((ele)=>{
                        ele.setAttribute('selected','false')
                    })
                    e.target.setAttribute('selected','true')
                    //this.model.selected = [e.target.getAttribute('muvalue')]
                }

            }
        }
    }

    /**
     * Registers an external DOM element that can trigger the dropdown
     * @param {HTMLElement|muDom} control - DOM element or muDom instance to use as trigger
     * @public
     * @example
     * const button = document.getElementById('custom-button');
     * selectComponent.registerExternalControl(button);
     */
    registerExternalControl(control) {
        this.externalControl = this.view.externalControl = muDom(control)
        this.externalControl.on('click',()=>{
            this.showModal()
        })
        if (this.model.selected.length) {
            control.addClass('hasSelection')
        }
    }

    /**
     * Programmatically shows the selection modal
     * @public
     * @example
     * selectComponent.showModal();
     */
    showModal(){
        this.modal.toggle('mu-modal-show')
        this.overlay.toggle('mu-select-show')
    }

    /**
     * Creates a template function for rendering individual options
     * @returns {Function} Template function that renders options
     * @private
     */
    optionTemplate(){
        return (item)=>{
            return new MuTagen()
                .tag('div').attribute('muvalue').class().text()
                .tag('span').class('decoration')
                .compile()
                .render({muvalue: item,
                         text: item,
                         class: 'muOption',
                         decoration: 'muCircle'})
        }
    }

    /**
     * Creates a template function for rendering the entire view
     * @returns {Function} Template function that renders the complete component
     * @private
     */
    viewTemplate(){
        return ()=>{
            return new MuTagen().tag('section').class('wrapperClass')
                .tag('button').class('buttonClass').text('buttonText').close()
                .tag('section').class('modalClass')
                .tag('header').text('headerText').close()
                .tag('div').class('logicClass').close()
                .tag('div').class('searchClass')
                .tag('input').attribute('type','inputType').close().close()
                .tag('div').class('noResultsClass').text('noResultsText').close()
                .tag('section').class('mainClass').close()
                .tag('footer')
                .tag('button').text('clearButtonText').close()
                .tag('button').text('confirmButtonText').close()
                .compile()
                .render(this.cfg)
        }
    }

    /**
     * Creates default configuration values for the component
     * @returns {Object} Default configuration object
     * @private
     */
    defaults(){
        return {
            search: false,
            noResults: 'No Results',
            multiple: false,
            multipleConfirmTxt: "OK",
            wrapperClass: 'muSelectWrapper',
            modalClass: 'muModal',
            buttonClass: 'muSelectButton',
            buttonText: 'You need button text',
            confirmButtonText: 'Ok',
            clearButtonText: 'Clear',
            headerText: 'Choose wisely',
            tagClass: 'muSelectTag',
            noResultsClass: 'muNoResults muHide',
            noResultsText: 'No results',
            searchClass: 'muSearch',
            inputType: 'text',
            mainClass: 'muModalMain',
            logicClass: 'muLogic'
        }
    }

    /**
     * Ensures that the modal overlay exists in the DOM
     * @private
     */
    ensureOverlay(){
        let overlay = muDom('.mu-select-overlay')
        if (overlay.count == 0) {
            let elem = new MuTagen()
                .tag('div')
                .class()
                .compile()
                .render({class: 'mu-select-overlay'})
            muDom('body').prepend(elem)
            overlay = muDom('.mu-select-overlay')
        }
        this.overlay = overlay
    }

    /**
     * Creates the event selector string for option change events
     * @returns {string} Event selector string
     * @private
     */
    changeEventString(){
        return `click .${this.cfg.mainClass} .muOption, .${this.cfg.mainClass} .muOption *`
    }

    /**
     * Creates the event selector string for logic option events
     * @returns {string} Event selector string
     * @private
     */
    logicEventString(){
        return `click .${this.cfg.logicClass} .muOption, .${this.cfg.logicClass} .muOption *`
    }
}



// export class MuSelects {
//     constructor(config) {

//         this.ensureOverlay()
//         let overlay = this.overlay
//         this.cfg = Object.assign(this.defaults(),config)

//         let multiple = this.cfg.multiple
//         let changeEventSring = this.changeEventString()
//         let logicEventString = this.logicEventString()
//         let changeHandler = this.changeHandler()
//         let logicHandler = this.logicHandler()
//         let buttonClickString = `click button.${this.cfg.buttonClass}`

//         let reselect = function () {
//             this.model.selected.forEach((e)=>{
//                 this.options.find(`[muvalue="${e}"]`).setAttribute('selected','true')
//             })
//         }
//         let selectOptions = `.${this.cfg.modalClass} .${this.cfg.mainClass} [selected="true"]`
//         let selectLogic = `.${this.cfg.modalClass} .${this.cfg.logicClass} [selected="true"]`
//         let viewConstructor = muView({
//             autoRender: true,
//             template: this.viewTemplate(),
//             events: {
//                 [changeEventSring]: changeHandler,
//                 [logicEventString]: logicHandler,
//                 [buttonClickString]: this.showModal,
//                 'click footer :first-child': function(){
//                     this.options.find(selectOptions).each((el)=>{
//                         el.setAttribute('selected','false')
//                     })
//                     this.model.selected = []
//                     this.model.confirmed = -this.model.confirmed
//                 },
//                 'click footer :last-child': function(){
//                     let allSelected = this.options.find(selectOptions).map((ele)=>{
//                         return ele.getAttribute('muvalue')
//                     })
//                     let logicSelected = this.logic.find(selectLogic).map((ele)=>{
//                         return ele.getAttribute('muvalue')
//                     })

//                     if (JSON.stringify(this.model.selected) !== JSON.stringify(allSelected) ||
//                         JSON.stringify(this.model.selectedLogic) !== JSON.stringify(logicSelected)) {
//                         this.model.selected = allSelected
//                         this.model.selectedLogic = logicSelected
//                         /*
//                           twiddle the number between 1 and -1
//                           to fire change event on confirmation spo
//                           anything listening outside can just bind to
//                           this.model.on('change:confirmed') to get
//                           selection confirmation
//                         */
//                         this.model.confirmed = -this.model.confirmed
//                     }

//                     this.modal.toggle('mu-modal-show')

//                     overlay.toggle('mu-select-show')
//                     if (this.model.selected.length) {
//                         this.mainButton.addClass('hasSelection')
//                         if (this.externalControl) {
//                             this.externalControl.addClass('hasSelection')
//                         }
//                     } else {
//                         this.mainButton.removeClass('hasSelection')
//                         if (this.externalControl) {
//                             this.externalControl.removeClass('hasSelection')
//                         }
//                     }
//                 },
//                 'keyup .muSearch>input': function(e){
//                     let search = e.target.value
//                     if (search == '') {
//                         this.options.find('.muNoResults').hide()
//                         if (this.model.options.length == this.model.shownOptions.length) { return }
//                         this.model.shownOptions = this.model.options.slice()
//                         reselect.call(this)
//                         return
//                     }

//                     let newShown = this.model.options.filter((val)=>{
//                         return val.toLowerCase().indexOf(search.toLowerCase()) > -1
//                     })

//                     if (newShown.length) {
//                         this.options.find('.muNoResults').hide()
//                         this.model.shownOptions = newShown
//                         reselect.call(this)
//                     } else {
//                         this.model.shownOptions = []
//                         this.options.find('.muNoResults').show()
//                     }
//                 }
//             },
//             references: {
//                 modal: `.${this.cfg.modalClass}`,
//                 options:  `.${this.cfg.modalClass} .${this.cfg.mainClass}`,
//                 logic: `.${this.cfg.modalClass} .${this.cfg.logicClass}`,
//                 mainButton: `.${this.cfg.buttonClass}`
//             },
//             bindings: {
//                 shownOptions: {
//                     selector: `.${this.cfg.modalClass} .${this.cfg.mainClass}`,
//                     type: 'html',
//                     template: this.optionTemplate()
//                 },
//                 logicOptions: {
//                     selector: `.${this.cfg.modalClass} .${this.cfg.logicClass}`,
//                     type: 'html',
//                     template: this.optionTemplate()
//                 }
//             }

//         })
//         let modelConstructor =  MuObservableObject({
//             props: ['options','selected','shownOption','confirm','multiple']
//         })
//         this.model = new modelConstructor({options: this.cfg.selectOptions || [],
//                                            selected: this.cfg.selected || [],
//                                            shownOptions: this.cfg.selectOptions.slice(),
//                                            confirmed: 1,
//                                            multiple: this.cfg.multiple,
//                                            logicOptions: this.cfg.logicOptions || [],
//                                            selectedLogic: this.cfg.selectedLogic || []})

//         this.view = viewConstructor({
//             model: this.model
//         })
//         this.view.overlay = overlay
//         this.modal = this.view.modal
//         let quickRef = muDom(this.view.el)
//         if (!this.cfg.search) {
//             quickRef.find(`.${this.cfg.searchClass}`).hide()
//         }
//         if (!this.model.logicOptions.length) {
//             quickRef.find(`.${this.cfg.logicClass}`).hide()
//         }
//         if (this.cfg.noButton) {
//             quickRef.find(`button.${this.cfg.buttonClass}`).remove()
//         }

//         this.view.options.find('[muvalue]').each((ele)=>{
//             if (this.model.selected.includes(ele.getAttribute('muvalue'))){
//                 ele.setAttribute('selected','true')
//             } else {
//                 ele.setAttribute('selected','false')
//             }
//         })
//     }

//     logicHandler(){
//         return function(e) {
//             let selected = e.target.getAttribute('selected')
//             if (selected && selected == 'true') {
//                 e.target.setAttribute('selected','false')
//             } else {
//                 e.target.setAttribute('selected','true')
//             }
//         }
//     }

//     changeHandler(){
//         return function (e) {
//             let selected = e.target.getAttribute('selected')
//             if (this.model.multiple) {
//                 if (selected && selected == 'true') {
//                     e.target.setAttribute('selected','false')
//                 } else {
//                     e.target.setAttribute('selected','true')
//                 }
//                 //this.model.selected = [...this.model.selected,e.target.getAttribute('muvalue')]
//             } else {
//                 if (selected && selected == 'true') {
//                     e.target.setAttribute('selected','false')
//                     //this.model.selected = []
//                     return
//                 } else {
//                     this.options.find('[selected="true"]').each((ele)=>{
//                         ele.setAttribute('selected','false')
//                     })
//                     e.target.setAttribute('selected','true')
//                     //this.model.selected = [e.target.getAttribute('muvalue')]
//                 }

//             }
//         }
//     }

//     registerExternalControl(control) {
//         this.externalControl = this.view.externalControl = muDom(control)
//         this.externalControl.on('click',()=>{
//             this.showModal()
//         })
//         if (this.model.selected.length) {
//             control.addClass('hasSelection')
//         }
//     }

//     showModal(){
//         this.modal.toggle('mu-modal-show')
//         this.overlay.toggle('mu-select-show')
//     }

//     optionTemplate(){
//         return (item)=>{
//             return new MuTagen()
//                 .tag('div').attribute('muvalue').class().text()
//                 .tag('span').class('decoration')
//                 .compile()
//                 .render({muvalue: item,
//                          text: item,
//                          class: 'muOption',
//                          decoration: 'muCircle'})
//         }
//     }

//     viewTemplate(){
//         return ()=>{
//             return new MuTagen().tag('section').class('wrapperClass')
//                 .tag('button').class('buttonClass').text('buttonText').close()
//                 .tag('section').class('modalClass')
//                 .tag('header').text('headerText').close()
//                 .tag('div').class('logicClass').close()
//                 .tag('div').class('searchClass')
//                 .tag('input').attribute('type','inputType').close().close()
//                 .tag('div').class('noResultsClass').text('noResultsText').close()
//                 .tag('section').class('mainClass').close()
//                 .tag('footer')
//                 .tag('button').text('clearButtonText').close()
//                 .tag('button').text('confirmButtonText').close()
//                 .compile()
//                 .render(this.cfg)
//         }
//     }

//     defaults(){
//         return {
//             search: false,
//             noResults: 'No Results',
//             multiple: false,
//             multipleConfirmTxt: "OK",
//             wrapperClass: 'muSelectWrapper',
//             modalClass: 'muModal',
//             buttonClass: 'muSelectButton',
//             buttonText: 'You need button text',
//             confirmButtonText: 'Ok',
//             clearButtonText: 'Clear',
//             headerText: 'Choose wisely',
//             tagClass: 'muSelectTag',
//             noResultsClass: 'muNoResults muHide',
//             noResultsText: 'No results',
//             searchClass: 'muSearch',
//             inputType: 'text',
//             mainClass: 'muModalMain',
//             logicClass: 'muLogic'
//         }
//     }

//     ensureOverlay(){
//         let overlay = muDom('.mu-select-overlay')
//         if (overlay.count == 0) {
//             let elem = new MuTagen()
//                 .tag('div')
//                 .class()
//                 .compile()
//                 .render({class: 'mu-select-overlay'})
//             muDom('body').prepend(elem)
//             overlay = muDom('.mu-select-overlay')
//         }
//         this.overlay = overlay
//     }

//     changeEventString(){
//         return `click .${this.cfg.mainClass} .muOption, .${this.cfg.mainClass} .muOption *`
//     }

//     logicEventString(){
//         return `click .${this.cfg.logicClass} .muOption, .${this.cfg.logicClass} .muOption *`
//     }
// }

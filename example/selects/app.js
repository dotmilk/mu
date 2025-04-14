import { MuSelects, muInjectCss } from '../../src'
muInjectCss()

const simpleSelect = window.simpleSelect = new MuSelects({
    selectOptions: ['Option 1', 'Option 2', 'Option 3'],
    buttonText: 'Select an option',
    headerText: 'Choose an option'
})

document.querySelector('body').appendChild(simpleSelect.view.el)
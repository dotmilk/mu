import { MuSelects, muInjectCss } from '../../src'
muInjectCss()

const simpleSelect = window.simpleSelect = new MuSelects({
    selectOptions: ['Option 1', 'Option 2', 'Option 3'],
    buttonText: 'Select an option',
    headerText: 'Choose an option'
})

// Listening to events
simpleSelect.on('confirm', (selections) => {
    console.log('User confirmed these selections:', selections)
})

simpleSelect.on('clear', () => {
    console.log('User cleared all selections')
})

simpleSelect.on('change', (newSelections, oldSelections) => {
    console.log('Selections changed from', oldSelections, 'to', newSelections)
})

simpleSelect.on('cancel', () => {
    console.log('User canceled/closed without saving changes')
})

document.querySelector('body').appendChild(simpleSelect.view.el)
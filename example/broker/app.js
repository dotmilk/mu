import { muInjectCss, MuBroker, MuDialogueManager, MuDialogue, muDom } from '../../src';
import { OkCancelDialogue } from './dialogue.js'

muInjectCss();
window.muDom = muDom;
let broker = window.broker = new MuBroker({});
let dm = window.dm = new MuDialogueManager(broker);

// Register the dialogue
broker.publish('dialogueManager:register', {
    name: 'test', 
    constructor: OkCancelDialogue
}).then(() => {
    console.log('Dialogue registered successfully');
});

// Set up button click handler
muDom('.theButton').on('click', () => {
    // Promise-based approach
    broker.publish('dialogueManager:open', {
        name: "test",
        title: "Test Dialogue"
    }).then(result => {
        console.log('Dialogue closed with result:', result);
        
        // Display the result
        if (result) {
            if (result.canceled) {
                muDom('#result').html('<p>Dialogue was canceled</p>');
            } else {
                muDom('#result').html(`<p>You entered: ${result.inputValue}</p>`);
            }
        }
    });
});

// Alternative: listen for specific dialogue closure events
broker.subscribe('dialogue:test:closed', (result) => {
    console.log('Received dialogue closed event with data:', result);
});



// import { muInjectCss, MuBroker, MuDialogueManager, MuDialogue, muDom } from '../../src'
// muInjectCss()
// window.muDom = muDom
// let broker = window.broker = new MuBroker({})
// let dm = window.dm = new MuDialogueManager(broker)
// muDom('.theButton').on('click',() => {
//     dm.open({name: "test"},(v) => {
//         console.log('whenclosed')
//     })
// })

// class OkCancelDialogue extends MuDialogue {
//     constructor({ name }) {
//         super()
//         this.name = name
//     }
//     onBeforeShow() {
//         muDom(this.element).find('.okButton').on('click', () => { 
//             console.log('foo')
//             dm.close({name: 'test'},()=> { console.log('closed') })
//         })
//     }
//     onShow() {
//         console.log('shown')
//         muDom(this.element).append(muDom('<p>woop woop</p>').elements[0])
//     }
//     dialogueOutput() {
//         return muDom(this.element).find('.someInput').value()
//     }
//     render() {

//         this.element = muDom(`<div>${this.name}: <button class="okButton">ok</button><input class="someInput" type="text" placeholder="Enter text here"></div>`).elements[0]
//         return this.element
//     }
// }
// Promise.all([broker.publish('dialogueManager:register',{name: 'test', constructor: OkCancelDialogue })]).then(() => {
//     console.log('registered')
// })
// // broker.publish('dialogueManager:register', { name: 'test', constructor: OkCancelDialogue })
// // Promise.all([
// //       broker.publish('dialogueManager:register',{name: 'test', constructor: OkCancelDialogue }),
// //      broker.publish('dialogueManager:register',{name: 'foo', constructor: MyDialogue })])
// //         .then(()=>{
// //             console.log('both should be registered')
// //         })
// // broker.publish('dialogueManager:register',{name: 'test', constructor: OkCancelDialogue })
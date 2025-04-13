import { muInjectCss, MuBroker, MuDialogueManager, MuDialogue, muDom } from '../../src'
muInjectCss()
let broker = window.broker = new MuBroker({})
let dm = window.dm = new MuDialogueManager(broker)

class OkCancelDialogue extends MuDialogue {
    constructor({ name }) {
        super()
        this.name = name
    }
    onBeforeShow() {
        muDom(this.element).on('click', () => { 
            console.log('foo') 
            
        })
    }
    onShow() {
        muDom(this.element).append(muDom('<p>woop woop</p>').elements[0])
    }
    dialogueOutput() {
        return muDom(this.element).find('input').value()
    }
    render() {

        this.element = muDom(`<div>${this.name}<button >ok</button></div>`).elements[0]
        return this.element
    }
}
Promise.all([broker.publish('dialogueManager:register',{name: 'test', constructor: OkCancelDialogue })]).then(() => {
    console.log('registered')
})
// broker.publish('dialogueManager:register', { name: 'test', constructor: OkCancelDialogue })
// Promise.all([
//       broker.publish('dialogueManager:register',{name: 'test', constructor: OkCancelDialogue }),
//      broker.publish('dialogueManager:register',{name: 'foo', constructor: MyDialogue })])
//         .then(()=>{
//             console.log('both should be registered')
//         })
// broker.publish('dialogueManager:register',{name: 'test', constructor: OkCancelDialogue })
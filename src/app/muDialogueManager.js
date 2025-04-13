import { muDom, MuTagen } from '../dom'

/**
 * Abstract dialogue class for use in {@link MuDialogueManager}
 */
export class MuDialogue {
    constructor(){
    }
    onBeforeShow(){}
    onShow(){}
    onBeforeClose(){}
    onClose(){}
    // default is to return empty element
    render(){ return muDom("<div></div>").elements[0] }
}

export class MuDialogueManager {

    constructor(broker,div,id) {
        this.overlay = MuDialogueManager._ensureOverlay(div,id)
        this.overlayNative = this.overlay.elements[0]
        //this.overlay.hide()
        this.stack = []
        this.dialogues = {closed: new MuDialogue()} // new MuStateMachine({states:{closed: new MuDialogue()}})
        this.broker = broker
        //broker.subscribe('dialogueManager:register',(cfg,def)=>{this.register(cfg,def)})
        broker.subscribe('dialogueManager:register',this.register.bind(this))
        broker.subscribe('dialogueManager:open',this.open.bind(this))
        broker.subscribe('dialogueManager:close',this.close.bind(this))
    }
    currentDialogue(){
        return this.stack.slice(-1)
    }
    /**
     * {name: 'dialogueName', constructor: something new will be called on }
     */
    register(def,success) {
        this.dialogues[def.name] = def.constructor
        success()
    }
    /**
     *
     */
    open(cfg,success) {
        let dialogue = this.dialogues[cfg.name]
        if (!dialogue) { throw `No dialogue named ${cfg.name} exists` }
        dialogue = new dialogue(cfg)
        let current = {reference: dialogue, callback: success,
                       name: cfg.name, content: dialogue.render(cfg)}
        this.stack.push(current)
        this.overlay.append(current.content)
        dialogue.onBeforeShow(cfg)
        this.overlay.addClass('mu-overlay-show')
        //dialogue.onShow(Object.assign({},cfg,{beforeShowResult: result}))

    }

    close(cfg,success) {
        let current = this.stack.pop()
        if (current) {
            let dialogueOutput = current.reference.dialogueOutput(cfg)
            current.reference.onBeforeClose(cfg)
            this.overlayNative.removeChild(this.overlayNative.lastChild)
            current.reference.onClose(cfg)
            current.callback(dialogueOutput)
        }
        if (!this.stack.length) {
            this.overlay.removeClass('mu-overlay-show')
        }
        success()
    }


    static _ensureOverlay(div,id) {
        let overlay =  muDom( id || '#mu-overlay')
        //shouldn't ever be greater but we don't want to add more just in case
        if (overlay.count >= 1) { return overlay }

        if (!div) {
            div = new MuTagen()
                .tag('div')
                .id()
                .compile()
                .render({id: id || 'mu-overlay'})
        }
        muDom('body').prepend(div)
        return  muDom( id || '#mu-overlay')
    }

}

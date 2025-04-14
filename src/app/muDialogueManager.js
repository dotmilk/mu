import { muDom, MuTagen } from '../dom'


/**
 * Abstract dialogue class for use in {@link MuDialogueManager}
 */
export class MuDialogue {
    constructor(config = {}) {
        this.config = config;
        this.name = config.name;
        this.element = null;
    }
    
    /**
     * Called before the dialogue is shown
     * @returns {Promise|void}
     */
    onBeforeShow() {}
    
    /**
     * Called after the dialogue is shown
     * @returns {Promise|void}
     */
    onShow() {}
    
    /**
     * Called before the dialogue is closed
     * @returns {Promise|void}
     */
    onBeforeClose() {}
    
    /**
     * Called after the dialogue is closed
     * @returns {Promise|void}
     */
    onClose() {}
    
    /**
     * Standard method to get data from the dialogue
     * @returns {Object} Data from the dialogue
     */
    getData() {
        return {};
    }
    
    /**
     * Utility method for dialogues to close themselves
     * @param {MuBroker} broker - The broker instance
     * @param {Object} additionalData - Optional additional data to include
     */
    closeDialogue(broker, additionalData = {}) {
        broker.publish('dialogueManager:close', {
            name: this.name,
            data: {...this.getData(), ...additionalData}
        });
    }
    
    /**
     * Render the dialogue content
     * @returns {HTMLElement} The rendered dialogue element
     */
    render() { 
        this.element = muDom("<div></div>").elements[0];
        return this.element;
    }
}

export class MuDialogueManager {
    /**
     * @param {MuBroker} broker - The broker instance
     * @param {HTMLElement} [div] - Optional container element
     * @param {string} [id] - Optional ID for the overlay
     */
    constructor(broker, div, id) {
        this.broker = broker;
        this.overlay = MuDialogueManager._ensureOverlay(div, id);
        this.overlayNative = this.overlay.elements[0];
        this.stack = [];
        this.dialogues = {};
        
        broker.subscribe('dialogueManager:register', this._handleRegister.bind(this));
        broker.subscribe('dialogueManager:open', this._handleOpen.bind(this));
        broker.subscribe('dialogueManager:close', this._handleClose.bind(this));
    }
    
    /**
     * Get the current active dialogue
     * @returns {Object|null} The current dialogue or null
     */
    currentDialogue() {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
    }
    
    /**
     * Handler for dialogue registration
     * @private
     */
    _handleRegister(def, success) {
        this.dialogues[def.name] = def.constructor;
        success(true);
    }
    
    /**
     * Handler for opening dialogues via broker
     * @private
     */
    _handleOpen(cfg, success) {
        this.open(cfg)
            .then(result => success(result))
            .catch(err => {
                console.error("Error opening dialogue:", err);
                success(null);
            });
    }
    
    /**
     * Handler for closing dialogues via broker
     * @private
     */
    _handleClose(cfg, success) {
        this.close(cfg)
            .then(result => success(result))
            .catch(err => {
                console.error("Error closing dialogue:", err);
                success(null);
            });
    }
    
    /**
     * Register a dialogue type
     * @param {Object} def - Definition object with name and constructor
     * @returns {Promise} Promise that resolves when registration is complete
     */
    register(def) {
        return new Promise((resolve) => {
            this.dialogues[def.name] = def.constructor;
            resolve(true);
        });
    }
    
    /**
     * Open a dialogue
     * @param {Object} cfg - Configuration for the dialogue
     * @returns {Promise} Promise that resolves when dialogue is closed with result
     */
    open(cfg) {
        return new Promise((resolve, reject) => {
            try {
                const DialogueClass = this.dialogues[cfg.name];
                if (!DialogueClass) {
                    reject(new Error(`No dialogue named ${cfg.name} exists`));
                    return;
                }
                
                const dialogue = new DialogueClass(cfg);
                const current = {
                    reference: dialogue,
                    resolver: resolve,
                    name: cfg.name,
                    content: dialogue.render(cfg)
                };
                
                this.stack.push(current);
                this.overlay.append(current.content);
                
                Promise.resolve(dialogue.onBeforeShow(cfg))
                    .then(() => {
                        this.overlay.addClass('mu-overlay-show');
                        return dialogue.onShow(cfg);
                    })
                    .catch(error => {
                        console.error("Error in dialogue lifecycle:", error);
                        this.close(cfg).catch(console.error);
                        reject(error);
                    });
            } catch (e) {
                reject(e);
            }
        });
    }
    
    /**
     * Close a dialogue
     * @param {Object} cfg - Configuration including name and optional data
     * @returns {Promise} Promise that resolves when dialogue is closed
     */
    close(cfg = {}) {
        return new Promise((resolve, reject) => {
            try {
                const current = this.stack.pop();
                if (!current) {
                    resolve(null);
                    return;
                }
                
                const dialogue = current.reference;
                const dialogueData = cfg.data || dialogue.getData();
                
                Promise.resolve(dialogue.onBeforeClose(cfg))
                    .then(() => {
                        this.overlayNative.removeChild(this.overlayNative.lastChild);
                        return dialogue.onClose(cfg);
                    })
                    .then(() => {
                        if (!this.stack.length) {
                            this.overlay.removeClass('mu-overlay-show');
                        }
                        
                        // Publish the result for anyone interested
                        this.broker.publish(`dialogue:${current.name}:closed`, dialogueData);
                        
                        // Resolve both the promise and the original resolver
                        current.resolver(dialogueData);
                        resolve(dialogueData);
                    })
                    .catch(error => {
                        console.error("Error closing dialogue:", error);
                        reject(error);
                    });
            } catch (e) {
                reject(e);
            }
        });
    }
    
    /**
     * Ensure the overlay exists in the DOM
     * @private
     * @static
     */
    static _ensureOverlay(div, id) {
        let overlay = muDom(id || '#mu-overlay');
        if (overlay.count >= 1) { return overlay; }

        if (!div) {
            div = new MuTagen()
                .tag('div')
                .id()
                .compile()
                .render({id: id || 'mu-overlay'});
        }
        muDom('body').prepend(div);
        return muDom(id || '#mu-overlay');
    }
}



// /**
//  * Abstract dialogue class for use in {@link MuDialogueManager}
//  */
// export class MuDialogue {
//     constructor(){
//     }
//     onBeforeShow(){}
//     onShow(){}
//     onBeforeClose(){}
//     onClose(){}
//     // default is to return empty element
//     render(){ return muDom("<div></div>").elements[0] }
// }

// export class MuDialogueManager {

//     constructor(broker,div,id) {
//         this.overlay = MuDialogueManager._ensureOverlay(div,id)
//         this.overlayNative = this.overlay.elements[0]
//         //this.overlay.hide()
//         this.stack = []
//         this.dialogues = {closed: new MuDialogue()} // new MuStateMachine({states:{closed: new MuDialogue()}})
//         this.broker = broker
//         //broker.subscribe('dialogueManager:register',(cfg,def)=>{this.register(cfg,def)})
//         broker.subscribe('dialogueManager:register',this.register.bind(this))
//         broker.subscribe('dialogueManager:open',this.open.bind(this))
//         broker.subscribe('dialogueManager:close',this.close.bind(this))
//     }
//     currentDialogue(){
//         return this.stack.slice(-1)
//     }
//     /**
//      * {name: 'dialogueName', constructor: something new will be called on }
//      */
//     register(def,success) {
//         this.dialogues[def.name] = def.constructor
//         success()
//     }
//     /**
//      *
//      */
//     open(cfg,success = ()=>{}) {
//         let dialogue = this.dialogues[cfg.name]
//         if (!dialogue) { throw `No dialogue named ${cfg.name} exists` }
//         dialogue = new dialogue(cfg)
//         let current = {reference: dialogue, callback: success,
//                        name: cfg.name, content: dialogue.render(cfg)}
//         this.stack.push(current)
//         this.overlay.append(current.content)
//         dialogue.onBeforeShow(cfg) // async? get result
//         this.overlay.addClass('mu-overlay-show')
//         dialogue.onShow(cfg)
//         //dialogue.onShow(Object.assign({},cfg,{beforeShowResult: result}))

//     }

//     close(cfg,success) {
//         let current = this.stack.pop()
//         if (current) {
//             let dialogueOutput = current.reference.dialogueOutput(cfg)
//             current.reference.onBeforeClose(cfg)
//             this.overlayNative.removeChild(this.overlayNative.lastChild)
//             current.reference.onClose(cfg)
//             current.callback(dialogueOutput)
//         }
//         if (!this.stack.length) {
//             this.overlay.removeClass('mu-overlay-show')
//         }
//         success()
//     }


//     static _ensureOverlay(div,id) {
//         let overlay =  muDom( id || '#mu-overlay')
//         //shouldn't ever be greater but we don't want to add more just in case
//         if (overlay.count >= 1) { return overlay }

//         if (!div) {
//             div = new MuTagen()
//                 .tag('div')
//                 .id()
//                 .compile()
//                 .render({id: id || 'mu-overlay'})
//         }
//         muDom('body').prepend(div)
//         return  muDom( id || '#mu-overlay')
//     }

// }

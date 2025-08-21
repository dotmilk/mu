import { MuDialogue, muDom } from '../../src'

export class OkCancelDialogue extends MuDialogue {
    constructor(config) {
        super(config);
    }
    
    onBeforeShow() {
        muDom(this.element).find('.okButton').on('click', () => {
            // Using the standardized method to close
            this.closeDialogue(window.broker);
        });
        
        muDom(this.element).find('.cancelButton').on('click', () => {
            this.closeDialogue(window.broker, { canceled: true });
        });
    }
    
    onShow() {
        console.log('Dialogue shown:', this.name);
    }
    
    onBeforeClose() {
        console.log('Dialogue closing:', this.name);
    }
    
    onClose() {
        console.log('Dialogue closed:', this.name);
    }
    
    getData() {
        return {
            inputValue: muDom(this.element).find('.someInput').value(),
            timestamp: new Date().toISOString()
        };
    }
    
    render() {
        this.element = muDom(`<div class="dialogue-container"><h3>${this.name || 'Dialogue'}</h3><input class="someInput" type="text" placeholder="Enter text here"><div class="button-row"><button class="okButton">OK</button><button class="cancelButton">Cancel</button></div></div>`).elements[0];
        
        return this.element;
    }
}
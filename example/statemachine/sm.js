class GumballMachineAbstract extends MuState {
    insertCoin(){}
    refundCoin(){}
    dispense(){}
}

class GumballStartup extends GumballMachineAbstract {
    onEnter(){
        this.coinsNeededToPurchase = 2
        this.emit('startup',{coinsNeededToPurchase: this.coinsNeededToPurchase,
                             coinCount: 0})
        this.transition('noCoin')
    }
}

class GumballMachineNoCoin extends GumballMachineAbstract {
    insertCoin(){
        this.coinCount = this.coinCount || 1
        this.emit('coinInserted',this.coinCount)
        this.transition('withCoin')
    }
    refundCoin(){this.emit('noCoinInserted')}
    dispense(){this.emit('noCoinInserted')}
}

class GumballMachineWithCoin extends GumballMachineAbstract {
    insertCoin(){
        if (this.coinCount < this.coinsNeededToPurchase) {
            this.coinCount++
            this.emit('coinInserted',this.coinCount)
        }
    }
    refundCoin(){
        this.coinCount--
        this.emit('refundCoin',this.coinCount)
        if (!this.coinCount) {
            this.transition('noCoin')
        }
    }
    dispense(){
        if (this.coinsNeededToPurchase == this.coinCount) {
            this.coinCount = 0
            this.emit('dispense',this.coinCount)
            this.transition('noCoin')
        } else {
            this.emit('insufficientCoin')
        }
    }
}

let gumballMachine = new MuStateMachine({
    states:{
        noCoin: new GumballMachineNoCoin(),
        withCoin: new GumballMachineWithCoin(),
        startup: new GumballStartup()
    },
    start(){
        this.transition('startup')
    },
    insertCoin(){
        this.handle('insertCoin')
    },
    refundCoin(){
        this.handle('refundCoin')
    },
    dispense(){
        this.handle('dispense')
    }
})

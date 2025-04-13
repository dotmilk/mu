import { MuState, MuStateMachine } from '../../src'

class GumballMachineAbstract extends MuState {
    insertCoin(){}
    refundCoin(){}
    dispense(){}
    '*'(){
        console.log('omfg')
    }
}

class GumballStartup extends GumballMachineAbstract {
    onEnter(){
        // pass out some info
        this.emit('startup',{coinsNeededToPurchase: this.coinsNeededToPurchase,
                             coinCount: this.coinCount })
        // fancy start state depnding on if we started with coins
        if (this.coinCount >= 1 ) {
            this.transition('withCoin')
        } else {
            this.transition('noCoin')
        }
    }

}

class GumballMachineNoCoin extends GumballMachineAbstract {
    insertCoin(){
        this.coinCount = 1
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

/**
 * Could just as easily have not used classes, just plain js objects
 *
 * {states:{
 *   noCoin: {
 *     insertCoin(){
 *       //etc
 *     }
 *   }
 *  }}
 */
let gumballMachine = new MuStateMachine({
    states:{
        noCoin: new GumballMachineNoCoin(),
        withCoin: new GumballMachineWithCoin(),
        startup: new GumballStartup()
    },
    // create api
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
    },
    init(){
        // You can provide an init function to maybe set up some things
        // If you want to that is, i'm not trying to tell you how to code
        this.coinsNeededToPurchase = 3
        // you can start the gumball machine with coins or no coins etc
        this.coinCount = 0
    }
})

export { gumballMachine }

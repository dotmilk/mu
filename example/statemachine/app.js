import { gumballMachine } from './sm.js'
import { muDom } from '@dotmilk/mu'

document.addEventListener('DOMContentLoaded',()=>{
    let totalCoinsNeeded
    let coinsInMachine
    let contentTemplate = (stateMsg)=>{
        return `inserted coins: ${coinsInMachine}
 coins needed: ${totalCoinsNeeded - coinsInMachine}
 machine status: ${stateMsg ? stateMsg : ''}`
    }
    let insertButton = muDom('.insert')
    let refundButton = muDom('.refund')
    let dispenseButton = muDom('.dispense')
    let outputArea = muDom('.output')

    gumballMachine.on('startup',(initialData)=>{
        // here we the statemachine passes us out some data
        totalCoinsNeeded = initialData.coinsNeededToPurchase
        coinsInMachine = initialData.coinCount
        outputArea.text(contentTemplate('ready to go'))
    })
    gumballMachine.on('coinInserted',(cc)=>{
        //
        coinsInMachine = cc
        outputArea.text(contentTemplate('coin inserted'))
    })
    gumballMachine.on('refundCoin',(cc)=>{
        coinsInMachine = cc
        outputArea.text(contentTemplate('here is your refund'))
    })
    gumballMachine.on('dispense',(cc)=>{
        coinsInMachine = cc
        outputArea.text(contentTemplate('you got a gumball'))
    })
    gumballMachine.on('noCoinInserted',()=>{
        outputArea.text(contentTemplate('not possible, no coin inserted'))
    })
    gumballMachine.on('insufficientCoin',()=>{
        outputArea.text(contentTemplate('not possible, not enough coin'))
    })

    insertButton.on('click',()=> gumballMachine.insertCoin())
    refundButton.on('click',()=> gumballMachine.refundCoin())
    dispenseButton.on('click',()=> gumballMachine.dispense())
    gumballMachine.start()
})

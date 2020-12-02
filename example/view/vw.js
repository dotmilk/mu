import { MuObservableObject, MuTagen, MuView } from '@dotmilk/mu'
let theModelFactory = new MuObservableObject({
    props: ['aNumber']
})

let theModel = new theModelFactory({aNumber: 5})

let theView = new MuView({
    autoRender: true,
    template: ()=>{ return new MuTagen().tag('div')
                    .tag('button').text().close()
                    .tag('div').compile().render({text: 'random number'})
                  },
    model: theModel,
    bindings: {
        aNumber: {
            selector: 'div',
            type: 'text'
        }
    },
    events: {
        'click button': function(){
            this.model.aNumber = Math.random() * (10000 - 1) + 1
        }
    }
})

export { theView }

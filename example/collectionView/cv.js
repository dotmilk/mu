function makeId() {
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let toJoin = []
    for (var i = 0; i < 10; i++) {
        toJoin.push(possible.charAt(Math.floor(Math.random() * possible.length)))
    }
    return toJoin.join('')
}

let collectionViewFactory = muView({
    autoRender: true,
    template: ()=>{
        console.log('template called?')
        return new MuTagen().tag('li')
            .tag('button').text().close()
            .tag('span')
            .compile().render({text: 'randomize me'})
    },
    // since the collection auto wraps we can bind to a property
    bindings: {
        aNumber: {
            selector: 'span',
            type: 'text'
        }
    },
    events: {
        'click button': function(){
            this.model.aNumber = Math.random() * (10000 - 1) + 1
        }
    }
})

// this will store items added by the button
let theCollection = new MuCollection()

let theView = new MuView({
    template: ()=>{ return new MuTagen().tag('div')
                    .tag('button').text().close()
                    .tag('ul').class().compile().render({text: 'make new item',class: 'items'})
                  },
    events: {
        'click button': function(){
            //collection automatically wraps the item in an observable object
            theCollection.add({aNumber: 5, id: makeId()})
        }
    }
})

theView.addCollection({
    collection: theCollection,
    view: collectionViewFactory,
    target: 'ul.items'
})
// if we used auo render on 'theView' we would need to call theView.renderSubviews
// to kick start our freshly added collection, so instead i have manually called render
theView.render()

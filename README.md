## Classes

<dl>
<dt><a href="#MuWrapperView">MuWrapperView</a> ⇐ <code>MuEvent</code></dt>
<dd><p>Abstract class for wrapping more complex constructs.</p>
</dd>
<dt><a href="#MuView">MuView</a> ⇐ <code>MuEvent</code></dt>
<dd><p>Main class for for a &#39;view&#39;, examples in example folder</p>
</dd>
</dl>

<a name="MuWrapperView"></a>

## MuWrapperView ⇐ <code>MuEvent</code>
Abstract class for wrapping more complex constructs.

**Kind**: global class  
**Extends**: <code>MuEvent</code>  

* [MuWrapperView](#MuWrapperView) ⇐ <code>MuEvent</code>
    * [new MuWrapperView(options)](#new_MuWrapperView_new)
    * [.init()](#MuWrapperView+init)
    * [.render()](#MuWrapperView+render)
    * [.remove()](#MuWrapperView+remove)

<a name="new_MuWrapperView_new"></a>

### new MuWrapperView(options)
Should only be called by super in extending class


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | References to parent and root el |
| options.el |  | The node this view manipulates |
| options.parent |  | The view rendering this |

<a name="MuWrapperView+init"></a>

### muWrapperView.init()
Stub function, extending class may implement

**Kind**: instance method of [<code>MuWrapperView</code>](#MuWrapperView)  
<a name="MuWrapperView+render"></a>

### muWrapperView.render()
Stub function, extending class may implement

**Kind**: instance method of [<code>MuWrapperView</code>](#MuWrapperView)  
<a name="MuWrapperView+remove"></a>

### muWrapperView.remove()
Stub function, extending class must implement

**Kind**: instance method of [<code>MuWrapperView</code>](#MuWrapperView)  
<a name="MuView"></a>

## MuView ⇐ <code>MuEvent</code>
Main class for for a 'view', examples in example folder

**Kind**: global class  
**Extends**: <code>MuEvent</code>  

* [MuView](#MuView) ⇐ <code>MuEvent</code>
    * [new MuView(options)](#new_MuView_new)
    * [.references(references)](#MuView+references)
    * [.parseBindings(bindings)](#MuView+parseBindings)
    * [.bindings(bindings)](#MuView+bindings)

<a name="new_MuView_new"></a>

### new MuView(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | various options |
| options.template | <code>function</code> \| <code>String</code> | Template to become this.el |
| options.model | <code>MuModel</code> | Model that bindings will use |
| options.bindings | <code>Object</code> | An object with model properties to watch as keys |
| options.events | <code>Object</code> | An object with 'event-type element > .foo' as keys and fn as value, to be bound to this.el |
| options.autoRender | <code>Boolean</code> | Call render at end of constructor |

**Example**  
```js
// overly simple non working example
let myView = new MuView({bindings: {foo: {valid action schema}...},
                         model: someModelWithFoo,
                         events: {'click some selector that exists within this.el': someFn},
                         references: {aDomRef: '.bar'}})

someModelWithFoo.foo = 'bar'
// result is action schema is called with new value of someModelWithFoo.foo
// clicking on element inside view.el with 'some selector that exists within this.el'
// calls someFn, someFn might use this.aDomRef to manipulate something
```
<a name="MuView+references"></a>

### muView.references(references)
**Kind**: instance method of [<code>MuView</code>](#MuView)  

| Param | Type | Description |
| --- | --- | --- |
| references | <code>Object</code> | An object describing dom references bound to 'this', and the selectors to use. Called internally. The references are mainly  used inside of your event bindings, for easy access without excessive dom queries. Will handle a selector or muDom instance. |

**Example**  
```js
myView.references({aBtn: 'button #myButton'})
myView.aBtn.on('click',()=>{console.log('button clicked')})
```
<a name="MuView+parseBindings"></a>

### muView.parseBindings(bindings)
Checks for special case of '\*' right now. In the future, there might be more.
'*' creates a new essentially derived property on the 'model' passed in.
Naming said property according to the 'name' key, based of some property
of the model 'prop' which should be an array. Essentially flattening a sequence
of model properties to an array: [key1,key2] comes out ['foo','bar'] of a
model {key1: 'foo', key2: 'bar', key3: 'baz'} this array is added to the bindings
['foo','bar'] and if [key1,key2] is changed then the binding is called again with
the resulting mapped array, see rowCollectionView in muTable for use. Called internally.

**Kind**: instance method of [<code>MuView</code>](#MuView)  

| Param | Type | Description |
| --- | --- | --- |
| bindings | <code>Object</code> | List of bindings defaults to this._bindings |

<a name="MuView+bindings"></a>

### muView.bindings(bindings)
Method for binding changes in the model to actions, called internally.
Currently accepts text, html, attribute and value actions on
changed model prop. As well as special case '\*' which is mentioned
in documentation for [parseBindings](#MuView+parseBindings).

Empty string selector is view.el. Selector is required to exist.

**Kind**: instance method of [<code>MuView</code>](#MuView)  

| Param | Type | Description |
| --- | --- | --- |
| bindings | <code>Object</code> | List of model props to bind to actions |

**Example**  
```js
myView.bindings({foo: {selector: 'div.foo',
                       type: html,
                       template: someFnTakingNewValueReturningHtml }})
modelPassedIntoMyViewConstructor.foo = 'bar'
// result is myView.el's div.foo is replaces with template function output
```

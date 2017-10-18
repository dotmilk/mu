## Classes

<dl>
<dt><a href="#MuCollectionView">MuCollectionView</a> ⇐ <code><a href="#MuWrapperView">MuWrapperView</a></code></dt>
<dd><p>Generic view wrapper for a collection</p>
</dd>
<dt><a href="#MuPaginatedCollectionView">MuPaginatedCollectionView</a> ⇐ <code><a href="#MuCollectionView">MuCollectionView</a></code></dt>
<dd><p>View wrapper for a paginated collection</p>
</dd>
<dt><a href="#MuWrapperView">MuWrapperView</a> ⇐ <code><a href="#MuEvent">MuEvent</a></code></dt>
<dd><p>Abstract class for wrapping more complex constructs.</p>
</dd>
<dt><a href="#MuView">MuView</a> ⇐ <code><a href="#MuEvent">MuEvent</a></code></dt>
<dd><p>Main class for for a &#39;view&#39;, examples in example folder</p>
</dd>
<dt><a href="#MuEvent">MuEvent</a></dt>
<dd><p>Very simple no frills Event Emitter so to speak, might add emitter.once later</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#muView">muView()</a></dt>
<dd><p>Factory function for <a href="#MuView">MuView</a>, uses currying to allow default options,
calling result with final options to produce instances.</p>
</dd>
</dl>

<a name="MuCollectionView"></a>

## MuCollectionView ⇐ [<code>MuWrapperView</code>](#MuWrapperView)
Generic view wrapper for a collection

**Kind**: global class  
**Extends**: [<code>MuWrapperView</code>](#MuWrapperView)  

* [MuCollectionView](#MuCollectionView) ⇐ [<code>MuWrapperView</code>](#MuWrapperView)
    * [.init()](#MuWrapperView+init)
    * [.render()](#MuWrapperView+render)
    * [.remove()](#MuWrapperView+remove)

<a name="MuWrapperView+init"></a>

### muCollectionView.init()
Stub function, extending class may implement

**Kind**: instance method of [<code>MuCollectionView</code>](#MuCollectionView)  
**Overrides**: [<code>init</code>](#MuWrapperView+init)  
<a name="MuWrapperView+render"></a>

### muCollectionView.render()
Stub function, extending class may implement

**Kind**: instance method of [<code>MuCollectionView</code>](#MuCollectionView)  
<a name="MuWrapperView+remove"></a>

### muCollectionView.remove()
Stub function, extending class must implement

**Kind**: instance method of [<code>MuCollectionView</code>](#MuCollectionView)  
**Overrides**: [<code>remove</code>](#MuWrapperView+remove)  
<a name="MuPaginatedCollectionView"></a>

## MuPaginatedCollectionView ⇐ [<code>MuCollectionView</code>](#MuCollectionView)
View wrapper for a paginated collection

**Kind**: global class  
**Extends**: [<code>MuCollectionView</code>](#MuCollectionView)  

* [MuPaginatedCollectionView](#MuPaginatedCollectionView) ⇐ [<code>MuCollectionView</code>](#MuCollectionView)
    * [.init()](#MuWrapperView+init)
    * [.render()](#MuWrapperView+render)
    * [.remove()](#MuWrapperView+remove)

<a name="MuWrapperView+init"></a>

### muPaginatedCollectionView.init()
Stub function, extending class may implement

**Kind**: instance method of [<code>MuPaginatedCollectionView</code>](#MuPaginatedCollectionView)  
**Overrides**: [<code>init</code>](#MuWrapperView+init)  
<a name="MuWrapperView+render"></a>

### muPaginatedCollectionView.render()
Stub function, extending class may implement

**Kind**: instance method of [<code>MuPaginatedCollectionView</code>](#MuPaginatedCollectionView)  
<a name="MuWrapperView+remove"></a>

### muPaginatedCollectionView.remove()
Stub function, extending class must implement

**Kind**: instance method of [<code>MuPaginatedCollectionView</code>](#MuPaginatedCollectionView)  
<a name="MuWrapperView"></a>

## MuWrapperView ⇐ [<code>MuEvent</code>](#MuEvent)
Abstract class for wrapping more complex constructs.

**Kind**: global class  
**Extends**: [<code>MuEvent</code>](#MuEvent)  

* [MuWrapperView](#MuWrapperView) ⇐ [<code>MuEvent</code>](#MuEvent)
    * [new MuWrapperView(options)](#new_MuWrapperView_new)
    * [.init()](#MuWrapperView+init)
    * [.render()](#MuWrapperView+render)
    * [.remove()](#MuWrapperView+remove)
    * [.on(event, fn)](#MuEvent+on)
    * [.removeListener(event, fn)](#MuEvent+removeListener)
    * [.clearListeners()](#MuEvent+clearListeners)
    * [.emit(event)](#MuEvent+emit)

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
<a name="MuEvent+on"></a>

### muWrapperView.on(event, fn)
Method to register a listener

**Kind**: instance method of [<code>MuWrapperView</code>](#MuWrapperView)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Name of event to listen for |
| fn | <code>function</code> | Fn to call when event heard |

<a name="MuEvent+removeListener"></a>

### muWrapperView.removeListener(event, fn)
May or may not work, usually just clear all listeners if anything

**Kind**: instance method of [<code>MuWrapperView</code>](#MuWrapperView)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Name of event to listen for |
| fn | <code>function</code> | Fn to call when event heard |

<a name="MuEvent+clearListeners"></a>

### muWrapperView.clearListeners()
Clears all listeners

**Kind**: instance method of [<code>MuWrapperView</code>](#MuWrapperView)  
<a name="MuEvent+emit"></a>

### muWrapperView.emit(event)
Emit event

**Kind**: instance method of [<code>MuWrapperView</code>](#MuWrapperView)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Name of event to emit |

<a name="MuView"></a>

## MuView ⇐ [<code>MuEvent</code>](#MuEvent)
Main class for for a 'view', examples in example folder

**Kind**: global class  
**Extends**: [<code>MuEvent</code>](#MuEvent)  

* [MuView](#MuView) ⇐ [<code>MuEvent</code>](#MuEvent)
    * [new MuView(options)](#new_MuView_new)
    * [.references(references)](#MuView+references)
    * [.parseBindings(bindings)](#MuView+parseBindings)
    * [.bindings(bindings)](#MuView+bindings)
    * [.events()](#MuView+events)
    * [.addCollection(options, collection, view)](#MuView+addCollection)
    * [.on(event, fn)](#MuEvent+on)
    * [.removeListener(event, fn)](#MuEvent+removeListener)
    * [.clearListeners()](#MuEvent+clearListeners)
    * [.emit(event)](#MuEvent+emit)

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
// result is myView.el's div.foo is replaced with template function output
```
<a name="MuView+events"></a>

### muView.events()
Uses event delegation to respond to events on view.el and its children.
keys should follow pattern 'eventName selector'. A string with no selector,
only eventName refers to view.el itself and not some child.

Place more generically selected things first:
{'click': fn, 'click button': fn, 'click button.foo': fn}
Called internally.

**Kind**: instance method of [<code>MuView</code>](#MuView)  
**Example**  
```js
myView.events({'click button.foo': ()=>{console.log('foo was clicked')}})
//clicking on button.foo logs the click to console
```
<a name="MuView+addCollection"></a>

### muView.addCollection(options, collection, view)
Adds a collection as a subview of this view, wrapping it in either a
[MuCollectionView](#MuCollectionView) or if the collection is paginated a
[MuPaginatedCollectionView](#MuPaginatedCollectionView)

**Kind**: instance method of [<code>MuView</code>](#MuView)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Set of options for the collection |
| collection | <code>Collection</code> | An object conforming to collection contract |
| view | [<code>MuView</code>](#MuView) \| <code>MuViewWrapper</code> | The result of calling [muView](#muView) |

<a name="MuEvent+on"></a>

### muView.on(event, fn)
Method to register a listener

**Kind**: instance method of [<code>MuView</code>](#MuView)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Name of event to listen for |
| fn | <code>function</code> | Fn to call when event heard |

<a name="MuEvent+removeListener"></a>

### muView.removeListener(event, fn)
May or may not work, usually just clear all listeners if anything

**Kind**: instance method of [<code>MuView</code>](#MuView)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Name of event to listen for |
| fn | <code>function</code> | Fn to call when event heard |

<a name="MuEvent+clearListeners"></a>

### muView.clearListeners()
Clears all listeners

**Kind**: instance method of [<code>MuView</code>](#MuView)  
<a name="MuEvent+emit"></a>

### muView.emit(event)
Emit event

**Kind**: instance method of [<code>MuView</code>](#MuView)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Name of event to emit |

<a name="MuEvent"></a>

## MuEvent
Very simple no frills Event Emitter so to speak, might add emitter.once later

**Kind**: global class  

* [MuEvent](#MuEvent)
    * [new MuEvent()](#new_MuEvent_new)
    * [.on(event, fn)](#MuEvent+on)
    * [.removeListener(event, fn)](#MuEvent+removeListener)
    * [.clearListeners()](#MuEvent+clearListeners)
    * [.emit(event)](#MuEvent+emit)

<a name="new_MuEvent_new"></a>

### new MuEvent()
Takes no arguments

**Example**  
```js
let emitter = new MuEvent()
emitter.on('whatever',()=>{console.log(whatever)})
emitter.emit('whatever')
```
<a name="MuEvent+on"></a>

### muEvent.on(event, fn)
Method to register a listener

**Kind**: instance method of [<code>MuEvent</code>](#MuEvent)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Name of event to listen for |
| fn | <code>function</code> | Fn to call when event heard |

<a name="MuEvent+removeListener"></a>

### muEvent.removeListener(event, fn)
May or may not work, usually just clear all listeners if anything

**Kind**: instance method of [<code>MuEvent</code>](#MuEvent)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Name of event to listen for |
| fn | <code>function</code> | Fn to call when event heard |

<a name="MuEvent+clearListeners"></a>

### muEvent.clearListeners()
Clears all listeners

**Kind**: instance method of [<code>MuEvent</code>](#MuEvent)  
<a name="MuEvent+emit"></a>

### muEvent.emit(event)
Emit event

**Kind**: instance method of [<code>MuEvent</code>](#MuEvent)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Name of event to emit |

<a name="muView"></a>

## muView()
Factory function for [MuView](#MuView), uses currying to allow default options,
calling result with final options to produce instances.

**Kind**: global function  
**Example**  
```js
let personView = muView({template: '<div></div>'})
let personOne = personView({model: personOneModel })
let personTwo = personView({model: personTwoModel })
```

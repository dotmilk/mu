# Mu

A few frills anti-framework for use in electron, no thought or care has been given to any other
environment or use case.

* * *

## Classes

<dl>
<dt><a href="#MuCollection">MuCollection</a> ⇐ <code><a href="#MuEvent">MuEvent</a></code></dt>
<dd><p>A collection emitting events on certain actions</p>
</dd>
<dt><a href="#MuPagedCollection">MuPagedCollection</a></dt>
<dd><p>Uses <a href="MuPaginator">MuPaginator</a> to paginate a <a href="#MuCollection">MuCollection</a>, why you&#39;d want to do this?
I dunno, you&#39;re the one using it.</p>
</dd>
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

<a name="MuCollection"></a>

## MuCollection ⇐ [<code>MuEvent</code>](#MuEvent)
A collection emitting events on certain actions

**Kind**: global class  
**Extends**: [<code>MuEvent</code>](#MuEvent)  

* [MuCollection](#MuCollection) ⇐ [<code>MuEvent</code>](#MuEvent)
    * [new MuCollection(options)](#new_MuCollection_new)
    * [.addBulk(items)](#MuCollection+addBulk)
    * [.add(items, bulk)](#MuCollection+add)
    * [.sort(comparator, reverse)](#MuCollection+sort)
    * [.remove(idxs)](#MuCollection+remove)
    * [.get(id)](#MuCollection+get)
    * [.each(fn)](#MuCollection+each)
    * [.reset(items)](#MuCollection+reset)
    * [.on(event, fn)](#MuEvent+on)
    * [.removeListener(event, fn)](#MuEvent+removeListener)
    * [.clearListeners()](#MuEvent+clearListeners)
    * [.emit(event)](#MuEvent+emit)

<a name="new_MuCollection_new"></a>

### new MuCollection(options)
Create a new collection, in the future will optionally wrap items in a model.
for exceptionally large collections, use flat, so as to not add each 'item' to
this.collection[item.idField] = item. Can be very slow. Flat instead stores
this.collection as an array, no removal of elements, just reset.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options for the collection |
| options.flat | <code>Boolean</code> | Store as array, not k:v |
| options.idField | <code>String</code> | The field to use as k when not flat, defaults to 'id' |
| options.model | <code>MuObservableObject</code> | Future: non instantiated model to wrap each item |
| options.comparator | <code>function</code> | Some fn to aid in sorting |
| options.content | <code>Array</code> | Initial items in collection, will fire add events, but you will be unable to listen |

**Example**  
```js
myCollection = new MuCollection({idField: 'customId'})
// or
myCollection = new MuCollection({flat: true})
myCollection.on('add',someFn)
myCollection.add([{foo: 'a'},{foo: 'b'}])
// someFn called twice with item, or
myCollection.add([{foo: 'a'},{foo: 'b'}],true)
// no add event fired, instead 'bulk' event fired after all items added
```
<a name="MuCollection+addBulk"></a>

### muCollection.addBulk(items)
Convenience function for add(stuff,true)

**Kind**: instance method of [<code>MuCollection</code>](#MuCollection)  

| Param | Type | Description |
| --- | --- | --- |
| items | <code>Array</code> \| <code>SingleItem</code> | Stuff to add |

<a name="MuCollection+add"></a>

### muCollection.add(items, bulk)
Perhaps the most useful method on a collection, adding things to the collection

**Kind**: instance method of [<code>MuCollection</code>](#MuCollection)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| items | <code>Array</code> \| <code>SingleItem</code> |  | Stuff to add |
| bulk | <code>Boolean</code> | <code>false</code> | Skip emitting add for each item, emit 'bulk' |

<a name="MuCollection+sort"></a>

### muCollection.sort(comparator, reverse)
Sort the collection, may or may not work, haven't test it lol

**Kind**: instance method of [<code>MuCollection</code>](#MuCollection)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| comparator | <code>function</code> |  | Some function that sorts things |
| reverse | <code>Boolean</code> | <code>false</code> | Sorting direction |

<a name="MuCollection+remove"></a>

### muCollection.remove(idxs)
Removes item / items from collection, throws an error if collection is flat

**Kind**: instance method of [<code>MuCollection</code>](#MuCollection)  

| Param | Type | Description |
| --- | --- | --- |
| idxs | <code>Array</code> \| <code>SingleItem</code> | A single index/key or array of them |

<a name="MuCollection+get"></a>

### muCollection.get(id)
Get Item from collection by idField or by index if flat

**Kind**: instance method of [<code>MuCollection</code>](#MuCollection)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> \| <code>Number</code> | A string key for idField lookup or number for flat index |

<a name="MuCollection+each"></a>

### muCollection.each(fn)
Do something with each thing in this collection...duh

**Kind**: instance method of [<code>MuCollection</code>](#MuCollection)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | A thing to do to each item in this collection |

<a name="MuCollection+reset"></a>

### muCollection.reset(items)
Reset internal state to a collection with no items or with items passed in

**Kind**: instance method of [<code>MuCollection</code>](#MuCollection)  

| Param | Type | Description |
| --- | --- | --- |
| items | <code>Array</code> \| <code>SingleItem</code> | Stuff to add to newly cleared collection |

<a name="MuEvent+on"></a>

### muCollection.on(event, fn)
Method to register a listener

**Kind**: instance method of [<code>MuCollection</code>](#MuCollection)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Name of event to listen for |
| fn | <code>function</code> | Fn to call when event heard |

<a name="MuEvent+removeListener"></a>

### muCollection.removeListener(event, fn)
May or may not work, usually just clear all listeners if anything

**Kind**: instance method of [<code>MuCollection</code>](#MuCollection)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Name of event to listen for |
| fn | <code>function</code> | Fn to call when event heard |

<a name="MuEvent+clearListeners"></a>

### muCollection.clearListeners()
Clears all listeners

**Kind**: instance method of [<code>MuCollection</code>](#MuCollection)  
<a name="MuEvent+emit"></a>

### muCollection.emit(event)
Emit event

**Kind**: instance method of [<code>MuCollection</code>](#MuCollection)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Name of event to emit |

<a name="MuPagedCollection"></a>

## MuPagedCollection
Uses [MuPaginator](MuPaginator) to paginate a [MuCollection](#MuCollection), why you'd want to do this?
I dunno, you're the one using it.

**Kind**: global class  
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
    * [.addCollection(options)](#MuView+addCollection)
    * [.registerSubview(view)](#MuView+registerSubview)
    * [.renderSubviews()](#MuView+renderSubviews)
    * [.remove()](#MuView+remove)
    * [.render()](#MuView+render)
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

### muView.addCollection(options)
Adds a collection as a subview of this view, wrapping it in either a
[MuCollectionView](#MuCollectionView) or if the collection is paginated a
[MuPaginatedCollectionView](#MuPaginatedCollectionView)

**Kind**: instance method of [<code>MuView</code>](#MuView)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Set of options for the collection |
| options.collection | <code>Collection</code> | An object conforming to collection contract |
| options.view | [<code>MuView</code>](#MuView) \| [<code>MuWrapperView</code>](#MuWrapperView) | The result of calling [muView](#muView) curried function is called by [MuCollectionView](#MuCollectionView) or [MuPaginatedCollectionView](#MuPaginatedCollectionView) per item in collection |
| options.viewOptions | <code>Object</code> | Merged before view is instantiated per item |
| options.lookup | <code>function</code> | If present is called with value of item, what it returns is used in place of item for view per item |
| options.target | <code>String</code> | IF supplied must be selector of some node in parent |

**Example**  
```js
myView.addCollection({view: someView, collection someCollection, target: 'div.foo'})
```
<a name="MuView+registerSubview"></a>

### muView.registerSubview(view)
Registers a subview that knows where to insert itself into this view

**Kind**: instance method of [<code>MuView</code>](#MuView)  

| Param | Type | Description |
| --- | --- | --- |
| view | [<code>MuWrapperView</code>](#MuWrapperView) | A wrapped view of some kind |

<a name="MuView+renderSubviews"></a>

### muView.renderSubviews()
Attempts to call render on all subviews

**Kind**: instance method of [<code>MuView</code>](#MuView)  
<a name="MuView+remove"></a>

### muView.remove()
Attempts to remove first all subviews and then self from the dom

**Kind**: instance method of [<code>MuView</code>](#MuView)  
<a name="MuView+render"></a>

### muView.render()
Slaps events and model bindings onto this.el and then renders subviews

**Kind**: instance method of [<code>MuView</code>](#MuView)  
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

* * *

&copy; 2016-2017 Seth Price

# Mu

A few frills anti-framework for use in electron, no thought or care has been given to any other
environment or use case.

* * *

## Classes

<dl>
<dt><a href="#MuManager">MuManager</a></dt>
<dd><p>A simple place to store anything if so desired, if an object is stored with
a property &#39;classDef&#39;, it will be treated as a reference to a class / called with new
and stored under the given key, with remaining properties passed in as options.
Use it or don&#39;t, I have no feelings either way. Good place to keep shit out of global scope.</p>
</dd>
<dt><a href="#MuPage">MuPage</a></dt>
<dd><p>Abstract class for page controllers</p>
</dd>
<dt><a href="#MuPageManager">MuPageManager</a> ⇐ <code><a href="#MuEvent">MuEvent</a></code></dt>
<dd><p>Super fun tool here. Designate by default some element with the attribute
mu-root, and one or more elements inside that one mu-page=&#39;pagename&#39;
mu-controller=&#39;someFnWithHandlers&#39;. Then fire this badboy up, and call load with
&#39;pagename&#39; bam</p>
</dd>
<dt><a href="#MuState">MuState</a></dt>
<dd><p>Abstract State class for use in <a href="#MuStateMachine">MuStateMachine</a></p>
</dd>
<dt><a href="#MuStateMachine">MuStateMachine</a></dt>
<dd><p>Super neat statemachine, very loosely based on <a href="http://machina-js.org/">machina.js</a>,
this is no where near as frilly, this does not have a kitchen sink, nor will it
keep your beverages cold.</p>
</dd>
<dt><a href="#MuCollection">MuCollection</a> ⇐ <code><a href="#MuEvent">MuEvent</a></code></dt>
<dd><p>A collection emitting events on certain actions</p>
</dd>
<dt><a href="#MuPagedCollection">MuPagedCollection</a> ⇐ <code><a href="#MuCollection">MuCollection</a></code></dt>
<dd><p>Uses <a href="#MuPaginator">MuPaginator</a> to paginate a <a href="#MuCollection">MuCollection</a>, why would you want to do this?
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
<dt><a href="#MuTagen">MuTagen</a></dt>
<dd><p>Programmatically create some html fragment template</p>
</dd>
<dt><a href="#MuEvent">MuEvent</a></dt>
<dd><p>Very simple no frills Event Emitter so to speak, might add emitter.once later</p>
</dd>
<dt><a href="#MuNodeManager">MuNodeManager</a></dt>
<dd><p>Name, store and possibly clone / possibly remove arbitrary nodes of
your document for later retrieval. Pretty fancy right?</p>
</dd>
<dt><a href="#MuPaginator">MuPaginator</a></dt>
<dd><p>Class for &#39;paginating&#39; an array</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#MuObservableObject">MuObservableObject()</a></dt>
<dd><p>A mystical thing, uses traps to watch for changes to an object,
also has derived properties.</p>
</dd>
<dt><a href="#muView">muView()</a></dt>
<dd><p>Factory function for <a href="#MuView">MuView</a>, uses currying to allow default options,
calling result with final options to produce instances.</p>
</dd>
<dt><a href="#muCss">muCss(style, id)</a></dt>
<dd><p>Inject a style sheet, if you feel so inclined</p>
</dd>
</dl>

<a name="MuManager"></a>

## MuManager
A simple place to store anything if so desired, if an object is stored with
a property 'classDef', it will be treated as a reference to a class / called with new
and stored under the given key, with remaining properties passed in as options.
Use it or don't, I have no feelings either way. Good place to keep shit out of global scope.

**Kind**: global class  

* [MuManager](#MuManager)
    * [new MuManager()](#new_MuManager_new)
    * [.add(name, opts)](#MuManager+add)
    * [.get(name)](#MuManager+get)

<a name="new_MuManager_new"></a>

### new MuManager()
Make a manager object

<a name="MuManager+add"></a>

### muManager.add(name, opts)
Add a property

**Kind**: instance method of [<code>MuManager</code>](#MuManager)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | key to store whatever you are storing under |
| opts | <code>\*</code> | Whatever you are storing, if it has a property classDef, that property will be called with new, and the rest of the object as arguments to it. |

<a name="MuManager+get"></a>

### muManager.get(name)
Retrieve a thing you have stored

**Kind**: instance method of [<code>MuManager</code>](#MuManager)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | key to retrieve |

<a name="MuPage"></a>

## MuPage
Abstract class for page controllers

**Kind**: global class  

* [MuPage](#MuPage)
    * [new MuPage(options)](#new_MuPage_new)
    * [.onLoad()](#MuPage+onLoad)
    * [.onShow()](#MuPage+onShow)
    * [.onHide()](#MuPage+onHide)

<a name="new_MuPage_new"></a>

### new MuPage(options)
This is always called by super in extending class don't worry about it...


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Just two options |
| options.pageName | <code>String</code> | Name of the page |
| options.pageManager | [<code>MuPageManager</code>](#MuPageManager) | Reference to the [MuPageManager](#MuPageManager) managing this page |

<a name="MuPage+onLoad"></a>

### muPage.onLoad()
Handler for load:pageName, subclass may implement

**Kind**: instance method of [<code>MuPage</code>](#MuPage)  
<a name="MuPage+onShow"></a>

### muPage.onShow()
Handler for show:pageName, subclass may implement

**Kind**: instance method of [<code>MuPage</code>](#MuPage)  
<a name="MuPage+onHide"></a>

### muPage.onHide()
Handler for hide:pageName, subclass may implement

**Kind**: instance method of [<code>MuPage</code>](#MuPage)  
<a name="MuPageManager"></a>

## MuPageManager ⇐ [<code>MuEvent</code>](#MuEvent)
Super fun tool here. Designate by default some element with the attribute
mu-root, and one or more elements inside that one mu-page='pagename'
mu-controller='someFnWithHandlers'. Then fire this badboy up, and call load with
'pagename' bam

**Kind**: global class  
**Extends**: [<code>MuEvent</code>](#MuEvent)  

* [MuPageManager](#MuPageManager) ⇐ [<code>MuEvent</code>](#MuEvent)
    * [new MuPageManager(options)](#new_MuPageManager_new)
    * [.getAttributes(name)](#MuPageManager+getAttributes)
    * [.getDOM(name)](#MuPageManager+getDOM)
    * [.getController(name)](#MuPageManager+getController)
    * [.load(name)](#MuPageManager+load)
    * [.on(event, fn)](#MuEvent+on)
    * [.removeListener(event, fn)](#MuEvent+removeListener)
    * [.clearListeners()](#MuEvent+clearListeners)
    * [.emit(event)](#MuEvent+emit)

<a name="new_MuPageManager_new"></a>

### new MuPageManager(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options |
| options.root | <code>String</code> | The name of the attribute denoting the root of your page. Where to find pages, and where page swapping will occur in essence. Defaults to 'mu-root'. |
| options.pageAttribute | <code>String</code> | The name of the attribute denoting a page. These will be cloned and removed from the dom. Defaults to 'mu-page'. |
| options.controllerAttribute | <code>String</code> | Placed on same element you denoted as a page. This should be a class name, to be instantiated by [MuPageManager](#MuPageManager) during init. |
| options.options | <code>Object</code> | Options you want passed in to each page controller, in addition to the defaults passed into each pageManager: a reference to this, and name: its name |

<a name="MuPageManager+getAttributes"></a>

### muPageManager.getAttributes(name)
Get a list of attributes of the page

**Kind**: instance method of [<code>MuPageManager</code>](#MuPageManager)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Name of page to get attributes of. |

<a name="MuPageManager+getDOM"></a>

### muPageManager.getDOM(name)
Get a reference to the DOM node tied to specified page

**Kind**: instance method of [<code>MuPageManager</code>](#MuPageManager)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Name of page |

<a name="MuPageManager+getController"></a>

### muPageManager.getController(name)
Get the controller instance bound to specified page

**Kind**: instance method of [<code>MuPageManager</code>](#MuPageManager)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Name of page |

<a name="MuPageManager+load"></a>

### muPageManager.load(name)
After construction, this is probably the only method you will be using. Removes old page if any emitting hide:pageName
so that it knows it is being removed from the dom. If it is the first time this page has been loaded load:pageName is
emitted in place of show:pageName, allowing your controller to do prep work if needed, you might want to call show yourself
at the end of your handler for show, depending on how all your shit is setup.

**Kind**: instance method of [<code>MuPageManager</code>](#MuPageManager)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Name of page |

<a name="MuEvent+on"></a>

### muPageManager.on(event, fn)
Method to register a listener

**Kind**: instance method of [<code>MuPageManager</code>](#MuPageManager)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Name of event to listen for |
| fn | <code>function</code> | Fn to call when event heard |

<a name="MuEvent+removeListener"></a>

### muPageManager.removeListener(event, fn)
May or may not work, usually just clear all listeners if anything

**Kind**: instance method of [<code>MuPageManager</code>](#MuPageManager)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Name of event to listen for |
| fn | <code>function</code> | Fn to call when event heard |

<a name="MuEvent+clearListeners"></a>

### muPageManager.clearListeners()
Clears all listeners

**Kind**: instance method of [<code>MuPageManager</code>](#MuPageManager)  
<a name="MuEvent+emit"></a>

### muPageManager.emit(event)
Emit event

**Kind**: instance method of [<code>MuPageManager</code>](#MuPageManager)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Name of event to emit |

<a name="MuState"></a>

## MuState
Abstract State class for use in [MuStateMachine](#MuStateMachine)

**Kind**: global class  
<a name="MuStateMachine"></a>

## MuStateMachine
Super neat statemachine, very loosely based on [machina.js](http://machina-js.org/),
this is no where near as frilly, this does not have a kitchen sink, nor will it
keep your beverages cold.

**Kind**: global class  

* [MuStateMachine](#MuStateMachine)
    * [new MuStateMachine(options)](#new_MuStateMachine_new)
    * [.transition(name)](#MuStateMachine+transition)
    * [.handle(name)](#MuStateMachine+handle)

<a name="new_MuStateMachine_new"></a>

### new MuStateMachine(options)
So basically you only need to define some states, of which there is
one 'special' state you can add 'uninitialized' if you don't add it
a blank [MuState](#MuState) is used.

Each state can also have its own '\*' handler as well to respond to
calls not specifically covered in that state's definition.

Every property not under states:{}, becomes a property of the instance.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | options for your stateMachine, everything not under options.state becomes a property of the instance |
| options.states | <code>Object</code> | defines the states your machine can transition to |

<a name="MuStateMachine+transition"></a>

### muStateMachine.transition(name)
Attempt to transition to a state. Should probably be called
from the api / internally, but again whatever it's your code.

**Kind**: instance method of [<code>MuStateMachine</code>](#MuStateMachine)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Name of state to transition to. |

<a name="MuStateMachine+handle"></a>

### muStateMachine.handle(name)
Attempts to call 'name' on current state. Should probably be called
from your provided api, instead of attempting to call directly from outside

**Kind**: instance method of [<code>MuStateMachine</code>](#MuStateMachine)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | state's method you are attempting to call |

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
| options.model | [<code>MuObservableObject</code>](#MuObservableObject) | Future: non instantiated model to wrap each item |
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
Sort the collection, may or may not work, haven't tested it in any real manner

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

## MuPagedCollection ⇐ [<code>MuCollection</code>](#MuCollection)
Uses [MuPaginator](#MuPaginator) to paginate a [MuCollection](#MuCollection), why would you want to do this?
I dunno, you're the one using it.

**Kind**: global class  
**Extends**: [<code>MuCollection</code>](#MuCollection)  

* [MuPagedCollection](#MuPagedCollection) ⇐ [<code>MuCollection</code>](#MuCollection)
    * [new MuPagedCollection(options)](#new_MuPagedCollection_new)
    * [.setPageSize(n)](#MuPagedCollection+setPageSize)
    * [.getPageSize()](#MuPagedCollection+getPageSize)
    * [.maxPage()](#MuPagedCollection+maxPage)
    * [.currentPageNumber()](#MuPagedCollection+currentPageNumber)
    * [.currentPage()](#MuPagedCollection+currentPage)
    * [.getPage(n)](#MuPagedCollection+getPage)
    * [.nextPage()](#MuPagedCollection+nextPage)
    * [.previousPage()](#MuPagedCollection+previousPage)
    * [.lastPage()](#MuPagedCollection+lastPage)
    * [.firstPage()](#MuPagedCollection+firstPage)
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

<a name="new_MuPagedCollection_new"></a>

### new MuPagedCollection(options)
This is where shit gets real, ok that might be an overstatement. Basically this provides
an api for [MuPaginator](#MuPaginator) and special events pertaining to a paged collection


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options for the collection |
| options.flat | <code>Boolean</code> | Store as array, not k:v |
| options.idField | <code>String</code> | The field to use as k when not flat, defaults to 'id' |
| options.model | [<code>MuObservableObject</code>](#MuObservableObject) | Future: non instantiated model to wrap each item |
| options.comparator | <code>function</code> | Some fn to aid in sorting |
| options.content | <code>Array</code> | Initial items in collection, will fire add events, but you will be unable to listen |

<a name="MuPagedCollection+setPageSize"></a>

### muPagedCollection.setPageSize(n)
Sets the number of items per 'page'

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>Integer</code> | Number of items per page |

<a name="MuPagedCollection+getPageSize"></a>

### muPagedCollection.getPageSize()
Gets the current page size

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  
<a name="MuPagedCollection+maxPage"></a>

### muPagedCollection.maxPage()
Gets maximum possible page number with current collection

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  
<a name="MuPagedCollection+currentPageNumber"></a>

### muPagedCollection.currentPageNumber()
Gets the current page number

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  
<a name="MuPagedCollection+currentPage"></a>

### muPagedCollection.currentPage()
Gets a reference to current page

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  
<a name="MuPagedCollection+getPage"></a>

### muPagedCollection.getPage(n)
Gets specified page number, if out of range gets first or last page

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>Integer</code> | Page number to get |

<a name="MuPagedCollection+nextPage"></a>

### muPagedCollection.nextPage()
Gets the next page

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  
<a name="MuPagedCollection+previousPage"></a>

### muPagedCollection.previousPage()
Gets previous page

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  
<a name="MuPagedCollection+lastPage"></a>

### muPagedCollection.lastPage()
Gets last page

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  
<a name="MuPagedCollection+firstPage"></a>

### muPagedCollection.firstPage()
Gets first page

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  
<a name="MuCollection+addBulk"></a>

### muPagedCollection.addBulk(items)
Convenience function for add(stuff,true)

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  

| Param | Type | Description |
| --- | --- | --- |
| items | <code>Array</code> \| <code>SingleItem</code> | Stuff to add |

<a name="MuCollection+add"></a>

### muPagedCollection.add(items, bulk)
Perhaps the most useful method on a collection, adding things to the collection

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| items | <code>Array</code> \| <code>SingleItem</code> |  | Stuff to add |
| bulk | <code>Boolean</code> | <code>false</code> | Skip emitting add for each item, emit 'bulk' |

<a name="MuCollection+sort"></a>

### muPagedCollection.sort(comparator, reverse)
Sort the collection, may or may not work, haven't tested it in any real manner

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| comparator | <code>function</code> |  | Some function that sorts things |
| reverse | <code>Boolean</code> | <code>false</code> | Sorting direction |

<a name="MuCollection+remove"></a>

### muPagedCollection.remove(idxs)
Removes item / items from collection, throws an error if collection is flat

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  

| Param | Type | Description |
| --- | --- | --- |
| idxs | <code>Array</code> \| <code>SingleItem</code> | A single index/key or array of them |

<a name="MuCollection+get"></a>

### muPagedCollection.get(id)
Get Item from collection by idField or by index if flat

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> \| <code>Number</code> | A string key for idField lookup or number for flat index |

<a name="MuCollection+each"></a>

### muPagedCollection.each(fn)
Do something with each thing in this collection...duh

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | A thing to do to each item in this collection |

<a name="MuCollection+reset"></a>

### muPagedCollection.reset(items)
Reset internal state to a collection with no items or with items passed in

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  

| Param | Type | Description |
| --- | --- | --- |
| items | <code>Array</code> \| <code>SingleItem</code> | Stuff to add to newly cleared collection |

<a name="MuEvent+on"></a>

### muPagedCollection.on(event, fn)
Method to register a listener

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Name of event to listen for |
| fn | <code>function</code> | Fn to call when event heard |

<a name="MuEvent+removeListener"></a>

### muPagedCollection.removeListener(event, fn)
May or may not work, usually just clear all listeners if anything

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Name of event to listen for |
| fn | <code>function</code> | Fn to call when event heard |

<a name="MuEvent+clearListeners"></a>

### muPagedCollection.clearListeners()
Clears all listeners

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  
<a name="MuEvent+emit"></a>

### muPagedCollection.emit(event)
Emit event

**Kind**: instance method of [<code>MuPagedCollection</code>](#MuPagedCollection)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Name of event to emit |

<a name="MuCollectionView"></a>

## MuCollectionView ⇐ [<code>MuWrapperView</code>](#MuWrapperView)
Generic view wrapper for a collection

**Kind**: global class  
**Extends**: [<code>MuWrapperView</code>](#MuWrapperView)  

* [MuCollectionView](#MuCollectionView) ⇐ [<code>MuWrapperView</code>](#MuWrapperView)
    * [.init()](#MuWrapperView+init)
    * [.render()](#MuWrapperView+render)
    * *[.remove()](#MuWrapperView+remove)*

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

### *muCollectionView.remove()*
Stub function, extending class must implement

**Kind**: instance abstract method of [<code>MuCollectionView</code>](#MuCollectionView)  
**Overrides**: [<code>remove</code>](#MuWrapperView+remove)  
<a name="MuPaginatedCollectionView"></a>

## MuPaginatedCollectionView ⇐ [<code>MuCollectionView</code>](#MuCollectionView)
View wrapper for a paginated collection

**Kind**: global class  
**Extends**: [<code>MuCollectionView</code>](#MuCollectionView)  

* [MuPaginatedCollectionView](#MuPaginatedCollectionView) ⇐ [<code>MuCollectionView</code>](#MuCollectionView)
    * [.init()](#MuWrapperView+init)
    * [.render()](#MuWrapperView+render)
    * *[.remove()](#MuWrapperView+remove)*

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

### *muPaginatedCollectionView.remove()*
Stub function, extending class must implement

**Kind**: instance abstract method of [<code>MuPaginatedCollectionView</code>](#MuPaginatedCollectionView)  
<a name="MuWrapperView"></a>

## MuWrapperView ⇐ [<code>MuEvent</code>](#MuEvent)
Abstract class for wrapping more complex constructs.

**Kind**: global class  
**Extends**: [<code>MuEvent</code>](#MuEvent)  

* [MuWrapperView](#MuWrapperView) ⇐ [<code>MuEvent</code>](#MuEvent)
    * [new MuWrapperView(options)](#new_MuWrapperView_new)
    * [.init()](#MuWrapperView+init)
    * [.render()](#MuWrapperView+render)
    * *[.remove()](#MuWrapperView+remove)*
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

### *muWrapperView.remove()*
Stub function, extending class must implement

**Kind**: instance abstract method of [<code>MuWrapperView</code>](#MuWrapperView)  
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

<a name="MuTagen"></a>

## MuTagen
Programmatically create some html fragment template

**Kind**: global class  

* [MuTagen](#MuTagen)
    * [new MuTagen()](#new_MuTagen_new)
    * [.tag()](#MuTagen+tag)
    * [.attribute()](#MuTagen+attribute)

<a name="new_MuTagen_new"></a>

### new MuTagen()
Get the party started

**Example**  
```js
let frag = new MuTagen().tag('div').class().tag('p').text('aParagraph').compile()
frag.render({class: 'foo',aParagraph: 'Some text for the paragraph'})
// returns
// <div class="foo"><p>Some text for the paragraph</p></div>
//For now lets just assume
frag = new MuTagen()
```
<a name="MuTagen+tag"></a>

### muTagen.tag()
Now that the party is started, lets make a tag

**Kind**: instance method of [<code>MuTagen</code>](#MuTagen)  
**Example**  
```js
frag.tag('div')
// optionally
frag.tag('div','foo')
// When render is called later all future properties must be found under {foo:{}}
// for any tag under this level, more robust example being
frag.tag('div').class().tag('section','profile').class()
                       .tag('p').text('name').close()
                       .tag('p').text('info').close().close()
               .tag('p').text('status')
frag.render({class:'foo',status:'online',profile:{ name: 'John Smith', info: 'age: 34, likes: long walks', class: 'profile'}})
// <div class="foo"><section class="profile"><p>John Smith</p><p>age: 34, likes: long walks</p></section><p>online</p></div>
```
<a name="MuTagen+attribute"></a>

### muTagen.attribute()
Now we have a tag so lets add an attribute to it

**Kind**: instance method of [<code>MuTagen</code>](#MuTagen)  
**Example**  
```js
frag.attribute('class')
// By default it will look up the value for the attribute later under the
// key with the same name as that attribute, or you can specify
```
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

<a name="MuNodeManager"></a>

## MuNodeManager
Name, store and possibly clone / possibly remove arbitrary nodes of
your document for later retrieval. Pretty fancy right?

**Kind**: global class  

* [MuNodeManager](#MuNodeManager)
    * [new MuNodeManager()](#new_MuNodeManager_new)
    * [.add(name, selector, context, clone)](#MuNodeManager+add)
    * [.addAndRemove()](#MuNodeManager+addAndRemove)
    * [.getCloned()](#MuNodeManager+getCloned)
    * [.get()](#MuNodeManager+get)
    * [.getCurried(name, cloned)](#MuNodeManager+getCurried)

<a name="new_MuNodeManager_new"></a>

### new MuNodeManager()
Nothing to see here, pretty standard instance constructor...

<a name="MuNodeManager+add"></a>

### muNodeManager.add(name, selector, context, clone)
This is the heavy lifter here

**Kind**: instance method of [<code>MuNodeManager</code>](#MuNodeManager)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>String</code> |  | The name you want to store it under |
| selector | <code>String</code> |  | Where to find your node |
| context | <code>SomethingDomish</code> |  | Defaults to document |
| clone | <code>Boolean</code> | <code>true</code> | Clone it or just store reference, defaults to true |

<a name="MuNodeManager+addAndRemove"></a>

### muNodeManager.addAndRemove()
Like [add](#MuNodeManager+add) but it removes the node from the document after jacking it

**Kind**: instance method of [<code>MuNodeManager</code>](#MuNodeManager)  
<a name="MuNodeManager+getCloned"></a>

### muNodeManager.getCloned()
Get a clone of something you stored earlier!!

**Kind**: instance method of [<code>MuNodeManager</code>](#MuNodeManager)  
<a name="MuNodeManager+get"></a>

### muNodeManager.get()
Get a direct reference to something you stored earlier!
Not as exciting as [getCloned](#MuNodeManager+getCloned) so only one !

**Kind**: instance method of [<code>MuNodeManager</code>](#MuNodeManager)  
<a name="MuNodeManager+getCurried"></a>

### muNodeManager.getCurried(name, cloned)
Maybe you know what you want now, but later you won't,
but you'll like, still want it, later, when you want it.

**Kind**: instance method of [<code>MuNodeManager</code>](#MuNodeManager)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>String</code> |  | Name of the node you want |
| cloned | <code>Boolean</code> | <code>true</code> | Defaults to true, if false gets raw node reference, not clone... |

<a name="MuPaginator"></a>

## MuPaginator
Class for 'paginating' an array

**Kind**: global class  

* [MuPaginator](#MuPaginator)
    * [new MuPaginator(options)](#new_MuPaginator_new)
    * [.paginator()](#MuPaginator+paginator)
    * [.getPage(pageNumber)](#MuPaginator+getPage)
    * [.maxPage()](#MuPaginator+maxPage)
    * [.isLastPage()](#MuPaginator+isLastPage)
    * [.lastPage()](#MuPaginator+lastPage)
    * [.firstPage()](#MuPaginator+firstPage)
    * [.nextPage()](#MuPaginator+nextPage)
    * [.previousPage()](#MuPaginator+previousPage)

<a name="new_MuPaginator_new"></a>

### new MuPaginator(options)
Set a pagesize and pass in some  data, if you reset or change data from outside
you should probably go ahead and set instance.paginate to undefined before
getting next page or change current page...or really do whatever to get
your desired result


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options for paginator |
| options.pageSize | <code>Integer</code> | Items to return per page |
| options.data | <code>Array</code> | An array to paginate, yay! |

**Example**  
```js
let p = new MuPaginator({pageSize: 2, data: [1,2,3,4,5,6,7,8,9,10]})
console.log(p.nextPage())
// [3,4]
```
<a name="MuPaginator+paginator"></a>

### muPaginator.paginator()
Internal generator function, for the actual paginating, cause why the hell not

**Kind**: instance method of [<code>MuPaginator</code>](#MuPaginator)  
**Yields**: <code>(Value \| PageDone)</code> Very fancy  
<a name="MuPaginator+getPage"></a>

### muPaginator.getPage(pageNumber)
Does pretty much all of the work, returns a page by pagenumber.

**Kind**: instance method of [<code>MuPaginator</code>](#MuPaginator)  

| Param | Type | Description |
| --- | --- | --- |
| pageNumber | <code>Integer</code> | defaults to this.currentPage if not provided |

<a name="MuPaginator+maxPage"></a>

### muPaginator.maxPage()
Returns the max possible page number

**Kind**: instance method of [<code>MuPaginator</code>](#MuPaginator)  
<a name="MuPaginator+isLastPage"></a>

### muPaginator.isLastPage()
Are we on the last page?

**Kind**: instance method of [<code>MuPaginator</code>](#MuPaginator)  
<a name="MuPaginator+lastPage"></a>

### muPaginator.lastPage()
If we weren't, we are now, on the last page that is.

**Kind**: instance method of [<code>MuPaginator</code>](#MuPaginator)  
<a name="MuPaginator+firstPage"></a>

### muPaginator.firstPage()
Similar to [lastPage](#MuPaginator+lastPage) except by some miracle, gets you the first page

**Kind**: instance method of [<code>MuPaginator</code>](#MuPaginator)  
<a name="MuPaginator+nextPage"></a>

### muPaginator.nextPage()
Now this one is unique, it gets you the next page

**Kind**: instance method of [<code>MuPaginator</code>](#MuPaginator)  
<a name="MuPaginator+previousPage"></a>

### muPaginator.previousPage()
Ok I lied [nextPage](#MuPaginator+nextPage) wasn't that unique, this gets a page too
but the previous one this time.

**Kind**: instance method of [<code>MuPaginator</code>](#MuPaginator)  
<a name="MuObservableObject"></a>

## MuObservableObject()
A mystical thing, uses traps to watch for changes to an object,
also has derived properties.

**Kind**: global function  
**Example**  
```js
let person = MuObservableObject(
   {props: ['firstName','lastName'],
    derived: {
        fullName: {
            deps: ['firstName','lastName'],
            fn: function(){
                return `${this.firstName} ${this.lastName}`
            }
        }
    }})
let dude = new person({firstName: 'jim', lastName: 'smith'})
console.log(dude.fullName)
// Magically fullName is 'jim smith' and if you change first or last...magic
// fullName updates...crazy
person.on('change:fullName',doSomething)
// can also listen for changes on any property.
```
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
<a name="muCss"></a>

## muCss(style, id)
Inject a style sheet, if you feel so inclined

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| style | <code>String</code> | some string of css |
| id | <code>String</code> | optional id for the style node you are about to inject |

**Example**  
```js
muCss('.someClass {background-color: red}')
```

* * *

&copy; 2016-2017 Seth Price

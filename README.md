## Classes

<dl>
<dt><a href="#MuWrapperView">MuWrapperView</a> ⇐ <code>MuEvent</code></dt>
<dd><p>Abstract class for wrapping more complex constructs.</p>
</dd>
<dt><a href="#MuView">MuView</a> ⇐ <code>MuEvent</code></dt>
<dd><p>Main class for for a &#39;view&#39;</p>
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
Main class for for a 'view'

**Kind**: global class  
**Extends**: <code>MuEvent</code>  

* [MuView](#MuView) ⇐ <code>MuEvent</code>
    * [new MuView(options)](#new_MuView_new)
    * [.references(references)](#MuView+references)

<a name="new_MuView_new"></a>

### new MuView(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | various options |
| options.template | <code>function</code> \| <code>String</code> | Template to become this.el |
| options.model | <code>MuModel</code> | Model that bindings will use |
| options.bindings | <code>Object</code> | An object with model properties to watch as keys |
| options.events | <code>Object</code> | An object with 'event-type element > .foo' as keys            and fn as value, to be bound to this.el |
| options.autoRender | <code>Boolean</code> | Call render at end of constructor |

<a name="MuView+references"></a>

### muView.references(references)
**Kind**: instance method of [<code>MuView</code>](#MuView)  

| Param | Type | Description |
| --- | --- | --- |
| references | <code>Object</code> | An object describing dom references            bound to 'this', and the selectors to use. Called internally.            The references are mainly  used inside of your event bindings,            for easy access without excessive dom queries.            Will handle a selector or muDom instance. |

**Example**  
```js
myView.references({aBtn: 'button #myButton'});
myView.aBtn.on('click',()=>{console.log('button clicked')});
```

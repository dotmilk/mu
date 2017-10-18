## Classes

<dl>
<dt><a href="#MuWrapperView">MuWrapperView</a> ⇐ <code>MuEvent</code></dt>
<dd><p>Abstract class for wrapping more complex constructs.</p>
</dd>
<dt><a href="#MuView">MuView</a> ⇐ <code>MuEvent</code></dt>
<dd><p>Main class for for a &#39;view</p>
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
Main class for for a 'view

**Kind**: global class  
**Extends**: <code>MuEvent</code>  
<a name="new_MuView_new"></a>

### new MuView(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | various options |
|  | <code>function</code> \| <code>string</code> | Template to become this.el |


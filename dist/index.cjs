var m=Object.defineProperty;var c=Object.getOwnPropertyDescriptor;var f=Object.getOwnPropertyNames;var b=Object.prototype.hasOwnProperty;var g=(r,e)=>{for(var n in e)m(r,n,{get:e[n],enumerable:!0})},x=(r,e,n,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of f(e))!b.call(r,o)&&o!==n&&m(r,o,{get:()=>e[o],enumerable:!(s=c(e,o))||s.enumerable});return r};var y=r=>x(m({},"__esModule",{value:!0}),r);var w={};g(w,{MU_CSS:()=>p,MuTagen:()=>h,muCss:()=>l,muDom:()=>u});module.exports=y(w);function l(r,e){let n=document.createElement("style");e&&(n.id=e),n.innerHTML=r,document.body.appendChild(n)}var p=`
#mu-overlay > :not(:last-child) {
  display: none !important;
}
#mu-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: fixed;
  background: #666;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 9010;
  transition: opacity .3s;
  visibility: hidden;
}
.mu-overlay-show {
  opacity: 1 !important;
  visibility: visible !important;
}
.mu-select-overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  background: #666;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
  z-index: 9010;
  transition: opacity .3s;
}
.mu-select-show {
  opacity: 1;
  visibility: visible;
}
.muModal {
  color: #888;
  transform: translateX(-50%) scale(0.8, 0.8);
  left: 50%;
  top: 10px;
  border-radius: 6px;
  position: fixed;
  width: 280px;
  z-index: 9015;
  transition: all .3s;
  visibility: hidden;
  background: #f2f2f2;
  opacity: 0;
}
.muModal header {
  text-align: center;
  letter-spacing: 1px;
  font-weight: 700;
  padding: 20px 10px;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #afafaf;
}
.muModal .muOption[selected="true"] {
  background-color: #c2c2c2;
}
.muModal .muOption[selected="true"] .muCircle {
  background-color: #888;
}
.muModal .muCircle {
  border: 1px solid #afafaf;
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 2px;
  right: 12px;
}
.muModal .muOption {
  text-transform: capitalize;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 1.2px;
  cursor: pointer;
  padding: 14px 10px;
  border-bottom: 1px solid #afafaf;
  position: relative;
}
.muModal .muNoResults {
  text-transform: capitalize;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 1.2px;
  cursor: pointer;
  padding: 14px 10px;
  border-bottom: 1px solid #afafaf;
  position: relative;
  cursor: initial;
}
.muModal footer :first-child {
  border-right: 1px solid #afafaf;
}
.muModal footer {
  display: flex;
}
.muModal footer button {
  background: 0 0;
  border: none;
  width: 100%;
  margin-top: 10px;
  padding-top: 16px;
  padding-bottom: 18px;
  cursor: pointer;
  letter-spacing: 1px;
  font-weight: 700;
  border-radius: 0 0 3px 3px;
  outline: none;
  border-top: 1px solid #afafaf;
}
.mu-modal-show {
  transform: translateX(-50%) scale(1, 1);
  visibility: visible;
  opacity: 1;
  box-shadow: 0 30px 10px -20px #777;
}
.muModalMain {
  overflow-y: auto;
  max-height: 60vh;
}
.muSearch {
  margin-top: 15px;
}
.muSearch > input {
  width: calc(92%);
  padding: 8px 4px;
  margin: 6px;
  border: 1px solid #ddd;
}
.muLogic {
  display: flex;
}
.muLogic .muOption {
  flex-grow: 1;
  border-right: 1px solid #afafaf;
}
.muLogic .muOption:last-child {
  border-right: none;
}
.muTable {
  background-color: #F3F3F3;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  max-width: max-content;
}
.muTable .muTableControls {
  display: flex;
  font-size: 1.4rem;
  height: 2rem;
  line-height: 2rem;
  padding: 1.2rem 1.2rem;
  text-align: center;
  text-decoration: none;
  user-select: none;
  vertical-align: middle;
}
.muTable .muTableControls input {
  width: 4ch;
  padding: 0.5rem;
  border-radius: 0.2rem;
}
.muTable .muTableControls input[type=number]::-webkit-inner-spin-button,
.muTable .muTableControls input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.muTable .muTableControls button {
  height: 2rem;
  border-radius: 0.2rem;
  border: 0;
}
.muTable .muTableControls button:focus {
  outline: none;
}
.muTable .muTableControls :not(:first-child) {
  margin-left: 0.5rem;
}
.muTable table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}
.muTable table thead {
  background-color: #c8c8c8;
}
.muTable table thead th {
  text-align: left;
  padding: 0.5rem;
}
.muTable table tbody tr.selected:hover {
  background-color: #7C8AA5;
}
.muTable table tbody tr.selected {
  background-color: #7C8AA5;
}
.muTable table tbody tr:hover {
  background-color: #DADADA;
}
.muTable table tbody tr td {
  padding: 0.5rem;
  text-align: left;
}
`;function u(r,e){if(!window.muDomInjected){let t=".muHide { display: none !important}";document.readyState=="complete"||document.readyState=="interactive"?l(t,"muDom"):document.addEventListener("DOMContentLoaded",()=>{l(t,"muDom")}),window.muDomInjected=!0}function n(t){return document.createRange().createContextualFragment(`<template>${t}</template>`).children[0].content.children[0]}let s={html(t){return this.elements.forEach(i=>{i.innerHTML=t}),this},value(t){return t||t==""?(this.elements.forEach(i=>{i.value=t}),this):this.count==1?this.elements[0].value:this.elements.map(i=>i.value)},text(t){return this.elements.forEach(i=>{i.innerText=t}),this},setAttribute(t,i){return this.elements.forEach(a=>{a.setAttribute(t,i)}),this},src(t){return this.setAttribute("src",t)},each(t){return this.elements.forEach(t),this},some(t){return this.elements.some(t)},map(t){return this.elements.map(t)},siblings(){let t=[],i=this.elements[0].parentNode.firstChild;do i!=this.elements[0]&&i.nodeType!=3&&t.push(i);while(i=i.nextSibling);return u(t,this.context)},is(t){return this.elements.some(i=>i.matches(t))},focus(){return this.elements.length==1&&this.elements[0].focus(),this},element(){return this.elements[0]},blur(){return this.each(t=>{t.blur()}),this},toggle(t="muHide"){return this.each(i=>{i.classList.contains(t)?i.classList.remove(t):i.classList.add(t)}),this},hide(){return this.each(t=>{t.classList.add("muHide")}),this},show(){return this.each(t=>{t.classList.remove("muHide")}),this},addClass(t){return this.each(i=>{i.classList.add(t)}),this},removeClass(t){return this.each(i=>{i.classList.remove(t)}),this},swap(t){return this.each(i=>{i.parentNode.replaceChild(t,i)}),this},swap_(t){let i=this.elements[0];return i.parentNode.replaceChild(t,i),i},on(t,i,a){return this.each(d=>{d.addEventListener(t,i,a)}),this},off(t,i,a){return this.each(d=>{d.removeEventListener(t,i,a)}),this},find(t){return this.count?u(t,this.context):(this.elements=Array.from(this.context.querySelectorAll(t)),this.count=this.elements.length,this)},append(t){return typeof t=="string"&&(t=n(t)),this.each(i=>{i.append(t)})},prepend(t){return typeof t=="string"&&(t=n(t)),this.each(i=>{i.prepend(t.cloneNode(!0))})},remove(){return this.each(t=>{t.parentNode.removeChild(t)})},clear(){return this.each(t=>{for(;t.firstChild;)t.removeChild(t.firstChild)}),this}};function o(t){Object.assign(this,s),this.context=t,this.elements=[],this.count=0,this.isMudom=!0}if(r.isMudom)return r;if(typeof r=="string"&&r[0]==="<"&&r[r.length-1]===">"&&r.length>=3&&(r=n(r)),Array.isArray(r)){let t=new o(e);return t.elements=r,t.count=r.length,t}if(r.nodeType&&!e){let t=new o(r);return t.elements.push(r),t.count=1,t}else{if(typeof r=="string"&&!e)return new o(document).find(r);if(typeof r=="string"&&e)return new o(e).find(r);throw console.log(r,e),"WTF are you trying to do"}}var h=class r{constructor(e,n){return this.fullPrefix=e||[],this.parent=n,this.children=[],this.elem,this.attributes=[],this.compiledString,this.template,this.innerText,this}tag(e,n){if(this.elem){let s;this.fullPrefix.length?(s=[].concat(this.fullPrefix),n&&s.push(n)):n&&(s=[n]);let o=new r(s,this).tag(e);return this.children.push(o),o}return n&&this.fullPrefix.push(n),this.elem={open:`<${e}`,afterOpen:">",close:`</${e}>`},this}attribute(e,n=e){return e in this.attributes||this.attributes.push([e,n]),this}class(e="class"){return this.attribute("class",e)}id(e="id"){return this.attribute("id",e)}text(e="text"){return this.innerText=e,this}close(){return this.parent?this.parent:this}closeAll(){let e=this.parent;for(;e.parent;)e=e.parent;return e}compileAttributes(){let e="";for(let n of this.attributes)e+=` ${n[0]}="`,e+="${",this.fullPrefix.length?e+=`opts.${this.fullPrefix.join(".")}["${n[1]}"]`:e+=`opts.${n[1]}`,e+='}"';return e}compile(e){let n,s="";if(this.parent&&!e)return this.parent.compile();let o=this.children.map(t=>(t.compile(!0),t.compiledString));return s=this.compileAttributes(),n=o.join(""),this.innerText?this.compiledString=this.elem.open+s+this.elem.afterOpen+`\${opts${this.fullPrefix.length?"."+this.fullPrefix.join("."):""}['${this.innerText}']}`+n+this.elem.close:this.compiledString=this.elem.open+s+this.elem.afterOpen+n+this.elem.close,this.template=new Function("opts",`return \`${this.compiledString}\``),this}render(e){if(!this.template)throw"No template compiled";return document.createRange().createContextualFragment(`<template>${this.template(e)}</template>`).children[0].content.children[0]}};0&&(module.exports={MU_CSS,MuTagen,muCss,muDom});

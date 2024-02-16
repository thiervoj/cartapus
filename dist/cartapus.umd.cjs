(function(c,n){typeof exports=="object"&&typeof module<"u"?module.exports=n():typeof define=="function"&&define.amd?define(n):(c=typeof globalThis<"u"?globalThis:c||self,c.Cartapus=n())})(this,function(){"use strict";var L=(c,n,f)=>{if(!n.has(c))throw TypeError("Cannot "+f)};var p=(c,n,f)=>{if(n.has(c))throw TypeError("Cannot add the same private member more than once");n instanceof WeakSet?n.add(c):n.set(c,f)};var u=(c,n,f)=>(L(c,n,"access private method"),f);var m,w,g,C,d,l,b,T,_,N,O,R,y,j,M,F;function c(o){return o&&o.__esModule&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o}var n={exports:{}};function f(){}f.prototype={on:function(o,h,t){var e=this.e||(this.e={});return(e[o]||(e[o]=[])).push({fn:h,ctx:t}),this},once:function(o,h,t){var e=this;function s(){e.off(o,s),h.apply(t,arguments)}return s._=h,this.on(o,s,t)},emit:function(o){var h=[].slice.call(arguments,1),t=((this.e||(this.e={}))[o]||[]).slice(),e=0,s=t.length;for(e;e<s;e++)t[e].fn.apply(t[e].ctx,h);return this},off:function(o,h){var t=this.e||(this.e={}),e=t[o],s=[];if(e&&h)for(var r=0,i=e.length;r<i;r++)e[r].fn!==h&&e[r].fn._!==h&&s.push(e[r]);return s.length?t[o]=s:delete t[o],this}},n.exports=f,n.exports.TinyEmitter=f;var q=n.exports;const I=c(q);class S extends I{constructor(t={}){super();p(this,m);p(this,g);p(this,d);p(this,b);p(this,_);p(this,O);p(this,y);p(this,M);this.intersect=u(this,O,R).bind(this),this.mutate=u(this,M,F).bind(this),this.isObserving=!1,this.options=Object.assign({root:null,rootMargin:"0px",threshold:0,once:!1},t),this.observers=[u(this,b,T).call(this)],u(this,m,w).call(this),u(this,_,N).call(this),this.observe()}observe(){if(!this.isObserving){this.isObserving=!0;for(const t of this.observers)for(const e of t.elements)t.observer.observe(e)}}unobserve(){if(this.isObserving){this.isObserving=!1;for(const t of this.observers)for(const e of t.elements)t.observer.unobserve(e)}}triggerEvents(t){var e,s;if(t){const r=Array.isArray(t)?t:[t];for(const i of r)(e=i._cartapus)==null||e.observer.unobserve(i),(s=i._cartapus)==null||s.observer.observe(i);return}for(const r of this.observers)for(const i of r.elements)r.observer.unobserve(i),r.observer.observe(i)}add(t){const e=u(this,d,l).call(this,t);return e&&t._cartapus.observer.observe(t),e}destroy(){this.unobserve(),this.mutationObserver.disconnect();for(const t of this.observers){for(const e of t.elements)delete e._cartapus;t.observer.disconnect(),t.elements=[]}}}return m=new WeakSet,w=function(){const e=(this.options.root?this.options.root:document).querySelectorAll("[data-cartapus]");for(const s of e)u(this,d,l).call(this,s)},g=new WeakSet,C=function(t){if(!t)return;const e=t.dataset.cartapusThreshold?parseFloat(t.dataset.cartapusThreshold):this.options.threshold,s=t.dataset.cartapusRootMargin?t.dataset.cartapusRootMargin:this.options.rootMargin;return this.observers.find(i=>i.threshold===e&&i.rootMargin===s)},d=new WeakSet,l=function(t){if(!t||!t.hasAttribute||!t.hasAttribute("data-cartapus"))return!1;if(t.dataset.cartapusThreshold||t.dataset.cartapusRootMargin){const e=u(this,g,C).call(this,t);if(e)e.elements.push(t),t._cartapus=e;else{const s=t.dataset.cartapusThreshold?parseFloat(t.dataset.cartapusThreshold):this.options.threshold,r=t.dataset.cartapusRootMargin?t.dataset.cartapusRootMargin:this.options.rootMargin;s>=0&&s<=1?this.observers.push(u(this,b,T).call(this,{element:t,options:{threshold:s,rootMargin:r}})):console.warn("[Cartapus] : Threshold values must be numbers between 0 and 1")}}else this.observers[0].elements.push(t),t._cartapus=this.observers[0];return!0},b=new WeakSet,T=function({options:t,element:e}={}){const s={...this.options,...t},r={observer:new IntersectionObserver(this.intersect,s),threshold:s.threshold,rootMargin:s.rootMargin,elements:e?[e]:[]};return e&&(e._cartapus=r),r},_=new WeakSet,N=function(){this.mutationObserver||(this.mutationObserver=new MutationObserver(this.mutate),this.mutationObserver.observe(this.options.root?this.options.root:document.body,{childList:!0,subtree:!0}))},O=new WeakSet,R=function(t,e){for(const s of t){if(s.isIntersecting){s.target.setAttribute("data-cartapus","visible");const r=s.target.getAttribute("data-cartapus-once");if(r==="false")continue;r!==null&&(e.unobserve(s.target),s.target._cartapus.elements.splice(s.target._cartapus.elements.indexOf(s.target),1))}else s.target.setAttribute("data-cartapus","hidden");u(this,y,j).call(this,s)}},y=new WeakSet,j=function(t){const e={element:t.target,visible:t.isIntersecting,intersection:t},s=new CustomEvent("cartapusintersect",{detail:e});t.target.dispatchEvent(s),this.emit("intersect",e)},M=new WeakSet,F=function(t){var e,s,r,i;for(const x of t)if(x.type==="childList"){for(const a of x.addedNodes)if(u(this,d,l).call(this,a)&&a._cartapus.observer.observe(a),a._cartapus){const v=a.querySelectorAll("[data-cartapus]");for(const A of v)u(this,d,l).call(this,A)&&((e=A._cartapus)==null||e.observer.observe(A))}for(const a of x.removedNodes){if(a._cartapus){const E=a._cartapus.elements.indexOf(a);a._cartapus.elements.splice(E,1),a._cartapus.observer.unobserve(a)}if(a._cartapus){const E=a.querySelectorAll("[data-cartapus]");for(const v of E)(r=v._cartapus)==null||r.elements.splice((s=v._cartapus)==null?void 0:s.elements.indexOf(v),1),(i=v._cartapus)==null||i.observer.unobserve(v)}}}},S});
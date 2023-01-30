(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const r of e.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function o(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerpolicy&&(e.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?e.credentials="include":t.crossorigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function s(t){if(t.ep)return;t.ep=!0;const e=o(t);fetch(t.href,e)}})();function h(n,i){return h=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(o,s){return o.__proto__=s,o},h(n,i)}function m(n,i){(i==null||i>n.length)&&(i=n.length);for(var o=0,s=new Array(i);o<i;o++)s[o]=n[o];return s}function l(n,i){var o=typeof Symbol<"u"&&n[Symbol.iterator]||n["@@iterator"];if(o)return(o=o.call(n)).next.bind(o);if(Array.isArray(n)||(o=function(t,e){if(t){if(typeof t=="string")return m(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return r==="Object"&&t.constructor&&(r=t.constructor.name),r==="Map"||r==="Set"?Array.from(t):r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?m(t,e):void 0}}(n))||i&&n&&typeof n.length=="number"){o&&(n=o);var s=0;return function(){return s>=n.length?{done:!0}:{done:!1,value:n[s++]}}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function d(){}d.prototype={on:function(n,i,o){var s=this.e||(this.e={});return(s[n]||(s[n]=[])).push({fn:i,ctx:o}),this},once:function(n,i,o){var s=this;function t(){s.off(n,t),i.apply(o,arguments)}return t._=i,this.on(n,t,o)},emit:function(n){for(var i=[].slice.call(arguments,1),o=((this.e||(this.e={}))[n]||[]).slice(),s=0,t=o.length;s<t;s++)o[s].fn.apply(o[s].ctx,i);return this},off:function(n,i){var o=this.e||(this.e={}),s=o[n],t=[];if(s&&i)for(var e=0,r=s.length;e<r;e++)s[e].fn!==i&&s[e].fn._!==i&&t.push(s[e]);return t.length?o[n]=t:delete o[n],this}};var g=d;g.TinyEmitter=d;var y=function(n){var i,o;function s(e){var r;return e===void 0&&(e={}),(r=n.call(this)||this).intersect=r.intersect.bind(function(c){if(c===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return c}(r)),r.options=Object.assign({root:null,rootMargin:"0px",threshold:0,once:!1},e),r.observers=[r.createObserver()],r.getElems(),r.createObservers(),r.observe(),r}o=n,(i=s).prototype=Object.create(o.prototype),i.prototype.constructor=i,h(i,o);var t=s.prototype;return t.getElems=function(){var e=this.options.root?this.options.root:document;this.elems=e.querySelectorAll("[data-cartapus]")},t.createObservers=function(){for(var e,r=this,c=function(){var a=e.value;if(a.dataset.cartapusThreshold||a.dataset.cartapusRootMargin){var f=a.dataset.cartapusThreshold?parseFloat(a.dataset.cartapusThreshold):r.options.threshold,v=a.dataset.cartapusRootMargin?a.dataset.cartapusRootMargin:r.options.rootMargin,p=r.observers.find(function(b){return b.threshold===f&&b.rootMargin===v});p?p.elements.push(a):r.observers.push(r.createObserver({element:a,options:{threshold:f,rootMargin:v}}))}else r.observers[0].elements.push(a)},u=l(this.elems);!(e=u()).done;)c()},t.createObserver=function(e){var r=e===void 0?{}:e,c=r.element,u=Object.assign(this.options,r.options);return{observer:new IntersectionObserver(this.intersect,u),threshold:u.threshold,rootMargin:u.rootMargin,elements:c?[c]:[]}},t.intersect=function(e,r){for(var c,u=l(e);!(c=u()).done;){var a=c.value;a.isIntersecting?(a.target.setAttribute("data-cartapus","visible"),a.target.hasAttribute("data-cartapus-once")&&r.unobserve(a.target)):a.target.setAttribute("data-cartapus","hidden"),this.dispatch(a)}},t.dispatch=function(e){var r={element:e.target,visible:e.isIntersecting,intersection:e},c=new CustomEvent("cartapusintersect",{detail:r});e.target.dispatchEvent(c),this.emit("intersect",r)},t.observe=function(){for(var e,r=l(this.observers);!(e=r()).done;)for(var c,u=e.value,a=l(u.elements);!(c=a()).done;){var f=c.value;f._cartapus=u,u.observer.observe(f)}},t.unobserve=function(){for(var e,r=l(this.observers);!(e=r()).done;)for(var c,u=e.value,a=l(u.elements);!(c=a()).done;)u.observer.unobserve(c.value)},t.destroy=function(){this.unobserve();for(var e,r=l(this.observers);!(e=r()).done;)e.value.elements=[]},t.reset=function(){this.destroy(),this.init()},s}(g);new y;

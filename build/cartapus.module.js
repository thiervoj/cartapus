function t(e,r){return t=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},t(e,r)}function e(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function r(t,r){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(n)return(n=n.call(t)).next.bind(n);if(Array.isArray(t)||(n=function(t,r){if(t){if("string"==typeof t)return e(t,r);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?e(t,r):void 0}}(t))||r&&t&&"number"==typeof t.length){n&&(t=n);var o=0;return function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function n(){}n.prototype={on:function(t,e,r){var n=this.e||(this.e={});return(n[t]||(n[t]=[])).push({fn:e,ctx:r}),this},once:function(t,e,r){var n=this;function o(){n.off(t,o),e.apply(r,arguments)}return o._=e,this.on(t,o,r)},emit:function(t){for(var e=[].slice.call(arguments,1),r=((this.e||(this.e={}))[t]||[]).slice(),n=0,o=r.length;n<o;n++)r[n].fn.apply(r[n].ctx,e);return this},off:function(t,e){var r=this.e||(this.e={}),n=r[t],o=[];if(n&&e)for(var s=0,i=n.length;s<i;s++)n[s].fn!==e&&n[s].fn._!==e&&o.push(n[s]);return o.length?r[t]=o:delete r[t],this}};var o=n;o.TinyEmitter=n;var s=/*#__PURE__*/function(e){var n,o;function s(t){var r;return void 0===t&&(t={}),(r=e.call(this)||this).intersect=r.intersect.bind(function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(r)),r.options=Object.assign({root:null,rootMargin:"0px",threshold:0,once:!1,events:!0},t),r.createMainObserver(),r.init(),r}o=e,(n=s).prototype=Object.create(o.prototype),n.prototype.constructor=n,t(n,o);var i=s.prototype;return i.createMainObserver=function(){this.observers=[{observer:new IntersectionObserver(this.intersect,this.options),threshold:this.options.threshold,rootMargin:this.options.rootMargin,elements:[]}]},i.init=function(){this.getElems(),this.createObservers(),this.observe()},i.getElems=function(){var t=null===this.options.root?document:this.options.root;this.elems=t.querySelectorAll("[data-cartapus]")},i.createObservers=function(){for(var t,e=r(this.elems);!(t=e()).done;){var n=t.value;if(n.dataset.cartapusThreshold||n.dataset.cartapusRootMargin){for(var o,s=n.dataset.cartapusThreshold?parseFloat(n.dataset.cartapusThreshold):this.options.threshold,i=n.dataset.cartapusRootMargin?n.dataset.cartapusRootMargin:this.options.rootMargin,a=!1,c=r(this.observers);!(o=c()).done;){var h=o.value;s===h.threshold&&i===h.rootMargin&&(a=!0,h.elements.push(n))}if(!a){var u={observer:new IntersectionObserver(this.intersect,Object.assign(this.options,{threshold:s,rootMargin:i})),threshold:s,rootMargin:i,elements:[n]};this.observers.push(u)}}else this.observers[0].elements.push(n)}},i.intersect=function(t,e){var r=this;t.forEach(function(t){t.isIntersecting?(t.target.dataset.cartapus="visible",r.options.once&&"false"!==t.target.dataset.cartapusOnce&&e.unobserve(t.target)):t.target.dataset.cartapus="hidden",r.options.events&&r.dispatch(t)})},i.dispatch=function(t){var e={element:t.target,visible:t.isIntersecting,intersection:t},r=new CustomEvent("cartapusintersect",{detail:e});t.target.dispatchEvent(r),this.emit("intersect",e)},i.observe=function(){this.observers.forEach(function(t){t.elements.forEach(function(e){t.observer.observe(e)})})},i.unobserve=function(){this.observers.forEach(function(t){t.elements.forEach(function(e){t.observer.unobserve(e)})})},i.destroy=function(){this.unobserve(),this.observers.forEach(function(t){t.elements=[]})},i.reset=function(){this.destroy(),this.init()},s}(o);export{s as default};
//# sourceMappingURL=cartapus.module.js.map

function e(t,r){return e=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},e(t,r)}function t(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,s=new Array(t);r<t;r++)s[r]=e[r];return s}function s(e,t){var s="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(s)return(s=s.call(e)).next.bind(s);if(Array.isArray(e)||(s=function(e,t){if(e){if("string"==typeof e)return r(e,t);var s=Object.prototype.toString.call(e).slice(8,-1);return"Object"===s&&e.constructor&&(s=e.constructor.name),"Map"===s||"Set"===s?Array.from(e):"Arguments"===s||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s)?r(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){s&&(e=s);var a=0;return function(){return a>=e.length?{done:!0}:{done:!1,value:e[a++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function a(){}a.prototype={on:function(e,t,r){var s=this.e||(this.e={});return(s[e]||(s[e]=[])).push({fn:t,ctx:r}),this},once:function(e,t,r){var s=this;function a(){s.off(e,a),t.apply(r,arguments)}return a._=t,this.on(e,a,r)},emit:function(e){for(var t=[].slice.call(arguments,1),r=((this.e||(this.e={}))[e]||[]).slice(),s=0,a=r.length;s<a;s++)r[s].fn.apply(r[s].ctx,t);return this},off:function(e,t){var r=this.e||(this.e={}),s=r[e],a=[];if(s&&t)for(var o=0,n=s.length;o<n;o++)s[o].fn!==t&&s[o].fn._!==t&&a.push(s[o]);return a.length?r[e]=a:delete r[e],this}};var o=a;o.TinyEmitter=a;var n=/*#__PURE__*/function(r){var a,o;function n(e){var s;return void 0===e&&(e={}),(s=r.call(this)||this).intersect=s.intersect.bind(t(s)),s.mutate=s.mutate.bind(t(s)),s.isObserving=!1,s.options=Object.assign({root:null,rootMargin:"0px",threshold:0,once:!1},e),s.observers=[s.createObserver()],s.createObservers(),s.createMutationObserver(),s.observe(),s}o=r,(a=n).prototype=Object.create(o.prototype),a.prototype.constructor=a,e(a,o);var i=n.prototype;return i.createObservers=function(){for(var e,t=s((this.options.root?this.options.root:document).querySelectorAll("[data-cartapus]"));!(e=t()).done;)this.storeNewElement(e.value)},i.findObserverForElement=function(e){if(e){var t=e.dataset.cartapusThreshold?parseFloat(e.dataset.cartapusThreshold):this.options.threshold,r=e.dataset.cartapusRootMargin?e.dataset.cartapusRootMargin:this.options.rootMargin;return this.observers.find(function(e){return e.threshold===t&&e.rootMargin===r})}},i.storeNewElement=function(e){if(!e||!e.hasAttribute||!e.hasAttribute("data-cartapus"))return!1;if(e.dataset.cartapusThreshold||e.dataset.cartapusRootMargin){var t=this.findObserverForElement(e);if(t)t.elements.push(e),e._cartapus=t;else{var r=e.dataset.cartapusThreshold?parseFloat(e.dataset.cartapusThreshold):this.options.threshold;this.observers.push(this.createObserver({element:e,options:{threshold:r,rootMargin:e.dataset.cartapusRootMargin?e.dataset.cartapusRootMargin:this.options.rootMargin}}))}}else this.observers[0].elements.push(e),e._cartapus=this.observers[0];return!0},i.createObserver=function(e){var t=void 0===e?{}:e,r=t.element,s=Object.assign(this.options,t.options),a={observer:new IntersectionObserver(this.intersect,s),threshold:s.threshold,rootMargin:s.rootMargin,elements:r?[r]:[],once:!(!r||!r.hasAttribute("data-cartapus-once")||"false"===r.getAttribute("data-cartapus-once"))||s.once};return r&&(r._cartapus=a),a},i.createMutationObserver=function(){this.mutationObserver=new MutationObserver(this.mutate),this.mutationObserver.observe(this.options.root?this.options.root:document.body,{childList:!0,subtree:!0})},i.intersect=function(e,t){for(var r,a=s(e);!(r=a()).done;){var o=r.value;if(o.isIntersecting){o.target.setAttribute("data-cartapus","visible");var n=o.target.getAttribute("data-cartapus-once");if("false"===n)continue;(o.target._cartapus.once||null!==n)&&t.unobserve(o.target)}else o.target.setAttribute("data-cartapus","hidden");this.dispatch(o)}},i.dispatch=function(e){var t={element:e.target,visible:e.isIntersecting,intersection:e},r=new CustomEvent("cartapusintersect",{detail:t});e.target.dispatchEvent(r),this.emit("intersect",t)},i.mutate=function(e){for(var t,r=s(e);!(t=r()).done;){var a=t.value;if("childList"===a.type){for(var o,n=s(a.addedNodes);!(o=n()).done;){var i=o.value;if(this.storeNewElement(i)&&i._cartapus.observer.observe(i),i._cartapus)for(var u,c=s(i.querySelectorAll("[data-cartapus]"));!(u=c()).done;){var v=u.value;this.storeNewElement(v)&&v._cartapus&&v._cartapus.observer.observe(v)}}for(var l,h=s(a.removedNodes);!(l=h()).done;){var p=l.value;if(p._cartapus){var d=p._cartapus.elements.indexOf(p);p._cartapus.elements.splice(d,1),p._cartapus.observer.unobserve(p)}if(p._cartapus)for(var f,b=s(p.querySelectorAll("[data-cartapus]"));!(f=b()).done;){var m=f.value;if(m._cartapus){var g=m._cartapus.elements.indexOf(m);m._cartapus.elements.splice(g,1),m._cartapus.observer.unobserve(m)}}}}}},i.observe=function(){if(!this.isObserving){this.isObserving=!0;for(var e,t=s(this.observers);!(e=t()).done;)for(var r,a=e.value,o=s(a.elements);!(r=o()).done;)a.observer.observe(r.value)}},i.unobserve=function(){if(this.isObserving){this.isObserving=!1;for(var e,t=s(this.observers);!(e=t()).done;)for(var r,a=e.value,o=s(a.elements);!(r=o()).done;)a.observer.unobserve(r.value)}},i.triggerEvent=function(e){if(e)for(var t,r=s(Array.isArray(e)?e:[e]);!(t=r()).done;){var a=t.value;a._cartapus&&(a._cartapus.observer.unobserve(a),a._cartapus.observer.observe(a))}else for(var o,n=s(this.observers);!(o=n()).done;)for(var i,u=o.value,c=s(u.elements);!(i=c()).done;){var v=i.value;u.observer.unobserve(v),u.observer.observe(v)}},i.add=function(e){var t=this.storeNewElement(e);return t&&e._cartapus.observer.observe(e),t},i.destroy=function(){this.unobserve(),this.mutationObserver.disconnect();for(var e,t=s(this.observers);!(e=t()).done;){for(var r,a=e.value,o=s(a.elements);!(r=o()).done;)delete r.value._cartapus;a.observer.disconnect(),a.elements=[]}},n}(o);export{n as default};
//# sourceMappingURL=cartapus.mjs.map
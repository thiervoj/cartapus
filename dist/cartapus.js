!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e||self)["'Cartapus'"]=t()}(this,function(){function e(t,r){return e=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},e(t,r)}function t(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,o=new Array(t);r<t;r++)o[r]=e[r];return o}function o(e,t){var o="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(o)return(o=o.call(e)).next.bind(o);if(Array.isArray(e)||(o=function(e,t){if(e){if("string"==typeof e)return r(e,t);var o=Object.prototype.toString.call(e).slice(8,-1);return"Object"===o&&e.constructor&&(o=e.constructor.name),"Map"===o||"Set"===o?Array.from(e):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?r(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){o&&(e=o);var n=0;return function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function n(){}n.prototype={on:function(e,t,r){var o=this.e||(this.e={});return(o[e]||(o[e]=[])).push({fn:t,ctx:r}),this},once:function(e,t,r){var o=this;function n(){o.off(e,n),t.apply(r,arguments)}return n._=t,this.on(e,n,r)},emit:function(e){for(var t=[].slice.call(arguments,1),r=((this.e||(this.e={}))[e]||[]).slice(),o=0,n=r.length;o<n;o++)r[o].fn.apply(r[o].ctx,t);return this},off:function(e,t){var r=this.e||(this.e={}),o=r[e],n=[];if(o&&t)for(var s=0,a=o.length;s<a;s++)o[s].fn!==t&&o[s].fn._!==t&&n.push(o[s]);return n.length?r[e]=n:delete r[e],this}};var s=n;return s.TinyEmitter=n,/*#__PURE__*/function(r){var n,s;function a(e){var o;return void 0===e&&(e={}),(o=r.call(this)||this).intersect=o.intersect.bind(t(o)),o.mutate=o.mutate.bind(t(o)),o.options=Object.assign({root:null,rootMargin:"0px",threshold:0,once:!1},e),o.observers=[o.createObserver()],o.createObservers(),o.createMutationObserver(),o.observe(),o}s=r,(n=a).prototype=Object.create(s.prototype),n.prototype.constructor=n,e(n,s);var i=a.prototype;return i.createObservers=function(){for(var e,t=o((this.options.root?this.options.root:document).querySelectorAll("[data-cartapus]"));!(e=t()).done;)this.storeNewElement(e.value)},i.findObserverForElement=function(e){var t=e.dataset.cartapusThreshold?parseFloat(e.dataset.cartapusThreshold):this.options.threshold,r=e.dataset.cartapusRootMargin?e.dataset.cartapusRootMargin:this.options.rootMargin;return this.observers.find(function(e){return e.threshold===t&&e.rootMargin===r})},i.storeNewElement=function(e){if(!e.hasAttribute("data-cartapus"))return!1;if(e.dataset.cartapusThreshold||e.dataset.cartapusRootMargin){var t=this.findObserverForElement(e);if(t)t.elements.push(e),e._cartapus=t;else{var r=e.dataset.cartapusThreshold?parseFloat(e.dataset.cartapusThreshold):this.options.threshold;this.observers.push(this.createObserver({element:e,options:{threshold:r,rootMargin:e.dataset.cartapusRootMargin?e.dataset.cartapusRootMargin:this.options.rootMargin}}))}}else this.observers[0].elements.push(e),e._cartapus=this.observers[0];return!0},i.createObserver=function(e){var t=void 0===e?{}:e,r=t.element,o=Object.assign(this.options,t.options),n={observer:new IntersectionObserver(this.intersect,o),threshold:o.threshold,rootMargin:o.rootMargin,elements:r?[r]:[]};return r&&(r._cartapus=n),n},i.createMutationObserver=function(){this.mutationObserver=new MutationObserver(this.mutate),this.mutationObserver.observe(this.options.root?this.options.root:document.body,{childList:!0,subtree:!0})},i.intersect=function(e,t){for(var r,n=o(e);!(r=n()).done;){var s=r.value;s.isIntersecting?(s.target.setAttribute("data-cartapus","visible"),s.target.hasAttribute("data-cartapus-once")&&t.unobserve(s.target)):s.target.setAttribute("data-cartapus","hidden"),this.dispatch(s)}},i.dispatch=function(e){var t={element:e.target,visible:e.isIntersecting,intersection:e},r=new CustomEvent("cartapusintersect",{detail:t});e.target.dispatchEvent(r),this.emit("intersect",t)},i.mutate=function(e){for(var t,r=o(e);!(t=r()).done;){var n=t.value;if("childList"===n.type){for(var s,a=o(n.addedNodes);!(s=a()).done;){var i=s.value;this.storeNewElement(i)&&i._cartapus.observer.observe(i)}for(var u,c=o(n.removedNodes);!(u=c()).done;){var l=u.value;if(l._cartapus){var h=l._cartapus.elements.indexOf(l);l._cartapus.elements.splice(h,1),l._cartapus.observer.unobserve(l)}}}}},i.observe=function(){for(var e,t=o(this.observers);!(e=t()).done;)for(var r,n=e.value,s=o(n.elements);!(r=s()).done;)n.observer.observe(r.value)},i.unobserve=function(){for(var e,t=o(this.observers);!(e=t()).done;)for(var r,n=e.value,s=o(n.elements);!(r=s()).done;)n.observer.unobserve(r.value)},i.destroy=function(){this.unobserve(),this.mutationObserver.disconnect();for(var e,t=o(this.observers);!(e=t()).done;){for(var r,n=e.value,s=o(n.elements);!(r=s()).done;)delete r.value._cartapus;n.observer.disconnect(),n.elements=[]}},a}(s)});

function t(){}t.prototype={on:function(t,e,s){var r=this.e||(this.e={});return(r[t]||(r[t]=[])).push({fn:e,ctx:s}),this},once:function(t,e,s){var r=this;function o(){r.off(t,o),e.apply(s,arguments)}return o._=e,this.on(t,o,s)},emit:function(t){for(var e=[].slice.call(arguments,1),s=((this.e||(this.e={}))[t]||[]).slice(),r=0,o=s.length;r<o;r++)s[r].fn.apply(s[r].ctx,e);return this},off:function(t,e){var s=this.e||(this.e={}),r=s[t],o=[];if(r&&e)for(var i=0,n=r.length;i<n;i++)r[i].fn!==e&&r[i].fn._!==e&&o.push(r[i]);return o.length?s[t]=o:delete s[t],this}};var e=t;e.TinyEmitter=t;class s extends e{constructor(t={}){super(),this.intersect=this.intersect.bind(this),this.options=Object.assign({root:null,rootMargin:"0px",threshold:0,once:!1,events:!0},t),this.createMainObserver(),this.init()}createMainObserver(){this.observers=[{observer:new IntersectionObserver(this.intersect,this.options),threshold:this.options.threshold,rootMargin:this.options.rootMargin,elements:[]}]}init(){this.getElems(),this.createObservers(),this.observe()}getElems(){const t=null===this.options.root?document:this.options.root;this.elems=t.querySelectorAll("[data-cartapus]")}createObservers(){for(const t of this.elems)if(t.dataset.cartapusThreshold||t.dataset.cartapusRootMargin){const e=t.dataset.cartapusThreshold?parseFloat(t.dataset.cartapusThreshold):this.options.threshold,s=t.dataset.cartapusRootMargin?t.dataset.cartapusRootMargin:this.options.rootMargin;let r=!1;for(const o of this.observers)e===o.threshold&&s===o.rootMargin&&(r=!0,o.elements.push(t));if(!r){const r={observer:new IntersectionObserver(this.intersect,Object.assign(this.options,{threshold:e,rootMargin:s})),threshold:e,rootMargin:s,elements:[t]};this.observers.push(r)}}else this.observers[0].elements.push(t)}intersect(t,e){t.forEach(t=>{t.isIntersecting?(t.target.dataset.cartapus="visible",this.options.once&&"false"!==t.target.dataset.cartapusOnce&&e.unobserve(t.target)):t.target.dataset.cartapus="hidden",this.options.events&&this.dispatch(t)})}dispatch(t){const e={element:t.target,visible:t.isIntersecting,intersection:t},s=new CustomEvent("cartapusintersect",{detail:e});t.target.dispatchEvent(s),this.emit("intersect",e)}observe(){this.observers.forEach(t=>{t.elements.forEach(e=>{t.observer.observe(e)})})}unobserve(){this.observers.forEach(t=>{t.elements.forEach(e=>{t.observer.unobserve(e)})})}destroy(){this.unobserve(),this.observers.forEach(t=>{t.elements=[]})}reset(){this.destroy(),this.init()}}export{s as default};
//# sourceMappingURL=cartapus.modern.js.map

var j = (r, n, t) => {
  if (!n.has(r))
    throw TypeError("Cannot " + t);
};
var u = (r, n, t) => {
  if (n.has(r))
    throw TypeError("Cannot add the same private member more than once");
  n instanceof WeakSet ? n.add(r) : n.set(r, t);
};
var c = (r, n, t) => (j(r, n, "access private method"), t);
function q(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var A = { exports: {} };
function x() {
}
x.prototype = {
  on: function(r, n, t) {
    var e = this.e || (this.e = {});
    return (e[r] || (e[r] = [])).push({
      fn: n,
      ctx: t
    }), this;
  },
  once: function(r, n, t) {
    var e = this;
    function s() {
      e.off(r, s), n.apply(t, arguments);
    }
    return s._ = n, this.on(r, s, t);
  },
  emit: function(r) {
    var n = [].slice.call(arguments, 1), t = ((this.e || (this.e = {}))[r] || []).slice(), e = 0, s = t.length;
    for (e; e < s; e++)
      t[e].fn.apply(t[e].ctx, n);
    return this;
  },
  off: function(r, n) {
    var t = this.e || (this.e = {}), e = t[r], s = [];
    if (e && n)
      for (var o = 0, i = e.length; o < i; o++)
        e[o].fn !== n && e[o].fn._ !== n && s.push(e[o]);
    return s.length ? t[r] = s : delete t[r], this;
  }
};
A.exports = x;
A.exports.TinyEmitter = x;
var I = A.exports;
const S = /* @__PURE__ */ q(I);
var b, w, l, T, f, v, p, E, g, N, m, R, _, C, O, F;
class P extends S {
  /**
   * Creates a new Cartapus instance, starting to watch every `[data-cartapus]` elements' visibility right away.
   *
   * Usually you will only need to instanciate Cartapus once for your whole App.
   *
   * @param {Object} [options] — User options.
   * @param {Element} [options.root=document] — The root DOM element into which [data-cartapus] targets will be watched.
   * @param {String} [options.rootMargin="0px"] — A CSS margin property string defining offsets into the `root` element.
   * @param {Number} [options.threshold=0] — A number between 0 and 1 which defines the percentage of height that must be into the viewport for an element to be considered "visible".
   * @param {Boolean} [options.once=false] — If "true", elements will only toggle to "visible" once and never return to their "hidden" state.
   *
   * @extends Emitter
   * @constructor
   */
  constructor(t = {}) {
    super();
    /**
     * For each [data-cartapus] element, check its inner data-cartapus parameters
     * Create new IntersectionObservers accordingly if parameters differs from the main observer.
     *
     * @private
     * @returns {void}
     */
    u(this, b);
    /**
     * Gets the observer configuration object for the given element.
     *
     * @param {Element} el A DOM element.
     *
     * @private
     * @returns {(undefined|Object)} The found observer object, `undefined` if not found.
     */
    u(this, l);
    /**
     * Stores a new DOM element to be watched. Creating a new `IntersectionObserver` if needed.
     *
     * @param {Element} el A DOM element.
     *
     * @private
     * @returns {Boolean} True if a new element is being watched, else false.
     */
    u(this, f);
    /**
     * Creates a new `IntersectionObserver` with the given options. Optionally watching a given element.
     *
     * @param {(undefined|Object)} param An object containing parameters.
     * @param {(undefined|Object)} param.options An object containing the `IntersectionObserver` parameters.
     * @param {(undefined|Element)} param.element A DOM Element to start observing with the newly created observer.
     *
     * @private
     * @returns {Object} An object with the related observer values.
     */
    u(this, p);
    /**
     * Creates the MutationObserver.
     *
     * @private
     * @returns {void}
     */
    u(this, g);
    /**
     * Callback function triggered by the observers.
     * Sets the data-cartapus attribute accordingly to the visibility of the elements.
     * Triggers the custom events.
     *
     * @param {array.<IntersectionObserverEntry>} entries — An array of entries that intersected with the root.
     * @param {IntersectionObserver} observer — The observer that triggered the event.
     *
     * @private
     * @returns {void}
     */
    u(this, m);
    /**
     * Triggers the CustomEvent `cartapusintersect` on the entry's target.
     * Also triggers an `intersect` event on the class instance.
     *
     * @param {IntersectionObserverEntry} entry — The entry that intersected.
     *
     * @private
     * @returns {void}
     */
    u(this, _);
    /**
     * This method is called on every mutation of the DOM.
     *
     * @param {Array<MutationRecord>} records A array of MutationRecords.
     *
     * @private
     * @returns {void}
     */
    u(this, O);
    this.intersect = c(this, m, R).bind(this), this.mutate = c(this, O, F).bind(this), this.isObserving = !1, this.options = Object.assign({
      root: null,
      rootMargin: "0px",
      threshold: 0,
      once: !1
    }, t), this.observers = [c(this, p, E).call(this)], c(this, b, w).call(this), c(this, g, N).call(this), this.observe();
  }
  /**
   * Turns on all the observers to watch all of their related targets.
   *
   * This will trigger Cartapus events.
   *
   * @public
   * @returns {void}
   */
  observe() {
    if (!this.isObserving) {
      this.isObserving = !0;
      for (const t of this.observers)
        for (const e of t.elements)
          t.observer.observe(e);
    }
  }
  /**
   * Turns off all the observers to stop watching all of their related targets.
   *
   * @public
   * @returns {void}
   */
  unobserve() {
    if (this.isObserving) {
      this.isObserving = !1;
      for (const t of this.observers)
        for (const e of t.elements)
          t.observer.unobserve(e);
    }
  }
  /**
   * Triggers the cartapus events for the given targets. If no targets are given, all the elements will trigger their events.
   *
   * @param {(undefined|Array<Element>|Element)} targets - An element or an array of elements.
   *
   * @public
   * @returns {void}
   */
  triggerEvents(t) {
    var e, s;
    if (t) {
      const o = Array.isArray(t) ? t : [t];
      for (const i of o)
        (e = i._cartapus) == null || e.observer.unobserve(i), (s = i._cartapus) == null || s.observer.observe(i);
      return;
    }
    for (const o of this.observers)
      for (const i of o.elements)
        o.observer.unobserve(i), o.observer.observe(i);
  }
  /**
   * Start watching a given Element. Use in case the `data-cartapus` attribute has been added after the Element has been appended to the DOM.
   *
   * @param {Element} el A DOM element to start observing.
   *
   * @public
   * @returns {Boolean} Whether the Element is now being observed or not.
   */
  add(t) {
    const e = c(this, f, v).call(this, t);
    return e && t._cartapus.observer.observe(t), e;
  }
  /**
   * Turns off observers and empty their related targets.
   *
   * @public
   * @returns {void}
   */
  destroy() {
    this.unobserve(), this.mutationObserver.disconnect();
    for (const t of this.observers) {
      for (const e of t.elements)
        delete e._cartapus;
      t.observer.disconnect(), t.elements = [];
    }
  }
}
b = new WeakSet(), w = function() {
  const e = (this.options.root ? this.options.root : document).querySelectorAll("[data-cartapus]");
  for (const s of e)
    c(this, f, v).call(this, s);
}, l = new WeakSet(), T = function(t) {
  if (!t)
    return;
  const e = t.dataset.cartapusThreshold ? parseFloat(t.dataset.cartapusThreshold) : this.options.threshold, s = t.dataset.cartapusRootMargin ? t.dataset.cartapusRootMargin : this.options.rootMargin;
  return this.observers.find((i) => i.threshold === e && i.rootMargin === s);
}, f = new WeakSet(), v = function(t) {
  if (!t || !t.hasAttribute || !t.hasAttribute("data-cartapus"))
    return !1;
  if (t.dataset.cartapusThreshold || t.dataset.cartapusRootMargin) {
    const e = c(this, l, T).call(this, t);
    if (e)
      e.elements.push(t), t._cartapus = e;
    else {
      const s = t.dataset.cartapusThreshold ? parseFloat(t.dataset.cartapusThreshold) : this.options.threshold, o = t.dataset.cartapusRootMargin ? t.dataset.cartapusRootMargin : this.options.rootMargin;
      s >= 0 && s <= 1 ? this.observers.push(c(this, p, E).call(this, {
        element: t,
        options: {
          threshold: s,
          rootMargin: o
        }
      })) : console.warn("[Cartapus] : Threshold values must be numbers between 0 and 1");
    }
  } else
    this.observers[0].elements.push(t), t._cartapus = this.observers[0];
  return !0;
}, p = new WeakSet(), E = function({ options: t, element: e } = {}) {
  const s = {
    ...this.options,
    ...t
  }, o = {
    observer: new IntersectionObserver(this.intersect, s),
    threshold: s.threshold,
    rootMargin: s.rootMargin,
    elements: e ? [e] : []
  };
  return e && (e._cartapus = o), o;
}, g = new WeakSet(), N = function() {
  this.mutationObserver || (this.mutationObserver = new MutationObserver(this.mutate), this.mutationObserver.observe(this.options.root ? this.options.root : document.body, {
    childList: !0,
    subtree: !0
  }));
}, m = new WeakSet(), R = function(t, e) {
  for (const s of t) {
    if (s.isIntersecting) {
      s.target.setAttribute("data-cartapus", "visible");
      const o = s.target.getAttribute("data-cartapus-once");
      if (o === "false")
        continue;
      o !== null && (e.unobserve(s.target), s.target._cartapus.elements.splice(s.target._cartapus.elements.indexOf(s.target), 1));
    } else
      s.target.setAttribute("data-cartapus", "hidden");
    c(this, _, C).call(this, s);
  }
}, _ = new WeakSet(), C = function(t) {
  const e = {
    element: t.target,
    visible: t.isIntersecting,
    intersection: t
  }, s = new CustomEvent("cartapusintersect", { detail: e });
  t.target.dispatchEvent(s), this.emit("intersect", e);
}, O = new WeakSet(), F = function(t) {
  var e, s, o, i;
  for (const M of t)
    if (M.type === "childList") {
      for (const a of M.addedNodes)
        if (c(this, f, v).call(this, a) && a._cartapus.observer.observe(a), a._cartapus) {
          const h = a.querySelectorAll("[data-cartapus]");
          for (const y of h)
            c(this, f, v).call(this, y) && ((e = y._cartapus) == null || e.observer.observe(y));
        }
      for (const a of M.removedNodes) {
        if (a._cartapus) {
          const d = a._cartapus.elements.indexOf(a);
          a._cartapus.elements.splice(d, 1), a._cartapus.observer.unobserve(a);
        }
        if (a._cartapus) {
          const d = a.querySelectorAll("[data-cartapus]");
          for (const h of d)
            (o = h._cartapus) == null || o.elements.splice((s = h._cartapus) == null ? void 0 : s.elements.indexOf(h), 1), (i = h._cartapus) == null || i.observer.unobserve(h);
        }
      }
    }
};
export {
  P as default
};

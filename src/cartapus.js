/**
 * @file Cartapus core file, dispatches events based on [data-cartapus] elements' visibility in the viewport.
 * @author Jordan Thiervoz <jordanthiervoz@gmail.com>
 */

import Emitter from 'tiny-emitter'

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
 * @param {Boolean} [options.event=true] — If "true", events will be triggered when an element changes its state. A CustomEvent is triggered on the related element, and an event is also triggered on the Cartapus instance.
 *
 * @extends Emitter
 * @class
 */
export default class Cartapus extends Emitter {
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
   * @param {Boolean} [options.event=true] — If "true", events will be triggered when an element changes its state. A CustomEvent is triggered on the related element, and an event is also triggered on the Cartapus instance.
   *
   * @extends Emitter
   * @constructor
   */
  constructor(options = {}) {
    super()

    // Bind callback method.
    this.intersect = this.intersect.bind(this)

    // Set user options based on default options.
    const defaults = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
      once: false,
      events: true
    }

    this.options = Object.assign(defaults, options)

    // Creates the default observer then start.
    this.createMainObserver()
    this.init()
  }

  /**
   * Creates the main IntersectionObserver used with the default options.
   *
   * @private
   * @returns {void}
   */
  createMainObserver() {
    this.observers = [{
      observer: new IntersectionObserver(this.intersect, this.options),
      threshold: this.options.threshold,
      rootMargin: this.options.rootMargin,
      elements: []
    }]
  }

  /**
   * Initialization method, starts the IntersectionObservers.
   *
   * @private
   * @returns {void}
   */
  init() {
    this.getElems()
    this.createObservers()
    this.observe()
  }

  /**
   * Gets the [data-cartapus] elements from root element.
   *
   * @private
   * @returns {void}
   */
  getElems() {
    const root = this.options.root === null ? document : this.options.root

    this.elems = root.querySelectorAll('[data-cartapus]')
  }

  /**
   * For each [data-cartapus] element, check its inner data-cartapus parameters
   * Create new IntersectionObservers accordingly if parameters differs from the main observer.
   *
   * @private
   * @returns {void}
   */
  createObservers() {
    for (const el of this.elems) {
      // If element has data-cartapus-threshold attribute.
      if (el.dataset.cartapusThreshold || el.dataset.cartapusRootMargin) {
        const threshold = el.dataset.cartapusThreshold ? parseFloat(el.dataset.cartapusThreshold) : this.options.threshold
        const rootMargin = el.dataset.cartapusRootMargin ? el.dataset.cartapusRootMargin : this.options.rootMargin
        let found = false

        // If an observer already exists with the same threshold & the same rootMargin, add element to this observer.
        for (const observer of this.observers) {
          if (threshold === observer.threshold && rootMargin === observer.rootMargin) {
            found = true

            observer.elements.push(el)
          }
        }

        // If no observer has the same threshold & rootMargin, create a new one with the new options.
        if (!found) {
          const observer = {
            observer: new IntersectionObserver(this.intersect, Object.assign(this.options, { threshold, rootMargin })),
            threshold,
            rootMargin,
            elements: [el]
          }

          this.observers.push(observer)
        }
      } else this.observers[0].elements.push(el)
    }
  }

  /**
   * Callback function triggered by the observers.
   * Sets the data-cartapus attribute accordingly to the visibility of the elements.
   * Triggers the custom events if the `events` option is enabled.
   *
   * @param {array.<IntersectionObserverEntry>} entries — An array of entries that intersected with the root.
   * @param {IntersectionObserver} observer — The observer that triggered the event.
   *
   * @private
   * @returns {void}
   */
  intersect(entries, observer) {
    entries.forEach((entry) => {
      // Set data-cartapus attribute value either to "visible" or "hidden".
      if (entry.isIntersecting) {
        entry.target.dataset.cartapus = 'visible'

        // Stop observing this element if "once" options it true.
        if (this.options.once && entry.target.dataset.cartapusOnce !== 'false') observer.unobserve(entry.target)
      } else entry.target.dataset.cartapus = 'hidden'

      if (this.options.events) this.dispatch(entry)
    })
  }

  /**
   * Triggers the CustomEvent `cartapusintersect` on the entry's target.
   * Also triggers an `intersect` event on the class instance.
   *
   * @param {IntersectionObserverEntry} entry — The entry that intersected.
   *
   * @private
   * @returns {void}
   */
  dispatch(entry) {
    // Create event with details.
    const detail = {
      element: entry.target,
      visible: entry.isIntersecting,
      intersection: entry
    }
    const event = new CustomEvent('cartapusintersect', { detail })

    // Dispatch element and instance events.
    entry.target.dispatchEvent(event)
    this.emit('intersect', detail)
  }

  /**
   * Turns on all the observers to watch all of their related targets.
   *
   * This will trigger Cartapus events if events are turned on.
   *
   * @public
   * @returns {void}
   */
  observe() {
    this.observers.forEach((observer) => {
      observer.elements.forEach((el) => {
        observer.observer.observe(el)
      })
    })
  }

  /**
   * Turns off all the observers to stop watching all of their related targets.
   *
   * @public
   * @returns {void}
   */
  unobserve() {
    this.observers.forEach((observer) => {
      observer.elements.forEach((el) => {
        observer.observer.unobserve(el)
      })
    })
  }

  /**
   * Turns off observers and empty their related targets.
   *
   * @public
   * @returns {void}
   */
  destroy() {
    this.unobserve()

    this.observers.forEach((observer) => {
      observer.elements = []
    })
  }

  /**
   * Resets everything.
   * Turns off observers and resets their targets.
   * Then calls `this.init()` to restart everything with new elements to observe.
   * This will trigger Cartapus events if events are turned on.
   *
   * @public
   * @returns {void}
   */
  reset() {
    this.destroy()
    this.init()
  }
}

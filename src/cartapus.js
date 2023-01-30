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
      once: false
    }

    this.options = Object.assign(defaults, options)

    // Creates the main IntersectionObserver used with the default options.
    this.observers = [this.createObserver()]

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
    const root = this.options.root ? this.options.root : document

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
      // If element has a custom cartapus attribute.
      if (el.dataset.cartapusThreshold || el.dataset.cartapusRootMargin) {
        const threshold = el.dataset.cartapusThreshold ? parseFloat(el.dataset.cartapusThreshold) : this.options.threshold
        const rootMargin = el.dataset.cartapusRootMargin ? el.dataset.cartapusRootMargin : this.options.rootMargin

        // If an observer already exists with the same threshold & the same rootMargin, add element to this observer.
        const found = this.observers.find((observer) => observer.threshold === threshold && observer.rootMargin === rootMargin)

        if (found) found.elements.push(el)
        else {
          // If no observer has the same threshold & rootMargin, create a new one with the new options.
          this.observers.push(this.createObserver({
            element: el,
            options: {
              threshold,
              rootMargin
            }
          }))
        }
      } else this.observers[0].elements.push(el)
    }
  }

  createObserver({ options, element } = {}) {
    const opt = Object.assign(this.options, options)

    return {
      observer: new IntersectionObserver(this.intersect, opt),
      threshold: opt.threshold,
      rootMargin: opt.rootMargin,
      elements: element ? [element] : []
    }
  }

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
  intersect(entries, observer) {
    for (const entry of entries) {
      // Set data-cartapus attribute value either to "visible" or "hidden".
      if (entry.isIntersecting) {
        entry.target.setAttribute('data-cartapus', 'visible')

        // Stop observing this element if "once" options it true.
        if (entry.target.hasAttribute('data-cartapus-once')) observer.unobserve(entry.target)
      } else entry.target.setAttribute('data-cartapus', 'hidden')

      this.dispatch(entry)
    }
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
   * This will trigger Cartapus events.
   *
   * @public
   * @returns {void}
   */
  observe() {
    for (const observer of this.observers) {
      for (const el of observer.elements) {
        el._cartapus = observer

        observer.observer.observe(el)
      }
    }
  }

  /**
   * Turns off all the observers to stop watching all of their related targets.
   *
   * @public
   * @returns {void}
   */
  unobserve() {
    for (const observer of this.observers) {
      for (const el of observer.elements) {
        observer.observer.unobserve(el)
      }
    }
  }

  /**
   * Turns off observers and empty their related targets.
   *
   * @public
   * @returns {void}
   */
  destroy() {
    this.unobserve()

    for (const observer of this.observers) {
      observer.observer.disconnect()
      observer.elements = []
    }
  }

  /**
   * Resets everything.
   * Turns off observers and resets their targets.
   * Then calls `this.init()` to restart everything with new elements to observe.
   * This will trigger Cartapus events.
   *
   * @public
   * @returns {void}
   */
  reset() {
    this.destroy()
    this.init()
  }
}

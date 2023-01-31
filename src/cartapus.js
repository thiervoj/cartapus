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

    this.intersect = this.intersect.bind(this)
    this.mutate = this.mutate.bind(this)

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

    this.createObservers()
    this.createMutationObserver()
    this.observe()
  }

  /**
   * For each [data-cartapus] element, check its inner data-cartapus parameters
   * Create new IntersectionObservers accordingly if parameters differs from the main observer.
   *
   * @private
   * @returns {void}
   */
  createObservers() {
    const root = this.options.root ? this.options.root : document
    const elems = root.querySelectorAll('[data-cartapus]')

    for (const el of elems) {
      this.storeNewElement(el)
    }
  }

  findObserverForElement(el) {
    const threshold = el.dataset.cartapusThreshold ? parseFloat(el.dataset.cartapusThreshold) : this.options.threshold
    const rootMargin = el.dataset.cartapusRootMargin ? el.dataset.cartapusRootMargin : this.options.rootMargin

    // If an observer already exists with the same threshold & the same rootMargin, add element to this observer.
    const found = this.observers.find((observer) => observer.threshold === threshold && observer.rootMargin === rootMargin)

    return found
  }

  storeNewElement(el) {
    if (!el.hasAttribute('data-cartapus')) return false

    // If element has a custom cartapus attribute.
    if (el.dataset.cartapusThreshold || el.dataset.cartapusRootMargin) {
      const observer = this.findObserverForElement(el)

      if (observer) {
        observer.elements.push(el)

        el._cartapus = observer
      } else {
        const threshold = el.dataset.cartapusThreshold ? parseFloat(el.dataset.cartapusThreshold) : this.options.threshold
        const rootMargin = el.dataset.cartapusRootMargin ? el.dataset.cartapusRootMargin : this.options.rootMargin

        // If no observer has the same threshold & rootMargin, create a new one with the new options.
        this.observers.push(this.createObserver({
          element: el,
          options: {
            threshold,
            rootMargin
          }
        }))
      }
    } else {
      this.observers[0].elements.push(el)

      el._cartapus = this.observers[0]
    }

    return true
  }

  createObserver({ options, element } = {}) {
    const opt = Object.assign(this.options, options)
    const observer = {
      observer: new IntersectionObserver(this.intersect, opt),
      threshold: opt.threshold,
      rootMargin: opt.rootMargin,
      elements: element ? [element] : []
    }

    if (element) element._cartapus = observer

    return observer
  }

  /**
   * Creates the MutationObserver.
   *
   * @private
   * @returns {void}
   */
  createMutationObserver() {
    this.mutationObserver = new MutationObserver(this.mutate)

    this.mutationObserver.observe(this.options.root ? this.options.root : document.body, {
      childList: true,
      subtree: true
    })
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

  mutate(records) {
    for (const record of records) {
      if (record.type === 'childList') {
        for (const addedNode of record.addedNodes) {
          const success = this.storeNewElement(addedNode)

          if (success) addedNode._cartapus.observer.observe(addedNode)

          const inners = addedNode.querySelectorAll('[data-cartapus]')

          for (const el of inners) {
            const success = this.storeNewElement(el)

            if (success && el._cartapus) el._cartapus.observer.observe(el)
          }
        }

        for (const removedNode of record.removedNodes) {
          if (removedNode._cartapus) {
            const index = removedNode._cartapus.elements.indexOf(removedNode)

            removedNode._cartapus.elements.splice(index, 1)
            removedNode._cartapus.observer.unobserve(removedNode)
          }

          const inners = removedNode.querySelectorAll('[data-cartapus]')

          for (const el of inners) {
            if (el._cartapus) {
              const index = el._cartapus.elements.indexOf(el)

              el._cartapus.elements.splice(index, 1)
              el._cartapus.observer.unobserve(el)
            }
          }
        }
      }
    }
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
    this.mutationObserver.disconnect()

    for (const observer of this.observers) {
      for (const el of observer.elements) {
        delete el._cartapus
      }

      observer.observer.disconnect()
      observer.elements = []
    }
  }
}

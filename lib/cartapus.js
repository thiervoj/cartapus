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

    this.intersect = this.#intersect.bind(this)
    this.mutate = this.#mutate.bind(this)

    this.isObserving = false
    // Set user options based on default options.
    this.options = Object.assign({
      root: null,
      rootMargin: '0px',
      threshold: 0,
      once: false
    }, options)

    // Creates the main IntersectionObserver used with the default options.
    this.observers = [this.#createObserver()]

    this.#createObservers()
    this.#createMutationObserver()
    this.observe()
  }

  /**
   * For each [data-cartapus] element, check its inner data-cartapus parameters
   * Create new IntersectionObservers accordingly if parameters differs from the main observer.
   *
   * @private
   * @returns {void}
   */
  #createObservers() {
    const root = this.options.root ? this.options.root : document
    const elems = root.querySelectorAll('[data-cartapus]')

    for (const el of elems) {
      this.#storeNewElement(el)
    }
  }

  /**
   * Gets the observer configuration object for the given element.
   *
   * @param {Element} el A DOM element.
   *
   * @private
   * @returns {(undefined|Object)} The found observer object, `undefined` if not found.
   */
  #findObserverForElement(el) {
    if (!el) return

    const threshold = el.dataset.cartapusThreshold ? parseFloat(el.dataset.cartapusThreshold) : this.options.threshold
    const rootMargin = el.dataset.cartapusRootMargin ? el.dataset.cartapusRootMargin : this.options.rootMargin

    // If an observer already exists with the same threshold & the same rootMargin, add element to this observer.
    const found = this.observers.find((observer) => observer.threshold === threshold && observer.rootMargin === rootMargin)

    return found
  }

  /**
   * Stores a new DOM element to be watched. Creating a new `IntersectionObserver` if needed.
   *
   * @param {Element} el A DOM element.
   *
   * @private
   * @returns {Boolean} True if a new element is being watched, else false.
   */
  #storeNewElement(el) {
    if (!el || !el.hasAttribute || !el.hasAttribute('data-cartapus')) return false

    // If element has a custom cartapus attribute.
    if (el.dataset.cartapusThreshold || el.dataset.cartapusRootMargin) {
      const observer = this.#findObserverForElement(el)

      if (observer) {
        observer.elements.push(el)

        el._cartapus = observer
      } else {
        const threshold = el.dataset.cartapusThreshold ? parseFloat(el.dataset.cartapusThreshold) : this.options.threshold
        const rootMargin = el.dataset.cartapusRootMargin ? el.dataset.cartapusRootMargin : this.options.rootMargin

        if (threshold >= 0 && threshold <= 1) {
          // If no observer has the same threshold & rootMargin, create a new one with the new options.
          this.observers.push(this.#createObserver({
            element: el,
            options: {
              threshold,
              rootMargin
            }
          }))
        } else console.warn('[Cartapus] : Threshold values must be numbers between 0 and 1')
      }
    } else {
      this.observers[0].elements.push(el)

      el._cartapus = this.observers[0]
    }

    return true
  }

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
  #createObserver({ options, element } = {}) {
    const opt = {
      ...this.options,
      ...options
    }
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
  #createMutationObserver() {
    if (this.mutationObserver) return

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
  #intersect(entries, observer) {
    for (const entry of entries) {
      // Set data-cartapus attribute value either to "visible" or "hidden".
      if (entry.isIntersecting) {
        entry.target.setAttribute('data-cartapus', 'visible')

        const once = entry.target.getAttribute('data-cartapus-once')

        if (once === 'false') continue

        // Stop observing this element if "once" options it true.
        if (once !== null) {
          observer.unobserve(entry.target)

          entry.target._cartapus.elements.splice(entry.target._cartapus.elements.indexOf(entry.target), 1)
        }
      } else entry.target.setAttribute('data-cartapus', 'hidden')

      this.#dispatch(entry)
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
  #dispatch(entry) {
    const detail = {
      element: entry.target,
      visible: entry.isIntersecting,
      intersection: entry
    }
    const event = new CustomEvent('cartapusintersect', { detail })

    entry.target.dispatchEvent(event)
    this.emit('intersect', detail)
  }

  /**
   * This method is called on every mutation of the DOM.
   *
   * @param {Array<MutationRecord>} records A array of MutationRecords.
   *
   * @private
   * @returns {void}
   */
  #mutate(records) {
    for (const record of records) {
      if (record.type === 'childList') {
        for (const addedNode of record.addedNodes) {
          const success = this.#storeNewElement(addedNode)

          if (success) addedNode._cartapus.observer.observe(addedNode)

          if (addedNode._cartapus) {
            const inners = addedNode.querySelectorAll('[data-cartapus]')

            for (const el of inners) {
              const success = this.#storeNewElement(el)

              if (success) el._cartapus?.observer.observe(el)
            }
          }
        }

        for (const removedNode of record.removedNodes) {
          if (removedNode._cartapus) {
            const index = removedNode._cartapus.elements.indexOf(removedNode)

            removedNode._cartapus.elements.splice(index, 1)
            removedNode._cartapus.observer.unobserve(removedNode)
          }

          if (removedNode._cartapus) {
            const inners = removedNode.querySelectorAll('[data-cartapus]')

            for (const el of inners) {
              el._cartapus?.elements.splice(el._cartapus?.elements.indexOf(el), 1)
              el._cartapus?.observer.unobserve(el)
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
    if (this.isObserving) return

    this.isObserving = true

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
    if (!this.isObserving) return

    this.isObserving = false

    for (const observer of this.observers) {
      for (const el of observer.elements) {
        observer.observer.unobserve(el)
      }
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
  triggerEvents(targets) {
    if (targets) {
      const els = Array.isArray(targets) ? targets : [targets]

      for (const el of els) {
        el._cartapus?.observer.unobserve(el)
        el._cartapus?.observer.observe(el)
      }

      return
    }

    for (const observer of this.observers) {
      for (const el of observer.elements) {
        observer.observer.unobserve(el)
        observer.observer.observe(el)
      }
    }
  }

  /**
   * Start watching a given Element. Use in case the `data-cartapus` attribute has been added after the Element has been appended to the DOM.
   *
   * @param {Element} el A DOM element to start observing.
   *
   * @public
   * @returns {Boolean} Whether the Element is now being observed or not.
   */
  add(el) {
    const success = this.#storeNewElement(el)

    if (success) el._cartapus.observer.observe(el)

    return success
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

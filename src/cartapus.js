import Emitter from 'tiny-emitter'

export default class Cartapus extends Emitter {
  constructor(options = {}) {
    super()

    this.intersect = this.intersect.bind(this)

    this.setOptions(options)
    this.createMainObserver()

    this.init()
  }

  setOptions(options) {
    const defaults = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
      once: true,
      events: false
    }

    this.options = Object.assign(defaults, options)
  }

  createMainObserver() {
    this.observers = [{
      observer: new IntersectionObserver(this.intersect, this.options),
      threshold: this.options.threshold,
      elements: []
    }]
  }

  init() {
    this.getElems()
    this.createObservers()
    this.observe()
  }

  getElems() {
    this.elems = this.options.root ? this.options.root.querySelectorAll('[data-cartapus]') : document.querySelectorAll('[data-cartapus]')
  }


  createObservers() {
    for (const el of this.elems) {
      // If element has data-cartapus-threshold attribute
      if (el.dataset.cartapusThreshold) {
        const threshold = parseFloat(el.dataset.cartapusThreshold)
        let found = false

        // If an observer already exists with the same threshold, add element to this observer
        for (const observer of this.observers) {
          if (threshold === observer.threshold) {
            found = true

            observer.elements.push(el)
          }
        }

        // If no observer has the same threshold, create a new one with the new threshold
        if (!found) {
          const observer = {
            observer: new IntersectionObserver(this.intersect, Object.assign(this.options, { threshold })),
            threshold,
            elements: [el]
          }

          this.observers.push(observer)
        }
      } else this.observers[0].elements.push(el)
    }
  }

  intersect(entries, observer) {
    entries.forEach((entry) => {
      // Set data-cartapus attribute value
      if (entry.isIntersecting) {
        entry.target.dataset.cartapus = 'visible'

        // Stop observing this element if "once" options it true
        if (this.options.once && entry.target.dataset.cartapusOnce !== 'false') observer.unobserve(entry.target)
      } else entry.target.dataset.cartapus = 'hidden'

      if (this.options.events) this.dispatch(entry)
    })
  }

  dispatch(entry) {
    // Create event with details and dispatch it
    const data = {
      element: entry.target,
      visible: entry.isIntersecting,
      intersection: entry
    }
    const event = new CustomEvent('cartapusintersect', { detail: data })

    // Dispatch instance and element events
    this.emit('intersect', data)
    entry.target.dispatchEvent(event)
  }

  observe() {
    this.observers.forEach((observer) => {
      observer.elements.forEach((el) => {
        observer.observer.observe(el)
      })
    })
  }

  unobserve() {
    this.observers.forEach((observer) => {
      observer.elements.forEach((el) => {
        observer.observer.unobserve(el)
      })
    })
  }

  reset() {
    this.destroy()
    this.init()
  }

  destroy() {
    this.unobserve()

    this.observers.forEach((observer) => {
      observer.elements = []
    })
  }
}

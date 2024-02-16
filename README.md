# cartapus
[![npm](https://img.shields.io/npm/v/cartapus.svg)](https://www.npmjs.com/package/cartapus)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/cartapus?label=bundle%20size)](https://bundlephobia.com/result?p=cartapus)
![NpmLicense](https://img.shields.io/npm/l/cartapus.svg)

✨ A small `IntersectionObserver` wrapper and helper to help detect easily DOM elements entering or leaving the viewport.

## What is cartapus ?

cartapus is a library designed to help you manage detection of elements in the browser's viewport.

The goal of cartapus is to provide a **quick** and **easy to use** solution to those who need to **animate/manipulate** elements when they **appear/disappear** from the screen, using the `IntersectionObserver` API.

Cartapus also watches DOM modifications to start observing newly added elements automatically (and also to stop observing freshly removed element) using the `MutationObserver` API.

---

## Getting started

### Install it

```bash
$ npm i cartapus
```

### Initialize it

Initialize the library in your codebase :

```javascript
import Cartapus from 'cartapus'

const cartapus = new Cartapus()
```

### Use it

Now, add `data-cartapus` attribute to any element you need to observe :

```html
<div class="box" data-cartapus></div>
```

### Animate

When this element will be visible in the viewport, its attribute will switch to `data-cartapus="visible"`. Allowing you to adapt your CSS to easily animate this element.

An invisible element will have its attribute set to `data-cartapus="hidden"`.

Here is a fade in example :

```css
.box[data-cartapus]{
  /* HIDDEN STATE */
  opacity: 0;
  transition: opacity 1s;
}

.box[data-cartapus=visible]{
  /* VISIBLE STATE */
  opacity: 1;
}
```

---

## Options

Here are all the available options :

```javascript
const cartapus = new Cartapus({
  root: null,
  rootMargin: '0px',
  threshold: 0,
  once: false
})
```

> `root`, `rootMargin` and `threshold` are all three related to the `IntersectionObserver` API. You can have more information about these parameters by consulting the [official documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver).

|     Option     |    Type     | Default | Description |
| -------------- | ----------- | ------- | ----------- |
|    **root**    | Element | `null` *(entire viewport)*  | The root DOM element into which `[data-cartapus]` targets will be observed. Default is set to `null`, which is equivalent to the entire viewport. (More information [here](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root)) |
| **rootMargin** | string | `'0px'` | A CSS margin property string defining offsets into the `root` element. (More information [here](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin)) |
| **threshold**  | number | `0` | A number between `0` and `1` which defines the percentage of height that must be into the viewport for an element to be considered "visible". (More information [here](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds)) |
| **once** | boolean | `false` | If `true`, elements that are `visible` will never return to their `hidden` state even if they disappear from the `root`. |

---

## Events

Cartapus will trigger events when an element changes its state to `visible` or `hidden`.

> Events are called for **all** elements **immediately** after initializing Cartapus, providing you their *initial visibility state*.

To listen to the events, use the following methods :

```js
// Watch intersections instance-wide
cartapus.on('intersect', ({ element, visible, intersection }) => {
  // `element` just switched its visibility
})

// Watch intersection per element
el.addEventListener('cartapusintersect', ({ detail }) => {
  // `detail.element` just switched its visibility
})
```

Some parameters are given to these callbacks :

- `element` : The `Element` that triggered the event.
- `visible` : Whether the element is visible or not (same as its `data-cartapus` value).
- `intersection` : The `IntersectionObserverEntry` instance.

> `detail` contains exactly the same properties as given in the instance event (`element`, `visible` and `intersection`).

---

## Advanced usage

Maybe you want a *specific element* to switch its state with a different *threshold* than the others.

Or you may want to *prevent* a specific element *from going back* to its `hidden` state (triggering the event only **once**).

Some additional attributes are available to allow both of those cases, overriding the default options for this specific element :

```html
<div data-cartapus
  data-cartapus-threshold="0.5"
  data-cartapus-root-margin="0px 0px -200px 0px"
  data-cartapus-once>
</div>
```

- `data-cartapus-threshold` : overrides the `threshold` option. *Ie : this element will be visible when 50% of its height is visible.*
- `data-cartapus-root-margin` : overrides the `rootMargin` option. *Ie : the bottom bounding box of the viewport will be shrunk by 200px on the bottom, as if the viewport was smaller.*
- `data-cartapus-once` : overrides the `once` option. *Ie : this element will switch to `visible`, then never switch back to `hidden` again.* To explicitly turn off the `once` option, use it like this : `data-cartapus-once="false"`.

---

## Methods

Some methods are available, to turn on/off Cartapus programmatically :

### `.add(el)`

Cartapus watches DOM changes and observes automatically appended elements. But in some cases you may need to start observing an element manually (when a `data-cartapus` attribute has been added after the element being appended, etc).

This method returns `true` if the element is now being watched, `false` if not.

### `.triggerEvents(targets)`

Triggers instantly the cartapus events related to the given elements (can be an array of elements, or a single element).

If `targets` parameter is not given, it triggers the events of **all** observed elements.

### `.destroy()`

Stops observing **all** `[data-cartapus]` elements. And disconnects all the `IntersectionObservers` along with the `MutationObserver`.

### `.unobserve()`

Stops observing **all** `[data-cartapus]` elements.

### `.observe()`

Starts observing **all** `[data-cartapus]` elements.

> This method triggers instantly the `events` for **every** element.

---

## Browser support

Cartapus supports **all recent major versions** of the modern browsers.

Internally, Cartapus uses the `IntersectionObserver` and `MutationObserver` APIs to observe elements. You can have more details about compatibility by consulting CanIuse :
- [IntersectionObserver](https://caniuse.com/#feat=intersectionobserver)
- [MutationObserver](https://caniuse.com/#feat=mutationobserver)

---

*"On me voit. On me voit plus. On me voit un peu, on me voit plus." - Cartapus (2002)*
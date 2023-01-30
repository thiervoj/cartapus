# cartapus.js
[![npm](https://img.shields.io/npm/v/cartapus.svg)](https://www.npmjs.com/package/cartapus)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/cartapus?label=bundle%20size)](https://bundlephobia.com/result?p=cartapus)
![NpmLicense](https://img.shields.io/npm/l/cartapus.svg)

✨ Animate DOM elements as they appear in your window.

*"On me voit. On me voit plus. On me voit un peu, on me voit plus." - Cartapus (2002)*

## What is cartapus.js ?

cartapus is a library designed to help you manage detection of elements in the browser's viewport.

The goal of cartapus is to provide a **quick** and **easy to use** solution to those who need to **animate/manipulate** elements when they **appear/disappear** from the screen, using the `IntersectionObserver` API.

Cartapus also watches DOM modifications to start observing newly added elements automatically (and also to stop observing freshly removed element) using the `MutationObserver` API.

## Getting started

### Install it

```bash
$ npm i cartapus
```

### Use it

Initialize the library with a single line of JavaScript :

```javascript
import Cartapus from 'cartapus'

const cartapus = new Cartapus()
```

Now, add `data-cartapus` attribute to any element you need to observe :

```html
<div class="box" data-cartapus></div>
```

When this element will be visible in the viewport, its attribute will switch to `data-cartapus="visible"`. Allowing you to adapt your CSS to easily animate this element.

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

## Options

You can customize visibility detection by providing options to the Cartapus constructor.

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

### In details

|     Option     |    Type     | Default | Description |
| -------------- | ----------- | ------- | ----------- |
|    **root**    | Element | `null` *(entire viewport)*  | The root DOM element into which `[data-cartapus]` targets will be observed. Default is set to `null`, which is equivalent to the entire viewport. (More information [here](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root)) |
| **rootMargin** | string | `'0px'` | A CSS margin property string defining offsets into the `root` element. (More information [here](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin)) |
| **threshold**  | number | `0` | A number between `0` and `1` which defines the percentage of height that must be into the viewport for an element to be considered "visible". (More information [here](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds)) |
| **once** | boolean | `false` | If `true`, elements that are `visible` will never return to their `hidden` state even if they disappear from the `root`. |

## Events

Cartapus will trigger events when an element changes its state to `visible` or `hidden`.

> Events are called for **all** elements **immediately** after initializing Cartapus, providing you their *initial visibility state*.

### Instance event

To listen to the `intersect` event, use the following :

```javascript
cartapus.on('intersect', ({ element, visible, intersection }) => {
  // `element` just switched its visibility
})
```

Some useful parameters are given :

- `element` : The `Element` that triggered the event.
- `visible` : Whether the element is visible or not (same as its `data-cartapus` value).
- `intersection` : The `IntersectionObserverEntry` instance.

### Element event

You can also listen to an event on specific elements, as following :

```javascript
const el = document.querySelector('.box')

el.addEventListener('cartapusintersect', ({ detail }) => {
  // `detail.element` just switched its visibility
})
```

`detail` contains exactly the same properties as given in the instance event :

- `detail.element` : The `Element` that triggered the event.
- `detail.visible` : Whether the element is visible or not (same as its `data-cartapus` value).
- `detail.intersection` : The `IntersectionObserverEntry` instance.

## Advanced usage

Maybe you want a *specific element* to switch its state with a different *threshold* than the others.

Or you may want to *prevent* a specific element *from going back* to its `hidden` state (triggering the event only **once**).

Some additional attributes are available to allow both of those cases, overriding the default options for this specific element :

```html
<div class="box"
  data-cartapus
  data-cartapus-threshold="0.5"
  data-cartapus-root-margin="0px 0px -200px 0px"
  data-cartapus-once>
</div>
```

- `data-cartapus-threshold` : overrides the `threshold` option. *Ie : this element will be visible when 50% of its height is visible.*
- `data-cartapus-root-margin` : overrides the `rootMargin` option. *Ie : the bottom bounding box of this element will be shrunk by 200px.*
- `data-cartapus-once` : overrides the `once` option. *Ie : this element will switch to `visible`, then never switch back to `hidden` again.*

## Methods

Some methods are available, to turn on/off Cartapus programmatically :

### `.destroy()`

Stops observing **all** `[data-cartapus]` elements. And disconnects all the `IntersectionObservers`.

### `.unobserve()`

Stops observing **all** `[data-cartapus]` elements.

### `.observe()`

Starts observing **all** `[data-cartapus]` elements.

> This method triggers instantly the `events` for **every** element.

## Browser support

Cartapus supports **all recent major versions** of the modern browsers.

Internally, Cartapus uses the `IntersectionObserver` and `MutationObserver` APIs to observe elements. You can have more details about compatibility by consulting CanIuse :
- [IntersectionObserver](https://caniuse.com/#feat=intersectionobserver).
- [MutationObserver](https://caniuse.com/#feat=mutationobserver).

## Todo

- [ ] Implement `add` and `remove` methods to add/remove specific items to/from the watched list.
- [ ] Add a parameter to `.reset()` method to prevent the already visible items with `once = true` to reset their state.

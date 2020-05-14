# cartapus.js
[![npm](https://img.shields.io/npm/v/cartapus.svg)](https://www.npmjs.com/package/cartapus)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/cartapus?label=bundle%20size)](https://bundlephobia.com/result?p=cartapus)
![NpmLicense](https://img.shields.io/npm/l/cartapus.svg)

✨ Animate DOM elements as they appear in your window.

*"On me voit. On me voit plus. On me voit un peu, on me voit plus." - Cartapus (2002)*

## What is cartapus.js ?

cartapus is a JavaScript library designed to help you manage detection of elements in the browser's viewport.

The goal of cartapus is to provide a **quick** and **performant** solution to those who need to **animate/manipulate** elements when **appear/disappear** from the screen.

## Getting started

### Install it

```bash
$ npm add cartapus --save
```

### Use it

Initialize the library with a single line of JavaScript :

```javascript
import Cartapus from 'cartapus'

const cartapus = new Cartapus()
```

Now, add `data-cartapus` attribute to any element you want to observe :

```html
<div class="box" data-cartapus></div>
```

When this element will be visible in the viewport, its attribute will switch to `data-cartapus="visible"`. Allowing you to adapt your CSS to easily animate this element.

Here is a fade in example :

```css
.box[data-cartapus]{
  opacity: 0;
  transition: opacity 1s;
}

.box[data-cartapus=visible]{
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
  threshold: 0.2,
  once: false,
  events: false
})
```

> `root`, `rootMargin` and `threshold` are all three related to the `IntersectionObserver` API. You can have more information about these parameters by consulting the [official documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver).

### In details

|     Option     |    Type     | Default | Description |
| -------------- | ----------- | ------- | ----------- |
|    **root**    | Element | `null` *(entire viewport)*  | The root DOM element into which `[data-cartapus]` targets will be retreived and observed. Default is set to `null`, which is equivalent to the entire viewport. (More information [here](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root)) |
| **rootMargin** | string | `'0px'` | A CSS margin property string defining offsets into the `root` element. (More information [here](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin)) |
| **threshold**  | number | `0.2` | A number between `0` and `1` which defines the percentage of height that must be into the viewport for an element to be considered "visible". (More information [here](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds)) |
| **once** | boolean | `false` | If `true`, elements that are `visible` will never return to their `hidden` state even if they disappear from the `root`. |
| **events** | boolean | `false` | If `true`, events will be triggered when an element changes its state. A `CustomEvent` is triggered on the related `Element`, and an event is also triggered on the Cartapus instance (Read next part for information about events). |

## Events

When the `events` option is set to `true`, Cartapus will trigger events when any element changes its state to `visible` or `hidden`.

### Instance event

To listen to the `intersect` event, use the following :

```javascript
cartapus.on('intersect', ({ element, visible, intersection }) => {
  // ...
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
  // ...
})
```

`details` contains exactly the same properties as given in the instance event :

- `details.element` : The `Element` that triggered the event.
- `details.visible` : Whether the element is visible or not (same as its `data-cartapus` value).
- `details.intersection` : The `IntersectionObserverEntry` instance.

## Fine tuning

Maybe you want a specific element to switch its state with a different *threshold* than the others.

Or you may want to *prevent* a specific element *from going back* to its `hidden` state (triggering the event only **once**).

Some additional attributes are available to allow both of those cases overriding the default options for this specific element :

```html
<div class="box"
  data-cartapus
  data-cartapus-threshold="0.5"
  data-cartapus-once="true">
</div>
```

- `data-cartapus-threshold` : overrides the `threshold` option : this element will be visible when 50% of its height is visible.
- `data-cartapus-once` : overrides the `once` option : this element will switch to `visible`, then never switch back to `hidden` again.

## Methods

Some methods are available to turn on/off Cartapus programmatically :

### `.unobserve()`

```javascript
cartapus.unobserve()
```

Stop observing **all** `[data-cartapus]` elements
.

### `.observe()`

```javascript
cartapus.observe()
```

Start observing **all** `[data-cartapus]` elements
.

> This method triggers instantly the `events` for **every** element.

### `.reset()`

```javascript
cartapus.reset()
```

Destroys the instance, clears all `[data-cartapus]` elements, then initializes the instance again with newly fetched `[data-cartapus]` elements.

This is useful to refresh the list of observed elements in case they changed.

>This methods triggers instantly the `events` for **every** new element.

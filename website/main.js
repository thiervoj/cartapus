import './style.css'

import Cartapus from '../bundled/cartapus'

// eslint-disable-next-line no-new
new Cartapus()

const wrapper = document.querySelector('.wrapper')

console.log('Ready')

setTimeout(() => {
  const div = document.createElement('div')
  const div2 = document.createElement('div')
  const p = document.createElement('p')

  div.classList.add('yolo')
  div2.classList.add('card')
  div2.setAttribute('data-cartapus', '')
  p.textContent = 'Am I visible ?'

  console.log('---------')
  console.log('APPEND')

  div.appendChild(div2)
  div2.appendChild(p)
  wrapper.appendChild(div)
}, 6000)

setTimeout(() => {
  const test = document.querySelector('.yolo')

  console.log('---------')
  console.log('REMOVE')

  test.remove()
}, 14000)

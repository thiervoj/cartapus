import './style.css'

import Cartapus from '../bundled/cartapus'

// eslint-disable-next-line no-new
new Cartapus()

const wrapper = document.querySelector('.wrapper')

console.log('Ready')

setTimeout(() => {
  const div = document.createElement('div')
  const p = document.createElement('p')

  div.classList.add('card')
  div.setAttribute('data-cartapus', '')
  p.textContent = 'Am I visible ?'

  console.log('---------')
  console.log('APPEND')

  div.appendChild(p)
  wrapper.appendChild(div)
}, 6000)

setTimeout(() => {
  const cards = document.querySelectorAll('.card')

  console.log('---------')
  console.log('REMOVE')

  cards[cards.length - 1].remove()
}, 10000)

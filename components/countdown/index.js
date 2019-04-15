var html = require('choo/html')
var Component = require('choo/component')

module.exports = class Countdown extends Component {
  constructor (id, state, emit) {
    super(id)
    this.cache = state.cache
    this.local = state.components[id] = { id, offset: 0, counters: [] }
    for (let i = 0; i < 5; i++) this.local.counters.push(i)
  }

  update () {
    return false
  }

  load (el) {
    var index = this.local.counters.length
    var rerender = () => {
      this.rerender()
      window.requestAnimationFrame(function () {
        timeout = setTimeout(rerender, 1000)
      })
    }
    var loop = (counter) => {
      counter.addEventListener('animationend', () => {
        this.local.counters.push(index++)
        this.local.counters.shift()
        this.rerender()
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            loop(el.querySelector('.js-counter'))
          })
        })
      })
    }

    var timeout = setTimeout(rerender, 1000)
    loop(el.querySelector('.js-counter'))
    this.unload = function () {
      clearTimeout(timeout)
    }
  }

  createElement (date) {
    var now = new Date()
    var hour = now.getHours()
    if (hour > 12) hour -= 12

    var diff = date.getTime() - now.getTime()
    var days = Math.floor(diff / (1000 * 60 * 60 * 24))
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    var seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return html`
      <div class="Countdown" id="${this.local.id}" style="--Countdown-minutes: ${now.getMinutes()}; --Countdown-hours: ${hour};">
        ${this.local.counters.map((index) => html`
          <time datetime="${JSON.stringify(date).replace(/^"|"$/g, '')}" id="${this.local.id}-${index}" class="Countdown-counter js-counter">
            <span class="Countdown-clock">
              <span class="Countdown-hand Countdown-hand--minute"></span>
              <span class="Countdown-hand Countdown-hand--hour"></span>
            </span> ${days} dagar ${hours} timmar ${minutes} minuter ${seconds} sekunder
          </time>
        `)}
      </div>
    `
  }
}

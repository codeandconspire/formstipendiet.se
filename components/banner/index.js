var html = require('choo/html')
var Component = require('choo/component')

module.exports = class Banner extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = { id, counter: 0 }
  }

  load (el) {
    el.addEventListener('animationend', () => {
      this.local.counter++
      this.rerender()
    })
  }

  update () {
    return false
  }

  createElement (offset, duration) {
    return html`
      <div class="Banner" id="${this.local.id}" style="--Banner-offset: ${offset}; --Banner-duration: ${duration}s;">
        <span class="Banner-text" id="${this.local.id}-${this.local.counter}">Tack för din anmälan</span><span class="Banner-text" id="${this.local.id}-${this.local.counter}">Tack för din anmälan</span>
      </div>
    `
  }
}

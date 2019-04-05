var html = require('choo/html')
var Component = require('choo/component')

var EMAIL = 'email'
var TEL = 'tel'

module.exports = class Contact extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {
      id,
      [EMAIL]: state.answers[EMAIL],
      [TEL]: state.answers[TEL]
    }
  }

  verify () {
    var fields = [EMAIL, TEL]
    return fields.reduce((valid, key) => valid && this.local[key], true)
  }

  serialize () {
    return {
      [EMAIL]: this.local[EMAIL],
      [TEL]: this.local[TEL]
    }
  }

  title () {
    return 'När urvalet är gjort, runt den 25 juni, hur vill du bli kontaktad?'
  }

  value () {
    return html`
      <p>
        ${this.local[EMAIL]}<br>
        ${this.local[TEL]}
      </p>
    `
  }

  update () {
    return false
  }

  createElement (callback) {
    var self = this

    return html`
      <div class="Contact" id="${this.local.id}">
      <label class="Contact-option">
          <span class="Contact-label">E-post:</span>
          <input class="Contact-text" type="email" name="${EMAIL}" value="${this.local[EMAIL]}" autocomplete="${EMAIL}" required oninput=${oninput}>
        </label>
        <label class="Contact-option">
          <span class="Contact-label">Telefonnumer:</span>
          <input class="Contact-text" type="text" name="${TEL}" value="${this.local[TEL]}" autocomplete="${TEL}" required oninput=${oninput}>
        </label>
      </div>
    `

    function oninput (event) {
      var target = event.target
      var name = target.name
      var value = target.value.trim()
      self.local[name] = value
      callback(name, value)
    }
  }
}

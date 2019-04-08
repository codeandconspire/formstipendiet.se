var html = require('choo/html')
var Component = require('choo/component')

var NAME = 'entry.481660275'
var STREET_ADDRESS = 'entry.160977161'
var POSTAL_CODE = 'entry.1139769175'
var CITY = 'entry.31493464'

module.exports = class AboutYou extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {
      id,
      [NAME]: state.answers[NAME],
      [STREET_ADDRESS]: state.answers[STREET_ADDRESS],
      [POSTAL_CODE]: state.answers[POSTAL_CODE],
      [CITY]: state.answers[CITY]
    }
  }

  verify () {
    var fields = [NAME, STREET_ADDRESS, POSTAL_CODE, CITY]
    return fields.reduce((valid, key) => valid && this.local[key], true)
  }

  serialize () {
    return {
      [NAME]: this.local[NAME],
      [STREET_ADDRESS]: this.local[STREET_ADDRESS],
      [POSTAL_CODE]: this.local[POSTAL_CODE],
      [CITY]: this.local[CITY]
    }
  }

  value () {
    return html`
      <p>
        ${this.local[NAME]}<br>
        ${this.local[STREET_ADDRESS]}<br>
        ${this.local[POSTAL_CODE]}, ${this.local[CITY]}
      </p>
    `
  }

  title () {
    return 'Vem är du?'
  }

  placeholder (...args) {
    return this.createElement(...args)
  }

  update () {
    return false
  }

  createElement (callback) {
    var self = this

    return html`
      <div class="AboutYou" id="${this.local.id}">
      <label class="AboutYou-option">
          <span class="AboutYou-label">Namn:</span>
          <input class="AboutYou-text" type="text" name="${NAME}" value="${this.local[NAME]}" autocomplete="name" required oninput=${oninput}>
        </label>
        <label class="AboutYou-option">
          <span class="AboutYou-label">Address:</span>
          <input class="AboutYou-text" type="text" name="${STREET_ADDRESS}" value="${this.local[STREET_ADDRESS]}" autocomplete="street-address" required oninput=${oninput}>
        </label>
        <label class="AboutYou-option">
          <span class="AboutYou-label">Postnummer:</span>
          <input class="AboutYou-text" type="text" name="${POSTAL_CODE}" value="${this.local[POSTAL_CODE]}" autocomplete="postal-code" required oninput=${oninput}>
        </label>
        <label class="AboutYou-option">
          <span class="AboutYou-label">Ort:</span>
          <input class="AboutYou-text" type="text" name="${CITY}" value="${this.local[CITY]}" autocomplete="address-level1" required oninput=${oninput}>
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

var html = require('choo/html')
var Component = require('choo/component')

var NAME = 'name'
var STREET_ADDRESS = 'street-address'
var POSTAL_CODE = 'postal-code'
var CITY = 'address-level1'

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

  title () {
    return 'Vem är du?'
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
          <input class="AboutYou-text" type="text" name="${NAME}" value="${this.local[NAME]}" autocomplete="${NAME}" required oninput=${oninput}>
        </label>
        <label class="AboutYou-option">
          <span class="AboutYou-label">Address:</span>
          <input class="AboutYou-text" type="text" name="${STREET_ADDRESS}" value="${this.local[STREET_ADDRESS]}" autocomplete="${STREET_ADDRESS}" required oninput=${oninput}>
        </label>
        <label class="AboutYou-option">
          <span class="AboutYou-label">Postnummer:</span>
          <input class="AboutYou-text" type="text" name="${POSTAL_CODE}" value="${this.local[POSTAL_CODE]}" autocomplete="${POSTAL_CODE}" required oninput=${oninput}>
        </label>
        <label class="AboutYou-option">
          <span class="AboutYou-label">Ort:</span>
          <input class="AboutYou-text" type="text" name="${CITY}" value="${this.local[CITY]}" autocomplete="${CITY}" required oninput=${oninput}>
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

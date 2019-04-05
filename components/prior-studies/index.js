var html = require('choo/html')
var Component = require('choo/component')

var NAME = 'entry.551104495'
var OTHER_NAME = 'entry.551104495.other_option_response'
var OPTIONS = [
  'Grundskola (årskurs 1-9)',
  'Gymnasium',
  'Högskola',
  'Universitet',
  'Fristående kurser'
]

module.exports = class PriorStudies extends Component {
  constructor (id, state, emit) {
    super(id)
    var value = state.answers[NAME] || []
    var text = state.answers[OTHER_NAME] || ''
    this.local = state.components[id] = { id, value, text }
  }

  verify () {
    return true
  }

  serialize () {
    return {
      [NAME]: this.local.value,
      [OTHER_NAME]: this.local.text
    }
  }

  title () {
    return 'Vad har du pluggat tidigare?'
  }

  value () {
    var value = this.local.value.concat(this.local.text).filter(Boolean)
    return html`<p>${value.join(', ')}</p>`
  }

  update () {
    return false
  }

  createElement (callback) {
    var self = this

    return html`
      <div class="PriorStudies" id="${this.local.id}">
        ${OPTIONS.map((label) => html`
          <label class="PriorStudies-option">
            <input class="PriorStudies-toggle" type="checkbox" name="${NAME}" value="${label}" checked=${this.local.value.includes(label)} onchange=${onchange}>
            <div class="PriorStudies-indicator"></div>
            <span class="PriorStudies-label">${label}</span>
          </label>
        `)}
        <input type="hidden" name="${NAME}" value="__other_option__">
        <label class="PriorStudies-option">
          <span class="PriorStudies-label">Annat:</span>
          <input class="PriorStudies-text" type="text" name="${OTHER_NAME}" value="${this.local.text}" oninput=${oninput}>
        </label>
      </div>
    `

    function oninput (event) {
      var target = event.target
      var value = target.value
      self.local.text = value
      callback(OTHER_NAME, value)
    }

    function onchange (event) {
      var target = event.target
      var value = target.value
      if (target.checked) value = self.local.value.concat(value)
      else value = self.local.value.filter((str) => str !== value)
      value.sort(function (a, b) {
        if (!OPTIONS.includes(a)) return 1
        if (!OPTIONS.includes(b)) return -1
        return OPTIONS.indexOf(a) - OPTIONS.indexOf(b)
      })
      self.local.value = value
      callback(NAME, value)
    }
  }
}

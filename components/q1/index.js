var html = require('choo/html')
var Component = require('choo/component')

var NAME = 'proir-studies'
var OPTIONS = [
  'Grundskola (årskurs 1-9)',
  'Gymnasium',
  'Högskola',
  'Universitet',
  'Fristående kurser'
]

module.exports = class Q1 extends Component {
  constructor (id, state, emit) {
    super(id)
    var value = state.answers[NAME] || []
    var text = value.find((val) => !OPTIONS.includes(val)) || ''
    this.local = state.components[id] = { id, value, text }
  }

  verify () {
    return true
  }

  serialize () {
    return { [NAME]: this.local.value }
  }

  title () {
    return 'Vad har du pluggat tidigare?'
  }

  update () {
    return false
  }

  createElement (callback) {
    var self = this

    return html`
      <div class="Q1" id="${this.local.id}">
        ${OPTIONS.map((label) => html`
          <label class="Q1-option">
            <input class="Q1-toggle" type="checkbox" name="${NAME}" value="${label}" checked=${this.local.value.includes(label)} onchange=${onchange}>
            <div class="Q1-indicator"></div>
            <span class="Q1-label">${label}</span>
          </label>
        `)}
        <label class="Q1-option">
          <span class="Q1-label">Annat:</span>
          <input class="Q1-text" type="text" name="${NAME}" value="${this.local.text}" oninput=${oninput}>
        </label>
      </div>
    `

    function oninput (event) {
      var value
      var target = event.target
      var text = self.local.text
      if (text) {
        value = self.local.value.map(function (val) {
          if (val === text) return target.value
          return val
        })
      } else {
        value = self.local.value.concat(target.value)
      }
      value.sort(function (a, b) {
        if (!OPTIONS.includes(a)) return 1
        if (!OPTIONS.includes(b)) return -1
        return OPTIONS.indexOf(a) - OPTIONS.indexOf(b)
      })
      self.local.text = target.value
      self.local.value = value.filter(Boolean)
      callback(NAME, value)
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

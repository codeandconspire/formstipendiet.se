var html = require('choo/html')
var Component = require('choo/component')

var NAME = 'has-applied'

module.exports = class Q0 extends Component {
  constructor (id, state, emit) {
    super(id)
    var value = state.answers[NAME]
    this.local = state.components[id] = { id, value }
  }

  verify () {
    return this.local.value === 'Ja'
  }

  serialize () {
    return { [NAME]: this.local.value }
  }

  title () {
    return 'Har du skickat in din ansökan till Kvällsskolan på Beckmans?'
  }

  update () {
    return false
  }

  createElement (callback) {
    var self = this

    return html`
      <div class="Q0" id="${this.local.id}">
        <label class="Q0-option">
          <input class="Q0-toggle" type="radio" name="${NAME}" value="Ja" checked=${this.local.value === 'Ja'} required onchange=${onchange}>
          <span class="Q0-label">Ja, självklart</span>
        </label>
        <label class="Q0-option">
          <input class="Q0-toggle" type="radio" name="${NAME}" value="Nej" checked=${this.local.value === 'Nej'} onchange=${onchange}>
          <span class="Q0-label">
            Nej..
            <span class="Q0-tooltip">
              Se till att göra det på <a href="https://www.beckmans.se" rel="noopener noreferrer">beckmans.se</a>
            </span>
          </span>
        </label>
      </div>
    `

    function onchange (event) {
      var target = event.target
      self.local.value = target.value
      callback(NAME, target.value)
    }
  }
}

var html = require('choo/html')
var Component = require('choo/component')

var NAME = 'why-me'

module.exports = class Q2 extends Component {
  constructor (id, state, emit) {
    super(id)
    var value = state.answers[NAME] || ''
    this.local = state.components[id] = { id, value }
  }

  verify () {
    return Boolean(this.local.value)
  }

  serialize () {
    return { [NAME]: this.local.value }
  }

  title () {
    return 'Berätta om varför du tycker att du ska få Formstipendiet.'
  }

  update () {
    return false
  }

  createElement (callback) {
    var self = this

    return html`
      <div class="Q2" id="${this.local.id}">
        <label class="Q2-option">
          <div class="Q2-limit">${500 - this.local.value.length} tecken</div>
          <span class="u-hiddenVisually">Varför tycker du att du ska få Formstipendiet?</span>
          <textarea class="Q2-text" name="${NAME}" maxlength="500" rows="9" placeholder="Skriv här…" required oninput=${oninput}>${this.local.value}</textarea>
        </label>
      </div>
    `

    function oninput (event) {
      var value = event.target.value
      self.local.value = value
      callback(NAME, value)
      self.rerender()
      if (value.length > 500) event.preventDefault()
    }
  }
}

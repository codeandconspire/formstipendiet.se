var html = require('choo/html')
var Component = require('choo/component')

var NAME = 'entry.1218836425'

module.exports = class Opportunities extends Component {
  constructor (id, state, emit) {
    super(id)
    var value = state.answers[NAME] || null
    this.local = state.components[id] = { id, value }
  }

  verify () {
    return this.local.value
  }

  serialize () {
    return { [NAME]: this.local.value }
  }

  title () {
    return 'Hur ser dina möjligheter ut att gå kvällsskolan om du inte skulle få Formstipendiet?'
  }

  value () {
    return html`<p>${this.local.value}</p>`
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
      <div class="Opportunities" id="${this.local.id}">
        <label class="Opportunities-option">
          <input class="Opportunities-toggle" type="radio" name="${NAME}" value="Dåliga" checked=${this.local.value === 'Dåliga'} onchange=${onchange}>
          <span class="Opportunities-label">
            <div class="Opportunities-indicator"></div>
            <svg class="Opportunities-symbol" width="70" height="70" viewBox="0 0 70 70">
              <g fill="currentColor" fill-rule="evenodd">
                <path fill-rule="nonzero" d="M35 70a35 35 0 1 1 0-70 35 35 0 0 1 0 70zm0-2.3a32.7 32.7 0 1 0 0-65.4 32.7 32.7 0 0 0 0 65.4z"/>
                <ellipse cx="25.7" cy="25.7" rx="3.5" ry="5.8"/>
                <ellipse cx="44.3" cy="25.7" rx="3.5" ry="5.8"/>
                <path fill-rule="nonzero" d="M12.7 49.8l2 1.2c4.1-7.1 12-11.6 20.6-11.6 8.8 0 16.8 4.7 20.7 12l2-1.1A25.8 25.8 0 0 0 35.4 37c-9.5 0-18 5-22.6 12.8z"/>
              </g>
            </svg>
            <span class="Opportunities-text">
              <span class="Opportunities-title">Dåliga.</span>
              <small class="Opportunities-description">Jag kommer inte kunna gå för att jag har inte råd.</small>
            </span>
          </span>
        </label>
        <label class="Opportunities-option">
          <input class="Opportunities-toggle" type="radio" name="${NAME}" value="Hm" checked=${this.local.value === 'Hm'} onchange=${onchange}>
          <span class="Opportunities-label">
            <div class="Opportunities-indicator"></div>
            <svg class="Opportunities-symbol" width="70" height="70" viewBox="0 0 70 70">
              <g fill="currentColor" fill-rule="evenodd">
                <path fill-rule="nonzero" d="M35 70a35 35 0 1 1 0-70 35 35 0 0 1 0 70zm0-2.3a32.7 32.7 0 1 0 0-65.4 32.7 32.7 0 0 0 0 65.4z"/>
                <ellipse cx="25.7" cy="25.7" rx="3.5" ry="5.8"/>
                <ellipse cx="44.3" cy="25.7" rx="3.5" ry="5.8"/>
                <path fill-rule="nonzero" d="M15.7 44.3V42h39.1v2.3z"/>
              </g>
            </svg>
            <span class="Opportunities-text">
              <span class="Opportunities-title">Hm…</span>
              <small class="Opportunities-description">Jag vet inte, men det kanske löser sig.</small>
            </span>
          </span>
        </label>
        <label class="Opportunities-option">
          <input class="Opportunities-toggle" type="radio" name="${NAME}" value="Bra" checked=${this.local.value === 'Bra'} onchange=${onchange}>
          <span class="Opportunities-label">
            <div class="Opportunities-indicator"></div>
            <svg class="Opportunities-symbol" width="70" height="70" viewBox="0 0 70 70">
              <g fill="currentColor" fill-rule="evenodd">
                <path fill-rule="nonzero" d="M35 70a35 35 0 1 1 0-70 35 35 0 0 1 0 70zm0-2.3a32.7 32.7 0 1 0 0-65.4 32.7 32.7 0 0 0 0 65.4z"/>
                <ellipse cx="25.7" cy="25.7" rx="3.5" ry="5.8"/>
                <ellipse cx="44.3" cy="25.7" rx="3.5" ry="5.8"/>
                <path fill-rule="nonzero" d="M10 35h2.2a22.8 22.8 0 0 0 23.4 22.2c12.9 0 23.3-10 23.3-22.2h2.3a25.1 25.1 0 0 1-25.6 24.5c-14.2 0-25.7-11-25.7-24.5z"/>
              </g>
            </svg>
            <span class="Opportunities-text">
              <span class="Opportunities-title">Bra!</span>
              <small class="Opportunities-description">Det löser sig alltid! Jag kommer att gå oavsett.</small>
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

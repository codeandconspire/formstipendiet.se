var html = require('choo/html')
var Component = require('choo/component')
var { i18n } = require('../../components/base')

var text = i18n()
var questions = require('./questions.json')

module.exports = form

function form (state, emit) {
  emit('meta', {
    title: text`SITE_NAME`,
    description: text`SITE_DESCRIPTION`,
    'og:image': '/share.jpg'
  })

  return state.cache(Form, 'form').render(state, emit)
}

class Form extends Component {
  constructor (id, state, emit) {
    super(id)
    var step = +state.query.q
    this.local = state.components[id] = {
      id: id,
      step: isNaN(step) ? 0 : step,
      answers: Object.keys(state.query)
        .filter((key) => key !== 'q')
        .reduce(function (obj, key) {
          obj[key] = state.query[key]
          return obj
        }, {})
    }
  }

  update () {
    return true
  }

  createElement (state, emit) {
    var question = questions[this.local.step]
    return html`
      <body id="${this.local.id}">
        <form class="Form" action="${state.href}" method="${this.local.step === questions.length - 1 ? 'POST' : 'GET'}">
          ${Object.keys(this.local.answers).map((key) => html`
            <input type="hidden" name="${key}" value="${this.local.answers[key]}">
          `)}
          <div class="Form-main">
            <div class="Form-statusbar">
              ${this.local.step + 1}/${questions.length}
              <a href="/" class="Form-cancel">Avbryt</a>
            </div>
            <div class="Form-question">
              <p>${question.text}</p>
            </div>
            <div class="Form-footer">
              ${this.local.step > 0 ? html`
                <button type="submit" name="q" value="${this.local.step - 1}">
                  Föregående fråga
                </button>
              ` : null}
            </div>
          </div>
          <div class="Form-sidebar">
            <div class="Form-options">
              ${question.options.map((option) => {
                var name = option.name || question.name
                switch (option.type) {
                  case 'checkbox': return html`
                    <label class="Form-option Form-option--checkbox">
                      <input class="Form-toggle" type="checkbox" name="${name}" checked=${this.local.answers[name] ? this.local.answers[name] === option.value : false}>
                      <span class="Form-label">${option.text}</span>
                    </label>
                  `
                  case 'radio': return html`
                    <label class="Form-option Form-option--radio">
                      <input class="Form-toggle" type="radio" name="${name}" checked=${this.local.answers[name] ? this.local.answers[name] === option.value : false}>
                      <span class="Form-label">${option.text}</span>
                    </label>
                  `
                  default: return null
                }
              })}
            </div>
            <div class="Form-nav">
              ${this.local.step > 0 ? html`
                <button type="submit" name="q" value="${this.local.step - 1}" class="Form-action Form-action--prev">
                  ← <span class="u-hiddenVisually">Föregående fråga</span>
                </button>
              ` : null}
              ${this.local.step === questions.length - 1 ? html`
                <button type="submit" class="Form-action Form-action--submit">
                  → Skicka ansökan ←
                </button>
              ` : html`
                <button type="submit" name="q" value="${this.local.step + 1}" class="Form-action Form-action--next">
                  <span class="u-hiddenVisually">Nästa fråga</span> →
                </button>
              `}
            </div>
          </div>
        </form>
      </body>
    `
  }
}

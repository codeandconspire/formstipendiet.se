var html = require('choo/html')
var raw = require('choo/html/raw')
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

    try {
      var persisted = window.localStorage.getItem(id)
      if (persisted) persisted = JSON.parse(persisted)
    } catch (e) {}

    var queried = Object.keys(state.query)
      .filter((key) => key !== 'q')
      .reduce(function (obj, key) {
        obj[key] = state.query[key]
        return obj
      }, {})

    var step = +state.query.q
    this.local = state.components[id] = {
      id: id,
      step: isNaN(step) ? 0 : step,
      answers: Object.assign({}, persisted, queried)
    }
  }

  update () {
    return true
  }

  createElement (state, emit) {
    var step = +state.query.q
    if (!isNaN(step)) this.local.step = step
    else step = this.local.step

    var query = serialize(this.local.answers)

    var self = this
    var question = questions[step]
    var isValid = Boolean(question.options.find(function (option) {
      var answer = self.local.answers[option.name || question.name]
      if (!answer) return false
      if (!answer.includes(encodeURIComponent(option.label))) return false
      var value = Boolean(answer)
      if (option.invalid && value) return false
      return value
    }))

    return html`
      <body id="${this.local.id}">
        <form class="Form ${isValid ? 'is-valid' : ''}" action="${state.href}" method="${step === questions.length - 1 ? 'POST' : 'GET'}">
          ${Object.keys(this.local.answers)
            .filter((key) => question.options.find((option) => question.name !== key && option.name !== key))
            .map((key) => html`
              <input type="hidden" name="${key}" value="${this.local.answers[key]}">
          `)}
          <div class="Form-main">
            <div class="Form-statusbar">
              ${step + 1}/${questions.length}
              <a href="/" class="Form-cancel">Avbryt</a>
            </div>
            <div class="Form-question">
              <p>${question.text}</p>
            </div>
            <div class="Form-footer">
              ${step > 0 ? html`
                <button type="submit" name="q" value="${step - 1}">
                  Föregående fråga
                </button>
              ` : null}
            </div>
          </div>
          <div class="Form-sidebar">
            <div class="Form-options">
              ${question.options.map((option, index) => {
                var name = option.name || question.name
                var value = encodeURIComponent(option.label)
                var answer = this.local.answers[name]

                switch (option.type) {
                  case 'checkbox': {
                    let checked = Boolean(answer && answer.includes(value))
                    return html`
                      <label class="Form-option Form-option--checkbox">
                        <input id="${this.local.id}-${step}-${index}" class="Form-toggle" type="checkbox" name="${name}" value="${value}" checked=${checked} required onchange=${onchange}>
                        <span class="Form-label">
                          ${option.label}
                          ${checked && option.tooltip ? html`<span class="Form-tooltip">${raw(option.tooltip)}</span>` : null}
                        </span>
                      </label>
                    `
                  }
                  case 'radio': {
                    let checked = Boolean(answer && answer.includes(value))
                    return html`
                      <label class="Form-option Form-option--radio">
                        <input id="${this.local.id}-${step}-${index}" class="Form-toggle" type="radio" name="${name}" value="${value}" checked=${checked} required onchange=${onchange}>
                        <span class="Form-label">
                          ${option.label}
                          ${checked && option.tooltip ? html`<span class="Form-tooltip">${raw(option.tooltip)}</span>` : null}
                        </span>
                      </label>
                    `
                  }
                  default: return null
                }
              })}
            </div>
            <div class="Form-nav">
              <a href="${state.href}${query}${query ? '&' : '?'}q=${step - 1}" class="Form-action Form-action--prev ${step === 0 ? 'is-disabled' : ''}" label="Föregående fråga">
                <span class="Form-button">Föregående fråga</span>
            </a>
              ${step === questions.length - 1 ? html`
                <button type="submit" class="Form-action Form-action--submit" disabled=${!isValid} label="Skicka ansökan">
                  <span class="Form-button">Skicka ansökan</span>
                </button>
              ` : html`
                <button type="submit" name="q" value="${step + 1}" class="Form-action Form-action--next" disabled=${!isValid} label="Nästa fråga">
                  <span class="Form-button">Nästa fråga</span>
                </button>
              `}
            </div>
          </div>
        </form>
      </body>
    `

    function onchange (event) {
      var target = event.target
      var value = target.value
      var name = target.name
      var answers = self.local.answers
      var toggle = target.type === 'radio' || target.type === 'checkbox'

      if (question.multiple) {
        let current = answers[name] ? answers[name].split(',') : []
        if (toggle) {
          if (target.checked) {
            answers[name] = current.concat(value).join(',')
          } else {
            value = current.filter((str) => str !== value).join(',')
            answers[name] = value
          }
        } else if (value) {
          answers[name] = value
        } else {
          delete answers[name]
        }
      } else {
        if (toggle) {
          if (target.checked) {
            answers[name] = value
          } else {
            delete answers[name]
          }
        } else if (value) {
          answers[name] = value
        } else {
          delete answers[name]
        }
      }

      window.localStorage.setItem(self.local.id, JSON.stringify(answers))
      self.rerender()
    }
  }
}

// serialize object to query string
// obj -> str
function serialize (obj) {
  return Object.keys(obj).reduce(function (str, key) {
    str += `${str ? '&' : '?'}${key}=${encodeURIComponent(obj[key])}`
    return str
  }, '')
}

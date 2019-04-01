var html = require('choo/html')
var raw = require('choo/html/raw')
var Component = require('choo/component')
var limit = require('../../components/limit')
var { i18n, className } = require('../../components/base')

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
      error: null,
      loading: false,
      step: isNaN(step) ? 0 : step,
      answers: Object.assign({}, persisted, queried)
    }
  }

  unload () {
    this.local.step = 0
    this.local.error = null
    this.local.loading = false
  }

  update () {
    return !this.local.loading
  }

  createElement (state, emit) {
    var step = +state.query.q
    if (!isNaN(step)) this.local.step = step
    else step = this.local.step

    var query = serialize(this.local.answers)

    var self = this
    var question = questions[step]
    var isSummary = step === questions.length
    var isValid = isSummary || Boolean(question.options.find(function (option) {
      var answer = self.local.answers[option.name || question.name]
      if (!answer) return false
      if (question.multiple) {
        if (!answer.includes(encodeURIComponent(option.label))) return false
      }
      var value = Boolean(answer)
      if (option.invalid && value) return false
      return value
    }))

    var answers = []
    Object.keys(this.local.answers).filter((key) => {
      if (!question) return true
      return question.options.find((option) => question.name !== key && option.name !== key)
    }).forEach((key) => {
      var value = this.local.answers[key]
      if (Array.isArray(value)) {
        answers[key] = answers[key] || []
        for (let i = 0, len = value.length; i < len; i++) {
          answers[key].push([key, value[i]])
        }
      } else {
        answers.push([key, value])
      }
    })

    return html`
      <body id="${this.local.id}">
        <form class="${className('Form', { 'Form--summary': isSummary, 'is-valid': isValid })}" action="${state.href}" method="${isSummary ? 'POST' : 'GET'}" onsubmit=${onsubmit}>
          ${answers.map(([name, value]) => html`<input type="hidden" name="${name}" value="${value}">`)}

          <div class="Form-statusbar">
            <span>${step < questions.length ? `${step + 1}/${questions.length}` : null}</span>
            <a href="/" class="Form-cancel"><span>Avbryt</span></a>
          </div>

          <div class="Form-main">
            <div class="Form-question">
              <p>${step < questions.length ? question.text : 'Granska din ansökan'}</p>
              ${this.local.error ? html`
                <div class="Form-error">
                  <h2>Hoppsan!</h2>
                  <p>Något verkar gått galet. Kontrollera att allt är ifyllt rätt innan du försöker igen.</p>
                  ${process.env.NODE_ENV === 'development' ? html`<pre>${this.local.error.stack}</pre>` : null}
                </div>
              ` : null}
            </div>

            <div class="Form-tools">
              ${step < questions.length ? html`
                <div class="Form-options">
                  ${question.options.map(asOption)}
                </div>
              ` : html`
                <div class="Form-summary">
                  <dl>
                    ${questions.reduce((list, question) => {
                      let answers = Object.keys(this.local.answers).filter((key) => {
                        if (key === question.name) return true
                        return question.options.find((opt) => opt.name === key)
                      })

                      list.push(html`<dt class="Form-title">${question.text}</dt>`)

                      for (let i = 0, len = answers.length; i < len; i++) {
                        if (i !== 0) list.push(html`<br>`)
                        let value = this.local.answers[answers[i]]
                        if (Array.isArray(value)) value = value.map(decodeURIComponent)
                        else value = decodeURIComponent(value)
                        list.push(html`<dd class="Form-value">${value}</dd>`)
                      }

                      return list
                    }, [])}
                  </dl>
                  <div class="Form-action Form-action--restart">
                      Blev något fel?<br>
                      <a href="${state.href}${query}${query ? '&' : '?'}q=0" class="Form-button" onclick=${goto(0)}>Gå tillbaka och ändra</a>
                  </div>
                </div>
              `}
            </div>
          </div>

          <div class="Form-nav">
            ${!isSummary ? html`
              <a href="${state.href}${query}${query ? '&' : '?'}q=${step - 1}" class="Form-action Form-action--prev ${step === 0 ? 'is-disabled' : ''}" label="Föregående fråga" onclick=${goto(step - 1)}>
                <span class="Form-button">Föregående fråga</span>
              </a>
            ` : null}
            ${isSummary ? html`
              <button type="submit" class="Form-action Form-action--submit" disabled=${!isValid} label="Skicka ansökan">
                <span class="Form-button">Skicka ansökan</span>
              </button>
            ` : html`
              <button type="submit" name="q" value="${step + 1}" class="Form-action Form-action--next" disabled=${!isValid} label="Nästa fråga">
                <span class="Form-button">Nästa fråga</span>
              </button>
            `}
          </div>

          ${step > 0 ? html`
            <button class="Form-footer" type="submit" name="q" value="${step - 1}">Föregående fråga</button>
          ` : html`
            <div class="Form-footer"></div>
          `}
        </form>
      </body>
    `

    function goto (step) {
      return function (event) {
        self.local.step = step
        if (state.query.q) emit('pushState', state.href)
        else self.rerender()
        event.preventDefault()
      }
    }

    function asOption (option, index) {
      var name = option.name || question.name
      var answer = self.local.answers[name]

      switch (option.type) {
        case 'checkbox': {
          let value = encodeURIComponent(option.label)
          let checked = Boolean(answer && answer.includes(value))
          return html`
            <label class="Form-option Form-option--checkbox">
              <input id="${self.local.id}-${step}-${index}" class="Form-toggle" type="checkbox" name="${name}" value="${value}" checked=${checked} required=${Boolean(option.required)} onchange=${onchange}>
              <span class="Form-label">
                ${option.label}
                ${checked && option.tooltip ? html`<span class="Form-tooltip">${raw(option.tooltip)}</span>` : null}
              </span>
            </label>
          `
        }
        case 'radio': {
          let value = encodeURIComponent(option.label)
          let checked = Boolean(answer && answer.includes(value))
          return html`
            <label class="Form-option Form-option--radio">
              <input id="${self.local.id}-${step}-${index}" class="Form-toggle" type="radio" name="${name}" value="${value}" checked=${checked} required=${Boolean(option.required)} onchange=${onchange}>
              <span class="Form-label">
                ${option.label}
                ${checked && option.tooltip ? html`<span class="Form-tooltip">${raw(option.tooltip)}</span>` : null}
              </span>
            </label>
          `
        }
        case 'text': {
          let value = decodeURIComponent(answer || '')
          return html`
            <label class="Form-option Form-option--text">
              <span class="Form-label">${option.label}</span>
              <input id="${self.local.id}-${step}-${index}" class="${className('Form-text', { 'Form-text--inline': question.multiple })}" type="text" name="${name}" value="${value}" required=${Boolean(option.required)} oninput=${onchange}>
            </label>
          `
        }
        case 'textarea': {
          let value = decodeURIComponent(answer || '')
          let oninput = (event) => {
            onchange(event)
            if (event.target.value > option.limit) event.preventDefault()
          }
          return html`
            <label class="Form-option Form-option--textarea">
              ${limit(value, option.limit)}
              <span class="u-hiddenVisually">${option.label}</span>
              <textarea id="${self.local.id}-${step}-${index}" class="Form-text" type="text" name="${name}" maxlength="${option.limit}" rows="9" placeholder="Skriv här…" required=${Boolean(option.required)} oninput=${oninput}>${value}</textarea>
            </label>
          `
        }
        default: return null
      }
    }

    function onchange (event) {
      var target = event.target
      var value = target.value
      var name = target.name
      var answers = self.local.answers

      if (question.multiple && target.type === 'checkbox') {
        let current = answers[name] || []
        if (target.checked) value = current.concat(value)
        else value = current.filter((str) => str !== value)
      }

      if (value) answers[name] = value
      else delete answers[name]

      window.localStorage.setItem(self.local.id, JSON.stringify(answers))
      self.rerender()
    }

    function onsubmit (event) {
      if (isSummary) {
        self.local.error = null
        self.local.loading = true
        self.rerender()
        window.fetch('/ansok', {
          method: 'POST',
          body: JSON.stringify(self.local.answers),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }).then(function (res) {
          if (!res.ok) return res.text().then((err) => Promise.reject(Error(err)))
          window.localStorage.removeItem(self.local.id)
          self.local.loading = false
          emit('pushState', '/tack')
        }).catch(function (err) {
          self.local.loading = false
          self.local.error = err
          window.scrollTo(0, 0)
          self.rerender()
        })
      } else {
        self.local.step += 1
        if (state.query.q) emit('pushState', state.href)
        else self.rerender()
      }
      event.preventDefault()
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

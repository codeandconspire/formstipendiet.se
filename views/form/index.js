var html = require('choo/html')
var { i18n, className } = require('../../components/base')
var questions = [
  require('../../components/has-applied'),
  require('../../components/why-you'),
  require('../../components/opportunities'),
  require('../../components/prior-studies'),
  require('../../components/age'),
  require('../../components/about-you'),
  require('../../components/contact')
]

var text = i18n()

module.exports = form

function form (state, emit) {
  emit('meta', {
    title: text`SITE_NAME`,
    description: text`SITE_DESCRIPTION`,
    'og:image': '/share.jpg'
  })

  var all = questions.map(function (Component, index) {
    return state.cache(Component, `forum-question-${index}`)
  })
  var current = all[state.step]

  var query = serialize(state.answers)
  var isSummary = state.step === questions.length
  var isValid = isSummary ? all.reduce(function (valid, component) {
    return valid && component.verify()
  }, true) : current.verify()

  var answers = all
    .filter((component, index) => index !== state.step)
    .reduce(function (pairs, component) {
      var props = component.serialize()
      var keys = Object.keys(props)
      for (let i = 0, len = keys.length; i < len; i++) {
        let key = keys[i]
        if (Array.isArray(props[key])) {
          for (let i = 0, len = props[key].length; i < len; i++) {
            pairs.push([key, props[key][i]])
          }
        } else {
          pairs.push([key, props[key]])
        }
      }
      return pairs
    }, [])

  return html`
    <body>
      <form class="${className('Form', { 'Form--summary': isSummary, 'is-valid': isValid })}" action="${state.href}" method="${isSummary ? 'POST' : 'GET'}" onsubmit=${onsubmit}>
        ${answers.map(([name, value]) => html`<input type="hidden" name="${name}" value="${value}">`)}

        <div class="Form-statusbar">
          <span>${state.step < questions.length ? `${state.step + 1}/${questions.length}` : null}</span>
          <a href="/" class="Form-cancel"><span>Avbryt</span></a>
        </div>

        <div class="Form-main">
          <div class="Form-container">
            <div class="Form-question">
              <p>${isSummary ? 'Granska din ansökan' : current.title()}</p>
              ${state.error ? html`
                <div class="Form-error">
                  <h2>Hoppsan!</h2>
                  <p>Något verkar gått galet. Kontrollera att allt är ifyllt rätt innan du försöker igen.</p>
                  ${process.env.NODE_ENV === 'development' ? html`<pre>${state.error.stack}</pre>` : null}
                </div>
              ` : null}
            </div>

            <div class="Form-tools">
              ${!isSummary ? current.render(onchange) : html`
                <div class="Form-summary">
                  <dl class="Form-dl">
                    ${all.reduce((list, question) => {
                      var value = question.value()
                      if (!value) return list
                      list.push(
                        html`<dt class="Form-title">${question.title()}</dt>`,
                        html`<dd class="Form-value">${value}</dd>`
                      )
                      return list
                    }, [])}
                  </dl>
                  <div class="Form-restart">
                    Blev något fel?<br>
                    <a class="Form-link" href="${state.href}${query}${query ? '&' : '?'}q=0" onclick=${goto(0)}>Gå tillbaka och ändra</a>
                  </div>
                </div>
              `}
            </div>
          </div>
        </div>

        <div class="Form-nav">
          ${!isSummary ? html`
            <a href="${state.href}${query}${query ? '&' : '?'}q=${state.step - 1}" class="Form-action Form-action--prev ${state.step === 0 ? 'is-disabled' : ''}" label="Föregående fråga" onclick=${goto(state.step - 1)}>
              <span class="Form-button">Föregående fråga</span>
            </a>
          ` : null}
          ${isSummary ? html`
            <button type="submit" class="Form-action Form-action--submit" disabled=${!isValid} label="Skicka ansökan">
              <span class="Form-button">Skicka ansökan</span>
            </button>
          ` : html`
            <button type="submit" name="q" value="${state.step + 1}" class="Form-action Form-action--next ${!isValid ? 'is-disabled' : ''}" disabled=${!isValid} label="Nästa fråga">
              <span class="Form-button">Nästa fråga</span>
            </button>
          `}
        </div>

        ${state.step > 0 ? html`
          <button class="Form-footer" type="submit" name="q" value="${state.step - 1}" onclick=${goto(state.step - 1)}>Föregående fråga</button>
        ` : html`
          <div class="Form-footer"></div>
        `}
      </form>
    </body>
  `

  function goto (step) {
    return function (event) {
      emit('form:goto', step)
      event.preventDefault()
    }
  }

  function onchange (name, value) {
    emit('form:save', name, value)
  }

  function onsubmit (event) {
    if (!state.loading) {
      if (isSummary) emit('form:submit')
      else emit('form:goto', state.step + 1)
    }
    event.preventDefault()
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

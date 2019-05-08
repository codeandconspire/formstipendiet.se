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
    'og:image': '/meta.png'
  })

  var all = questions.map(function (Component, index) {
    return state.cache(Component, `forum-question-${index}`)
  })
  var current = all[state.step]
  var next = all[state.next]

  var hasWindow = typeof window !== 'undefined'
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
          if (key === 'entry.551104495.other_option_response') {
            pairs.push(['entry.551104495', '__other_option__'])
          }
        }
      }
      return pairs
    }, [])

  var attrs = {
    class: className('Form', {
      'is-intransition': state.next != null,
      [`Form--${state.next - state.step === 1 ? 'forward' : 'backward'}`]: state.next != null,
      'Form--summary': isSummary,
      'is-valid': !hasWindow || isValid
    }),
    action: state.href,
    method: isSummary ? 'POST' : 'GET',
    onsubmit: onsubmit
  }

  if (state.next != null) attrs.style = `--Form-direction: ${state.next - state.step};`

  return html`
    <body>
      <form ${attrs}>
        ${answers.map(([name, value]) => html`<input type="hidden" name="${name}" value="${value}">`)}

        <div class="Form-statusbar">
          <span>${state.step < questions.length ? `${state.step + 1}/${questions.length}` : null}</span>
          <a href="/" class="Form-cancel" onclick=${reset}><span>Avbryt</span></a>
        </div>

        <div class="Form-main">
          <div class="Form-container js-scroll">
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

            <div class="Form-tools js-tools js-scroll">
              <div class="Form-answer">
                ${!isSummary ? current.render(onchange, { out: state.step - state.next }) : html`
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
                      <a class="Form-link" href="${state.href}${query}${query ? '&' : '?'}q=0" onclick=${onclick(0)}>Gå tillbaka och ändra</a>
                    </div>
                  </div>
                `}
              </div>
              <div class="Form-answer Form-answer--next">
                ${!isSummary && next ? next.placeholder(onchange, { in: state.next - state.step }) : null}
                <div class="Form-nav Form-nav--placeholder">
                  ${next ? html`
                    <button type="submit" name="q" value="${state.step + 1}" class="Form-action Form-action--next ${!next.verify() ? 'is-disabled' : ''}" disabled=${!next.verify()} label="${state.next === questions.length - 1 ? 'Granska' : 'Nästa fråga'}">
                      <span class="Form-button">${state.next === questions.length - 1 ? 'Granska' : 'Nästa fråga'}</span>
                    </button>
                  ` : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="Form-nav">
          ${!isSummary ? html`
            <a href="${state.href}${query}${query ? '&' : '?'}q=${state.step - 1}" class="Form-action Form-action--prev ${state.step === 0 ? 'is-disabled' : ''}" label="Förra frågan" onclick=${onclick(state.step - 1)}>
              <span class="Form-button">Förra frågan</span>
            </a>
          ` : null}
          ${isSummary ? html`
            <button type="submit" class="Form-action Form-action--submit ${(hasWindow && !isValid) || state.loading ? 'is-disabled' : ''}" disabled=${(hasWindow && !isValid) || state.loading} label="Skicka ansökan">
              <span class="Form-button">Skicka ansökan</span>
            </button>
          ` : html`
            <button type="submit" name="q" value="${state.step + 1}" class="Form-action Form-action--next ${hasWindow && !isValid ? 'is-disabled' : ''}" disabled=${hasWindow && !isValid} label="${state.step === questions.length - 1 ? 'Granska' : 'Nästa fråga'}">
              <span class="Form-button">${state.step === questions.length - 1 ? 'Granska' : 'Nästa fråga'}</span>
            </button>
          `}
        </div>

        ${state.step > 0 ? html`
          <button class="Form-footer" type="submit" name="q" value="${state.step - 1}" disabled=${state.loading} onclick=${onclick(state.step - 1)}>
            Förra frågan
          </button>
        ` : html`
          <div class="Form-footer"></div>
        `}
      </form>
    </body>
  `

  function reset (event) {
    emit('form:abort')
    event.preventDefault()
  }

  function onclick (step) {
    return function (event) {
      goto(step)
      event.preventDefault()
    }
  }

  function onchange (name, value) {
    emit('form:save', name, value)
  }

  function onsubmit (event) {
    if (!state.loading) {
      if (isSummary) emit('form:submit')
      else goto(state.step + 1)
    }
    event.preventDefault()
  }

  function goto (step) {
    var diff = state.step - step
    if (Math.abs(diff) === 1) {
      if (diff === -1) emit('form:next')
      else emit('form:prev')
      let tools = document.querySelector('.js-tools')
      tools.addEventListener('animationend', function onanimationend (event) {
        if (event.target !== tools) return
        tools.removeEventListener('animationend', onanimationend)
        emit('form:goto', step)
      })
    } else {
      emit('form:goto', step)
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

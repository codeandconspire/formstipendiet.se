var html = require('choo/html')
var { i18n } = require('../../components/base')
var intro = require('../../components/intro')
var Countdown = require('../../components/countdown')

var DEADLINE = new Date('2019-05-25')

var text = i18n()

module.exports = home

function home (state, emit) {
  emit('meta', {
    title: text`SITE_NAME`,
    description: text`SITE_DESCRIPTION`,
    'og:image': '/share.jpg'
  })

  return html`
    <body>
      <main class="Home js-scroll">
        <div class="Home-main">
          <div class="Home-content">
            <p>Din designkarriär kan börja hos Beckmans Kvällsskola!</p>
            <p>Att gå på kvällsskolan kostar 34 000 kronor vilket är mycket pengar. Därför startades Formstipendiet av Familjen Robert Weils Stiftelse. Om du har sökt till kvällsskolan så kan du ansöka om stipendiet och behöver alltså inte betala en enda krona.</p>
            <nav>
              ${DEADLINE > Date.now() ? html`<a href="/ansok" class="Home-apply">Sök Formstipendiet</a>` : null}
              <a href="/info" class="Home-menu">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <defs>
                    <path id="menu-text-path" d="M60 98a38 38 0 1 1 0-76 38 38 0 0 1 0 76zm0-1a37 37 0 1 0 0-74 37 37 0 0 0 0 74z"/>
                  </defs>
                  <circle class="Home-dot" r="4" fill="currentColor" cx="60" cy="60" />
                  <text width="120">
                    <textPath fill="currentColor" alignment-baseline="top" xlink:href="#menu-text-path">
                      Mer information
                    </textPath>
                  </text>
                </svg>
              </a>
            </nav>
          </div>
          ${DEADLINE > Date.now() ? html`
            <div class="Home-footer">
              ${state.cache(Countdown, 'home-timer').render(DEADLINE)}
            </div>
          ` : null}
        </div>
        <div class="Home-sidebar">
          ${intro()}
        </div>
      </main>
    </body>
  `
}

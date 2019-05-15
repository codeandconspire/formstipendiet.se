var html = require('choo/html')
var { i18n } = require('../../components/base')
var Intro = require('../../components/intro')
var Countdown = require('../../components/countdown')

var DEADLINE = new Date('2019-05-25')

var text = i18n()

module.exports = home

function home (state, emit) {
  emit('meta', {
    title: text`SITE_NAME`,
    description: text`SITE_DESCRIPTION`,
    'og:image': '/share-image.png'
  })

  return html`
    <body>
      <main class="Home js-scroll">
        <div class="Home-main">
          <div class="Home-content">
            <p>Din framtid kan börja på Beckmans Kvällsskola!</p>
            <p>Familjen Robert Weils Stiftelse har startat Formstipendiet. Om du vill söka kvällsskolan men tvekar inför att den kostar pengar är du en av de som har möjlighet att ansöka om Formstipendiet. Stipendiet täcker kostnaden för utbildningen.</p>
            <nav class="Home-nav">
              ${DEADLINE > Date.now() ? html`<a href="/ansok" class="Home-apply">Sök Formstipendiet</a>` : null}
              <a href="/info" class="Home-menu">Mer info</a>
            </nav>
          </div>
          ${DEADLINE > Date.now() ? html`
            <div class="Home-footer">
              ${state.cache(Countdown, 'home-timer').render(DEADLINE)}
            </div>
          ` : null}
        </div>
        <div class="Home-sidebar">
          ${state.cache(Intro, 'homepage-intro').render()}
        </div>
      </main>
    </body>
  `
}

var html = require('choo/html')
var { i18n } = require('../../components/base')

var text = i18n()

module.exports = home

function home (state, emit) {
  emit('meta', {
    title: text`SITE_NAME`,
    description: text`SITE_DESCRIPTION`,
    'og:image': '/meta.png'
  })

  return html`
    <body>
      <main class="Info js-scroll">
        <div class="Info-main">
          <div class="Info-content">
            <p>Gillar du att skapa med händerna? Kanske gillar du att inreda ditt rum och fantiserar om att bygga en bokhylla? Formgivning kan vara allt möjligt och form finns överallt.</p>
            <p>Med vilja och lust att skapa något kommer man långt. På kvällsskolan får du bland annat lära dig möbeldesign, inredning, skissteknik, materialkunskap, foto, designhistoria, förpackningsdesign och verkstadsteknik.</p>
            <nav>
              <a href="/" class="Info-menu">
                Tillbaka
              </a>
            </nav>
            <div class="Info-footer">
              Sista ansökningsdag 24 maj 2019 och besked om stipendiet ges runt den 25 juni.
            </div>
          </div>
        </div>
        <div class="Info-sidebar">
          <ol class="Info-instructions">
            <li class="Info-step">Du söker till Kvällsskolan på <a href="https://www.beckmans.se/studera/forberedande-utbildning-kvallsskola/kvallskola-form/">beckmans.se</a></li>
            <li class="Info-step">Därefter kan du söka Formstipendiet</li>
            <li class="Info-step">Blir du utvald slipper du betala utbildningen</li>
          </ol>
        </div>
      </main>
    </body>
  `
}

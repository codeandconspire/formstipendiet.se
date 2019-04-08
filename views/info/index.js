var html = require('choo/html')
var { i18n } = require('../../components/base')

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
      <main class="Info">
        <div class="Info-main">
          <div class="Info-content">
            <p>Gillar du att skapa med händerna? Kanske gillar du att inreda ditt rum och fantiserar om att bygga en bokhylla? Formgivning kan vara allt möjligt och form finns överallt.</p>
            <p>Med vilja och lust att skapa något kommer man långt. På kvällsskolan får du bland annat lära dig möbeldesign, inredning, skissteknik, materialkunskap, foto, designhistoria, förpackningsdesign och verkstadsteknik.</p>
            <nav>
              <a href="/" class="Info-menu">
                <svg class="Info-spinner" width="120" height="120" viewBox="0 0 120 120">
                  <defs>
                    <path id="menu-text-path" d="M60 98a38 38 0 1 1 0-76 38 38 0 0 1 0 76zm0-1a37 37 0 1 0 0-74 37 37 0 0 0 0 74z"/>
                  </defs>
                  <text width="120">
                    <textPath fill="currentColor" alignment-baseline="top" xlink:href="#menu-text-path">
                      Mindre information
                    </textPath>
                  </text>
                </svg>
              </a>
            </nav>
          </div>
          <div class="Info-footer">
            Sista ansökningsdag 24 maj 2019 och besked om stipendiet ges runt den 25 juni.
          </div>
        </div>
        <div class="Info-sidebar">
          <ol class="Info-instructions">
            <li class="Info-step">Du söker till Kvällsskolan på <a href="https://www.beckmans.se">beckmans.se</a></li>
            <li class="Info-step">Därefter kan du söka Formstipendiet</li>
            <li class="Info-step">Blir du utvald slipper du betala utbildningen</li>
          </ol>
        </div>
      </main>
    </body>
  `
}

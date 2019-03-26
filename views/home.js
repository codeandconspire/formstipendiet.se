var html = require('choo/html')
var raw = require('choo/html/raw')
var { i18n } = require('../components/base')

var text = i18n()

module.exports = home

function home (state, emit) {
  emit('meta', {
    title: text`SITE_NAME`,
    description: text`SITE_DESCRIPTION`,
    'og:image': '/share.jpg'
  })

  return html`
    <body class="View" id="view">
      <script type="application/ld+json">${raw(JSON.stringify(linkedData(state)))}</script>
      <main class="View-main">
        Formstipendiet
      </main>
    </body>
  `
}

// format document as schema-compatible linked data table
// obj -> obj
function linkedData (state) {
  return {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    name: text`DEFAULT_TITLE`,
    url: state.origin,
    logo: state.origin + '/icon.png'
  }
}

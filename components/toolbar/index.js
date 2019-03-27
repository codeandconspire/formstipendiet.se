var html = require('choo/html')
var { i18n } = require('../base')

var text = i18n()

module.exports = toolbar

function toolbar (props) {
  return html`
    <div class="Toolbar">
      <a class="Toolbar-prev" href="/1">
        <span class="Toolbar-label">${text`Previous question`}</span>
      </a>
      <a class="Toolbar-next" href="/2">
        <span class="Toolbar-label">${text`Next question`}</span>
      </a>
    </div>
  `
}

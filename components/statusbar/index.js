var html = require('choo/html')
var { i18n } = require('../base')

var text = i18n()

module.exports = statusbar

function statusbar (props = {}) {
  return html`
    <div class="Statusbar">
      <span class="u-hiddenVisually">${text(`Question %s of %s`, props.current, props.total)}</span>
      <span class="Statusbar-label" aria-hidden="true">${props.current}/${props.total}</span>
      <a class="Statusbar-cancel" href="/">${text`Cancel`}</a>
    </div>
  `
}

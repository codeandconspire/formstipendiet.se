var html = require('choo/html')

module.exports = limit

function limit (text, limit = Infinity) {
  return html`<div class="Limit">${limit - text.length} tecken</div>`
}

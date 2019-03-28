var html = require('choo/html')

module.exports = layout

function layout (main, sidebar) {
  return html`
    <div class="Layout">
      <div class="Layout-main">
        ${main}
      </div>
      <div class="Layout-sidebar">
        ${sidebar}
      </div>
    </div>
  `
}

var html = require('choo/html')
var Banner = require('../../components/banner')

module.exports = thanks

function thanks (state, emit) {
  var contact = state.contact ? state.contact.toUpperCase() : '?'

  return html`
    <body>
      <main class="Thanks">
        <div class="Thanks-banners">
          ${state.cache(Banner, 'thanks-banner-1').render(0, 15)}
          ${state.cache(Banner, 'thanks-banner-2').render(0.6, 24)}
          ${state.cache(Banner, 'thanks-banner-3').render(0.2, 19)}
          ${state.cache(Banner, 'thanks-banner-4').render(0.4, 14)}
        </div>
        <div class="Thanks-text">
          <h1 class="Thanks-title">Så där ja!</h1>
          <p>
            Vi kontaktar dig på <span class="u-textBreak">${contact}</span> när urvalet till Formstipendiet är beslutat. Svaret kommer runt 25 juni 2019.
          </p>
        </div>
      </main>
    </body>
  `
}

var html = require('choo/html')
var { i18n } = require('../components/base')
var statusbar = require('../components/statusbar')
var toolbar = require('../components/toolbar')

var text = i18n()

module.exports = home

function home (state, emit) {
  emit('meta', {
    title: text`SITE_NAME`,
    description: text`SITE_DESCRIPTION`,
    'og:image': '/share.jpg'
  })

  return html`
    <body id="home">
      <main class="u-scroll">
        <div class="Form">
          ${statusbar()}
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, eaque nesciunt deserunt incidunt voluptatibus et illo nemo laborum. Doloribus nemo tenetur temporibus id ducimus veniam atque ullam eum cumque explicabo?Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, eaque nesciunt deserunt incidunt voluptatibus et illo nemo laborum. Doloribus nemo tenetur temporibus id ducimus veniam atque ullam eum cumque explicabo?Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, eaque nesciunt deserunt incidunt voluptatibus et illo nemo laborum. Doloribus nemo tenetur temporibus id ducimus veniam atque ullam eum cumque explicabo?Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, eaque nesciunt deserunt incidunt voluptatibus et illo nemo laborum. Doloribus nemo tenetur temporibus id ducimus veniam atque ullam eum cumque explicabo?Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, eaque nesciunt deserunt incidunt voluptatibus et illo nemo laborum. Doloribus nemo tenetur temporibus id ducimus veniam atque ullam eum cumque explicabo?Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, eaque nesciunt deserunt incidunt voluptatibus et illo nemo laborum. Doloribus nemo tenetur temporibus id ducimus veniam atque ullam eum cumque explicabo?Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, eaque nesciunt deserunt incidunt voluptatibus et illo nemo laborum. Doloribus nemo tenetur temporibus id ducimus veniam atque ullam eum cumque explicabo?Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, eaque nesciunt deserunt incidunt voluptatibus et illo nemo laborum. Doloribus nemo tenetur temporibus id ducimus veniam atque ullam eum cumque explicabo?
          ${toolbar(status)}
        </div>
      </main>
    </body>
  `
}

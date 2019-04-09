module.exports = reset

function reset (state, emitter) {
  // properly reset eventbus on ssr
  if (typeof window === 'undefined') emitter.removeAllListeners()
  emitter.on('DOMTitleChange', function (title) {
    state.title = title
  })

  // prevent leaking component state in-between renders
  state.components = Object.create({
    toJSON () {
      return {}
    }
  })

  // reset meta in-between renders
  state.meta = state.prefetch ? {} : state.meta

  emitter.on('navigate', function () {
    window.requestAnimationFrame(function () {
      var containers = document.querySelectorAll('.js-scroll')
      for (let i = 0, len = containers.length; i < len; i++) {
        containers[i].scrollTo(0, 0)
      }
    })
  })
}

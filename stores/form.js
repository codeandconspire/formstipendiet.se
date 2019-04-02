module.exports = form

var STORAGE_ID = 'formstipendiet-form'

function form (state, emitter) {
  try {
    var persisted = window.localStorage.getItem(STORAGE_ID)
    if (persisted) persisted = JSON.parse(persisted)
  } catch (e) {}

  var queried = Object.keys(state.query)
    .filter((key) => key !== 'q')
    .reduce(function (obj, key) {
      var val = state.query[key]
      if (Array.isArray(val)) obj[key] = val.map(decodeURIComponent)
      else obj[key] = val
      return obj
    }, {})

  var step = +state.query.q
  state.step = isNaN(step) ? 0 : step
  state.error = null
  state.loading = false
  state.answers = Object.assign({}, persisted, queried)

  emitter.on('form:save', function (name, value) {
    if (value) state.answers[name] = value
    else delete state.answers[name]
    window.localStorage.setItem(STORAGE_ID, JSON.stringify(state.answers))
    emitter.emit('render')
  })

  emitter.on('form:submit', function () {
    state.error = null
    state.loading = true
    emitter.emit('render')
    window.fetch('/ansok', {
      method: 'POST',
      body: JSON.stringify(state.answers),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(function (res) {
      if (!res.ok) return res.text().then((err) => Promise.reject(Error(err)))
      window.localStorage.removeItem(STORAGE_ID)
      state.loading = false
      emitter.emit('pushState', '/tack')
    }).catch(function (err) {
      state.loading = false
      state.error = err
      window.scrollTo(0, 0)
      emitter.emit('render')
    })
  })

  emitter.on('form:goto', function (step) {
    state.step = step
    if (Object.keys(state.query).length) emitter.emit('pushState', state.href)
    else emitter.emit('render')
  })
}

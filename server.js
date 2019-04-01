if (!process.env.NOW) require('dotenv/config')

var jalla = require('jalla')
var dedent = require('dedent')
var { get, post } = require('koa-route')
var purge = require('./lib/purge')

var app = jalla('index.js', {
  sw: 'sw.js',
  serve: process.env.NODE_ENV === 'production'
})

app.use(post('/ansok', async function (ctx, next) {
  // TODO: post to Google Forms
  ctx.body = {}
  next()
}))

// disallow robots anywhere but live
app.use(get('/robots.txt', function (ctx, next) {
  ctx.type = 'text/plain'
  ctx.body = dedent`
    User-agent: *
    Disallow: ${app.env === 'production' ? '' : '/'}
  `
}))

// set headers
app.use(function (ctx, next) {
  if (!ctx.accepts('html')) return next()
  ctx.state.ref = null
  if (app.env !== 'development') {
    ctx.set('Cache-Control', `s-maxage=${60 * 60 * 24 * 30}, max-age=0`)
  }

  return next()
})

app.listen(process.env.PORT || 8080, function () {
  if (process.env.NOW && app.env === 'production') {
    purge(['/sw.js'], function (err) {
      if (err) app.emit('error', err)
    })
  }
})

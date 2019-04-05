if (!process.env.NOW) require('dotenv/config')

var got = require('got')
var jalla = require('jalla')
var body = require('koa-body')
var dedent = require('dedent')
var compose = require('koa-compose')
var { get, post } = require('koa-route')
var unparsed = require('koa-body/unparsed')
var purge = require('./lib/purge')

var ENDPOINT = 'https://docs.google.com/forms/u/1/d/e/1FAIpQLSd7gzpZ2H8-KAV_dB2NtFO0UcnvwDbVj-uvO883sSGgj57bCg/formResponse'

var app = jalla('index.js', {
  sw: 'sw.js',
  serve: process.env.NODE_ENV === 'production'
})

app.use(post('/ansok', compose([
  body({ includeUnparsed: true }),
  async function (ctx, next) {
    await got(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: ctx.request.body[unparsed]
    })

    if (ctx.accepts('html')) {
      ctx.redirect('/tack')
    } else {
      ctx.type = 'application/json'
      ctx.body = {}
    }
  }
])))

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

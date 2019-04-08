var html = require('choo/html')
var nanoraf = require('nanoraf')
var Component = require('choo/component')
var scrollIntoView = require('scroll-into-view')
var getDaysInMonth = require('date-fns/get_days_in_month')
var { vw, vh } = require('../base')

var MONTH = 'entry.1051571347_month'
var DAY = 'entry.1051571347_day'
var YEAR = 'entry.1051571347_year'
var YEARS = [1900]
for (let i = 0; i < 110; i++) YEARS.push(1900 + i)
var MONTHS = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli',
  'Augusti', 'September', 'Oktober', 'November', 'December']

module.exports = class Age extends Component {
  constructor (id, state, emit) {
    super(id)
    var year = parse(state.answers[YEAR], 1990)
    var month = parse(state.answers[MONTH], 1) - 1
    var day = parse(state.answers[DAY], 1)
    this.local = state.components[id] = { id, year, month, day }
  }

  verify () {
    if (this.local.year == null) return false
    if (this.local.month == null) return false
    if (this.local.day == null) return false
    return true
  }

  serialize () {
    var { year, month, day } = this.local
    return {
      [YEAR]: year,
      [MONTH]: month + 1,
      [DAY]: day
    }
  }

  title () {
    return 'När är du född?'
  }

  value () {
    var { year, month, day } = this.local
    month = ('0' + (month + 1)).substr(-2)
    day = ('0' + day).substr(-2)
    return html`
      <time datetime="${JSON.stringify(new Date(year, month, day)).replace(/^"|"$/g, '')}">
        ${[year, month, day].join('-')}
      </time>
    `
  }

  placeholder (...args) {
    var res = this.createElement(...args)
    window.requestAnimationFrame(() => {
      var items = res.querySelectorAll('.js-toggle:checked')
      for (let i = 0, len = items.length; i < len; i++) {
        let parent = items[i].parentElement
        scrollIntoView(parent, { time: 0 })
      }
    })
    return res
  }

  load (el) {
    var self = this
    var scrolling = false
    var timeout
    var onscroll = nanoraf(function (event) {
      clearTimeout(timeout)
      timeout = setTimeout(select, 200, event.target)
    })

    align(0)

    var lists = el.querySelectorAll('.js-list')
    for (let i = 0, len = lists.length; i < len; i++) {
      lists[i].addEventListener('scroll', onscroll, { passive: true })
    }

    this.align = nanoraf(align)
    window.addEventListener('resize', this.align)
    this.unload = function () {
      window.removeEventListener('resize', this.align)
    }

    function align (time = 500) {
      scrolling = true
      var items = el.querySelectorAll('.js-toggle:checked')
      for (let i = 0, len = items.length; i < len; i++) {
        let parent = items[i].parentElement
        scrollIntoView(parent, { time }, function () {
          scrolling = false
        })
      }
    }

    function select (list) {
      if (scrolling) return
      var item
      var { scrollLeft, scrollTop } = list
      var items = list.querySelectorAll('.js-toggle')
      var [width, height] = [vw(), vh()]
      for (let i = 0, len = items.length; i < len; i++) {
        item = items[i]
        let parent = item.parentElement
        if (width < 1000) {
          let { offsetLeft, offsetWidth } = parent
          if (offsetLeft - scrollLeft > width / 2 - offsetWidth) break
        } else {
          let { offsetTop, offsetHeight } = parent
          if (offsetTop - scrollTop > height / 2 - offsetHeight) break
        }
      }

      item.checked = true
      var value = +item.value
      if (item.name === MONTH) {
        self.local[item.dataset.name] = value - 1
        var max = getDaysInMonth(new Date(self.local.year, +item.value))
        if (self.local.day > max) self.local.day = null
      } else {
        self.local[item.dataset.name] = value
      }
      self.callback(item.name, value)
      self.rerender()
      self.align()
    }
  }

  update () {
    return false
  }

  createElement (callback) {
    this.callback = callback

    var self = this

    var days = []
    var total = getDaysInMonth(new Date(this.local.year, this.local.month))
    for (let i = 0; i < total; i++) days.push(i + 1)

    return html`
      <div class="Age" id="${this.local.id}">
        <div class="Age-list js-list">
          ${YEARS.map((value) => html`
            <label class="Age-option Age-option--year">
              <input class="Age-toggle js-toggle" type="radio" data-name="year" name="${YEAR}" value="${value}" checked="${this.local.year === value}" onchange=${onchange}>
              <span class="Age-label">${value}</span>
            </label>
          `)}
        </div>
        <div class="Age-list js-list">
          ${MONTHS.map((value, index) => html`
            <label class="Age-option Age-option--month">
              <input class="Age-toggle js-toggle" type="radio" data-name="month" name="${MONTH}" value="${index + 1}" checked="${this.local.month === index}" onchange=${onchange}>
              <span class="Age-label">${value}</span>
            </label>
          `)}
        </div>
        <div class="Age-list js-list">
          ${days.map((value) => html`
            <label class="Age-option Age-option--day">
              <input class="Age-toggle js-toggle" type="radio" data-name="day" name="${DAY}" value="${value}" checked="${this.local.day === value}" onchange=${onchange}>
              <span class="Age-label">${value}</span>
            </label>
          `)}
        </div>
      </div>
    `

    function onchange (event) {
      var target = event.target
      var value = +target.value
      if (event.target.name === MONTH) {
        self.local[target.dataset.name] = value - 1
        var max = getDaysInMonth(new Date(self.local.year, +target.value))
        if (self.local.day > max) self.local.day = null
      } else {
        self.local[target.dataset.name] = value
      }
      self.rerender()
      self.align()
      callback(target.name, value)
    }
  }
}

function parse (value, fallback) {
  value = parseInt(value, 10)
  if (isNaN(value)) value = fallback
  return value
}

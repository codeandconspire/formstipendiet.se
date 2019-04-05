var html = require('choo/html')
var nanoraf = require('nanoraf')
var Component = require('choo/component')
var scrollIntoView = require('scroll-into-view')
var getDaysInMonth = require('date-fns/get_days_in_month')
var { vw, vh } = require('../base')

var NAME = 'yob'
var YEARS = [1900]
for (let i = 0; i < 110; i++) YEARS.push(1900 + i)
var MONTHS = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli',
  'Augusti', 'September', 'Oktober', 'November', 'December']

module.exports = class Age extends Component {
  constructor (id, state, emit) {
    super(id)
    var value = state.answers[NAME] || '1990-0-1'
    var [year, month, day] = value.split('-').map((num) => +num)
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
    month = ('0' + (month + 1)).substr(-2)
    day = ('0' + day).substr(-2)
    return { [NAME]: [year, month, day].join('-') }
  }

  title () {
    return 'När är du född?'
  }

  value () {
    var { year, month, day } = this.local
    var data = this.serialize()
    return html`
      <time datetime="${JSON.stringify(new Date(year, month, day)).replace(/^"|"$/g, '')}">
        ${data[NAME]}
      </time>
    `
  }

  load (el) {
    var self = this
    var align = this.align = nanoraf(function (time = 500) {
      var items = el.querySelectorAll('.js-toggle:checked')
      for (let i = 0, len = items.length; i < len; i++) {
        let parent = items[i].parentElement
        scrollIntoView(parent, { time })
      }
    })

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

    window.addEventListener('resize', align)
    this.unload = function () {
      window.removeEventListener('resize', align)
    }

    function select (list) {
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
      self.local[item.name] = +item.value
      if (item.name === 'month') {
        var max = getDaysInMonth(new Date(self.local.year, +item.value))
        if (self.local.day > max) self.local.day = null
      }
      var value = [self.local.year, self.local.month, self.local.day].join('-')
      self.callback(NAME, value)
      self.rerender()
      align()
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
              <input class="Age-toggle js-toggle" type="radio" name="year" value="${value}" checked="${this.local.year === value}" onchange=${onchange}>
              <span class="Age-label">${value}</span>
            </label>
          `)}
        </div>
        <div class="Age-list js-list">
          ${MONTHS.map((value, index) => html`
            <label class="Age-option Age-option--month">
              <input class="Age-toggle js-toggle" type="radio" name="month" value="${index}" checked="${this.local.month === index}" onchange=${onchange}>
              <span class="Age-label">${value}</span>
            </label>
          `)}
        </div>
        <div class="Age-list js-list">
          ${days.map((value) => html`
            <label class="Age-option Age-option--day">
              <input class="Age-toggle js-toggle" type="radio" name="day" value="${value}" checked="${this.local.day === value}" onchange=${onchange}>
              <span class="Age-label">${value}</span>
            </label>
          `)}
        </div>
      </div>
    `

    function onchange (event) {
      var target = event.target
      if (event.target.name === 'month') {
        var max = getDaysInMonth(new Date(self.local.year, +target.value))
        if (self.local.day > max) self.local.day = null
      }
      var value = [self.local.year, self.local.month, self.local.day].join('-')
      self.local[target.name] = +target.value
      self.rerender()
      self.align()
      callback(NAME, value)
    }
  }
}

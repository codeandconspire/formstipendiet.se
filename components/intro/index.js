var html = require('choo/html')
var { i18n } = require('../base')

var text = i18n()

module.exports = intro

function intro (props) {
  return html`
    <div class="Intro">
      <div class="Intro-1">
        <div class="Intro-container">
          <div>
            <div class="Intro-line"></div>
            <div class="Intro-line"></div>
            <div class="Intro-line"></div>
            <div class="Intro-line"></div>
            <div class="Intro-line"></div>
            <div class="Intro-line"></div>
            <div class="Intro-line"></div>
            <div class="Intro-line"></div>
            <div class="Intro-line"></div>
          </div>
          <div>
            <div class="Intro-box"></div>
            <div class="Intro-box"></div>
            <div class="Intro-box"></div>
            <div class="Intro-box"></div>
            <div class="Intro-box"></div>
            <div class="Intro-box"></div>
            <div class="Intro-box"></div>
            <div class="Intro-box"></div>
            <div class="Intro-box"></div>
            <div class="Intro-box"></div>
            <div class="Intro-box"></div>
            <div class="Intro-box"></div>
          </div>
        </div>
      </div>
      <div class="Intro-2">
          <h1><span class="Intro-word">Form</span><span class="Intro-word">stipendiet</span> <span class="Intro-year">2019</span></h1>
      </div>
    </div>
  `
}

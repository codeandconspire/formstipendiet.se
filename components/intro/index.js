var html = require('choo/html')

module.exports = intro

function intro (props) {
  return html`
    <div class="Intro">
      <div class="Intro-1">
        <div class="Intro-stripe"></div>
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
        <div class="Intro-container">
          <h1><span class="Intro-word">Form</span><span class="Intro-word">stipendiet</span> <span class="Intro-year">2019</span></h1>
        </div>
      </div>
    </div>
  `
}

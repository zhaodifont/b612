// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './static/css/index.scss'
import './static/css/comm.css'
import 'zepto/src/zepto'
import 'zepto/src/event'
import {loading, endLoading, showErrMsg} from '@/comm/loading/loading'
import {canvasMake, drawing} from '@/static/js/fn'
import _load from '@/utils/asyncloadjs'
import browserCheck from '@/utils/browserCheck'
import pageBg from './static/img/pageBg.jpg'
import Canvas2Image from '@/utils/canvas2image'

let cdata = {
  userName : '路人甲',
  titles: [
    // 10-30天（10%）
    '单身时长不足，请不要再充值了',
    // 31-180天（40%）
    '请珍惜自己寥寥无几的单身生活',
    // 181-360天（20%）
    '相遇之前，即使单枪匹马也能勇敢无畏',
    // 正无穷（30%）
    '万年单身狗说的就是本人'
  ],
  des: [
    [
      '有风险，但也有机会。','你需要主动。','不妨赌一把。','天上要​​掉馅饼了。','别让它影响到你。','照你想做的那样去做。','说出来吧。','不要犹豫。','机会稍纵即逝。'
    ],
    [
      '找个人给你点意见。','观望。','照你想做的那样去做。','借助他人经验。','安排！','去争取机会。','改变不了世界，改变自己。','主动一点，人生会大不相同。','掌握更多信息。','相信你最初的想法。','观察形势。','你可能不得不放弃其他东西。','不要忧虑。','保持头脑清醒。','你必须现在就行动。','需要花费点时间。','不要迫于压力而改变初衷。','不要忽略身边的人。','去改变。','取决于你的选择。'
    ],
    [
      '勿忘初心，方得始终。','克服困难。','注意身后。','你需要考虑其他方面。','等待。','相信你的直觉。','去问你爸爸。','去尝试。','不妥协。','要有耐心。','有时应该回头看看。'
    ],
    [
      '醒醒吧，别做梦了。','不如试试换下性取向。','看看自己的小肚腩。','看看自己的小粗腿。','平时少吃点。','多读书多看报，少吃零食多睡觉。','放弃吧，别做梦了。','赶紧制定健身计划。','脱单是不可能脱单的，这辈子都不可能的。','脱单？是零食不好吃还是游戏不好玩。','从今往后一万年，始终一个人。','孤独终老。','恋爱绝缘体，是你。','丘比特射箭的时候唯独你掏出盾牌。','别恋爱了，免得被绿。','同性才是真爱，异性恋什么的好奇怪。','恋爱程序已被杀死，请重启自己。​'
    ]
  ]
}

;(function(){
  var img = new Image()
  img.onload = function(){
    endLoading()
    document.querySelector('#app').style.opacity = '1'
    document.querySelector('#page1 .text').classList.add('run')
  }
  img.src = pageBg
})()

$('#startBtn').on('click', () => {
  var val = $('input[name="userName"]').val().trim()
  if (val.length === 0) {
    showErrMsg('请输入用户名')
    return false
  } else if (val.length > 5) {
    showErrMsg('用户名长度不能超过5')
    return false
  } else {
    // cdata.userName = val
    showPage2()
  }
})

// showPage2()
let pointCount = 0
let lastTimer = null
function showPage2(){
  unBinds()
  $('#page1,#page3').hide()
  $('#page2').show()
  setTimeout(() => {
    canvasMake.canvasInit()
  },20)

  $('.redo').bind('click', () => {
    canvasMake.redo()
  })
  $('.confirm').bind('click', () => {
    pointCount = canvasMake.getPoint()
    if (!pointCount) {
      showErrMsg('请连接至少一点')
    } else {
      loading()
      clearInterval(lastTimer)
      preload(() => {
        setTimeout(() => {
          showPage3()
        }, 1000)
      })
    }
  })


  setTimeout(() => {
    if (browserCheck.lowSysVersion() && browserCheck.isAnd()) {
      _load('https://cdn.bootcss.com/html2canvas/0.4.1/html2canvas.min.js')
    } else {
      _load('https://cdn.bootcss.com/html2canvas/0.5.0-beta4/html2canvas.min.js')
    }
  _load('https://cdn.bootcss.com/html2canvas/0.4.1/html2canvas.min.js')
  })
}
// setTimeout(() => {
//   if (browserCheck.lowSysVersion() && browserCheck.isAnd()) {
//     _load('https://cdn.bootcss.com/html2canvas/0.4.1/html2canvas.min.js')
//   } else {
//     _load('https://cdn.bootcss.com/html2canvas/0.5.0-beta4/html2canvas.min.js')
//   }
// })
// showPage3()
function showPage3() {
  unBinds()
  endLoading()
  $('#page1, #page2').hide()
  $('#page3').show()

  $('.retest').on('click', () => {
    showPage2()
  })
  var timeOutEvent
  $('#page3').on('touchstart', (e) => {
    timeOutEvent = setTimeout(() => {
      drawTo()
      e.preventDefault()
    }, 300)
  }).on('touchmove', () => {
    clearTimeout(timeOutEvent)
  }).on('touchend', () => {
    clearTimeout(timeOutEvent)
    // return false
  })
}


let firstPage3 = $('.page3').eq(0)
function drawTo () {
  loading()
  document.querySelector('#page4').innerHTML = ''
  $('#page4').append($('#page3').clone())
  // .css({'position':'relative','z-index':'88888'})
  setTimeout(() => {
    drawing($('#page4 #page3')[0], (image) => {
      let img = new Image()

      $('.log').html(image.src.length)
      if (image.src.length < 40000) {
        drawTo()
      } else {
        img.onload = function () {
          firstPage3.find('#shareImg')[0].src = this.src
          endLoading()
          firstPage3.find('.shareDist').css({display:'flex'})
          firstPage3.find('#shareImg').css({width:'80%'})
          firstPage3.find('#shareImg').on('touchstart', (e) => {
            e.stopPropagation()
          })
          firstPage3.find('.shareDist').on('touchstart', (e) => {
            e.stopPropagation()
            firstPage3.find('.shareDist').css({display:'none'})
            firstPage3.find('#shareImg').off('touchstart')
            firstPage3.find('.shareDist').off('touchstart')
            $('#page4').empty()
          })
        }
        img.src = image.src
      }
    })
  }, 100)
}

function unBinds() {
  $('.redo, .confirm, #startBtn, .retest').off('click')
}
// preload()

function preload(cb){
  var probability = Math.floor(Math.random()*100)
  var page = $('.page3').eq(0)
  var cup = require('./static/img/cup.jpg')
  var dog = require('./static/img/dog.jpg')

  page.find('.name').html(cdata.userName)
  var addImg = probability%2 == 0?1:0

  page.find('.tip').find('img').eq(addImg).hide()
  let range = probability + 1
  let actIndex = 0
  let lastDay = 30
  let lastSecond = 0
  let lastHour = 0
  if (range >= 1 && range < 10) {
    actIndex = 0
    lastDay = 10 + Math.floor(Math.random() * 20)
  } else if (range >= 10 && range < 50) {
    actIndex = 1
    lastDay = 30 + Math.floor(Math.random() * 150)
  } else if (range >= 50 && range < 70) {
    actIndex = 2
    lastDay = 150 + Math.floor(Math.random() * 210)
  } else if (range >= 70 && range < 100) {
    actIndex = 3
    lastDay = 0
  }
  page.find('.tip var').html(cdata.titles[actIndex])
  let des_len = cdata.des[actIndex].length
  page.find('.des var').html(cdata.des[actIndex][Math.floor(Math.random()*des_len)])

  if(!lastDay){
    page.find('.time').html('正无穷')
  } else {
    lastSecond = (4 + Math.floor(Math.random()*20)) * 3600
    lastTimer = setInterval(() => {
      if (lastSecond == 0) {
        clearInterval(lastTimer)
        return
      }
      var h = Math.floor(lastSecond / (3600)),
          m = Math.floor((lastSecond - (h * 60 * 60))/60),
          s = lastSecond - (h * 3600) - (m * 60);
          lastSecond --
          page.find('.time em').html(lastDay)
          page.find('.time var').eq(0).html(h)
          page.find('.time var').eq(1).html(m)
          page.find('.time var').eq(2).html(s)
      // console.log(lastSecond, h, m, s);
    }, 1000)
  }

  if(cb){
    cb()
  }

  setTimeout(() => {
    console.log('probability',probability)
    console.log('date',new Date().getTime())
  }, 1000)
}

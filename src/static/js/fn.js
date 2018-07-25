import Canvas2Image from '@/utils/canvas2image'
// import html2canvas from 'html2canvas'
export class canvasMake {
  static recordPoint = []
  static canvas = $('#canvas')[0]
  static canvasInit(){
    let canvas = canvasMake.canvas,
        ctx = canvas.getContext('2d'),
        mod = $('.page2blank'),
        config = {
          color: '#fadaf0',
          lineWidth: $('.heart1')[0].offsetWidth * 0.4,
          parentTop: $('#page2 .parent')[0].offsetTop,
          parentLeft: $('#page2 .parent').offset().left + $('.page2blank').offset().left
        },
        hearts = [
          heartRange($('.heart1')),
          heartRange($('.heart2')),
          heartRange($('.heart3')),
          heartRange($('.heart4')),
          heartRange($('.heart5'))
        ]

    canvas.setAttribute('width', mod.offset().width)
    canvas.setAttribute('height', mod.offset().height)
    canvas.style.left = mod.offset().left + 'px'

    ctx.strokeStyle = config.color
    ctx.globalAlpha = 0.5
    let startX, startY, endX, endY, firstTouch, _isPointerType, heartStart, flag = false
    $('#canvas').on('touchstart', function(e){
      if ((_isPointerType = isPointerEventType(e, 'down')) && !isPrimaryTouch(e)) return
      firstTouch = _isPointerType ? e : e.touches[0]

      if (e.type === 'touchstart') {
        startX = firstTouch.clientX
        startY = firstTouch.clientY

        flag = hearts.some((item, index) => {
          let a = startX > hearts[index].l && startX < hearts[index].r
          let b = startY + $('#app').scrollTop() > hearts[index].t && startY + $('#app').scrollTop() < hearts[index].b
          if (a && b) {
            canvasMake.recordPoint = []
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
            heartStart = index
            startX = hearts[index].l + (hearts[index].w / 2)
            startY = hearts[index].t + (hearts[index].h / 2)
            if (index == 0) {
              startX = hearts[index].l + (hearts[index].w / 2) + 8
            }

            canvasMake.recordPoint.push({x: startX, y: startY, i: index})
            $('.hearts img').eq(index).removeClass('run').addClass('run')
          }
          return a && b
        })
        // console.log(hearts[1].l,hearts[1].t, startX, startY, flag)
      }
    })
    $('#canvas').on('touchmove', function(e){
      if (!flag) return
      e.preventDefault()

      // ctx.lineTo(startX - config.parentLeft, startY - config.parentTop)
      if (e.type === 'touchmove') {
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
        endX = e.touches[0].clientX
        endY = e.touches[0].clientY

        // ctx.fillStyle = config.color
        // ctx.beginPath()
        // ctx.arc(startX - config.parentLeft, startY - config.parentTop, config.lineWidth / 2, 0, Math.PI * 2, true)
        // ctx.closePath()
        // ctx.fill()

        let endX_ = endX, endY_ = endY, inPoint = false
        hearts.forEach((item, index) => {
          let a = endX > hearts[index].l && endX < hearts[index].r
          let b = endY + $('#app').scrollTop() > hearts[index].t && endY + $('#app').scrollTop() < hearts[index].b

          // $(".log").text(a && b);
          if (a && b) {
            // console.log(hearts[index].l,hearts[index].t, endX, endY, a, b);
            endX_ = hearts[index].l + (hearts[index].w / 2)
            endY_ = hearts[index].t + (hearts[index].h / 2)
            if (index == 0) {
              endX = hearts[index].l + (hearts[index].w / 2) + 8
            }
            if (index != heartStart) {
              canvasMake.recordPoint.push({x: endX_, y: endY_, i: index})
              heartStart = index
            }
            inPoint = true
            $('.hearts img').removeClass('run')
            $('.hearts img').eq(index).addClass('run')
          }
        })

        canvasMake.recordPoint.length && canvasMake.recordPoint.forEach((item, index) => {
          ctx.fillStyle = config.color
          ctx.beginPath()
          ctx.arc(item.x - config.parentLeft, item.y - config.parentTop, config.lineWidth / 2, 0, Math.PI * 2, true)
          ctx.closePath()
          ctx.fill()
        })

        ctx.lineWidth = config.lineWidth
        ctx.fillStyle = config.color

        canvasMake.recordPoint.length && canvasMake.recordPoint.reduce((cur, pre) => {
          ctx.beginPath()
          ctx.moveTo(cur.x - config.parentLeft, cur.y - config.parentTop)
          ctx.lineTo(pre.x - config.parentLeft, pre.y - config.parentTop)
          ctx.stroke()
          ctx.closePath()
          return pre
        })

        if (!inPoint) {
          ctx.beginPath()
          ctx.moveTo(canvasMake.recordPoint[canvasMake.recordPoint.length - 1].x - config.parentLeft, canvasMake.recordPoint[canvasMake.recordPoint.length - 1].y - config.parentTop)
          ctx.lineTo(endX_ - config.parentLeft, endY_ - config.parentTop + $('#app').scrollTop())
          ctx.stroke()
          ctx.closePath()
        }
      }
    })

    $('#canvas').on('touchend', function(){
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      canvasMake.recordPoint.length && canvasMake.recordPoint.forEach((item, index) => {
        ctx.fillStyle = config.color
        ctx.beginPath()
        ctx.arc(item.x - config.parentLeft, item.y - config.parentTop, config.lineWidth / 2, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.fill()
      })

      canvasMake.recordPoint.length && canvasMake.recordPoint.reduce((cur, pre) => {
        ctx.beginPath()
        ctx.moveTo(cur.x - config.parentLeft, cur.y - config.parentTop)
        ctx.lineTo(pre.x - config.parentLeft, pre.y - config.parentTop)
        ctx.stroke()
        ctx.closePath()
        return pre
      })
    })
  }
  static getPoint () {
    return canvasMake.recordPoint.length
  }
  static redo() {
    canvasMake.recordPoint = []
    canvasMake.canvas.getContext('2d').clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
  }
}

function isPointerEventType(e, type){
  return (e.type == 'pointer' + type || e.type.toLowerCase() == 'mspointer' + type)
}
function isPrimaryTouch(event){
  return (event.pointerType == 'touch' ||
    event.pointerType == event.MSPOINTER_TYPE_TOUCH) && event.isPrimary
}

function heartRange(target){
  return {
    l: target.offset().left,
    t: target.offset().top - Math.abs($('#app').scrollTop()),
    r: target.offset().left + target.offset().width,
    b: target.offset().top + target.offset().height - Math.abs($('#app').scrollTop()),
    w: target.offset().width,
    h: target.offset().height
  }
}

// imgs to canvas 绘图
export function drawing(target, cb){
  var cntElem = target
  var shareContent = cntElem//需要截图的包裹的（原生的）DOM 对象
  var width = shareContent.offsetWidth //获取dom 宽度
  var height = shareContent.offsetHeight //获取dom 高度
  var canvas = document.createElement('canvas')//创建一个canvas节点
  var scale = 1.5//定义任意放大倍数 支持小数
  canvas.width = width * scale//定义canvas 宽度 * 缩放
  canvas.height = height * scale//定义canvas高度 *缩放
  canvas.getContext('2d').scale(scale, scale)//获取context,设置scale
  var opts = {
      scale: scale, // 添加的scale 参数
      canvas: canvas, //自定义 canvas
      // logging: true, //日志开关，便于查看html2canvas的内部执行流程
      width: width, //dom 原始宽度
      height: height,
      useCORS: true, // 【重要】开启跨域配置,
      onrendered: function(canvas) {
          var context = canvas.getContext('2d')
          // 【重要】关闭抗锯齿
          context.mozImageSmoothingEnabled = false
          context.webkitImageSmoothingEnabled = false
          context.msImageSmoothingEnabled = false
          context.imageSmoothingEnabled = false
          // context.shadowBlur=5;
          // context.shadowColor="black";
          // context.lineWidth=0;
          // context.strokeRect(25,25,canvas.width,canvas.height);

          // 【重要】默认转化的格式为png,也可设置为其他格式
          setTimeout(function(){
            var img = Canvas2Image.convertToJPEG(canvas, canvas.width, canvas.height)
            if (cb) {
              cb(img)
            }
          }, 0)
      }
  }
  setTimeout(() => {
    html2canvas(shareContent, opts)
    // html2canvas(shareContent, opts).then(canvas => {
    //   var context = canvas.getContext('2d')
    //   // 【重要】关闭抗锯齿
    //   context.mozImageSmoothingEnabled = false
    //   context.webkitImageSmoothingEnabled = false
    //   context.msImageSmoothingEnabled = false
    //   context.imageSmoothingEnabled = false
    //
    //   // 【重要】默认转化的格式为png,也可设置为其他格式
    //   setTimeout(function(){
    //     var img = Canvas2Image.convertToPNG(canvas, canvas.width, canvas.height)
    //     if (cb) {
    //       cb(img)
    //     }
    //   }, 0)
    // })

  })
}

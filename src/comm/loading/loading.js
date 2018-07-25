let loadingTimer
let _touch = 'createTouch' in document ? 'touchend' : 'click'

export function loading() {
  document.querySelector('.loading').classList.add('run')
  document.querySelector('.loading').style.display = 'flex'
  loadingTimer = setInterval(function(){
    if (!window.navigator.onLine){
      endLoading()
      showErrMsg('请检查网络连接')
      clearInterval(loadingTimer)
    }
  }, 20)
}
export function endLoading(){
  document.querySelector('.loading').style.display = 'none'
  document.querySelector('.loading').classList.remove('run')
  clearInterval(loadingTimer)
}

export function showErrMsg(val){
  $('.errMsg var').text(val)
  $('.errMsg').css('display', 'flex')
  $('.errMsg .wpr,.errMsg').bind(_touch, function(e){
    e.stopPropagation()
  })
  $('.errMsg').bind(_touch, function(){
    hideErrMsg()
  })
  $('.errMsg button').bind(_touch, function(){
    hideErrMsg()
  })
}

export function hideErrMsg(){
  $('.errMsg').css('display', 'none')
  $('.errMsg .wpr,.errMsg').unbind(_touch)
  $('.errMsg').unbind(_touch)
  $('.errMsg button').unbind(_touch)
}

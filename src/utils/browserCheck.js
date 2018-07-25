// let userAgent = navigator.userAgent.toLowerCase()
// return {
//   isAndroid: /android/.test(userAgent),
//   isIos: /ipad|iphone|ipod/.test(userAgent),
//   isWechat: /micromessenger/.test(userAgent),
//   isQQ: /qq/.test(userAgent),
//   isWeibo: /weibo/.test(userAgent),
//   isQZone: /qzone/.test(userAgent)
// }
export default class browserCheck {
  static isIos() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false
  }
  static isAnd() {
    return navigator.userAgent.match(/Android/i) ? true : false
  }
  static lowSysVersion() {
    // 苹果机
    if (browserCheck.isIos()) {
      let iosLimitVersion = [10, 2, 2]
      let iosVersionArr = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/)
      iosVersionArr.shift()
      for (let i = 0; i < iosLimitVersion.length; i++) {
        let cur = parseInt(iosVersionArr[i], 10) || 0
        let limit = parseInt(iosLimitVersion[i], 10) || 0
        if (cur < limit) {
          return true
        } else if (cur > limit) {
          return false
        }
      }
      return false
    } else if (browserCheck.isAnd()) {
      let andrLimitVersion = [4, 5, 0]
      let andrVersionArr = navigator.userAgent.match(/Android (\d+)\.(\d+)\.?(\d+)?/)

      andrVersionArr.shift()
      for (let i = 0; i < andrLimitVersion.length; i++) {
        let cur = parseInt(andrVersionArr[i], 10) || 0
        let limit = parseInt(andrLimitVersion[i], 10) || 0
        if (cur < limit) {
          return true
        } else if (cur > limit) {
          return false
        }
      }
      return false
    }
  }
}

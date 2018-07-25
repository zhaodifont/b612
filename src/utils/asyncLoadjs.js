export default function _load(src, cb) {
    var s = document.createElement('script')
    if (s.readyState) {
        s.onreadystatechange = function(){
            if (s.readyState == 'loaded' || s.readyState == 'complete') {
                s.onreadystatechange = null
                cb && cb()
            }
        }
    } else {
        s.onload = function(){
          cb && cb()
        }
    }
    s.src = src
    document.getElementsByTagName('head')[0].appendChild(s)
}

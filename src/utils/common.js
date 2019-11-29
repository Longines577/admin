// 日期格式化
Date.prototype.format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}
// url地址转为file对象
const imgUrl2File = function(options) {
  /**
   * imgList {Object}
   * @key symbol {String} -- 标识
   * @key imgObject {String}  -- 图片信息
   */
  const { imgList, loaded } = options
  let recordIndex = 1 // 标记下标
  const cacheImg = []
  imgList.forEach((item, index) => {
    const img = item.imgObject
    console.log('imgObject:', img)
    const image = new Image()
    image.setAttribute('crossOrigin', 'Anonymous')
    image.src = img.url
    image.onload = function() {
      console.log('image:', image)
      const base64 = getBase64Image(image)
      const img2 = convertBase64UrlToBlob(base64)
      img2.lastModifiedDate = new Date()
      img2.name = img.name
      cacheImg.push({
        symbol: item.symbol,
        raw: img2
      })
      recordIndex += 1
      if (recordIndex === imgList.length) {
        console.log('cacheImg:', cacheImg)
        return
        loaded(cacheImg)
      }
    }
  })
}
function getBase64Image(img) {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)
  const ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
  const dataURL = canvas.toDataURL('image/' + ext)
  return {
    dataURL,
    type: 'image/' + ext
  }
}
function convertBase64UrlToBlob(base64) {
  const urlData = base64.dataURL
  const type = base64.type
  const bytes = window.atob(urlData.split(',')[1]) //去掉url的头，并转换为byte
  //处理异常,将ascii码小于0的转换为大于0
  const ab = new ArrayBuffer(bytes.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }
  return new Blob([ab], { type: type })
}

//

// 根据网点数来划分颜色
function colorOpacityByNodeCount(l) {
  const ret = []
  let opacity = 0.6
  // const opacitySpan = l <= 10 ? 0.1 : l <= 30 ? 0.03 : 0.01
  const opacitySpan = (100 / (l + 5) / 100).toFixed(2)
  for (let i = 0; i < l; i++) {
    ret.push(opacity)
    opacity -= opacitySpan
  }
  return ret
}
export { imgUrl2File, colorOpacityByNodeCount }

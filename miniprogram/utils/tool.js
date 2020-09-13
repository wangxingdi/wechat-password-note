import log from './log'
const CryptoJS = require('./cryptojs/cryptojs.js').Crypto
const OPENID = 'uid'

export default {
  get app() {
    return getApp()
  },
  get openid() {
    return wx.getStorageSync(OPENID)
  },
  tip(msg, duration = 2000) {
    return new Promise(resolve =>
      wx.showToast({
        title: msg,
        icon: 'none',
        duration,
        complete() {
          setTimeout(() => {
            resolve()
          }, duration)
        }
      })
    )
  },
  sleep(time = 2000) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, time)
    })
  },
  callCloud(options, showLoading = true) {
    showLoading && wx.showLoading({ title: '获取数据中', mask: true })
    return wx.cloud.callFunction(options).then(res => {
      showLoading && wx.hideLoading()
      return res
    }).catch(e => {
      log.error(e)
      showLoading && wx.hideLoading()
      throw e
    })
  },
  get store() {
    const store = getApp().store
    return {
      set: (key, value = '') => {
        if (key) {
          store[key] = value
        }
      },
      get: (key) => {
        return store[key]
      }
    }
  },
  digest(str) {
    return CryptoJS.SHA256(str)
  },
  loading(title = '加载中', mask = true) {
    return new Promise(resolve => { wx.showLoading({ title, mask, complete: resolve }) })
  },
  hideLoading() { wx.hideLoading() },
  encrypt(value, key) {
    return CryptoJS.AES.encrypt(value, key).toString()
  },
  decrypt(value, key) {
    return CryptoJS.AES.decrypt(value, key).toString()
  }
}

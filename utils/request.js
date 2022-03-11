// 封装ajax函数

// 引入基础API
import config from 'config.js'
export default (url, data = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.baseUrl + url,
      data,
      header: {
        cookie: wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1):''
      },
      success: (res) => {
        // console.log(res.data)
        if(data.isLogin){// 登录请求
          // 将用户的cookie存入至本地
          wx.setStorage({
            key: 'cookies',
            data: res.cookies
          })
        }
        resolve(res.data)
        return res.data
      },
      fail: (err) => {
        console.log(err)
        reject(err)
      }
    })

  })
}
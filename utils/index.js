// let baseUrl = 'http://192.168.19.25:8080/'; //测试
// let baseUrl = 'http://******/';//预发布
let baseUrl = 'https://you.yunfeiyang.com/';//线上
module.exports = function (url, method, data = {}) {
  let meth = method.toUpperCase()
  if (meth != "GET" && meth != "DELETE" && meth != "POST" && meth != "PUT") {
    meth = 'GET' //不传情况下默认'GET'
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      header: {
        'content-type': meth == 'POST' ? 'application/x-www-form-urlencoded' : 'application/json',
        token: wx.getStorageSync('token') ? wx.getStorageSync('token') : ''
      },
      url: baseUrl + url,
      data: data,
      method: meth,
      success: function (res) {
        if (res.data.code == 401) {
          var tokens=wx.getStorageSync('token')
          wx.removeStorageSync('token')
          if(tokens){
            wx.showModal({
              title: '暂未登录',
              content: `是否前去登录`,
              success(e) {
                if (e.confirm) {
                    wx.reLaunch({
                    url: '../../../pages/login/index',
                  })
                } else if (e.cancel) {
                  // return false;
                }
              }
            })
          }else{
            wx.showToast({
              title: "登录失效，请从新登录",
              icon: 'none',
              duration: 1000,
            })
          }
          
          
          
          // return false;
        }
        if (res.data.code == 500) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000,
          })
          setTimeout(function () {
            // wx.reLaunch({
            //   url: '../../../pages/login/index',
            // })

          }, 1000)
          return false;
        }
        if (res.data.code == -3) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000,
          })
          setTimeout(function () {
            wx.reLaunch({
              url: '../../login/index',
            })

          }, 1000)
          return false;
        }
        //resolve用于具体调用中
        resolve(res)
      },
      fail: function (res) {
        //错误信息统一处理操作
        reject(res)
      }
    })
  })
}
//index.js
import ajax from '../../utils/index.js' //引入
//获取应用实例
const app = getApp()

Page({
  data: {
    isLogin:true,
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    inputValue: "",
    a:"点击获取二维码",
    rdSessionId: "",
    isHas:false,
    hasTap:false,
  },
  scanCode:function(e){
    var _this = this;
    wx.scanCode({
      success: function (res) {
        _this.setData({
          inputValue: res.result,
          a: res.result,
          isHas:true
        })
      },
      fail: function (res) {
      }
    })
  },
  // 登陆 获取手机号
  getPhoneNumber1(e){
    console.log(e)
    // return
// console.log(e)
    var that = this;
    var inputVal = that.data.inputValue;
    if (e.detail.errMsg == 'getPhoneNumber:fail:user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) {
          console.log(res)
          that.setData({
            hasTap: false
          })
        }
      })
    } else if(e.detail.errMsg == 'getPhoneNumber:ok') {
      if (!that.data.hasTap) {
        that.setData({
          hasTap: true
        }, () => {
          ajax('mobile/pwd/loginNew', 'POST', {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            rdSessionId: that.data.rdSessionId,
            orgCode: inputVal
          }).then((res) => {
            that.setData({
                hasTap: true
              })
            if (res.data.code == 1) {
              wx.showToast({
                title: res.data.msg,
                icon: "none"
              })
            } else {
              // 优先判断aroundType ：0：表示内部司机  1：表示外部个人客户司机  
              //                     2：表示外部车队（包括司机和管理员）
              wx.setStorageSync('aroundType', res.data.aroundType)
              wx.setStorageSync('authType', res.data.authType)
              // 如果aroundType为2时，需要判断status的值： 2：表示外部车队司机
              //                                         3：表示外部车队管理员
              wx.setStorageSync('status', res.data.status)
    
              wx.setStorageSync('token', res.data.token)
              
              wx.setStorageSync('userId', res.data.user.userId)
              wx.setStorageSync('username', res.data.user.name)
              wx.setStorageSync('phoneNumber', res.data.user.mobile)
              wx.redirectTo({
                url: '../../packageA/pages/index/index',
              })
            }
          }).catch((err) => {
            console.log(err)
          })
        })
      } else {
        return
      }
      
    } 
  },
  select_number(){
      wx.showToast({
        title: '请先扫码获取邀请码',
        icon:"none"
      })
  },
  // 注册 获取手机号
  getPhoneNumber(e) {
    var that = this;
    var inputVal = that.data.inputValue;
    if (!that.data.hasTap) {
      that.setData({
        hasTap: true
      }, () => {
        console.log(e)
        if(e.detail.errMsg == 'getPhoneNumber:fail user deny'){
          that.setData({
            hasTap: false
          })
          return
        }else{
          ajax('mobile/pwd/loginNew', 'POST', {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            rdSessionId: that.data.rdSessionId,
            orgCode: inputVal
          }).then((e) => {
            that.setData({
              hasTap: false,
              inputValue:""
            })
            if (e.data.code == 1) {
              wx.showToast({
                title: e.data.msg,
                icon: "none"
              })
            } else {
              wx.setStorageSync('aroundType', e.data.aroundType)
              wx.setStorageSync('authType', e.data.authType)
                // 如果aroundType为2时，需要判断status的值： 2：表示外部车队司机
                //                                         3：表示外部车队管理员
                wx.setStorageSync('status', e.data.status)
  
                wx.setStorageSync('token', e.data.token)
                wx.setStorageSync('username', e.data.user.name)
                wx.setStorageSync('userId', e.data.user.userId)
                wx.setStorageSync('phoneNumber', e.data.user.mobile)
              wx.redirectTo({
                url: '../../packageA/pages/index/index',
              })
            }
          }).catch((err) => {
            console.log(err)
          })
        }
        
      })
    } else {
      return
    }
  },
  isLogins(){
    var that = this;
    this.setData({
      isLogin:!that.data.isLogin,
      inputValue:"",
      hasTap:false
    })
  },
  onLoad: function () {
    var that = this;
    var token = wx.getStorageSync('token')
    if(token){
      wx.redirectTo({
        url: '../../packageA/pages/index/index',
      })
    }
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.setStorageSync("code", res.code)
          //发起网络请求    
          ajax('mobile/pwd/code', 'POST', {
            code: res.code
          }).then((e) => {
            that.setData({
              rdSessionId: e.data.rdSessionId
            })
            wx.setStorageSync("openid", e.data.openid)
          }).catch((err) => {
            console.log(err)
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
      // 在没有 open-type=getUserInfo 版本的兼容处理
     
  },


})

// pages/register/index.js
import ajax from '../../utils/index.js' //引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    register: {
      username: "",
      phone: "",
      password: "",
      password2: "",
      authCode: ""
    }
  },
  // 注册用户名
  registerUsername: function (e) {
    this.data.register.username = e.detail.value;
  },
  // 注册用户手机号
  registerPhone: function (e) {
    this.data.register.phone = e.detail.value;
  },
  // 注册用户密码
  registerPassword: function (e) {
    this.data.register.password = e.detail.value;
  },
  // 重复密码
  registerPassword2: function (e) {
    this.data.register.password2 = e.detail.value;
  },
  // 输入 授权码
  registerAuthCode: function (e) {
    this.data.register.authCode = e.detail.value;
  },
  // 确定注册
  register: function () {
    var _this = this;
    // 正则验证手机号是否符合规则
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(this.data.register.phone)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    // 限制密码的长度不得小于6位
    if (this.data.register.password.length < 6) {
      wx.showToast({
        title: '密码不得小于6位！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    // 两次密码不一致
    if (this.data.register.password != this.data.register.password2) {
      wx.showToast({
        title: '两次密码不一致！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    // 限制用户名和授权码不得为空
    if (this.data.register.username.length == 0 || this.data.register.authCode.length == 0) {
      wx.showToast({
        title: '基本信息有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    this.setData({
      addCar: false
    })
    // 注册
    ajax('mobile/register', 'POST', {
      username: this.data.register.username,
      tel: this.data.register.phone,
      password: this.data.register.password,
      password2: this.data.register.password2,
      authCode: this.data.register.authCode
    }).then((res) => {
      if (res.data.code == 0) {
        wx.showToast({
          title: '注册成功！',
          icon: "none",
          duration: 1000
        })
        setTimeout(function () {
          wx.navigateBack()
        }, 1000)
        _this.setData({
          username: "",
          phone: "",
          password: "",
          password2: "",
          authCode: ""
        })
      }
      if (res.data.code != 0) {
        wx.showToast({
          title: res.msg,
          duration: 3000,
          icon: 'none'
        })
      }
    }).catch((err) => {
      console.log(res)
    })
    this.setData({
      addCar: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
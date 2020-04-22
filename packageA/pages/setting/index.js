// packageA/stationManage/setting/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:"",
    phone:"",
    aroundType:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var username = wx.getStorageSync("username")
    var phone = wx.getStorageSync("phoneNumber")
    var aroundType = wx.getStorageSync("aroundType")
    var authType = wx.getStorageSync("authType")
    var name = ""
    if(aroundType==1){
      name = "普通司机"
    }
    if (aroundType == 2) {
      if(authType == 1){
        name = "车队成员"
      }
      if(authType == 3){
        name = "车队管理员"
      }
    }  
    this.setData({
      username,
      phone,
      aroundType:name
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  changePwd() {
    wx.navigateTo({
      url: '../changePwd/index',
    })
  },
  loginOut() {
    wx.clearStorageSync("token")
    wx.clearStorageSync("userId")
    wx.clearStorageSync("openid")
    wx.clearStorageSync("yd_user_dept")
    wx.clearStorageSync("phoneNumber")
    wx.redirectTo({
      url: '../../../pages/login/index',
    })
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
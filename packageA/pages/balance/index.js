import ajax from '../../../utils/index.js' //引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myBalance:"0",
    userId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId:wx.getStorageSync("userId")
    })
    this.balance()
  },
  balance:function(){
    var that = this
    ajax('mobile/car/getAccount', 'POST',{
      userId:that.data.userId
    }).then((res) => {
      if(res.statusCode==200){
        that.setData({
          myBalance: res.data.account.balance
        })
      } 
    }).catch((err) => {
      console.log(err)
      wx.showToast({
        title: err,
        icon: "none"
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  recharge() {
    wx.navigateTo({
      url: '../recharge/index',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.balance()
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
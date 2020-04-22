// packageA/pages/moneyReDe/index.js
import ajax from '../../../utils/index.js' //引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moneyDetails:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.moneyDetails(options.flowno)
  },
  moneyDetails: function (pageNo){
    var that = this;
    ajax('mobile/car/getTradDetails', 'POST', {
      flowno: pageNo
    }).then(res => {
      console.log(res)
      if (res.data.code == 0) {
        that.setData({
          moneyDetails: res.data.tradDetails
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    }).catch(err => {
      console.log("==> [ERROR]", err)
    })
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
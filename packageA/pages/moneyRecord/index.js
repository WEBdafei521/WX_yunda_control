// packageA/pages/moneyRecord/index.js
import ajax from '../../../utils/index.js' //引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordLists:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.recordList(1)
  },
  recordList: function (pageNo) {
    this.loading = true
    var that = this;
    return ajax('mobile/car/getTradList', 'POST', {
      page: pageNo,
      limit: 10
    }).then(res => {
      if (res.data.code == 0) {
        console.log(res)
        var list = res.data.tradList
        that.setData({
          recordLists: that.data.recordLists.concat(list),
          page: pageNo,     //当前的页号
          pages: parseInt(res.data.total / 10) + 1
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    }).catch(err => {
      console.log("==> [ERROR]", err)
    }).then(() => {
      this.loading = false
    })
  },
  moneyDetails:function(e){
    console.log(e.currentTarget.dataset.flowno)
    wx.navigateTo({
      url: '../moneyReDe/index?flowno='+e.currentTarget.dataset.flowno
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
    var that = this;
    // 下拉触底，先判断是否有请求正在进行中
    // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
    if (!that.loading && that.data.page < that.data.pages) {
      that.recordList(that.data.page + 1)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
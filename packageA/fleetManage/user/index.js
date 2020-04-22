// packageB/pages/index/index.js
const app = getApp()
Page({
  data: {
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    userInfo: app.globalData.userInfo,
    username: "lipeng123"
  },

  attached() {
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    let i = 0;
    numDH();
    let that = this;
    function numDH() {
      if (i < 20) {
        setTimeout(function () {
          // console.log(i)
          that.setData({
            starCount: i,
            forksCount: i,
            visitTotal: i
          })
          i++
          numDH();
        }, 20)
      } else {

      }
    }
    wx.hideLoading()
  },
  // GitHub
  CopyLink(e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.link,
      success: res => {
        wx.showToast({
          title: '已复制',
          duration: 1000,
        })
      }
    })
  },
  // 首页面
  goIndex() {
    wx.navigateTo({
      url: '../index/index',
    })
  },
  // 车队信息
  fleetInfo() {
    
  },
  methods: {
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    this.attached()
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res)
        _this.setData({
          userInfo: res.data
        })
      },
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
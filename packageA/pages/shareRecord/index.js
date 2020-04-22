// packageA/pages/shareRecord/index.js
import ajax from '../../../utils/index.js' //引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordLists:[],
    page:1,
    pages:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.recordList(1)
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
  recordList: function (pageNo){
    this.loading = true
    var that = this;
    return ajax('mobile/car/getDistributeInfo', 'POST', {
      page: pageNo,
      limit: 10
    }).then(res => {
      if (res.data.code == 0) {
        var list = res.data.accountInfoList
        that.setData({
          recordLists: that.data.recordLists.concat(list),
          page: pageNo,     //当前的页号
          pages: parseInt(res.data.totalCount/ 10)+1
        })
      }else{
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
  // ListTouch触摸开始
  ListTouchStart(e) {
    // console.log(e)
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },
  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },
  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

 

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
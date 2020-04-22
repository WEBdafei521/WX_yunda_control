// packageA/pages/order/index.js
import ajax from '../../../utils/index.js' //引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderLists:[],
    page7:1,
    pages7:0,
    page8:1,
    pages8:0,
    TabCur: 7,
    scrollLeft: 0,
    // 节流 防止重复点击
    hasTap: false,
    // 加载提示
    isLoading:true,
    // 未支付 
    unpays:[],
    // 已支付
    pays:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.recordList(1)
    var that =this;
    var token = wx.getStorageSync("token")
    if(token){
      this.unPay(1)
      this.pay(1)
    }else{
      that.setData({
        isLoading:false
      })
      // return
    }
    
  },
  tabSelect(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  // 未支付
  unPay:function(pageNo){
    var that = this;
    ajax('mobile/car/getOrder', 'POST', {
      page: pageNo,
      limit: 10,
      payType:7
    }).then(res => {
      if (res.data.code == 0) {
        var list = res.data.orderList
        that.setData({
          unpays: list, 
          page7: pageNo,  //当前的页号
          pages7: parseInt(res.data.totalCount / 10) + 1,
          isLoading:false
        })
      } else if(res.data.code == 401) {
       
        that.setData({
          isLoading:false
        })
      }else{
         wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    }).catch(err => {
      console.log("==> [ERROR]", err)
    })
  },
  // 已支付
  pay:function(pageNo){
    var that = this;
    ajax('mobile/car/getOrder', 'POST', {
      page: pageNo,
      limit: 10,
      payType:8
    }).then(res => {
      if (res.data.code == 0) {
        var list = res.data.orderList
        that.setData({
          pays: list, 
          page8: pageNo,  //当前的页号
          pages8: parseInt(res.data.totalCount / 10) + 1,
          isLoading:false
        })
      } else if(res.data.code == 401) {
       
        that.setData({
          isLoading:false
        })
      }else{
         wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    }).catch(err => {
      console.log("==> [ERROR]", err)
    })
  },
  recordList: function (pageNo , isAdd) {
    console.log("----")
    console.log(this.data.TabCur)
    // return
    this.loading = true;
    var that = this;
    return ajax('mobile/car/getOrder', 'POST', {
      page: pageNo,
      limit: 10,
      payType:that.data.TabCur
    }).then(res => {
      if (res.data.code == 0) {
        var list = res.data.orderList
        if(that.data.TabCur == 7){
          that.setData({
            unpays: isAdd ? that.data.unpays.concat(list) : res.data.orderList, 
            page7: pageNo,  //当前的页号
            pages7: parseInt(res.data.totalCount / 10) + 1,
            isLoading:false
          })
        }else if(that.data.TabCur == 8){
          that.setData({
            pays: isAdd ? that.data.pays.concat(list) : res.data.orderList, 
            page8: pageNo,  //当前的页号
            pages8: parseInt(res.data.totalCount / 10) + 1,
            isLoading:false
          })
        }
        
      } else if(res.data.code == 401) { 
        that.setData({
          isLoading:false
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
  toPay:function(e){
    let that = this
    if (!this.data.hasTap) {
      that.setData({
        hasTap: true
      }, () => {
        wx.navigateTo({
          url: '../pay/index?stationId=' + e.currentTarget.dataset.stationid,
          success: function () {
            that.setData({
              hasTap: true
            })
          }
        })
      })
    } else {
      return
    }
  },
  orderDetail(e){
    let that = this
    if (!this.data.hasTap) {
      that.setData({
        hasTap: true
      }, () => {
        wx.navigateTo({
          url: '../orderDetail/index?orderId=' + e.currentTarget.dataset.stationid,
          success: function () {
            that.setData({
              hasTap: true
            })
          }
        })
      })
    } else {
      return
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 下单页面
  goBook() {
    var _this = this;
    wx.redirectTo({
      url: '../book/index'
    })
  },
  // 我的页面
  goUser() {
    wx.redirectTo({
      url: '../user/index',
    })
  },
  // 首页面
  goIndex() {
    wx.redirectTo({
      url: '../index/index',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      hasTap: false
    })
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    // 显示加载动画
    this.setData({
      isLoading:true
    })
    var that = this;
    //模拟加载
    var TabCur = this.data.TabCur;
    if(TabCur == 7){
      that.recordList(1, false)
    }else if(TabCur == 8){
      that.recordList(1, false)
    }
    // this.recordList(1,true)
    setTimeout(function () {

      // complete

      wx.hideNavigationBarLoading() //完成停止加载

      wx.stopPullDownRefresh() //停止下拉刷新

    }, 500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    // 下拉触底，先判断是否有请求正在进行中
    // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
    var TabCur = that.data.TabCur;
    if(TabCur == 7){
      console.log(TabCur)
      if (!that.loading && that.data.page7 < that.data.pages7) {
        // 显示加载动画
        that.setData({
          isLoading:true
        })
        
        that.recordList(that.data.page7 + 1,true)
      }
    }else if(TabCur == 8){
      if (!that.loading && that.data.page8 < that.data.pages8) {
        // 显示加载动画
        that.setData({
          isLoading:true
        })
        
        that.recordList(that.data.page8 + 1,true)
      }
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
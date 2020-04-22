// packageA/pages/pay/index.js
import ajax from '../../../utils/index.js' //引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo:{},
    discount:"",
    stationId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    ajax('mobile/car/getOrderDetails', 'POST', {
          flowno: options.stationId
        }).then((e) => {
          console.log(e)
          if(e.data.code == 0){
            var discount = e.data.order.orderMoney - e.data.order.amountMoney;
            discount = discount.toFixed(2)
            that.setData({
              orderInfo: e.data.order,
              discount,
              stationId: options.stationId,
              flowno: options.stationId
            })
          }
        }).catch((err) => {
          console.log(err)
        })
  },
  toPay(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否去支付订单',
      success(res) {
        if (res.confirm) {
          ajax('mobile/car/pay', 'POST', {
            flowno: that.data.flowno
          }).then((e) => {
            if (e.data.code == 0) {
              wx.requestSubscribeMessage({
                tmplIds: ['EDdBI4zK0yU_-E0qNR8ZDdm2T8DCfMl2DupZD8MqxwY'],
                success(res) {
                  wx.redirectTo({
                    url: '../order/index',
                  })
                  setTimeout(function () {
                    wx.showToast({
                      title: '支付成功',
                    })
                  }, 1000)
                },
                fail(res) {
                  console.log(res)
                }
              })
            } else {
              wx.showToast({
                title: '余额不足，请充值',
              })
            }
          }).catch((err) => {
            console.log(err)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
        
     
  },
  backs:function(){
    wx.navigateBack()
  },
  cancelOrder:function(){
    var stationId = this.data.stationId;
    wx.showModal({
      title: '提示',
      content: '确定要删除此订单吗',
      success(res) {
        if (res.confirm) {
          ajax('mobile/car/removeOrder', 'POST', {
            flowno: stationId
          }).then((res) => {
            if (res.data.code == 0) {
              wx.redirectTo({
                url: '../order/index'
              })
            }
          }).catch((err) => {
            console.log(err)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
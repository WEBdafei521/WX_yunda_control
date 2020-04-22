// packageA/fleetManage/recharge/index.js
import ajax from '../../../utils/index.js' //引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:"",
    userId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
     userId:wx.getStorageSync("userId")
   })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
    console.log(e)
  },
  recharge(){
    var that = this;
    var inputval = this.data.inputValue
    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    // 校验输入金额格式
    if (!reg.test(inputval)) {
      wx.showToast({
        title: '请输入正确的金额',
        icon: "none",
        duration: 1000
      })
     }
    ajax('mobile/car/recharge', 'POST', {
      userId: that.data.userId,
      money:inputval
    }).then((e) => {
      if(e.data.code==0){
        wx.navigateBack();
        setTimeout(function(){
          wx.showToast({
            title: '充值成功',
          })
        },1000)
      }
    }).catch((err) => {
      console.log(err)
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
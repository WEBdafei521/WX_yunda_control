// packageA/pages/M1/index.js
import ajax from '../../../utils/index.js' //引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    M1List:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.m1List()
  },
  isForbidden:function(e){
    var _this =this;
    // console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
    var M1Lists = this.data.M1List
    // console.log(M1Lists[index])
    // 将列表中的项拿出来
    var m1Car = M1Lists[index];
    // 将项中的statue值计算出来
    var status = Math.abs(m1Car.status - "1")+""
    // 赋值给项
    m1Car.status = status
    // 将项在赋值给列表中的位置
    M1Lists[index]=m1Car;


    wx.showModal({
      title: '提示',
      content: `是否${status == 1 ? '启用' : '停用'}卡号为${m1Car.cardNo}的M1卡`,
      success(res) {
        if (res.confirm) {
          // 渲染视图
          _this.setData({
            M1List: M1Lists
          })
          ajax('mobile/car/update', 'POST', {
            id: m1Car.id,
            status: m1Car.status
          }).then((res) => {
            console.log(res)
            if (res.data.code == 0) {
              wx.showToast({
                title: "操作成功!",
                icon: "none"
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: "none"
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

  m1List:function(){
    var that = this;
    ajax('mobile/car/getMIList', 'POST',{
      page:1,
      limit:10,
      cardType:2
    }).then((res) => {
      console.log(res.data.page.list)
      if (res.data.code == 0) {
        console.log(res)
        that.setData({
          M1List: res.data.page.list
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:"none"
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
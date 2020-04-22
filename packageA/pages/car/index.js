// pages/tool/myCar/index.js
import ajax from '../../../utils/index.js' //引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addCar: false,
    page: 1,
    limit: 10,
    carList: [],
    carInfo: {
      lpn: "",
      vin: "",//车架号
      tankCapacity: "",//容量
      engine: "",//发动机号
      owner: "",//车主
      mphone: "",//手机号码
      sim: "",//SIM卡号
      devsn: ""//设备号
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCarList()
  },
  addNum: function (e) {
    var _this = this;
    _this.data.carInfo.lpn = e.detail.value
  },
  addChejia: function (e) {
    var _this = this;
    _this.data.carInfo.vin = e.detail.value
  },
  addVolume: function (e) {
    var _this = this;
    _this.data.carInfo.tankCapacity = e.detail.value
  },
  addEngine: function (e) {
    var _this = this;
    _this.data.carInfo.engine = e.detail.value
  },
  addMaster: function (e) {
    var _this = this;
    _this.data.carInfo.owner = e.detail.value
  },
  addTel: function (e) {
    var _this = this;
    _this.data.carInfo.mphone = e.detail.value
  },
  addSIM: function (e) {
    var _this = this;
    _this.data.carInfo.sim = e.detail.value
  },
  addEquipment: function (e) {
    var _this = this;
    _this.data.carInfo.devsn = e.detail.value
  },
  // 获取车辆列表
  getCarList: function () {
    var _this = this;
    ajax('mobile/car/get', 'POST').then((res) => {
      console.log(res)
      if (res.data.code == 0) {
        _this.setData({
          carList: this.data.carList.concat(res.data.cars)
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none",
          duration: 2000
        })
      }
      console.log(this.data.carList)
    })
  },
  // 添加车辆按钮
  addCar: function () {
    var _this = this;
    if (this.data.carInfo.vin.length == 0 || this.data.carInfo.lpn.length == 0 || this.data.carInfo.tankCapacity.length == 0 || this.data.carInfo.engine.length == 0 || this.data.carInfo.owner.length == 0 || this.data.carInfo.sim.length == 0 || this.data.carInfo.devsn.length == 0) {
      wx.showToast({
        title: '填写信息有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(this.data.carInfo.mphone)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }

    wx.request({
      url: 'https://you.yunfeiyang.com/mobile/car/save', //仅为示例，并非真实的接口地址
      data: JSON.stringify(_this.data.carInfo),
      method: "POST",
      header: {
        'content-type': 'application/json',// 默认值
        "token": wx.getStorageSync('token')
      },
      success(res) {
        if (res.data.code == 0) {
          _this.getCarList();

          wx.showToast({
            title: "添加成功",
            icon: 'none',
            duration: 1000,
          })
          setTimeout(function () {
            wx.hideToast()
          }, 1000)
        }
        _this.data.carInfo.lpn = "";
        _this.data.carInfo.vin = "";
        _this.data.carInfo.tankCapacity = "";
        _this.data.carInfo.engine = "";
        _this.data.carInfo.owner = "";
        _this.data.carInfo.mphone = "";
        _this.data.carInfo.sim = "";
        _this.data.carInfo.devsn = "";
      }
    })
    _this.setData({
      addCar: false
    })
  },
  // 取消添加车辆按钮
  cancel: function () {
    this.setData({
      addCar: false
    })
  },
  cancelJU: function (e) {
    // console.log(e)
    if (e.target.id == "a") {
      this.setData({
        addCar: false
      })
    }
  },
  actionSheetTap: function () {
    if (this.data.addCar == false) {
      this.setData({
        addCar: true
      })
    } else if (this.data.addCar == true) {
      this.setData({
        addCar: false
      })
    }
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
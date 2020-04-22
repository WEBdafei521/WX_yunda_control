// packageA/pages/shareMoney/index.js
import ajax from '../../../utils/index.js' //引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myBalance:"",
    index: null,
    userId:"",
    region: [
      { username: "张三", checked: false },
      { username: "李四", checked: false },
      { username: "王五",checked:false },
    ],
    driveLists:[
      // {username:"张三",value:50}
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      myBalance: wx.getStorageSync("myBalance"),
      userId: wx.getStorageSync("userId")
    })
    this.driverList();
  },
  add: function (e) {
    var index = e.currentTarget.dataset.index;
    var driveLists = this.data.driveLists;
    var arr = driveLists.map(function (currentValue, indexs, arr) {
      if (indexs == index) {
        currentValue.value += 10
      }
      return currentValue
    })
    this.setData({
      driveLists: arr
    })
  },
  reduce:function(e){
    var index = e.currentTarget.dataset.index;
    var driveLists = this.data.driveLists;
    var arr = driveLists.map(function (currentValue, indexs, arr) {
      if (indexs == index) {
        currentValue.value -= 10
      }
      return currentValue
    })
    this.setData({
      driveLists: arr
    })
  },
  changeValue:function(e){
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    var driveLists = this.data.driveLists;
    var arr = driveLists.map(function (currentValue, indexs, arr) {
      if (indexs == index) {
        currentValue.value = value
      }
      return currentValue
    })
    this.setData({
      driveLists: arr
    })
  },
  // 选中司机
  checkboxChange:function(e){
    var index = e.currentTarget.dataset.index;
    this.selectDri(index)
  },
  aaa: function (e) {
    var index = e.currentTarget.dataset.index;
    this.selectDri(index)
  },
  selectDri:function(index){
    var region = this.data.region;
    var arr = region.map(function (currentValue, indexs, arr) {
      if (indexs == index) {
        currentValue.checked = !currentValue.checked
      }
      return currentValue
    })
    this.setData({
      region: arr
    })
  },
  // 完成选则司机
  selectDriver:function(){
    var arr = this.data.region;
    var driverList = []
    for(var item of arr){
      if(item.checked){
        item.value = 50
        driverList.push(item)
      }
    }
    this.setData({
      modalName: "",
      driveLists: driverList
    })
  },
  // 展示选择司机列表
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  // 隐藏选择司机列表
  hideModal(e) {
    var arr = this.data.region;
    for(var item of arr){
      item.checked = false
    }
    this.setData({
      modalName: null,
      region:arr,
      driveLists:[]
    })
  },
  // 获取司机列表
  driverList:function(){
    var that = this
    ajax('mobile/car/getMotorcade', 'POST',{
      page:1,
      limit:100
    }).then((res) => {
      if (res.data.code == 0) {
        var driveList = [];
        for (var item of res.data.motorcade) {
          var arr = {};
          arr.username = item.username;
          arr.checked = false;
          driveList.push(arr)
        }
        that.setData({
          region: driveList
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
  // 提交分配
  formSubmit: function (e) {
    var that = this
    if(this.data.driveLists.length == 0){
      wx.showToast({
        title: '请选择所需分配的司机',
        icon: "none",
        duration: 1000
      })
      return
    }
    var arr=[];
    var obj;
    for(var item of this.data.driveLists){
      obj = {};
      var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      var price = item.value;
      if (!reg.test(price)) {
        wx.showToast({
          title: '请输入正确的金额',
          icon: "none",
          duration: 1000
        })
        return
      }
      obj.username = item.username
      obj.money = item.value;
      arr.push(obj)
    }
    var data = JSON.stringify(arr)
    ajax('mobile/car/distribute', 'POST', {
      data, userId: that.data.userId
    }).then((res) => {
      console.log(res)
      if (res.data.code == 0) {
        wx.navigateBack()
        setTimeout(function () {
          wx.showToast({
            title: '分配成功',
            icon: "success",
            duration: 1000
          })
        }, 1000)

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
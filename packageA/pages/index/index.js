// packageA/pages/index/index.js
import ajax from '../../../utils/index.js' //引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:"",
    stationList:[],
    // 油站列表的参数
    index:0,
    page:1,
    pages:0,
    // 外部司机
    // 选择输入金额的模态框
    checkbox: [{
        value: 0,
        name: '50元',
        money:"50",
        checked: false,
        hot: false,
      }, {
        value: 1,
        name: '100元',
        money: "100",
        checked: false,
        hot: false,
      }, {
        value: 2,
        name: '200元',
        money: "200",
        checked: false,
        hot: true,
      }, {
        value: 3,
        name: '500元',
        money: "500",
        checked: false,
        hot: true,
      }, {
        value: 4,
        name: '1000元',
        money: "1000",
        checked: false,
        hot: false,
      }, {
        value: 5,
        name: '5000元',
        money: '5000', 
        checked: false,
        hot: false,
      }
    ],
    // 显示模态框
    modalName:"",
    // 用户的订单列表
    orderList:[],
    // 无订单 输入的加油金额
    inputVal:"",

    // 内部司机
    carList:[],
    // 选择输入油量的模态框
    checkCarPribox: [{
        value: 0,
        name: '10L',
        sum: "10",
        checked: false,
        hot: false,
      }, {
        value: 1,
        name: '30L',
        sum: "30",
        checked: false,
        hot: false,
      }, {
        value: 2,
        name: '50L',
        sum: "50",
        checked: false,
        hot: true,
      }, {
        value: 3,
        name: '100L',
        sum: "100",
        checked: false,
        hot: true,
      }, {
        value: 4,
        name: '300L',
        sum: "300",
        checked: false,
        hot: false,
      }, {
        value: 5,
        name: '500L',
        sum: '500',
        checked: false,
        hot: false,
      }
    ],
    // 有车辆输入金额
    inputCarPriVal:"",
    carId:"",
    // 节流 防止重复点击
    hasTap: false,
    // 油站列表加载中
    isfinish:true,

    isLogin:false
    
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      userId: wx.getStorageSync("userId")
    })
    that.recordList(1); 
  },
 
  // 扫码
  scanCode: function () {
    var aroundType = wx.getStorageSync("aroundType");
    var that = this;
    wx.scanCode({
      success: function (res) {
        that.setData({
          gunId: res.result
        })
        // 外部用户
        if(aroundType != 0){
          // 获取订单  并传入油枪编号
          that.choseOrder(res.result)
        }else{
          // 获取司机列表 传入油枪编号
          that.choseCar(res.result)
        }
      },
      fail: function (res) {
      }
    })
  },

  // 外部司机
  // 获取司机订单列表，将订单号传给后台
  choseOrder(gunId) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    // 外部司机的订单号 数组 备用
    var arr = [];
    ajax('mobile/car/getUserAbleOrder', 'POST').then((res) => {
      wx.hideLoading()
      if (res.data.code) {
        // 有订单的情况
        if (res.data.orders.length != 0) {
          wx.showModal({
            title: '已有订单',
            content: `是否选已有订单`,
            success(e) {
              if (e.confirm) {
                that.setData({
                  // 有订单
                  modalName: "viewModal",
                  // modalName: "RadioModal",
                  // 无订单
                  // modalName: "ChooseModal",
                  orderList: res.data.orders,
                  gunId
                })
              } else if (e.cancel) {
                that.setData({
                  // 有订单
                  // modalName: "viewModal",
                  // modalName: "RadioModal",
                  // 无订单
                  modalName: "ChooseModal",
                  orderList: res.data.orders,
                  gunId
                })
              }
            }
          })
          
        } else {
          that.setData({
            modalName: "ChooseModal",
            orderList: res.data.orders,
            gunId
          })
        }

      }
    }).catch((err) => {
      console.log(err)
    })
  },
  // 外部司机有订单的情况下 选中订单
  order(e) {
    var that = this;
    that.setData({
      modalName: ""
    })
    var flowno = that.data.orderList[e.currentTarget.dataset.index].flowno;
    // 油枪编号
    console.log(that.data.gunId)
    // 订单信息
    console.log(that.data.orderList[e.currentTarget.dataset.index])
    // 订列表的下标
    console.log(e.currentTarget.dataset.index)
    // return
    wx.showModal({
      title: '友情提示',
      content: `请确定是否加油？`,
      success(res) {
        if (res.confirm) {
          // 确定加油
          wx.showLoading({
            title: '请稍等...',
          })
          var json = {
            carId: "",
            userId: wx.getStorageSync("userId"),
            tankerId: that.data.gunId,
            oilNum: "",
            flowno
          }
          // 加油接口
          ajax('yunda/yfytoiltrade/toOil', 'POST', json).then((res) => {
            wx.hideLoading()
            if (res.data.code == 0) {
              
              wx.showToast({
                title: res.data.msg,
              })
            } else if (res.data.code == "-888") {
              wx.showModal({
                title: '提示',
                content: `请确定是否申请临时授权？`,
                success(r) {
                  
                }
              })
            } else {

            }
          }).catch((err) => {
            console.log(res)
          })
        } else if (res.cancel) {
         
        }
      }
    })
    
  },
  // 外部司机无订单的清空下，输入金额
  entryVal(e){
    var that = this ;
      this.setData({
        inputVal: e.detail.value
      })
  },
  // 外部司机无订单的清空下，选中预备的金额
  ChooseCheckbox(e) {
    var that = this;
    let items = this.data.checkbox;
    let values = e.currentTarget.dataset.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value == values) {
        items[i].checked = !items[i].checked;
        that.setData({
          inputVal : items[i].money
        })
      } else {
        items[i].checked = false;
      }
    }
    this.setData({
      checkbox: items
    })
  },
  // 无订单 选择金额生成订单 返回订单号 
  comfirm(e) {
    var that = this;
    var money = that.data.inputVal;
    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    if (!reg.test(money)) {
      wx.showToast({
        title: '请输入正确的金额',
        icon:"none"
      })
      that.setData({
        inputVal:""
      })
      return
    }
    // 获取用户的订单信息
    ajax('mobile/car/addOrder', 'POST',{
      money: that.data.inputVal,
      tankerId: that.data.gunId,
      userId:wx.getStorageSync("userId")
      // tankerId: "09080704"
    }).then((res) => {
      that.setData({
        inputVal:""
      })
      var flowno = res.data.flowno;
      if (res.data.code == 0) {
        wx.showModal({
          title: '友情提示',
          content: `请确定是否加油？`,
          success(res) {
            if (res.confirm) {
              // 确定加油
              wx.showLoading({
                title: '请稍等...',
              })
              var json = {
                carId: "",
                userId: wx.getStorageSync("userId"),
                tankerId: that.data.gunId,
                oilNum: "",
                flowno
              }
              
              // 加油接口
              ajax('yunda/yfytoiltrade/toOil', 'POST', json).then((res) => {
                console.log(res)
                  wx.hideLoading()
                if (res.data.code == 0) {
                  wx.showToast({
                    title: res.data.msg,
                  })
                } else if (res.data.code == "-888") {
                  wx.showModal({
                    title: '提示',
                    content: `请确定是否申请临时授权？`,
                    success(r) {
                      console.log("同意临时授权，待调接口")
                    }
                  })
                } else {

                }
              }).catch((err) => {
                console.log(res)
              })
            } else if (res.cancel) {

            }
          }
        })
      }
    }).catch((err) => {
      console.log(err)
    })
    this.setData({
      modalName: ""
    })
  },

  // 内部司机
  // 获取车辆
  choseCar(gunId){
    var that = this;
    // 获取用户的车辆信息RadioModalCar
    ajax('mobile/car/get', 'POST').then((res) => {
      if (res.data.code == 0) {
        if (res.data.cars.length == 0) {
          that.setData({
            modalName: "ChooseCarModel",
            gunId:"",
          })
        } else {
          // 获取车辆 显示列表
          that.setData({
            carList: res.data.cars,
            modalName:"RadioModalCar"
          })
        }
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  // 选择车辆
  selectCar(e){
    var that = this;
    that.setData({
      modalName: "ChooseCarModel"
    })
    var carId = that.data.carList[e.currentTarget.dataset.index].vehId;
    this.setData({
      carId
    })
  },
  // 内部司机 有车辆 输入油量
  entryCarPriVal(e){
    var that = this;
    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    // 校验输入金额格式
    if (reg.test(e.detail.value)) {
      this.setData({
        inputCarPriVal: e.detail.value
      })
    }
  },
  ChooseCheckCarPribox(e){
    var that = this;
    let items = this.data.checkCarPribox;
    let values = e.currentTarget.dataset.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value == values) {
        items[i].checked = !items[i].checked;
        that.setData({
          inputCarPriVal: items[i].sum
        })
      } else {
        items[i].checked = false;
      }
    }
    this.setData({
      checkCarPribox: items
    })
  },
  comfirmCarPri(){
    var that = this;
    if(that.data.inputCarPriVal < 5){
      wx.showToast({
        title: '每次加油不低于5L',
        icon:"none"
      })
      return
    }
    that.setData({
      modalName:""
    })
    wx.showLoading({
      title: '加油中...'
    })
    var json = {
      carId: that.data.carId,
      userId: that.data.userId,
      tankerId: that.data.gunId,
      oilNum: that.data.inputCarPriVal,
    }
    // 加油接口
    ajax('yunda/yfytoiltrade/toOil', 'POST', json).then((res) => {
      wx.hideLoading()
      if (res.data.code == 0) {
        wx.showToast({
          title: res.data.msg,
        })
      }
      if (res.data.code == "-999") {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          success(e) {
            if (e.confirm) {
              return false;

            } else if (e.cancel) {
              return false;
            }
          }
        })
      }
      if (res.data.code == "-777") {
        wx.showToast({
          title: res.data.msg,
        })
      }
      if (res.data.code == "-888") {
        // 获取用户的车辆信息
        ajax('yunda/yfytoiltrade/applyOrder', 'POST', json).then((res) => {
          if (res.data.code == "-999") {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              success(e) {
                if (e.confirm) {
                  return false;
                } else if (e.cancel) {
                  return false;
                }
              }
            })
          }else{
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              success(e) {
                if (e.confirm) {
                  return false;
                } else if (e.cancel) {
                  return false;
                }
              }
            })
          }
        }).catch((err) => {
          console.log(res)
        })
      }
    }).catch((err) => {
      console.log(res)
    })
  },


  // 获取油站列表
  recordList: function (pageNo, isAdd) {
    this.loading = true
    var that = this;
    var latitude;
    var longitude
    wx.getLocation({
      success: function (res) {
        latitude = res.latitude;
        longitude = res.longitude;
        ajax('mobile/car/getAllStation', 'POST', {
          // ajax('mobile/car/getStation', 'POST', {
          lon: longitude,
          lat: latitude,
          page: pageNo,
          limit: 10
        }).then((e) => {
          console.log(e)
          var list =  e.data.stations;
          if (e.data.code == 0) {
            that.setData({
              stationList:!isAdd ? that.data.stationList.concat(list) : list,
              page: pageNo,     //当前的页号
              pages: parseInt(e.data.totalCount / 20) + 1,
              isfinish:false
            })
          }else if(e.data.code == 401) {
            that.setData({
              isfinish:false
            })
          }
        }).catch((err) => {
          console.log(err)
        }).then(() => {
          that.loading = false
        })
      }
    });
  },
  
  hideModal(e) {
    this.setData({
      modalName: ""
    })
  },
  cancelLogin(){
    this.setData({
      isLogin:false
    })
  },
  goLogin(){
    wx.reLaunch({
     url: '../../../pages/login/index',
    })
  },
  // 去下单
  goBookOrder(e) {
    let that = this
    var token = wx.getStorageSync("token");
    if(!token){
      // wx.showModal({
      //   title: '暂未登录',
      //   content: `登录后方可下单，是否去登录`,
      //   success(e) {
      //     if (e.confirm) {
      //         wx.reLaunch({
      //         url: '../../../pages/login/index',
      //       })
      //     } else if (e.cancel) {
      //       // return false;
      //     }
      //   }
      // })
      that.setData({
        isLogin:true
      })
      return
    }
    if (!this.data.hasTap) {
      that.setData({
        hasTap: true
      }, () => {
        wx.navigateTo({
          url: '../book/index?orgCode=' + e.currentTarget.dataset.orgcode,
          success: function () {
            that.setData({
              hasTap: true,
              isLogin:false
            })
          }
        })
      })
    } else {
      return
    }
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
  // 订单页面
  goOrder() {
    wx.redirectTo({
      url: '../order/index',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  
  onReady: function (e) {
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
    //模拟加载
    this.recordList(1, true)
    setTimeout(function () {

      // complete

      wx.hideNavigationBarLoading() //完成停止加载

      wx.stopPullDownRefresh() //停止下拉刷新

    }, 1500);
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
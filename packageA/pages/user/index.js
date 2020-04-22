// packageB/pages/index/index.js
import ajax from '../../../utils/index.js' //引入
const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHas:true,
    // 充值记录
    forksCount: 0,
    myBalance:0,
    // 资金记录
    visitTotal: 0,  
    username: " ",
    isController:1,

    // 节流 防止重复点击
    hasTap:false,
    isLogin:true

  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var visitTotal = wx.getStorageSync("visitTotal")?wx.getStorageSync("visitTotal"):0;
    var aroundType = wx.getStorageSync("aroundType")?wx.getStorageSync("aroundType"):0;
    var authType = wx.getStorageSync("authType")?wx.getStorageSync("authType"):0;
    
    var username = wx.getStorageSync("username");
    if(aroundType == 2 && authType ==2){
      _this.setData({
        isController:1
      })
    }else if(aroundType == 2 && authType ==3){
      _this.setData({
        isController:0
      })
    }
    if (username){
      _this.setData({
        username,
        visitTotal
      })
    }else{
      _this.setData({
        visitTotal,
        isHas:false
      })
    }
    var token = wx.getStorageSync("token")
    if(token){
      this.attached()
      this.setData({
        isLogin:true
      })
    }else{
      this.setData({
        isLogin:false
      })
    }
  },
  toLogin:function(){
    wx.showModal({
      title: '暂未登录',
      content: `是否前去登录`,
      success(e) {
        if (e.confirm) {
            wx.reLaunch({
            url: '../../../pages/login/index',
          })
        } else if (e.cancel) {
          return false;
        }
      }
    })
  },
  // 获取用户的头像 和unionid
  bindGetUserInfo:function(){
    var _this = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        if (res.code) {
          //发起网络请求  
          wx.getUserInfo({
            success: function (res) {
              _this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                isHas: true
              })
              wx.setStorageSync("username", res.userInfo.nickName);
              
              ajax('mobile/pwd/saveUnionid', 'POST', {
                code,
                nickName:res.userInfo.nickName,
                encryptedData: res.encryptedData,
                iv:res.iv
              }).then((e) => {
                
              }).catch((err) => {
                console.log(err)
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    
  },
  // 用户的基本信息
  attached() {
    var that = this;
    ajax('mobile/car/getTradList', 'POST', {
      page: 1,
      limit: 1000
    }).then(res => {
      if (res.data.code == 0) {
        var listLength = res.data.tradList.length
        wx.setStorageSync("visitTotal", listLength)
        that.setData({
          visitTotal: listLength
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
    }).catch(err => {
      console.log("==> [ERROR]", err)
    })


    ajax('mobile/car/getAccount', 'POST',{
      userId: wx.getStorageSync("userId")
    }).then((res) => {
      if (res.data.code == 1) {
        that.setData({
          myBalance: "!"
        })
        wx.showToast({
          title: '余额异常，请联系管理员',
          icon:"none"
        })
      }else if(res.data.code == 0){
        wx.setStorageSync("myBalance", res.data.account.balance)
        that.setData({
          myBalance: res.data.account.balance
        })
      }
    }).catch((err) => {
      console.log(err)
    })


    ajax('mobile/car/getRechargeList', 'POST', {
      userId: wx.getStorageSync("userId"),
      page:1,
      limit:10
    }).then((res) => {
      if (res.data.code == 0) {
        that.setData({
          forksCount: res.data.total
        })
      }
    }).catch((err) => {
      console.log(err)
    })
    // wx.hideLoading()
  },
  // 充值
  recharge(){
    let that = this
    if (!this.data.hasTap) {
      that.setData({
        hasTap: true
      }, () => {
        if(that.data.isLogin){
          wx.navigateTo({
            url: '../rechargeRecord/index',
            success: function () {
              that.setData({
                hasTap: true
              })
            }
          })
        }else{
          wx.showToast({
            title: '请先登录',
            icon:"none"
          })
          that.setData({
            hasTap: false
          })
        }
      })
    } else {
      return
    }
  },
  // 资金记录
  moneyRecord(){
    let that = this
    if (!this.data.hasTap) {
      that.setData({
        hasTap: true
      }, () => {
        if(that.data.isLogin){
          wx.navigateTo({
            url: '../moneyRecord/index',
            success: function () {
              that.setData({
                hasTap: true
              })
            }
          })
        }else{
          wx.showToast({
            title: '请先登录',
            icon:"none"
          })
          that.setData({
            hasTap: false
          })
        }
      })
    } else {
      return
    }
  },
  // 资金分配
  shareMoney(){
    let that = this
    if (!this.data.hasTap) {
      that.setData({
        hasTap: true
      }, () => {
        wx.navigateTo({
          url: '../shareMoney/index',
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
  // 分配记录
  shareRecord() {
    wx.navigateTo({
      url: '../shareRecord/index',
    })
  },

  // 车队信息
  carInfo() {
    wx.navigateTo({
      url: '../shareRecord/index',
    })
  },
  // 我的车队
  fleetInfo(){
    wx.navigateTo({
      url: '../fleetInfo/index',
    })
  },
  // 我的余额
  myBalance() {
    let that = this
    if (!this.data.hasTap) {
      that.setData({
        hasTap: true
      }, () => {
        if(that.data.isLogin){
          wx.navigateTo({
            url: '../balance/index',
            success: function () {
              that.setData({
                hasTap: true
              })
            }
          })
        }else{
          wx.showToast({
            title: '请先登录',
            icon:"none"
          })
          that.setData({
            hasTap: false
          })
        }
      })
    } else {
      return
    }
  },
  // 我的M1卡
  m1() {
    let that = this
    if (!this.data.hasTap) {
      that.setData({
        hasTap: true
      }, () => {
        wx.navigateTo({
          url: '../M1/index',
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
  myCar(){
    wx.navigateTo({
      url: '../car/index',
    })
  },
  // 首页面
  goIndex(){
    wx.redirectTo({
      url: '../index/index',
    })
  },
  // 订单页面
  goBook() {
    wx.redirectTo({
      url: '../book/index',
    })
  },
  // 订单页面
  goOrder() {
    wx.redirectTo({
      url: '../order/index',
    })
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var token = wx.getStorageSync("token")
     this.setData({
        hasTap:false
      })
    if(token){
      // this.attached()
      // this.setData({
      //   hasTap:false
      // })
    }
   
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
    var islogin = this.data.islogin;
    if(islogin){
      this.attached()
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
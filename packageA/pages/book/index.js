// packageA/pages/book/index.js
import ajax from '../../../utils/index.js' //引入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stationId:"",
    // 油站信息
    station:{},
    // 油站列表
    picker: ['92#', '95#', '97#'],
    // 油品是否显示
    oilTyleIsShow:false,
    checkbox: [{
        value: 0,
        name: '50',
        checked: false,
        hot: false,
      }, {
        value: 1,
        name: '100',
        checked: false,
        hot: false,
      }, {
        value: 2,
        name: '200',
        checked: false,
        hot: false,
      }, {
        value: 3,
        name: '500',
        checked: false,
        hot: true,
      }, {
        value: 4,
        name: '800',
        checked: false,
        hot: false,
      }, {
        value: 5,
        name: '1000',
        checked: false,
        hot: false,
      }],
    checkboxOil: [{
        value: 0,
        name: '92#',
        check: false,
        hot: false,
        label:null
      }],
    
    // 油品单价
    simpelPrice:"0",
    // 输入购买金额
    price:"",
    // 所输入金额 可购买的油量
    oilSum:"0",
    // 油品型号
    oilType:"请选择油品",
    // 油品编号
    goodsCode:"",
    
    hasPrice:false,
    hasOilType:false,
    // 节流 防止重复点击
    hasTap: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.hasOwnProperty('orgCode')){
      let orgCode = options.orgCode
      // 根据油站ID 从获取油量
      this.setData({
        stationId: orgCode
      })
      ajax('mobile/car/getStationDetails', 'POST', {
        orgCode:options.orgCode
      }).then((e) => {
        if (e.data.code == 0) {
          let oilType = [];
          var i = 0;
          for (var item of e.data.goodList.goodsList) {
            var arr = {};
            arr.value = i;
            arr.check = false;
            arr.hot = item.price;
            arr.name = item.goodsName;
            arr.label = item.tagPrice;
            arr.goodsCode = item.goodsCode;
            oilType.push(arr)
            i++;
          }
          that.setData({
            station: e.data.goodList,
            checkboxOil: oilType
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  
  },
  // 油品显示/隐藏
  isShow:function(){
    this.setData({
      oilTyleIsShow:!this.data.oilTyleIsShow
    })
  },
  onReady: function(){},
  // 输入加油金额
  inputVal(e){
    var _this = this;
    var inputValue = e.detail.value;
    var simpelPrice = this.data.simpelPrice;

    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    // 校验输入金额格式
    if (!reg.test(inputValue)) {
      wx.showToast({
        title: '请输入正确的金额',
        icon: "none",
        duration: 1000
      })
    }else{
      var oilsum = 0;
      if (_this.data.simpelPrice != "0") {
        oilsum = inputValue / simpelPrice;
        oilsum = oilsum.toFixed(2);
        _this.setData({
          price: inputValue,
          oilSum: oilsum
        })
      }
    }
    
  },
  // 选择油品·
  ChooseCheckboxOil(e) {
    // console.log(e)
    var _this = this;
    let items = this.data.checkboxOil;
    // 下标
    let values = e.currentTarget.dataset.value;
    // 用户输入的总价
    let inputValue = _this.data.price;
    // 单价
    let simpelPrice = _this.data.checkboxOil[values].hot;
    // 标签价
    let label = _this.data.checkboxOil[values].label;
    // 油品编号
    let goodsCode = _this.data.checkboxOil[values].goodsCode;
    // console.log(goodsCode)
    _this.setData({
      simpelPrice: _this.data.checkboxOil[values].hot,
      oilTyleIsShow: !this.data.oilTyleIsShow,
      label: label,
      goodsCode
    })
    // 如果选择油品 得出单价  如果有加油总价 算出加油量 
    var oilsum = 0;
    if(_this.data.price){
      oilsum = inputValue / simpelPrice;
      oilsum = oilsum.toFixed(2);
      _this.setData({
        oilSum: oilsum
      })
    }
    // console.log(_this.data.checkboxOil[values].hot)
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value == values) {
        
        items[i].check = true;
        _this.setData({
          hasPrice: true
        })
        if (items[i].check) {
          
          _this.setData({
            oilType: items[i].name
          })
        } else {
          _this.setData({
            oilType: ""
          })
        }
      } else {
        items[i].check = false;
      }
    }
    this.setData({
      checkboxOil: items
    })
  },
  // 选择充值金额
  ChooseCheckbox(e) {
    var _this = this;
    let items = this.data.checkbox;
    let values = e.currentTarget.dataset.value;
    var simpelPrice = this.data.simpelPrice;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value == values) {
        var oilsum = 0;
        if (_this.data.simpelPrice != "0"){
          oilsum = items[i].name / simpelPrice;
          oilsum = oilsum.toFixed(2);
        }
        items[i].checked = !items[i].checked;
        if (items[i].checked ){
          _this.setData({
            price : items[i].name,
            oilSum : oilsum
          })
        }else{
          _this.setData({
            price: ""
          })
        }
        
      }else{
        items[i].checked = false;
      }
    }
    this.setData({
      checkbox: items
    })
  },
  
  submit:function(e){
    var that = this;
   
        wx.showLoading({
          title: '数据加载中',
          mask: true,
        })
        // 下单金额
        var money = that.data.price;
        // 单价
        var price = that.data.simpelPrice;
        // 挂牌价
        var tagPrice;
        if (that.data.label) {
          tagPrice = that.data.label;
        } else {
          tagPrice = ""
        }
        // 油品编号
        var goodsCode = that.data.goodsCode;
        if (goodsCode == ""){
          wx.showToast({
            title: '请选择油品',
            icon: "none",
            duration: 1000
          })
          return
        }
        var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
        // 校验输入金额格式
        if (!reg.test(money)) {
          wx.showToast({
            title: '请输入正确的加油金额',
            icon: "none",
            duration: 1000
          })
          return
        }
        // 所加油量
        var oilSum = that.data.oilSum;
        // 站点编号
        var stationId = that.data.stationId;

        if (!that.data.hasTap) {
          that.setData({
            hasTap: true
          }, () => {
            ajax('mobile/car/addOrder', 'POST', {
              orgCode: stationId,
              money: money,
              price,
              tagPrice,
              goodsCode
            }).then((e) => {
              if (e.data.code == 0) {
                wx.hideLoading()
                wx.navigateTo({
                  url: '../pay/index?stationId=' + e.data.flowno,
                  success: function () {
                    that.setData({
                      hasTap: true
                    })
                  }
                })
              } else {
                wx.hideLoading()
                wx.showToast({
                  title: res.data.msg,
                  icon: "none"
                })
              }
            }).catch((err) => {
              console.log(err)
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

  // 我的页面
  goUser() {
    wx.navigateTo({
      url: '../user/index',
    })
  },
  // 我的页面
  goIndex() {
    wx.navigateTo({
      url: '../index/index',
    })
  },
  // 订单页面
  goOrder() {
    wx.navigateTo({
      url: '../order/index',
    })
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
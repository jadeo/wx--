// pages/reward/reward.js
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    session3rd:'',
    money:'',
    count:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    utils.Login(that,function(session){
    })
  },
  money_input:function(e){
      var that=this;
      that.setData({
        money:e.detail.value,
      })
  },
  pay: function (e) {
    console.log(e)
    var that=this;
    var cont = e.currentTarget.dataset.money;
    var session3rd = this.data.session3rd;
    var money=this.data.money
    var count=this.data.count
    if(money){
      that.setData({
        count:money
      })
    }else{
      that.setData({
        count: cont,
      })
    }
    pay(session3rd,that.data.count)
  },
})

function pay(session3rd,count){
  wx.request({
    url: 'https://yjxg.suxcx.com/index.php?s=/w17/Yjuser/Xpay/payweixinx',//改成你自己的链接  
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      session3rd: session3rd,
      money: count
    },
    method: 'POST',
    success: function (res) {
      console.log(res);
      wx.requestPayment({
        'timeStamp': res.data.timeStamp,
        'nonceStr': res.data.nonceStr,
        'package': res.data.package,
        'signType': 'MD5',
        'paySign': res.data.paySign,
        success: function (res) {
          console.log(res);
        }
      })
    }
  })
}
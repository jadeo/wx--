// pages/achievement/achievement.js
var request = require('../../request/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      get_num:5,
      session3rd:'',
      model_list:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getStorage({
      key: 'session',
      success: function (res) {
        that.setData({
          session3rd: res.data,
        })
        console.log(that.data.session3rd)
        model.call(that)
      },
      fail: function () {
        wxLogin.call(that);
      }
    })
  },
})

//请求勋章
function model(){
  var session3rd=this.data.session3rd;
  var that=this;
  request.requestMedal({
    session3rd:session3rd,
  },(data) =>{
    console.log(data)
    that.setData({
      model_list: data,
    })
  })
}
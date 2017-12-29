// pages/authorization/authorization.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  getAgain:function(){
    wx.openSetting({
      success: function (res) {
        console.log(res)
        if (res.authSetting["scope.userInfo"]==true) {
         wx.switchTab({
           url: '../index/index',
         })
        }
      }
    })
  }
  
})
// pages/join/join.js
var request = require('../../request/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      joinlist:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that=this;
    var fid = options.id;
      request.requestJoin({
        fid: fid,
      }, (data) => {
        console.log(data)
        that.setData({
          joinlist:data,
        })
      }, (data) => {

      })
  },
})

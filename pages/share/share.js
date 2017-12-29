// pages/save/save.js
var request = require('../../request/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    model_show: true,
    mask_show: true,
    url: [],
    content: '该照片已经保存到你的手机，可以去朋友圈分享了',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = this.data.url;
    console.log(options)
    that.setData({
      url: [options.url],
    })
  },
  previewImage: function (e) {
    var previewImageArray = e.currentTarget.dataset.previewimgarray;
    wx.previewImage({
      urls: previewImageArray // 需要预览的图片http链接列表
    })
  },
  postCard: function () {
    var that = this;
    var url = this.data.url[0];
    wx.downloadFile({
      url: url,
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success: function () {
            that.setData({
              model_show: false,
              mask_show: false,
              content: '该图片已保存到您手机相册，可以直接去朋友圈分享了!'
            })
          },
          fail: function () {
            that.setData({
              model_show: false,
              mask_show: false,
              content: '保存失败，请稍后重试'
            })
          },
        })
      },
      fail: function () { },
    })
  },
  // 点击我知道了
  result: function () {
    var that = this;
    that.setData({
      model_show: true,
      mask_show: true,
    })
  },
  onShareAppMessage: function () {
    return {
      title: '每日瑜伽',
      path: '/pages/save/save?url=' + this.data.url[0]
    }
  }
})
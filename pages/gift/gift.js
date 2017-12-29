// pages/gift/gift.js
var request = require('../../request/request.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      session3rd:'',
      item:{
        fid:'',
        userinfo:[],
        gift:true,
        card_name: '',   //标题
        name:'',
        address:'',
        phone:'',
        weixin:'',
        disabled:false,
      },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that=this;
    var card_name = options.title;
    var fid=options.fid;
    that.setData({
      'item.card_name': card_name,
      'item.fid': fid,
    })
    wx.getUserInfo(
      {
        success: function (res) {
          that.setData({
            'item.userinfo':res.userInfo,
          })
        },
      }
    )
    wx.getStorage({
      key: 'session',
      success: function (res) {
        that.setData({
          session3rd: res.data,
        })
        console.log(that.data.session3rd)
      },
      fail: function () {
        // wxLogin.call(that);
      }
    })
  },
  // 获取到name
  getName:function(e){
    console.log(e)
    var name=e.detail.value;
    console.log(name)
    this.setData({
        'item.name':name,
    })
  },
  // 获取到地址
  getaddress:function(e){
    var address = e.detail.value;
    this.setData({
      'item.address': address,
    })
  },
  // 获取手机号
  getPhone:function(e){
    var phone = e.detail.value;
    this.setData({
      'item.phone': phone,
    })
  },
  // 获取微信号
  getWeixin:function(e){
    var weixin = e.detail.value;
    this.setData({
      'item.weixin': weixin,
    })
  },
  // 保存按钮
  save:function(){
    var that=this;
    var session3rd = this.data.session3rd;
    console.log(session3rd)
    var weixin = this.data.item.weixin;
    var phone = this.data.item.phone;
    var name = this.data.item.name;
    var address = this.data.item.address;
    var fid = this.data.item.fid;
    var disabled = this.data.item.disabled;
    if (app.trim(name).length <= 0 || app.trim(address).length <= 0 || app.trim(phone).length <= 0){
          wx.showModal({
            title: '提示',
            content: '信息请填写完整哦',
            showCancel:false,
          })
    }else{
        wx.showToast({
          icon:'loading',
          duration:1000,
        })
        that.setData(
          {
            disabled: true,
          }
        )
        request.requestAddress({
          session3rd: session3rd,
          // fid: fid,
          weixin: weixin,
          phone: phone,
          name:name,
          address: address,
        },(data) =>{
          console.log('success')
          wx.switchTab({
            url: '../index/index',
          })
        },(data) =>{
          console.log('fail')
        })
      }
  }

})
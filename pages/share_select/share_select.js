// pages/share_select/share_select.js
var app=getApp();
var util = require('../../utils/util.js')
var request = require('../../request/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    origin:'../../imgs/add_photo.png',
    uploadimg:'',
    placeholder: [],
    index:'',
    curIndex:'',
    pcont:'',
    num:'',
    session3rd:'',
    value:'',
    signID:'',
    day:'',
    color:'',
    status:1,
    disabled:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that=this;
      console.log(options)
      that.setData({
        signID: options.fid,
        day: options.day,
        color: options.color,
      })
      // var index=this.data.index;
      // var placeholder = this.data.placeholder
      that.setData({
        index: Math.ceil(Math.random() * 9),
      })
      var index = that.data.index;
      console.log(index)
      request.requestPunchShare({
      }, (data) => {
        console.log(data)
        that.setData({
          placeholder:data,
          num:data[index].cont.length,
        })
      })
      util.Login(that, function (session) {
      })
      
  },   
  chooseImg:function(){
    var that=this;
    wx.chooseImage({
      count:1,
      success: function(res) {
        console.log(res)
        that.setData({
          uploadimg: res.tempFilePaths[0],
        })
      },
    })
  },
  // 获取输入的内容
  input: function (e) {
    var that = this;
    var value = e.detail.value;
    var num = value.length;
    that.setData({
      num: num,
      value:value,
    })
  },
  // 点击换一句，有输入内容时，仍可以点击
  change:function(){
    var that=this;
    var next = Math.ceil(Math.random()*10)
    var placeholder = this.data.placeholder;
    var p = placeholder[next].cont.length
    that.setData({
      index:next,
      num: p,
      value:'',
    })
    console.log(that.data.num)
    console.log(next)
  },
  select1:function(){
    var that=this;
    that.setData({
        curIndex:0,
        status:1,
    })
  },
  select2: function () {
    var that = this;
    that.setData({
      curIndex: 1,
      status:2,
    })
  },
  select3: function () {
    var that = this;
    that.setData({
      curIndex: 2,
      status:3,
    })
  },


  // 生成邀请卡片
  post:function(){
    var that=this;
    var value=this.data.value;
    var index = this.data.index;
    var placeholder = this.data.placeholder;
    var uploadimg = this.data.uploadimg;
    var session3rd = this.data.session3rd;
    var signID = this.data.signID;
    var day = this.data.day;
    var color = this.data.color;
    var status = this.data.status;
    var path='';
    switch (color){
      case '1':
        console.log('t1')
        path= 'pages/task_detail/task_detail?id=' + signID + '&color=' + color;
        break;
      case '2':
        console.log('t2')
        path= 'pages/task_detail_two/task_detail?id=' + signID + '&color=' + color;
        break;
      case '3':
        console.log('t3')
        path= 'pages/task_detail_three/task_detail?id=' + signID + '&color=' + color;
        break;
      case '4':
        console.log('t4')
        path= 'pages/task_detail_four/task_detail?id=' + signID + '&color=' + color;
        break;
      default:
      console.log('index')
        path= 'pages/index/index';
    }
    console.log(color)
    console.log(signID)
    console.log(path)
    if (uploadimg == '') {
      wx.showModal({
        title: '提示',
        content: '请选择一张图片哦',
        showCancel: false,
      })
    }
     if (app.trim(value).length<1){
        that.setData({
          pcont: placeholder[index].cont
        })
      }else{
        that.setData({
          pcont: value,
        })
      }
    console.log(that.data.pcont)
    // 上传照片
    util.uploadimg1(that,uploadimg,(res)=>{
      var pcont = this.data.pcont;
      that.setData({
        disabled: true,
      })
      wx.showToast({
        title: '照片生成中',
        icon: 'loading',
        duration: 5000,
      })
      console.log(res.data)
      if (res.statusCode == 200) {
        request.requestGetUserImg(
          {
            session3rd: session3rd,
            signID: signID,
            imgid: res.data,
            cont: pcont,
            day:day,
            status: status,
            path: path,
          },
          (data) => {
            console.log(data)
            wx.showToast({
              title: '照片生成中',
              icon: 'loading',
              duration:0,
            })
            console.log('success')
            wx.redirectTo({
              url: '../share/share?url=' + data.url,
            })
          },
          (data) => {
            console.log('fail')
          }
        )
      } else {
        wx.showModal({
          title: '提示',
          content: '对不起，您上传的图片格式有误',
          showCancel: false,
        })
      }
    })
  },
})


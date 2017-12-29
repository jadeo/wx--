// pages/tuwen/tuwen.js
var app=getApp();
var request = require('../../request/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      originimg:'../../imgs/add_photo.png',
      uploadimg:'',
      cont:'',
      session3rd:'',
      privacy:0,
      fid:1,
      disabled:false,
      clock:1,
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
      },
      fail: function () {
        console.log('fail')
      }
    })
  },
  // 选择照片
  chooseImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        that.setData({
          uploadimg:res.tempFilePaths[0],
        })
      },
    })
  },

  // 输入文字
  mindInput:function(e){
    var cont=e.detail.value;
    this.setData({
      cont:cont,
    })
    console.log(this.data.cont)
  },
  
  // 发布
  relese:function(){
    var that = this;
    var session3rd=this.data.session3rd;
    var cont=this.data.cont;
    var fid=this.data.fid;
    var privacy = this.data.privacy;
    var img = this.data.img;
    var uploadimg = this.data.uploadimg;
    
    if (cont == '' && uploadimg.length < 1){
      wx.showModal({
        title: '提示',
        content: '图片和文字必须选一个哦',
        showCancel:false,
      })
    }
    // 有图片的
    if (uploadimg.length > 0){
      var that=this;
      wx.uploadFile({
        url: 'https://yj.suxcx.com/index.php?s=/w17/Yjuser/Yjfast/upload',
        filePath: uploadimg,
        name: 'file',
        success: function (res){
          console.log(res)
          that.setData({
            disabled:true,
          })
          wx.showToast({
            icon: 'loading',
            duration:3000,
          })
          if (res.statusCode==200){
            request.requestPunch(
              {
                  session3rd:session3rd,
                  fid: fid,
                  privacy: privacy,
                  cont: cont,
                  img: img,
              },
              (data) =>{
                console.log('success')
                console.log(data)
                that.setData({
                  clock: 0,
                })
                var clock=that.data.clock;
                console.log(clock)
                wx.redirectTo({
                  url: '../index/index?clock=' +clock,
                })
              },
              (data) =>{
                console.log('fail')
              }
            )
          }else{
            wx.showModal({
              title: '提示',
              content: '对不起，您上传的图片格式有误',
              showCancel:false,
            })
          }
        }
      })
    }else{
      // 没有图片
      that.setData({
        disabled: true,
      })
      wx.showToast({
        icon: 'loading',
        duration: 3000,
      })
      request.requestPunch(
        {
          session3rd: session3rd,
          fid: fid,
          privacy: privacy,
          cont: cont,
        },
        (data) => {
          console.log('success')
          console.log(data)
          that.setData({
            clock: 0,
          })
          var clock=that.data.clock;
          console.log(clock)
          wx.navigateTo({
            url: '..//index',
          })
        },
        (data) => {
          console.log('fail')
        }
      )
    }
    
  },


})

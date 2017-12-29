// pages/my/my.js
var app=getApp();
var request = require('../../request/request.js');
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    session3rd:'',
    start:10,
    size:10,
    headimg: '',
    username: '',
    use_medal:'',
    signlist:[],
    scrollHeight:'',
    loadingmore:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showToast({
      icon: 'loading',
      duration: 1000,
    })
    wx.getStorage({
      key: 'session',
      success: function (res) {
        that.setData({
          session3rd: res.data,
        })
        request.requestUsercenter({
          session3rd: res.data,
        }, (data) => {
          that.setData({
            headimg: data.fans.headimg,
            username: data.fans.nickname,
            use_medal: data.fans.use_medal,
            signlist: data.signlist,
          })

        }, (data) => {
          console.log('fail')
        })
      },
      fail: function () {
        app.wxLogin.call(that)
      }
    })

    util.onwork()
    util.getwork()
  },

  // 页面监听
  onShow:function(){
    var that=this;
    wx.getSystemInfo({    //页面显示获取设备屏幕高度，以适配scroll-view组件高度
      success: (res) => {
        that.setData({
          scrollHeight: res.windowHeight +200// rpx转px 屏幕宽度/750
        });
        console.log(that.data.scrollHeight)
      }
    })
    wx.getStorage({   //如果缓存中有 session3rd 取出给data赋值
      key: 'session',
      success: function (res) {    //缓存中  有session3rd
        console.log('onshow有session3rd')
        that.setData({
          session3rd: res.data
        })
        onmy.call(that)
      },
      fail: function () {    //如果缓存中  没有session3rd
        //请求 普通帖
        console.log('没有session3rd')
      }
    })
  },
  // 跳转到成就页面
  go_achievement:function(){
    wx.navigateTo({
      url: '../achievement/achievement',
    })
  },

  // 上拉加载
  lower:function(){
    var that=this;
    console.log('上拉加载')
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
    })
    my.call(that)
  },

  // 预览图片
  previewImage: function (e) {
    var previewImageArray = e.currentTarget.dataset.previewimgarray;
    var previewSrc = e.currentTarget.dataset.previewsrc;
    wx.previewImage({
      urls: previewImageArray,// 需要预览的图片http链接列表
      current: previewSrc
    })
  },
  // 跳转赞赏页面
  reward: function(){
    wx.navigateTo({
      url: '../reward/reward',
    })
  }
})




// 请求个人中心数据
function my(){
  var session3rd=this.data.session3rd;
  var start=this.data.start;
  var size = this.data.size;
  var signlist = this.data.signlist;
  var that=this;
  console.log(start)
  console.log(size)
  console.log(session3rd)
  request.requestUsercenter({
    session3rd:session3rd,
    start:start,
    size:size,
  },(data) =>{
    console.log(data)
    if (data.signlist != []){
      that.setData({
        start: start + size,
        headimg: data.fans.headimg,
        username: data.fans.nickname,
        use_medal: data.fans.use_medal,
        signlist: signlist.concat(data.signlist),
      })
    }else{
      that.setData({
        loadingmore:true,
      })
    }
  },(data) =>{
    console.log('fail')
  })
}

function onmy() {   
  var that = this;
  var session3rd = this.data.session3rd;
  var size = this.data.start;
  // console.log(size)
  request.requestUsercenter({
    session3rd: session3rd,
    size: size,
  }, (data) => {
    console.log(data)
    if (data.signlist != null) {
      that.setData({
        headimg: data.fans.headimg,
        username: data.fans.nickname,
        use_medal: data.fans.use_medal,
        signlist: data.signlist,
        loadingmore: false,
      })
    } else {
      that.setData({
        loadingmore: true,
      })
    }
  }, (data) => {
    console.log('fail')
  })
}
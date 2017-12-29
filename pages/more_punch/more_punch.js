//index.js
//获取应用实例
var app = getApp();
var request = require('../../request/request.js');
var util = require('../../utils/util.js')

Page({
  data: {
    session3rd: '',
    formId:'',
    item: {
      taskList: [],
      shouquan_hidden: true,
      task_hidden: false,    //是否有任务卡
      startX: "",
      delBtnWidth: 100,
      // txtStyle:"",
      color: '',
      id: '',
      scrollHeight: '',
      data: '',
      card: ['../../imgs/cardbg_011.png', '../../imgs/cardbg_022.png', '../../imgs/cardbg_033.png', '../../imgs/cardbg_044.png'],
      join_text: '已加入',
      join_text1: '加入',
      more_show:true,
      more_true:true,
      task_true:false,
    }

  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      formId: options.formId,
    })
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
        console.log(that.data.session3rd)
        task.call(that)
      },
      fail: function () {
        wxLogin.call(that);
      }
    })
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          screenWidth: res.screenWidth,
        })
      }
    })
    util.onwork()
    util.getwork()
  },



  // 页面监听
  onShow: function (options) {
    var that = this;
    console.log(options)
    console.log('页面监听')
    wx.getSystemInfo({    //页面显示获取设备屏幕高度，以适配scroll-view组件高度
      success: (res) => {
        that.setData({
          'item.scrollHeight': res.windowHeight - (res.windowWidth / 750) // rpx转px 屏幕宽度/750
        });
      }
    })
    wx.getStorage({   //如果缓存中有 session3rd 取出给data赋值
      key: 'session',
      success: function (res) {    //缓存中  有session3rd
        console.log('onshow有session3rd')
        that.setData({
          session3rd: res.data
        })
        task.call(that)
      },
      fail: function () {    //如果缓存中  没有session3rd
        //请求 普通帖
        console.log('没有session3rd')
        wxLogin.call(that);
      }
    })
  },
  // 跳转到打卡详情页面
  go_punch: function (e) {
    console.log(e)
    var color = e.currentTarget.dataset.color;
    console.log('颜色为' + color)
    var id = e.currentTarget.dataset.id;
    console.log('项目id为' + id)
    switch (color) {
      case '1':
        wx.navigateTo({
          url: '../task_detail/task_detail?id=' + id + '&color=' + color,
        })
        break;
      case '2':
        wx.navigateTo({
          url: '../task_detail_two/task_detail?id=' + id + '&color=' + color,
        })
        break;
      case '3':
        wx.navigateTo({
          url: '../task_detail_three/task_detail?id=' + id + '&color=' + color,
        })
        break;
      case '4':
        wx.navigateTo({
          url: '../task_detail_four/task_detail?id=' + id + '&color=' + color,
        })
        break;
    }

  },

});
//请求个人项目打卡列表
function task() {
  var that = this;
  var session3rd = this.data.session3rd;
  var cindex = this.data.cindex;
  var formId = this.data.formId;
  request.requestMore(
    {
      session3rd: session3rd,
      formId: formId,
    },
    (data) => {
      console.log(data)
      console.log('success')
      that.setData({
        'item.taskList': data,
      })
    },
    (data) => {
      console.log('fail')
    }
  )
}


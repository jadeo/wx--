//index.js
//获取应用实例
var app = getApp();
var request = require('../../request/request.js');
var util = require('../../utils/util.js')

Page({
  data: {
    session3rd: '',
    item:{
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
      task_true:true,
    }

  },
  onLoad: function () {
    var that=this;
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
      success:function(res){
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
  // 跳转发布页面
  go_relese:function(){
      wx.navigateTo({
        url: '../relese/relese',
      })
  },

  // 跳转到更多打卡
  more_punch:function(e){
    var formId=e.detail.formId;
    wx.navigateTo({
      url: '../more_punch/more_punch?formId=' + formId,
    })
  },
  // 跳转到打卡详情页面
  go_punch:function(e){
    console.log(e)
    var color = e.currentTarget.dataset.color;
    console.log('颜色为'+color)
    var id = e.currentTarget.dataset.id;
    console.log('项目id为' + id)
    switch (color){
        case '1':
        wx.navigateTo({
          url: '../task_detail/task_detail?id='+id+'&color='+color,
        })
        break;
        case '2':
           wx.navigateTo({
             url: '../task_detail_two/task_detail?id='+id+'&color='+color,
           })
        break;
        case '3':
           wx.navigateTo({
             url: '../task_detail_three/task_detail?id='+id+'&color='+color,
           })
        break;
        case '4':
           wx.navigateTo({
             url: '../task_detail_four/task_detail?id='+id+'&color='+color,
           })
        break;
    }
   
  },
  touchS: function (e) {
    console.log("touchS");
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        'item.startX': e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    console.log(e);
    var that = this
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = that.data.item.startX - moveX;
      var delBtnWidth = that.data.item.delBtnWidth;
      console.log(delBtnWidth)
      var txtStyle = "";
      if (disX <= 60 ) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      console.log(index)
      var list = that.data.item.taskList;
      console.log(list)
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        'item.taskList': list
      });
    }
  },
  touchE: function (e) {
    console.log("touchE");
    var that = this
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.item.startX - endX;
      var delBtnWidth = that.data.item.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = that.data.item.taskList;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      that.setData({
        'item.taskList': list
      });
    }
  },
  // 删除某一项
   delItem: function (e) {
     var that=this;
     var index = e.currentTarget.dataset.index;
     var newlist = this.data.item.taskList;
     var session3rd = this.data.session3rd;
     var fid = e.currentTarget.dataset.id;
     console.log(fid)
     console.log(index)
     wx.showModal({
       title: '',
       content: '是否删除',
       success:function(res){
          if(res.confirm){
            request.requestDel(
              {
                session3rd:session3rd,
                fid:fid,
              },(data) =>{
                newlist.splice(index, 1);
                that.setData({
                  'item.taskList': newlist,
                });
              },(data) =>{
                wx.showModal({
                  content: '对不起删除失败，请重试',
                  showCancel:false,
                })
              }
            )
           
          }
       }
     })
  },
  // 点击生成二维码
   new_code: function (e) {
     var index = e.currentTarget.dataset.index;
     var id = e.currentTarget.dataset.id;
     var session3rd = this.data.session3rd;
     var color = e.currentTarget.dataset.color;
     var day = this.data.item.taskList[index].day.tt_day;
    //  wx.showToast({
    //    title: '照片生成中',
    //    icon: 'loading',
    //  })
    //  switch (color) {
    //    case '1':
    //      request.requestGetCode({
    //        session3rd: session3rd,
    //        path: 'pages/task_detail/task_detail?id=' + id + '&color=' + color,
    //        signID: id,
    //      }, (data) => {
    //        console.log(data)
    //        wx.navigateTo({
    //          url: '../share/share?url=' + data,
    //        })
    //      }, (data) => {
    //        wx.showModal({
    //          content: '照片生成失败请重试',
    //        })
    //      })
    //      break;
    //    case '2':
    //      request.requestGetCode({
    //        session3rd: session3rd,
    //        path: 'pages/task_detail_two/task_detail?id=' + id + '&color=' + color,
    //        signID: id,
    //      }, (data) => {
    //        wx.navigateTo({
    //          url: '../share/share?url=' + data,
    //        })
    //      }, (data) => {
    //        wx.showModal({
    //          content: '照片生成失败请重试',
    //        })
    //      })
    //      break;
    //    case '3':
    //      request.requestGetCode({
    //        session3rd: session3rd,
    //        path: 'pages/task_detail_three/task_detail?id=' + id + '&color=' + color,
    //        signID: id,
    //      }, (data) => {
    //        wx.navigateTo({
    //          url: '../share/share?url=' + data,
    //        })
    //      }, (data) => {
    //        wx.showModal({
    //          content: '照片生成失败请重试',
    //        })
    //      })
    //      break;
    //    case '4':
    //      request.requestGetCode({
    //        session3rd: session3rd,
    //        path: 'pages/task_detail_four/task_detail?id=' + id + '&color=' + color,
    //        signID: id,
    //      }, (data) => {
    //        wx.navigateTo({
    //          url: '../share/share?url=' + data,
    //        })
    //      }, (data) => {
    //        wx.showModal({
    //          content: '照片生成失败请重试',
    //        })
    //      })
    //      break;
    //  }
    wx.navigateTo({
      url: '../share_select/share_select?fid='+id+ '&color='+color+'&day='+day,
    })
   }

});
//请求个人项目打卡列表
function task(){
  var that=this;
  var session3rd=this.data.session3rd;
  var cindex = this.data.cindex;
  request.requestSelfTask(
    {
      session3rd: session3rd,
    },
    (data) =>{
      console.log(data)
      console.log('success')
      that.setData({
        'item.taskList':data.list,
        'item.data':data,
      })
    },
    (data) =>{
      console.log('fail')
    }
  )
}


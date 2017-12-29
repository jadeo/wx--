// pages/punch/punch.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      punchday:20,
      targetday:30,
      weekday: ["日", "一", "二", "三", "四", "五", "六"],
      startday:'',
      day:[],
      status:'',
      week:'',
      txtStyle:'',
      bg:'',
      cl:'',
      bg1:'',
      cl1:'',
      value:'',
      ruleshow:false,
      starttime:'12:00',
      endtime:'13:50',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  wx.request({
    url: 'https://yj.suxcx.com/index.php?s=/w17/Yjuser/Yjfast/punchrecording',
    type:'get',
    success:function(res){
        console.log(res);
    },
    fail:function(){

    },
  })

    var that=this;
    var day=this.data.day;
    var weekday = this.data.weekday;
    var txtStyle = this.data.txtStyle;
      var week=new Date().getDay(); //5
      var nowday=new Date().getDate();  //8
      console.log(nowday)
      var nowweek = weekday[week]  
      console.log(nowweek)  //五
      that.setData({
        startday:nowday,
      })
      var value = this.data.value;
      var time = new Date();
      console.log(time)
      var hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
      var minute = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
      var thistime = hour + ':' + minute;
      var starttime = this.data.starttime;
      var endtime = this.data.endtime;
      this.time_range(starttime, endtime, thistime);
        switch(nowweek) {
        case '日':
            that.setData({
              day: [(nowday + 1), (nowday + 2), (nowday + 3), (nowday + 4), (nowday + 5), (nowday + 6)]
            });
        break;
        case '一':
            that.setData({
              day: [(nowday + 1), (nowday + 2), (nowday + 3), (nowday + 4), (nowday + 5)]
            });
        break;
        case '二':
            that.setData({
              day: [(nowday + 1), (nowday + 2), (nowday + 3), (nowday + 4)]
            });
        break;
        case '三':
            that.setData({
              day: [(nowday + 1), (nowday + 2), (nowday + 3)]
            });
        break;
        case '四':
            that.setData({
              day: [(nowday + 1), (nowday + 2)]
            });
        break;
        case '五':
            that.setData({
              day: [(nowday + 1)]
            });
        break;
        case '六':
            that.setData({
              day: []
            });
        break;
      }  
      switch (nowweek) {
        case '日':
          that.setData({
            txtStyle: 'margin-left:0rpx;'
          });
          break;
        case '一':
          that.setData({
            txtStyle: 'margin-left:100rpx;'
          });
          break;
        case '二':
          that.setData({
            txtStyle: 'margin-left:200rpx;'
          });
          break;
        case '三':
          that.setData({
            txtStyle: 'margin-left:300rpx;'
          });
          break;
        case '四':
          that.setData({
            txtStyle: 'margin-left:400rpx;'
          });
          break;
        case '五':
          that.setData({
            txtStyle:'margin-left:500rpx;'
          });
          break;
        case '六':
          that.setData({
            txtStyle: 'margin-left:600rpx;'
          });
          break;
      }  
      
  },
  punch:function(e){
    var nowday = new Date().getDate();  //8
    var startday = this.data.startday;
    var day=this.data.day;
    var value=this.data.value;
    if (nowday == startday && value=='打卡' ){
      this.setData({
        bg: 'background:red;',
        cl: 'color:#fff;'
      })
    }
  },

  // 判断是否在打卡时间内
  time_range:function(beginTime, endTime, nowTime) {
    var that= this;
    var bg1 = this.data.bg1;
    var cl1 = this.data.cl1;
    var value = this.data.value;
    var strb = beginTime.split(":");
    if(strb.length != 2) {
      return false;
    }

  var stre = endTime.split(":");
    if(stre.length != 2) {
      return false;
    }

  var strn = nowTime.split(":");
    if(stre.length != 2) {
      return false;
    }
   var b = new Date();
    var e = new Date();
    var n = new Date();

    b.setHours(strb[0]);
    b.setMinutes(strb[1]);
    e.setHours(stre[0]);
    e.setMinutes(stre[1]);
    n.setHours(strn[0]);
    n.setMinutes(strn[1]);

    if(n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
      console.log("当前时间是：" + n.getHours() + ":" + n.getMinutes() + "，在打卡范围内！");
      that.setData({
        value: '打卡',
      })
      console.log(that.data.value)
    } else {
      console.log("当前时间是：" + n.getHours() + ":" + n.getMinutes() + "，不在打卡范围内！");
      that.setData({
        value: '未在打卡时间',
        bg1: 'background:#ccc;',
        cl1: 'color:#fff',
      })
      console.log(that.data.value)
    return false;
    }
  },
  // 打卡规则
  rule: function () {
    var that = this;
    var ruleshow = this.data.ruleshow;
    if (ruleshow == false) {
      that.setData({
        ruleshow: true,
      })
    } else {
      that.setData({
        ruleshow: false,
      })
    }
  },
  // 打卡设置
  set: function () {
    wx.navigateTo({
      url: '../punch_set/punch_set',
    })
  },

  // 打卡记录
  punch_record:function(){
    wx.navigateTo({
      url: '../punch_record/punch_record',
    })
  },

  //跳转到排行榜
  ranking_list: function () {
    wx.navigateTo({
      url: '../ranking/ranking',
    })
  },
  
  // 邀请好友
  onShareAppMessage: function () {
    return {
      title: '每日瑜伽',
      // path: '/pages/index/index'
    }
  },

  // 分享成就
  share:function(){
    wx.redirectTo({
      url: '../share/share',
    })
  },
})

//index.js
//获取应用实例
var app = getApp();
var utils = require('../../utils/util.js');
var request = require('../../request/request.js');

Page({
  data: {
    session3rd: '',
    hidden: true,
    pro_start: '',
    pro_end: '',
    day_start: '08:00',
    day_end: '18:00',
    free_hidden: true,
    warn_check: true,
    tuwen_check: false,
    privacy_check: false,
    warn_hidden: false, 
    money_hidden: true,
    money: [2, 5, 10, 15, 20,50],
    money_reset: 2,
    is_disabled:false,
    title:'',
    rule:"",
    img_txt:'',
    ts:1,
    privacy:'',
    timestart:'20:00',
    select_show:true,      //  全天任意时间上的选中状态
    icon_show:true,        //自定义时间的选中状态
    allday_checked:false,  //全天任意时间的圆圈选中
    free_checked: false,    //自定义时间的圆圈选中
    radio_group: [
      { name: '一周', value: '一周' },
      { name: '21天', value: '21天',  },
      { name: '一个月', value: '一个月', checked:'true' },
      { name: '不限时间', value: '不限时间' },
      { name: '自定义', value: '自定义' },
    ],
    mask_show:true,
    exist:true,
    title:'',
    id:'',
    color:'',
  },
  onLoad: function () {
    var that = this;
    var time = new Date();
    var newTime=addTime(30)
    that.setData({
      pro_start: time_guige(time),
      pro_end: time_guige(newTime),
      select_show: false,
      icon_show: true,
      allday_checked: true,
      free_checked: false,
      free_hidden: true,
      day_start: '00:00',
      day_end: '23:59',
      tuwen_check:true,
      img_txt:1,
    })
    wx.getStorage({
      key: 'session',
      success: function (res) {
        console.log(res)
        that.setData({
          session3rd: res.data,
        })
      },
      fail: function () {
        app.wxLogin.call(that)
      },
    })
  },
  // 登录
  getlogin: function () {
    // var that=this;
    getLoginAgain()
  },
  

 
  // 设置打卡持续时间
  radioChange:function(e){
      console.log(e)
      let value = e.detail.value;
      let time=new Date();
      let newTime1 = addTime(6);
      let newTime2 = addTime(20);
      let newTime3 = addTime(29);
      let newTime4 = addTime(7336);
      switch (value){
        case '一周':
            this.setData({
              pro_start:time_guige(time),
              pro_end: time_guige(newTime1),
              free_hidden: true,
            })
        break;
        case '21天':
          this.setData({
            pro_start: time_guige(time),
            pro_end: time_guige(newTime2),
            free_hidden: true,
          })
          break;
        case '一个月':
          this.setData({
            pro_start: time_guige(time),
            pro_end: time_guige(newTime3),
            free_hidden: true,
          })
          break;
        case '不限时间':
          this.setData({
            pro_start: time_guige(time),
            pro_end: time_guige(newTime4),
            free_hidden: true,
          })
          break;
        case '自定义':
          this.setData({
            free_hidden:false,
          })
          break;
      }
  },

  // 设置项目开始时间
  bindDateChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var pro_end=new Date(this.data.pro_end).getTime();
    var pro_start=new Date(e.detail.value).getTime();
    if (pro_start > pro_end){
        wx.showModal({
          title: '提示',
          content: '开始时间不得大于结束时间',
          showCancel:false,
        })
    }else{
      this.setData({
        pro_start: e.detail.value
      })
    }
  },
  // 设置项目结束时间
  bindDateChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var pro_end=e.detail.value;
    var pro_endd = new Date(pro_end)
    var pro_endd_secord = pro_endd.getTime();
    console.log(pro_endd_secord)
    var pro_start=this.data.pro_start;
    var pro_startt = new Date(pro_start);
    var pro_startt_second = pro_startt.getTime();
    if (pro_startt_second > pro_endd_secord){
       wx.showModal({
         title: '提示',
         content: '结束时间不得小于开始时间',
         showCancel:false,
       })
    }else{
    this.setData({
      pro_end: e.detail.value
    })
    }

    // if(){

    // }
  },
  // 打卡提醒结束时间
  bindTimeChange3:function(e){
      this.setData({
        timestart:e.detail.value,
      })
  },
  // 开启打卡提醒
  switch1Change: function () {
    var warn_hidden = this.data.warn_hidden;
    var warn_check = this.data.warn_check;
    var ts = this.data.ts;
    if (warn_hidden == true) {
      this.setData({
        warn_hidden: false,
      })
    } else {
      this.setData({
        warn_hidden: true,
      })
    }
    if (!warn_check){
      this.setData({
        warn_check: true,
        ts:1,
      })
    }else{
      this.setData({
        warn_check: false,
        ts: 0,
      })
    }
    console.log(this.data.ts)
    console.log(this.data.warn_check)
  },
  // 开启图文打卡
  switch2Change:function(){
      var tuwen_check=this.data.tuwen_check;
      var img_txt = this.data.img_txt;
      if (!tuwen_check){
        this.setData(
          {
            tuwen_check:true,
            img_txt:1
          }
        )
      }else{
        this.setData({
          tuwen_check: false,
          img_txt: 0,
        })
      }
  },

  // 开启隐私打卡
    // switch3Change:function(){
    //   var privacy_check = this.data.privacy_check;
    //   var privacy = this.data.privacy;
    //   if (!privacy_check) {
    //     this.setData(
    //       {
    //         privacy_check: true,
    //         privacy: 1
    //       }
    //     )
    //   } else {
    //     this.setData({
    //       privacy_check: false,
    //       privacy: 0,
    //     })
    //   }
    //   console.log(this.data.privacy_check)
    //   console.log(this.data.privacy)
    // },

  // 开启付费
  // switch4Change: function () {
  //   var money_hidden = this.data.money_hidden;
  //   if (money_hidden == true) {
  //     this.setData({
  //       money_hidden: false,
  //     })
  //   } else {
  //     this.setData({
  //       money_hidden: true,
  //     })
  //   }
  // },
  // // 选择数额
  // select_money: function (e) {
  //   console.log(e)
  //   var value = e.target.dataset.value;
  //   this.setData({
  //     money_reset: value,
  //   })
  // },

  // 得到输入的标题
  getTitle:function(e){
      var title=e.detail.value;
      this.setData({
        title:title,
      })
  },
  // 得到输入的规则
  getRule: function (e) {
    var rule = e.detail.value;
    this.setData({
      rule: rule,
    })
  },
  
  // 设置每天打卡时间
  // 1.全天任意时间
  allday:function(){
      var that=this;
      that.setData({
        select_show:false,
        icon_show:true,
        allday_checked:true,
        free_checked:false,
        free_hidden: true,
        day_start:'00:00',
        day_end:'23:59',
      })
  },
  // 2.自定义
  free:function(){
      var that=this;
      that.setData({
        select_show: true,
        icon_show:false,
        allday_checked: false,
        free_checked: true,
        free_hidden: false,
      })
  },
  // 自定义开始时间
  bindTimeChange1: function (e) {
    this.setData({
      day_start: e.detail.value,
    })
  },
  // 自定义结束时间
  bindTimeChange2: function (e) {
    this.setData({
      day_end: e.detail.value,
    })
  },

// 付费模式暂未开通
  money_warn:function(){
    wx.showModal({
      title: '提示',
      content: '对不起此功能暂未开通',
      showCancel:false,
    })
  },

  // 点击确定按钮发布
  relese:function(e){
    var formid=e.detail.formId;
    var session3rd = this.data.session3rd;
    var title = this.data.title;
    var system = this.data.rule;
    var pro_start = this.data.pro_start;
    var pro_end = this.data.pro_end;
    var day_start = this.data.day_start;
    var day_end = this.data.day_end;
    var img_txt = this.data.img_txt;
    var ts = this.data.ts;
    var status = this.data.status;
    console.log(pro_start)
    console.log(pro_end)
    var privacy = this.data.privacy;
    var ctime = this.data.timestart;
    if (app.trim(title).length<=0){
        wx.showModal({
          title: '提示',
          content: '请把信息填写完整',
          showCancel:false,
        })
    }else{
      request.requestAddContent({
        session3rd: session3rd,
        title: title,
        system: system,
        pro_start: pro_start,
        pro_end: pro_end,
        ctime: ctime,
        formid: formid,
      }, (data) => {
        console.log(data)
        if (data.msg =='Already exist'){
         this.setData({
           mask_show:false,
           exist:false,
           title1: data.title,
           id:data.id,
           color:data.color,
         })
        }else{
          this.setData({
            is_disabled: true,
          })
          wx.switchTab({
            url: '../task/task?system=' + system,
          })
        }
      }, (data) => {
        console.log('发布失败')
      })
    }
   
  },

  // 立即加入已有项目
  join_exist: function () {
    var id = this.data.id;
    var color=this.data.color;
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

  // 继续创建
  con_new:function(e){
    console.log(e)
    var formid = e.detail.formId;
    var session3rd = this.data.session3rd;
    var title = this.data.title;
    var system = this.data.rule;
    var pro_start = this.data.pro_start;
    var pro_end = this.data.pro_end;
    var day_start = this.data.day_start;
    var day_end = this.data.day_end;
    var img_txt = this.data.img_txt;
    var ts = this.data.ts;
    var status = this.data.status;
    console.log(pro_start)
    console.log(pro_end)
    var privacy = this.data.privacy;
    var ctime = this.data.timestart;
    request.requestAddContent({
      session3rd: session3rd,
      title: title,
      system: system,
      pro_start: pro_start,
      pro_end: pro_end,
      ctime: ctime,
      formid: formid,
      state:1,
    }, (data) => {
      console.log(data)
        this.setData({
          is_disabled: true,
        })
        wx.switchTab({
          url: '../task/task?system=' + system,
        })
    }, (data) => {
      console.log('发布失败')
    })
  },
});

function addTime(num){
  let time = new Date();
  let time_secord = time.getTime();
  const second = 86400000 * num;
  let time2222 = time_secord + second;
  let newTime = new Date(time2222)
  return newTime
  
}


function time_guige(time){
  var year = time.getFullYear();
  var month = time.getMonth() + 1 < 10 ? '0' + parseInt(time.getMonth() + 1) : parseInt(time.getMonth() + 1);
  var date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
  var hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
  var minute = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
  var thisdate = year + '-' + month + '-' + date;
  return thisdate
}

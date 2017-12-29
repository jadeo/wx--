// pages/punch_set/punch_set.js
var request = require('../../request/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    session3rd:'',
    formid:'',
    item:{
      warn_hidden:false,
      warn_check:true,
      text_check:false,
      ys_check:false,
      timestart:'20:00',
      fid:'',
      img_txt:'',
      ts: 1,
      privacy:'',
      btn_wrap_hidden1: false,
      btn_wrap_hidden2: true,
      btn_wrap_hidden3: true,
      is_disabled:false,
      btn_wrap_hidden2: true,
      btn_wrap_hidden3: true,
      is_disabled:false,
      color:'',
      system:'',
      ps:'',
      pe:'',
      ds:'00:00',
      de:'23:59',
      free_hidden:true,
      select_show:false,
      icon_show:true,
      allday_checked:true,
      free_checked:false,
      day_start:'00:00',
      day_end:'23:59',
      is_admin:false,
      formId:'',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log(options)
    var timestart = this.data.item.timestart;
    var ds = this.data.item.ds;
    var de=this.data.item.de;
    if (!options.system==''){
      that.setData({
        'item.system': options.system, 
      })
    }
    if (options.ds!=='null'){
      that.setData(
       {
          'item.allday_checked': false,
          'item.free_checked': true,
          'item.free_hidden': false, 
          'item.day_start': options.ds,
          'item.day_end': options.de,
        }
      )
    }else{
      that.setData({
        'item.allday_checked': true,
        'item.free_checked': false,
        'item.free_hidden': true,
        'item.day_start': this.data.item.ds,
        'item.day_end': this.data.item.de,
      })
    }
    that.setData({
      'item.img_txt': options.img_txt,
      'item.privacy': options.privacy,
      'item.ts': options.ts,
      'item.fid': options.fid,
      'item.color': options.color,
      'item.timestart': (options.ctime != 'null' && options.ctime != "undefined") ? options.ctime : timestart,
      'item.ps':options.ps,
      'item.pe': options.pe,
      'item.ds': (options.ds != 'null' && options.ds != "") ? options.ds : ds,
      'item.de': (options.de != 'null' && options.de != "") ? options.de : de,
      'item.is_admin': options.admin,
      'item.formId':options.formId,
    })

    console.log(that.data.item.timestart)
    wx.getStorage({
      key: 'session',
      success: function (res) {
        that.setData({
          session3rd: res.data,
        })
        console.log(that.data.session3rd)
      },
      fail: function () {
      },
    })
    var ts = that.data.item.ts;
    var img_txt = that.data.item.img_txt;
    var privacy = that.data.item.privacy;
    if (ts == 0) {
      that.setData({
        'item.warn_check': false,
        'item.warn_hidden':true,
      })
    }
    if (ts == 1) {
      that.setData({
        'item.warn_check': true,
        'item.warn_hidden':false,
      })
    }
    if (img_txt == 0) {
      that.setData({
        'item.text_check': false,
      })
    }
    if (img_txt == 1) {
      that.setData({
        'item.text_check': true,
      })
    }
    if (privacy == 0) {
      that.setData({
        'item.ys_check': false,
      })
    }
    if (privacy == 1) {
      that.setData({
        'item.ys_check': true,
      })
    }


  },

  // 自定义时间
  free:function(){
    this.setData({
      'item.icon_show': false,
      'item.free_checked':true,
      'item.free_hidden': false,
      'item.select_show': true,
      'item.allday_checked': false,
    })
  },
  allday:function(){
    this.setData({
      'item.icon_show': true,
      'item.free_checked': false,
      'item.select_show': false,
      'item.allday_checked': true,
      'item.free_hidden': true,
      'item.day_start': '00:00',
      'item.day_end': '23:00',
    })
  },
  // 开启打卡提醒
  switch1Change: function (e) {
    console.log(e)
    var warn_check=this.data.item.warn_check;
    if (warn_check==true){
        this.setData({
          'item.ts':0,
          'item.warn_check':false,
        })
    }else{
      this.setData({
        'item.ts': 1,
        'item.warn_check': true,
      })
    }
    
    console.log(this.data.item.warn_check)
    console.log(this.data.item.ts)

    var warn_hidden = this.data.item.warn_hidden;
    if (warn_hidden == true) {
      this.setData({
        'item.warn_hidden': false,
      })
    } else {
      this.setData({
        'item.warn_hidden': true,
      })
    }
  },
  //每天打卡时间
  bindTimeChange1: function (e) {
    this.setData({
      'item.day_start': e.detail.value,
    })
  },
  bindTimeChange2: function (e) {
    this.setData({
      'item.day_end': e.detail.value,
    })
  },

  // 每天打卡提醒时间
  bindWarnChange1:function(e){
    this.setData({
      'item.timestart': e.detail.value,
    })
  },
  // 是否开启图文打卡
  switch2Change:function(){
    var text_check = this.data.item.text_check;
    var img_txt = this.data.item.img_txt;
    if (text_check == true) {
      this.setData({
        'item.img_txt': 0,
        'item.text_check': false,
      })
    } else {
      this.setData({
        'item.img_txt': 1,
        'item.text_check': true,
      })
    }
    
    console.log(this.data.item.text_check)
    console.log(this.data.item.img_txt)

  },
  
  // 是否开启隐私打卡
  switch3Change:function(){
    var ys_check = this.data.item.ys_check;
    if (ys_check == true) {
      this.setData({
        'item.privacy': 0,
        'item.ys_check': false,
      })
    } else {
      this.setData({
        'item.privacy': 1,
        'item.ys_check': true,
      })
    }
    console.log(this.data.item.ys_check)
    console.log(this.data.item.privacy)
  },

  // 点击保存
  save:function(e){
    var that=this;
    var formid=e.detail.formId;
    console.log(e)
    console.log('formid为'+formid)
    var session3rd=this.data.session3rd;
    var ts_time = this.data.item.timestart;
    var fid = this.data.item.fid;
    var img_txt = this.data.item.img_txt;
    var privacy = this.data.item.privacy;
    var ts = this.data.item.ts;
    var color = this.data.item.color;
    var day_start = this.data.item.day_start;
    var day_end = this.data.item.day_end;
    console.log(day_start)
    console.log(day_end)
    console.log(ts_time)
    request.requestPunchSet({
      session3rd:session3rd,
      fid: fid,
      img_txt: img_txt,
      ts: ts,
      ts_time: ts_time,
      formid: formid,
      day_start: day_start,
      day_end: day_end,
    }, (data) => {
      console.log(data)
      that.setData({
        'item.is_disabled':true,
      })
      wx.showToast({
        icon:'success',
        title:'保存成功',
        duration:1000,
      })
      switch (color) {
        case '1':
          wx.redirectTo({
            url: '../task_detail/task_detail?id=' + fid + '&color=' + color,
          })
          break;
        case '2':
          wx.redirectTo({
            url: '../task_detail_two/task_detail?id=' + fid + '&color=' + color,
          })
          break;
        case '3':
          wx.redirectTo({
            url: '../task_detail_three/task_detail?id=' + fid + '&color=' + color,
          })
          break;
        case '4':
          wx.redirectTo({
            url: '../task_detail_four/task_detail?id=' + fid + '&color=' + color,
          })
          break;
          default:
          wx.switchTab({
            url: '../index/index',
          })
          break;
      }
                                                                                                           
    },
    (data) =>{
      wx.showModal({
        title: '提示',
        content: '保存失败，请重试',
        showCancel:true,
      })
    }
    )
  },
})

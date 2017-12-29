// pages/index/index.js
var request = require('../../request/request.js');
var app = getApp();
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    session3rd: '',
    cdata_id: '',
    cdata_uid: '',
    rdata_id: '',
    rdata_uid: '',
    formid: '',
    commentList: [],
    rever_win_show: false,  //评论框是否出现
    reply_win_show: false,   //回复框是否出现
    rever_index: '',       //回复的是哪一个人
    pin_index:'',
    tindex:'',
    start:10,
    pagesize:10,
    scrollHeight:'',
    images:'',
    loadingmore:true,
    item: {
      originimg: '../../imgs/add_photo.png',
      uploadimg: [],
      cont: '',
      privacy: 0,
      disabled: false,
      clock: 1,
      tuwen_show: false,
      item2: '',
      punchday: '',    //已打卡的天数
      targetday: '',   //目标天数
      dotted_left: 0,
      card_name: '',  //打卡项目名字
      weekday: ["日", "一", "二", "三", "四", "五", "六"],
      startday: '',
      day_date: '',
      comment: '',        //图文发布的内容
      ctime: '',         //图文发布的时间
      img_txt: '',         //是否开启图文打卡
      ts: '',
      fid: '',             //项目id
      rever_cont: '',      //评论内容
      status: '',
      week: '',
      txtStyle: '',
      bg: '',
      cl: '',
      bg1: '',
      cl1: '',
      value: '',
      ruleshow: false,
      starttime: '',
      endtime: '',
      punch_num: 4,
      mask_show: true,     //遮罩是否出现
      mask_show1: true,     //遮罩是否出现
      mask_show2: true,     //遮罩是否出现
      mask_show3: true,     //遮罩是否出现
      success_punch_show: true,  //打卡成功弹窗
      timer: null,
      bg: '../../imgs/circle_bg02.png',
      active1: '',
      active2: '',
      statusgift: 1,        //领取奖品的状态
      status: 2,       //图文打卡的状态
      nopunch_time: false,   //是否在打卡时间
      is_msg: '',                //新消息
      join_punch: false,          //参与打卡
      detail: '',
      privacy: 0,               //是否开启隐私打卡
      is_clock: '',
      is_participate: '',
      from_uid: '',          //来自谁id
      to_uid: '',            //指向谁id
      list_id: '',           //被点赞信息id
      screenWidth: '',     //屏幕宽度
      color:"",
      medal_show:true,
      medal:'',
      rule1_show:true,
      total_text: '累计',
      num_plan: 1,
      dotted_hidden: '',
      punch_show:true,
      gift_show: true,
      lei: '累计',
      gf_success_hidden: true,

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    var fid = options.id;
    var start=this.data.start;
    var pagesize=this.data.pagesize;
    that.setData({
      'item.fid': fid,
      'item.color':options.color,
    })
    wx.showToast({
      icon: 'loading',
      duration: 1000,
    })
    var fid=this.data.item.fid;
    wx.getStorage({
      key: 'session',
      success: function (res) {
        that.setData({
          session3rd: res.data,
        })
        console.log(that.data.session3rd)
        punch_detail.call(that)
        request.requestCircle({
          session3rd: res.data,
          fid: fid,
        }, (data) => {
          console.log(data)
          if (data.comment !== null) {
            that.setData({
              commentList: data.comment,
            })
          }
        }, (data) => {
          console.log('fail')
        })

      },
      fail: function () {
        wxLogin.call(that);
      }
    })

    // 获取屏幕的宽度
    wx.getSystemInfo({
      success: function (res) {
        var screenWidth = res.screenWidth;
        that.setData({
          'item.screenWidth': screenWidth
        })
      }
    })
    util.onwork()
    util.getwork()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  // 点击我知道了
  know: function () {
    var that = this;
    that.setData({
      'item.punch_show': true,
      'item.mask_show': true,
    })
  },
  // 去官方打卡
  punch_good: function () {
    var that = this;
    wx.switchTab({
      url: '../index/index',
    })
  },
  // 查看全部参与头像
  headimg_go: function () {
    var fid = this.data.item.fid;
    wx.navigateTo({
      url: '../join/join?id=' + fid,
    })
  },
  // 页面监听
  onShow: function () {
    var that = this;
    var scrollHeight = this.data.scrollHeight;
    console.log('页面监听')
    wx.getStorage({   //如果缓存中有 session3rd 取出给data赋值
      key: 'session',
      success: function (res) {    //缓存中  有session3rd
        console.log('onshow有session3rd')
        that.setData({
          session3rd: res.data
        })
        punch_detail.call(that)
        tuwen_detail_listen.call(that)
      },
      fail: function () {    //如果缓存中  没有session3rd
        //请求 普通帖
        console.log('没有session3rd')
        wxLogin.call(that);
      }
    })
    util.scrollHeight(that, scrollHeight)
    console.log(that.data.scrollHeight)
  },

  // 预览图片
  previewImage: function (e) {
    var previewImageArray = e.currentTarget.dataset.previewimgarray;
    var previewSrc = e.currentTarget.dataset.previewsrc
    util.previewImage(previewSrc, previewImageArray)
  },
  // 打卡规则
  rule: function () {
    var that = this;
    that.setData({
      'item.rule1_show': false,
      'item.mask_show': false,
    })
  },
  // 打卡设置
  punch_set: function () {
    var img_txt = this.data.item.img_txt;      //是否开启图文打卡
    var privacy = this.data.item.privacy;      //是否开启图文打卡
    var ts = this.data.item.ts;      //是否开启图文打卡
    var fid = this.data.item.fid;
    var color = this.data.item.color;
    var ctime = this.data.item.detail.set_up.ctime;
    var is_participate = this.data.item.is_participate;
    var system = this.data.item.detail.punchinfo.system;
    var ps = this.data.item.detail.punchinfo.pro_start;
    var pe = this.data.item.detail.punchinfo.pro_end;
    var ds = this.data.item.detail.punchinfo.day_start;
    var de = this.data.item.detail.punchinfo.day_end;
    var is_admin = this.data.item.detail.set_up.is_admin;
    if (is_participate == 0) {
      //todo 提示不可以设置
      wx.showModal({
        title: '提示',
        content: '你需要参与项目',
      })
    } else {
      wx.redirectTo({
        url: '../punch_set/punch_set?img_txt=' + img_txt + '&privacy=' + privacy + '&ts=' + ts + '&fid=' + fid + '&ctime=' + ctime + '&color=' + color + '&system=' + system + '&ps=' + ps + '&pe=' + pe + '&ds=' + ds + '&de=' + de + '&admin=' + is_admin,
      })
    }
  },
  // 打卡记录
  punch_record: function (e) {
    console.log(e)
    var fid = this.data.item.fid;
    var formId = e.detail.formId;
    wx.navigateTo({
      url: '../punch_record/punch_record?fid=' + fid + '&formId=' + formId,
    })
  },

  // 排行榜
  ranking_list: function () {
    var fid=this.data.item.fid;
    wx.navigateTo({
      url: '../ranking/ranking?id='+fid,
    })
  },
  // 发布图文动态
  tuwen_relese: function () {
    var that = this;
    that.setData({
      'item.tuwen_show': true,
    })
  },
  // 取消发布
  relese_cancle: function () {
    var that = this;
    that.setData({
      'item.tuwen_show': false,
      'item.mask_show': true,
      'item.uploadimg': [],
    })
  },
  // 邀请好友
  onShareAppMessage: function () {
    var id = this.data.item.fid;
    var color=this.data.item.color;
    var title = this.data.item.detail.punchinfo.title;
    return {
      title: title,
      path: 'pages/task_detail_three/task_detail?id=' + id + '&color=' + color,
    }
  },
  // 分享成就
  // share: function () {
  //   var id = this.data.item.detail.punchinfo.id;
  //   var session3rd = this.data.session3rd;
  //   var color = this.data.item.color;
  //   var path = 'pages/task_detail_three/task_detail?id=' + id + '&color=' + color;
  //   var url = '../share/share?url=';
  //   util.show_model(session3rd, path, id, url, color)
  // },
  share: function () {
    var fid = this.data.item.fid;
    var day = this.data.item.detail.user_punch.tt_day;
    var color = this.data.item.detail.punchinfo.color;
    wx.navigateTo({
      url: '../share_select/share_select?fid=' + fid + '&day=' + day + '&color=' + color,
    })
  },
  // 有新的消息
  go_news: function () {
    var fid = this.data.item.fid;
    wx.navigateTo({
      url: '../newlist/newlist?id=' + fid,
    })
  },
  // 评论
  rever: function (e) {
    var that = this;
    console.log(e)
    var data_id = e.currentTarget.dataset.id;
    var data_uid = e.currentTarget.dataset.uid;
    var pin_index = e.currentTarget.dataset.index;
    console.log(pin_index)
    that.setData({
      'rever_win_show': true,
      'item.mask_show': false,
      'cdata_id': data_id,
      'cdata_uid': data_uid,
      pin_index: pin_index,
    })
  },
  // 获取评论内容
  rever_text: function (e) {
    var cont = e.detail.value;
    console.log(cont)
    this.setData({
      'item.rever_cont': cont,
    })
  },
  // 获取回复内容
  reply_text: function (e) {
    var cont = e.detail.value;
    console.log(cont)
    this.setData({
      'item.reply_cont': cont,
    })
  },
  // 取消评论
  rever_canle: function () {
    this.setData({
      'rever_win_show': false,
      'item.mask_show': true,
      'item.rever_cont': '',
    })
  },
  // 确认评论
  rever_sure: function (e) {
    console.log(e)
    this.setData({
      'rever_win_show': false,
      'item.mask_show': true,
    })
    var that=this;
    var data_id = this.data.cdata_id;
    var data_uid = this.data.cdata_uid;
    var session3rd = this.data.session3rd;
    var pin_index = this.data.pin_index;
    console.log(pin_index)
    var cont = this.data.item.rever_cont;
    var commentList = this.data.commentList;
    util.rever_sure(that, cont, session3rd, data_uid, data_id, commentList, pin_index)
  },
  // 回复
  reply: function (e) {
    var data_id = e.currentTarget.dataset.id;
    var data_uid = e.currentTarget.dataset.uid;
    var index = e.currentTarget.dataset.index;
    var tindex = e.currentTarget.dataset.tindex;
    this.setData({
      'reply_win_show': true,
      'item.mask_show': false,
      'rdata_id': data_id,
      'rdata_uid': data_uid,
      rever_index: index,       
      tindex: tindex,       

    })
  },
  // 取消回复
  reply_canle: function () {
    this.setData({
      'reply_win_show': false,
      'item.mask_show': true,
    })
  },
  // 确认回复
  reply_sure: function (e) {
    this.setData({
      'reply_win_show': false,
      'item.mask_show': true,
      'item.reply_cont': "",
    })
    var that=this;
    var cont = this.data.item.reply_cont;
    var to_uid = this.data.rdata_uid;
    var list_id = this.data.rdata_id;
    var session3rd = this.data.session3rd;
    var tindex = this.data.tindex;
    var commentList = this.data.commentList;
    var formId=e.detail.formId;
    util.reply_sure(that, cont, session3rd, to_uid, list_id, commentList, tindex, formId)
  },
  
  // 点击打卡
  punch: function (e) {
    var that = this;
    console.log(e)
    that.setData({
      formid: e.detail.formId,
    })
    var session3rd = this.data.session3rd;
    var nowday = new Date().getDate();  //当前号 privacy
    var img_txt = this.data.item.img_txt;      //是否开启图文打卡
    var statusgift = this.data.item.statusgift;
    var fid = this.data.item.fid;
    var src = e.currentTarget.dataset.src;
    var timer = this.data.item.timer;
    var privacy = this.data.item.privacy;
    var is_clock = this.data.item.is_clock;
    var punchday = this.data.item.punchday;
    var nowpunchday = punchday++;
    var overdue = this.data.item.detail.overdue;
    var statusgift = this.data.item.detail.is_gift;
    var nopunch_time = this.data.item.nopunch_time;
    var is_participate = this.data.item.is_participate;
    var formid = e.detail.formId;
    var item2 = this.data.item.detail.date[1].day;    //本周的开始日期
    var i = (nowday - item2) + 1;              //时间的间隔
    var time = new Date();
    var beginTime = that.data.item.starttime;
    var endTime = that.data.item.endtime;
    var hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    var minute = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    var nowTime = hour + ':' + minute;
    var pro = this.data.item.detail.punchinfo.pro_start;
    var ped = this.data.item.detail.punchinfo.pro_end;
    console.log(pro)
    console.log(ped)
    util.punch1(that, is_participate, beginTime, endTime, nowTime, session3rd, fid, formid, is_clock, overdue, nopunch_time, img_txt, punchday, i, nowday, pro, ped, function () {
      punch_detail.call(that)
    })
  },

  // 点击遮罩时打卡弹窗消失
  success_punch_mask: function () {
    var mask_show = this.data.item.mask_show;
    this.setData({
      'item.success_punch_show': true,
      'item.mask_show': true,
      'item.tuwen_show': false,
      'reply_win_show': false,
      'rever_win_show': false,
      'item.medal_show':true,
      'item.rule1_show':true,
      'item.punch_show': true,
      'item.medal_show':true,
    })
  },

  rule_sure: function () {
    var that = this;
    that.setData({
      'item.rule1_show': true,
      'item.mask_show': true,
    })
  },

  // 点赞
  imgHeart: function (e) {
    var that = this;
    var commentList = this.data.commentList;           //获取图文列表
    console.log(commentList)
    var currentIndex = e.currentTarget.dataset.index;   //当前图文的下标
    var from_uid = this.data.session3rd;        //来自谁ID
    var to_uid = commentList[currentIndex].uid;            //指向谁ID
    var list_id = commentList[currentIndex].id;          //被点赞信息ID
    var heart_num = parseFloat(commentList[currentIndex].heart_num)
    let formId = e.detail.formId;
    util.imgheart(that, commentList, currentIndex, heart_num, from_uid, to_uid, list_id, formId)
  },
  // 选择照片
  chooseImg: function () {
    var that = this;
    var count = 9;
    var addImg = this.data.item.uploadimg;
    util.chooseImg(that, count, addImg)
  },

  del_img: function (e) {
    var that = this;
    var imgs = this.data.item.uploadimg;
    var cindex = e.currentTarget.dataset.index;
    imgs.splice(cindex, 1);
    that.setData({
      'item.uploadimg': imgs,
    })
  },

  // 输入文字
  mindInput: function (e) {
    var cont = e.detail.value;
    this.setData({
      'item.cont': cont,
    })
  },

  // 发布
  relese: function (e) {
    console.log(e)
    var that = this;
    var session3rd = this.data.session3rd;
    var cont = this.data.item.cont;
    var fid = this.data.item.fid;
    var uploadimg = this.data.item.uploadimg;
    var images = this.data.images;
    var filePath = this.data.item.uploadimg;
    var tt_day = this.data.item.detail.user_punch.tt_day;
    var formId=e.detail.formId;
    that.setData({
      'item.disabled': true,
    })
    util.relese(that, images, filePath, cont, uploadimg, session3rd, fid, tt_day,formId)

    },
  // 上拉加载
  lower: function () {
    var that = this;
    wx.showToast({
      title:'加载中',
      icon: 'loading',
      duration: 1000,
    });
    console.log('上拉加载')
    tuwen_detail.call(that);
  },
})
//打卡项目详情
function punch_detail() {
  var that = this;
  var session3rd = this.data.session3rd;
  var fid = this.data.item.fid;
  console.log('fid为' + fid)

  request.requestTwDetail({
    session3rd: session3rd,
    fid: fid,
  }, (data) => {
    console.log(data)
    var pro_start = data.punchinfo.pro_start;
    var pro_end = data.punchinfo.pro_end;
    that.setData({
      'item.detail': data,                             //打卡详情
      'item.card_name': data.punchinfo.title,        //打卡项目名称
      'item.punchday': data.user_punch.tt_day,        //连续打卡天数
      'item.targetday': data.punchinfo.day,          //目标天数
      'item.starttime': data.punchinfo.day_start,   //打卡开始时间
      'item.endtime': data.punchinfo.day_end,        //打卡结束时间
      'item.day_date': data.date,
      'item.comment': data.comment,
      'item.is_msg': data.is_msg,                      //消息
      'item.img_txt': data.set_up.img_txt,             //是否是图文打卡
      'item.privacy': data.set_up.privacy,             //是否是隐私打卡
      'item.ts': data.set_up.ts,
      'item.is_clock': data.is_clock,
      'item.is_participate': data.is_participate,
      'item.item2': data.date[0].day,

    })
    console.log('img_txt为' + that.data.item.img_txt)
    console.log('privacy为' + that.data.item.privacy)
    console.log('ts为' + that.data.item.ts)

    console.log('开始时间为' + data.punchinfo.day_start)
    console.log('开始时间为' + that.data.item.starttime)
    var time1 = new Date();
    var day = util.day(time1)
    that.setData({
      'item.dotted_hidden': day,
    })
    if (that.data.item.starttime !== null) {
      that.setData({
        'item.starttime': that.data.item.starttime,
      })
    } else {
      that.setData({
        'item.starttime': '00:00',
      })
    }
    if (that.data.item.endtime !== null) {
      that.setData({
        'item.endtime': that.data.item.endtime,
      })
    } else {
      that.setData({
        'item.endtime': '23:59',
      })
    }
    // 未参与打卡
    var is_participate = that.data.item.is_participate;
    var is_clock = that.data.item.is_clock;
    var beginTime = that.data.item.starttime;
    var endTime = that.data.item.endtime;
    var hour = util.hour(time1);
    var minute = util.minute(time1);
    var nowTime = hour + ':' + minute;
    var strb = beginTime.split(":");
    console.log('is_clock' + is_clock)
    console.log(beginTime)
    console.log(endTime)
    console.log(nowTime)
    if (is_participate == 0) {
      that.setData({
        'item.bg': '../../imgs/circle_bg01.png',
        // 'item.join_punch': true,
      })
    } else {
      if (is_clock == 0) {
        console.log('is_clock在吗')
        that.setData({
          'item.bg': '../../imgs/circle_bg03.png',
        })
      } else {
        util.time(that, beginTime, endTime, nowTime)
      }
    }
    }, (data) => {
      wxLogin.call(that)
    })
}

function list() {
  var that = this;
  var session3rd = this.data.session3rd;
  var fid = this.data.item.fid;
  var start = this.data.start;
  var pagesize = this.data.pagesize;
  console.log(555)
  request.requestCircle({
    session3rd: session3rd,
    fid: fid,
    start: start,
    pagesize: pagesize,
  }, (data) => {
    console.log(data)
    that.setData({
      commentList: data.comment,
      start: start + pagesize,
    })
  }, (data) => {

  })
}
// 图文详情
function tuwen_detail() {
  var that = this;
  var session3rd = this.data.session3rd;
  var fid = this.data.item.fid;
  var start = this.data.start;
  var pagesize = this.data.pagesize;
  var commentList = this.data.commentList;
  console.log(start)
  request.requestCircle({
    session3rd: session3rd,
    fid: fid,
    start: start,
    pagesize: pagesize,
  }, (data) => {
    if (!data.comment == '') {
      // wx.showToast({
      //   title: '加载中',
      //   icon: 'loading',
      //   duration: 0,
      // })
      that.setData({
        commentList:commentList.concat(data.comment),
        start: start + pagesize,
      })
    } else {
      that.setData({
        loadingmore: false
      })
    }

  }, (data) => {
    console.log('fail')
  })
}
// 监听图文详情
function tuwen_detail_listen() {
  var that = this;
  var session3rd = this.data.session3rd;
  var fid = this.data.item.fid;
  var pagesize = this.data.start;
  var commentList = this.data.commentList;
  console.log(pagesize)
  request.requestCircle({
    session3rd: session3rd,
    fid: fid,
    pagesize: pagesize,
  }, (data) => {
    that.setData({
      commentList: data.comment,
    })
  }, (data) => {
    console.log('fail')
  })
}

//登录
function wxLogin(func) {
  var that = this;
  util.Login(that, function (data) {
    wx.setStorage({    //session3rd存入微信缓存
      key: "session",
      data: data,
      success: function () {
        punch_detail.call(that)
      }
    })
  }
  )
}
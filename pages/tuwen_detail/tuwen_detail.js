// pages/tuwen_detail/tuwen_detail.js
var request = require('../../request/request.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      session3rd:'',
      fid:'',
      cdata_id:'',
      cdata_uid:'',
      rdata_uid:'',
      rdata_id:'',
      rever_index: '',       //回复的是哪一个人
      pin_index: "",
      tindex: '',
      item:{
        tuwen_detail:'',
        rever_win_show:false,
        mask_show:true,
        rever_cont:'',
        reply_cont:'',
        reply_win_show:false,
        reply_index: '',

      },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that=this;
      var id=options.id;
      console.log(options)
      that.setData({
          fid:id,
      })
      wx.getStorage({
        key: 'session',
        success: function (res) {
          that.setData({
            session3rd: res.data,
          })
          console.log(that.data.session3rd)
          tuwen_detail.call(that)
        },
        fail: function () {
          app.wxLogin.call(that);
        }
      })
  },

  // 评论
  rever: function (e) {
    var that = this;
    console.log(e)
    var data_id = e.currentTarget.dataset.id;
    var data_uid = e.currentTarget.dataset.uid;
    that.setData({
      'item.rever_win_show': true,
      'item.mask_show': false,
      'cdata_id': data_id,
      'cdata_uid': data_uid,
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
      'item.rever_win_show': false,
      'item.mask_show': true,
      'item.rever_cont': '',

    })
  },
  // 确认评论
  rever_sure: function (e) {
    console.log(e)
    var that = this;
    this.setData({
      'item.rever_win_show': false,
      'item.mask_show': true,
    })
    var data_id = this.data.cdata_id;
    var data_uid = this.data.cdata_uid;
    var pin_index = this.data.pin_index;
    var session3rd = this.data.session3rd;
    var cont = this.data.item.rever_cont;
    console.log(data_id)
    console.log(data_uid)
    request.requestComment({
      session3rd: session3rd,
      to_uid: data_uid,
      list_id: data_id,
      status: 1,
      cont: cont,
    }, (data) => {
      console.log(data)
      console.log('success')
      console.log(data.cont.length)
      that.setData({
        'item.tuwen_detail.comment': data.cont,
        'item.tuwen_detail.comment_num': data.cont.length,
        'item.rever_cont':'',
      })
    }, (data) => {
      console.log('fail')
    })
  },
  // 回复
  reply: function (e) {
    var data_id = e.currentTarget.dataset.id;
    var data_uid = e.currentTarget.dataset.uid;
    var index = e.currentTarget.dataset.index;
    console.log(data_id)
    this.setData({
      'item.reply_win_show': true,
      'item.mask_show': false,
      'rdata_id': data_id,
      'rdata_uid': data_uid,
      'item.reply_index': index,
    })
  },
  // 取消回复
  reply_canle: function () {
    this.setData({
      'item.reply_win_show': false,
      'item.mask_show': true,
      'item.reply_cont': '',
    })
  },
  // 确认回复
  reply_sure: function (e) {
    var that = this;
    that.setData({
      'item.reply_win_show': false,
      'item.mask_show': true,
    })
    var cont = this.data.item.reply_cont;
    var to_uid = this.data.rdata_uid;
    var list_id = this.data.fid;
    var session3rd = this.data.session3rd;
    var tindex = this.data.tindex;
    console.log(to_uid)
    console.log(list_id)
    request.requestComment({
      session3rd: session3rd,
      to_uid: to_uid,
      list_id: list_id,
      status: 2,
      cont: cont,
    }, (data) => {
      console.log(data)
      that.setData({
        'item.tuwen_detail.comment': data.cont,
        'item.tuwen_detail.comment_num': data.cont.length,
        'item.reply_cont':'',
      })
      console.log('success')
    }, (data) => {
      console.log('fail')
    })
  },
  // 点赞
  imgHeart: function (e) {
    var that = this;
    var commentList = this.data.item.tuwen_detail;           //获取图文列表
    var currentIndex = e.currentTarget.dataset.index;   //当前图文的下标
    var from_uid = this.data.session3rd;        //来自谁ID
    var to_uid = commentList.uid;            //指向谁ID
    var list_id = commentList.id;          //被点赞信息ID
    var heart_num = parseFloat(commentList.heart_num);
    if (!commentList.is_heart) {
      that.setData({
        'commentList.is_heart': true,
        'commentList.heart_num': (heart_num + 1),
      })
      wx.getStorage({
        key: 'session',
        success: function (res) {
          that.setData({
            session3rd: res.data
          })
          var sesssion3rd = res.data
          request.requestHeart({
            session3rd: sesssion3rd,
            from_uid: from_uid,
            to_uid: to_uid,
            list_id: list_id,
            change: 1,
          }, (data) => {
            console.log(data)
            console.log(from_uid)
            console.log(to_uid)
            console.log(list_id)
            that.setData({
              ['commentList.head']: data.head,
            })
            tuwen_detail.call(that)
          }, () => {
            // 请求失败
          }, () => {
            // 请求完成
          },
          )
        }
      })
    } else {
      that.setData({
        'commentList.is_heart': false,
        'commentList.heart_num': (heart_num - 1),
      })
      wx.getStorage({
        key: 'session',
        success: function (res) {
          that.setData({
            session3rd: res.data
          })
          var sesssion3rd = res.data
          request.requestHeart({
            session3rd: sesssion3rd,
            from_uid: from_uid,
            to_uid: to_uid,
            list_id: list_id,
            change: 0,
          }, (data) => {
            console.log(data)
            that.setData({
              ['commentList.head']: data.head,
            })
            tuwen_detail.call(that)
            console.log(heart_num)
          }, () => {
            // 请求失败
          }, () => {
            // 请求完成
          },
          )
        }
      })
    }
  }, 


})

// 请求动态详情数据
function tuwen_detail(){
  var that=this;
  var session3rd=this.data.session3rd;
  var fid=this.data.fid;
  console.log('session3rd为' + session3rd)
  console.log('fid为' + fid)
  request.requestTuDetail({
    session3rd: session3rd,
    fid: fid,
  },(data) =>{
      console.log(data)
      that.setData({
          'item.tuwen_detail':data,
        })
  },(data) =>{
    console.log('fail')
  })
}
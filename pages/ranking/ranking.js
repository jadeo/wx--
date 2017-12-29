// pages/ranking/ranking.js
var request = require('../../request/request.js');
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    session3rd:'',
    scrollHeight:'',
    rankList:[],
    myself:'',
    fid:'',
    headimg: '../../imgs/achieve_bg.png',
    my_headimg:'../../imgs/achieve_bg.png',
    total_day: 60,
    username:'jade',
    my_total_day:200,
    my_rank:16,
    rank_img:[
      '../../imgs/no1.png',
      '../../imgs/no2.png',
      '../../imgs/no3.png',
    ],
    rank_num: [4,5,6,4,5,6,7,8,9,10,],
    joinlist: '',
    index:0,
    rank_hidden:false,
    join_hidden:true,
    start:0,
    size:10,
    data:'',
    cir_start:10,
    formId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      fid: options.id,
    })
    wx.getStorage({
      key: 'session',
      success: function (res) {
        that.setData({
          session3rd: res.data,
        })
        console.log(that.data.session3rd)
        rank.call(that)
      },
      fail: function () {
        wxLogin.call(that);
      }
    })
  },
  go:function(){
    wx.navigateTo({
      url: '../index/index',
    })
  },

  // 页面监听
  onShow:function(){
    var that=this;
    wx.getSystemInfo({    //页面显示获取设备屏幕高度，以适配scroll-view组件高度
      success: (res) => {
        that.setData({
          scrollHeight: res.windowWidth+188 // rpx转px 屏幕宽度/750
        });
        console.log(that.data.scrollHeight)
      }
    })
  },


  // 切换
  switch_tab1:function(e){
    var that=this;
    console.log(e)
    var formId=e.detail.formId;
    that.setData({
      index:0,
      rank_hidden: false,
      join_hidden:true,
      formId: formId,
    })
    rank.call(that)
  },
   switch_tab2: function () {
     var that=this;
    that.setData({
      index: 1,
      join_hidden: false,
      rank_hidden:true,
    })
    join.call(that)
    // var fid = this.data.fid;
    // var start = this.data.start;
    // var size = this.data.size;
    // var that = this;
    // request.requestJoin({
    //   fid: fid,
    //   start: start,
    //   size: size,
    // }, (data) => {
    //   console.log(data)
    //   that.setData({
    //     // start: start + size,
    //     data: data,
    //     joinlist: data.list,
    //   })
    // }, (data) => {

    // })
    
  },

  // 上拉加载
  lower:function(){
    var that=this;
   
    console.log('上拉加载')
    join_lower.call(that)
  },
})

// 请求排行榜列表
function rank(){
  var fid=this.data.fid;
  var session3rd=this.data.session3rd;
  var formId=this.data.formId;
  console.log(session3rd)
  request.requestRankList({
    fid: fid,
    session3rd: session3rd,
    formId:formId,
  },(data) =>{
    console.log('success')
    console.log(data)
    this.setData({
      rankList:data,
      myself: data.myself,
    })
  },(data) =>{
    console.log('fail')
  })
}

function join(){
  var fid = this.data.fid;
  var start=this.data.start;
  var size=this.data.size;
  var that=this;
  request.requestJoin({
    fid: fid,
    start: start,
    size: size,
  }, (data) => {
    console.log(data)
    that.setData({
      // start: start + size,
      data:data,
      joinlist: data.list,
    })
  }, (data) => {

  })
}


function join_lower(){
  var fid = this.data.fid;
  var start = this.data.cir_start;
  var size = this.data.size;
  var that = this;
  var joinlist = this.data.joinlist;
  console.log(start)
  console.log(size)
  request.requestJoin({
    fid: fid,
    start: start,
    size: size,
  }, (data) => {
    console.log(data)
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
    })
    if(!data.list==''){
      that.setData({
        cir_start: start + size,
        joinlist: joinlist.concat(data.list),
      })

    }
  }, (data) => {

  })
}
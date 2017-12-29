// newlist.js
var request=require('../../request/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      session3rd:'',
      item:{
        cont_id:'',    //项目id
        headimg: '../../imgs/achieve_bg.png',
        username:'jade',
        newslist:'',
      },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that=this;
    var fid=options.id;
    that.setData({
      'item.id':fid,
    })
    wx.getStorage({
      key: 'session',
      success: function (res) {
        that.setData({
          session3rd: res.data,
        })
        console.log(that.data.session3rd)
        newslist.call(that)
      },
      fail: function () {
       console.log('fail')
      }
    })
  },
  // 跳转到被赞详情
  go_heart:function(e){
    var cont_id = e.currentTarget.dataset.id;
    console.log(cont_id)
      wx.navigateTo({
        url: '../tuwen_detail/tuwen_detail?id=' + cont_id,
      })
  },
  // 跳转到评论详情
  go_rever:function(e){
    var cont_id = e.currentTarget.dataset.id;
    console.log(cont_id)
    wx.navigateTo({
      url: '../tuwen_detail/tuwen_detail?id=' + cont_id,
    })
  },
  // 跳转到回复详情
  go_reply:function(e){
    var cont_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../tuwen_detail/tuwen_detail?id=' + cont_id,
    })
  },
})

// 请求消息列表数据
function newslist(){
  var session3rd=this.data.session3rd;
  var id=this.data.item.id;
  var that=this;
  console.log(session3rd)
  console.log(id)
  request.requestNewsList({
    session3rd: session3rd,
    id:id,
  },(data) =>{
    console.log('success')
    console.log(data)
    that.setData({
      'item.newslist':data,
      'item.cont_id': data.cont_id,
    })
  },(data) =>{
    console.log('fail')
  })
}
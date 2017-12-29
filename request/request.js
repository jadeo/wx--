var api = require('api.js');
var app=getApp();

function isFunction(obj) {
  return typeof obj === 'function';
}

// 网络请求
function request(url, type, data, successCb, errorCb, completeCb) {
  wx.request({
    url: url,
    method: type,
    data: data,
    success: function (res) {
      // console.log(res)
      if (res.statusCode == 200) {
        isFunction(successCb) && successCb(res.data);
      } else if (res.data.error_code == 40001) {
        console.log('session3rd失效')
        isFunction(errorCb) && errorCb();
      } else {
        console.log('其他请求异常')
        console.log(res.data)
      }
    },
    error: function () {
      isFunction(errorCb) && errorCb();
    },
    complete: function () {
      isFunction(completeCb) && completeCb();
    }
  });
}

 // 打卡任务列表
function requestTaskList(data, successCb, errorCb, completeCb) {
  request(api.API_task_list, 'GET', data, successCb, errorCb, completeCb);
}
 // 项目排行页面
function requestRankList(data, successCb, errorCb, completeCb) {
  request(api.API_rank_list, 'GET', data, successCb, errorCb, completeCb);
}
// 个人中心
function requestUsercenter(data, successCb, errorCb, completeCb) {
  request(api.API_usercenter, 'GET', data, successCb, errorCb, completeCb);
}
// 勋章
function requestMedal(data, successCb, errorCb, completeCb) {
  request(api.API_medal, 'GET', data, successCb, errorCb, completeCb);
}
 // 打卡项目详情
function requestTwDetail(data, successCb, errorCb, completeCb) {
  request(api.API_tuwen_detail, 'GET', data, successCb, errorCb, completeCb);
}
 // 参与打卡
function requestJoinPunch(data, successCb, errorCb, completeCb) {
  request(api.API_join_punch, 'GET', data, successCb, errorCb, completeCb);
}
 // 项目设置
function requestPunchSet(data, successCb, errorCb, completeCb) {
  request(api.API_punch_set, 'GET', data, successCb, errorCb, completeCb);
}
 // 评论，回复
function requestComment(data, successCb, errorCb, completeCb) {
  request(api.API_comment, 'GET', data, successCb, errorCb, completeCb);
}
// 点赞，取消点赞
function requestHeart(data, successCb, errorCb, completeCb) {
  request(api.API_heart, 'GET', data, successCb, errorCb, completeCb);
}
  // 打卡记录
function requestPunchRecord(data, successCb, errorCb, completeCb) {
  request(api.API_punch_record, 'GET', data, successCb, errorCb, completeCb);
}
//个人项目打卡列表
function requestSelfTask(data, successCb, errorCb, completeCb) {
  request(api.API_self_task, 'GET', data, successCb, errorCb, completeCb);
}
 // 个人项目打卡任务列表
function requestSelfTaskDetail(data, successCb, errorCb, completeCb) {
  request(api.API_self_task_detail, 'GET', data, successCb, errorCb, completeCb);
}
 // 消息列表
function requestNewsList(data, successCb, errorCb, completeCb) {
  request(api.API_news_list, 'GET', data, successCb, errorCb, completeCb);
}
 // 打卡
function requestPunch(data, successCb, errorCb, completeCb) {
  request(api.API_punch, 'GET', data, successCb, errorCb, completeCb);
}
  // 收货地址
function requestAddress(data, successCb, errorCb, completeCb) {
  request(api.API_address, 'GET', data, successCb, errorCb, completeCb);
}
 // 创建新的项目
function requestAddContent(data, successCb, errorCb, completeCb) {
  request(api.API_addcontent, 'GET', data, successCb, errorCb, completeCb);
}
// 删除打卡项目
function requestDel(data, successCb, errorCb, completeCb) {
  request(api.API_del, 'GET', data, successCb, errorCb, completeCb);
}
// 消息列表详情
function requestTuDetail(data, successCb, errorCb, completeCb) {
  request(api.API_tuwenDetail, 'GET', data, successCb, errorCb, completeCb);
}
// 生成项目图片
function requestGetCode(data, successCb, errorCb, completeCb) {
  request(api.API_getCode, 'GET', data, successCb, errorCb, completeCb);
}
// 参与好友
function requestJoin(data, successCb, errorCb, completeCb) {
  request(api.API_join, 'GET', data, successCb, errorCb, completeCb);
}
// 打卡圈
function requestCircle(data, successCb, errorCb, completeCb) {
  request(api.API_circle, 'GET', data, successCb, errorCb, completeCb);
}
// 打卡圈发布
function requestCircleRelese(data, successCb, errorCb, completeCb) {
  request(api.API_circle_relese, 'GET', data, successCb, errorCb, completeCb);
}
// 分享
function requestPunchShare(data, successCb, errorCb, completeCb) {
  request(api.API_punch_share, 'GET', data, successCb, errorCb, completeCb);
}
// 分享
function requestGetUserImg(data, successCb, errorCb, completeCb) {
  request(api.API_getUserImg, 'GET', data, successCb, errorCb, completeCb);
}
// 更多
function requestMore(data, successCb, errorCb, completeCb) {
  request(api.API_more, 'GET', data, successCb, errorCb, completeCb);
}
module.exports = {
  requestTaskList: requestTaskList,     // 打卡任务列表
  requestRankList: requestRankList,      //// 项目排行页面
  requestUsercenter: requestUsercenter,   //个人中心
  requestMedal: requestMedal,     //勋章
  requestTwDetail: requestTwDetail,     //打卡项目详情
  requestJoinPunch: requestJoinPunch,  //参与打卡
  requestPunchSet: requestPunchSet,  //项目设置
  requestComment: requestComment,   //评论，回复
  requestHeart: requestHeart,    //点赞，取消点赞
  requestPunchRecord: requestPunchRecord,   //打卡记录
  requestSelfTask: requestSelfTask,   //个人项目打卡列表
  requestSelfTaskDetail: requestSelfTaskDetail,   //个人项目打卡任务列表
  requestNewsList: requestNewsList,   //消息列表
  requestPunch: requestPunch,  // 打卡
  requestAddress: requestAddress,          //地址
  requestAddContent: requestAddContent,          //创建新的项目
  requestDel: requestDel,      //删除打卡项目
  requestTuDetail: requestTuDetail,   //消息列表详情
  requestGetCode: requestGetCode,     //生成项目图片
  requestJoin: requestJoin,           //参与好友
  requestCircle: requestCircle,      //打卡圈
  requestCircleRelese: requestCircleRelese,      //打卡圈
  requestPunchShare: requestPunchShare,      //分享
  requestGetUserImg: requestGetUserImg,
  requestMore: requestMore,
}

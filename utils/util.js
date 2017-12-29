var request = require('../request/request.js')
var app = getApp();
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function isFunction(obj) {
  return typeof obj === 'function';
}
// 点赞
function imgheart(that, commentList, index, heart_num, from_uid, to_uid, list_id, formId) {
  if (!commentList[index].is_heart) {
    that.setData({
      ['commentList[' + index + '].is_heart']: true,
      ['commentList[' + index + '].heart_num']: (heart_num + 1),
      // h:true,
    })
    wx.getStorage({
      key: 'session',
      success: function (res) {
        that.setData({
          session3rd: res.data,
        })
        var sesssion3rd = res.data
        request.requestHeart({
          session3rd: sesssion3rd,
          from_uid: from_uid,
          to_uid: to_uid,
          list_id: list_id,
          change: 1,
          formId:formId,
        }, (data) => {
          console.log(data)
          console.log(from_uid)
          console.log(to_uid)
          console.log(list_id)
          that.setData({
            ['commentList[' + index + '].head']: data.head,
          })
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
      ['commentList[' + index + '].is_heart']: false,
      ['commentList[' + index + '].heart_num']: (heart_num - 1),
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
          formId: formId,
        }, (data) => {
          console.log(data)
          that.setData({
            ['commentList[' + index + '].head']: data.head,
          })
        }, () => {
          // 请求失败
        }, () => {
          // 请求完成
        },
        )
      }
    })
  }
}

// 预览图片
function previewImage(previewSrc, previewImageArray) {
  wx.previewImage({
    current: previewSrc,
    urls: previewImageArray // 需要预览的图片http链接列表
  })
}

//提示框
function showModel(title, cont) {
  wx.showModal({
    title: title,
    content: cont,
    showCancel: false,
  })
}
// 邀请好友
function onShare(title, path) {
  return {
    title: title,
    path: path,
  }
}

// 分享成就
function share_model(session3rd, path, id, url, color) {
  wx.showToast({
    title: '照片生成中',
    icon: 'loading',
  })
  request.requestGetCode({
    session3rd: session3rd,
    path: path,
    signID: id,
  }, (data) => {
    console.log(data)
    wx.navigateTo({
      url: url + data,
    })
  }, (data) => {
    wx.showModal({
      content: '照片生成失败请重试',
    })
  })
}

// 确认评论
function rever_sure(that, cont, session3rd, data_uid, data_id, commentList, pin_index) {
  if (app.trim(cont).length <= 0) {
    wx.showModal({
      title: '提示',
      content: '评论内容不能为空',
      showCancel: false,
    })
  } else {
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
        ['commentList[' + pin_index + '].revers']: data.cont,
        ['commentList[' + pin_index + '].comment_num']: data.cont.length,
        'item.rever_cont': '',
      })
    }, (data) => {
      console.log('fail')
    })
  }
}
// 确认回复
function reply_sure(that, cont, session3rd, to_uid, list_id, commentList, tindex, formId) {
  if (app.trim(cont).length <= 0) {
    wx.showModal({
      title: '提示',
      content: '回复内容不能为空',
      showCancel: false,
    })
  } else {
    request.requestComment({
      session3rd: session3rd,
      to_uid: to_uid,
      list_id: list_id,
      status: 2,
      cont: cont,
      formId:formId,
    }, (data) => {
      console.log(data)
      that.setData({
        ['commentList[' + tindex + '].revers']: data.cont,
        ['commentList[' + tindex + '].comment_num']: data.cont.length,
        'item.reply_cont': '',
      })
      console.log('success')
    }, (data) => {
      console.log('fail')
    })
  }
}

// 点击打卡
function punch(that, networkType, is_participate, session3rd, fid, formid, nowday, is_clock, overdue, nopunch_time, img_txt, privacy, punchday, callback) {
  if (networkType==false){
      wx.showModal({
        title: '提示',
        content: '网络状态不佳,打卡失败',
        showCancel:false,
      })
  }else{
    if (overdue == true) {
      wx.showModal({
        title: '提示',
        content: '对不起，项目已过期',
      })
    } else {
      if (is_participate == 0) {
        console.log('参与打卡');
        //to do 參與打卡
        request.requestJoinPunch({
          session3rd: session3rd,
          fid: fid,
          formid: formid,
        }, (data) => {
          console.log(data);
          that.setData({
            'item.is_participate': 1,
            'item.detail.join': data.headimg,
            'item.punch_show': false,
            'item.bg': '../../imgs/circle_bg02.png',
            'item.item1': nowday,
            'item.mask_show': false,
          })
          callback()
        }, (data) => {
        })
      } else {
        //todo 是否打过卡
        if (is_clock == 0) {
          console.log('已打卡');
          wx.showModal({
            content: '对不起，您已经打过卡了',
            showCancel: false,
          })
        } else {
          console.log('打卡');

          // //todo 判断是否过期
          if (overdue == false) {
            if (nopunch_time == true) {
              wx.showModal({
                title: '提示',
                content: '不在打卡时间，请在打卡时间内打卡',
                showCancel: false,
              })
            } else {
              if (img_txt == 1) {
                that.setData({
                  'item.tuwen_show': true,
                  'item.mask_show': false,
                })
              } else {
                request.requestPunch(
                  {
                    session3rd: session3rd,
                    fid: fid,
                    privacy: privacy,
                    formid: formid,
                  },
                  (data) => {
                    console.log('success')
                    console.log(data)
                    //判断是否该领奖
                    var lingjiang = data.is_gift;
                    var medal = data.medal;
                    that.setData({
                      'item.bg': '../../imgs/circle_bg03.gif',
                      'item.item1': nowday,
                      'item.is_clock': 0,
                      'item.punchday': parseInt(punchday++),
                    })
                    if (lingjiang == true) {
                      that.setData({
                        'item.lg': lingjiang,
                        'item.gift_show': false,
                        'item.mask_show': false,
                      })
                    } else if (medal) {
                      that.setData({
                        'item.medal': medal,
                        'item.medal_show': false,
                        'item.mask_show': false,
                      })
                    } else {
                      setTimeout(function () {
                        that.setData({
                          'item.mask_show': false,
                          'item.gf_success_hidden': false,
                        })
                      }, 500)
                    }
                    callback()
                  }, (data) => {
                    wx.showModal({
                      title: '提示',
                      content: '打卡失败，请稍后重试',
                      showCancel: false,
                    })
                  }
                )
              }
            }
          }
          else {
            wx.showModal({
              content: '对不起，您打卡的项目已过期',
              showCancel: false,
            })
          }
        }
      }
    }
  }
}
// 打卡1
function punch1(that, is_participate, beginTime, endTime, nowTime, session3rd, fid, formid, is_clock, overdue, nopunch_time, img_txt, punchday, i, nowday,pro,ped, callback) {
  if (is_participate == 0) {
    console.log('参与打卡');
    //to do 參與打卡
    request.requestJoinPunch({
      session3rd: session3rd,
      fid: fid,
      formid: formid,
    }, (data) => {
      console.log(data);
      //如果在时间段内，变换背景
      that.setData(
        {
          'item.mask_show': false,
          'item.punch_show': false,
        }
      )
      time(that, beginTime, endTime, nowTime)
      callback()
    }, (data) => {
    })
  } else {
    //todo 是否打过卡
    if (is_clock == 0) {
      console.log('已打卡');
      wx.showModal({
        content: '对不起，您已经打过卡了',
        showCancel: false,
      })
    } else {
      console.log('打卡');
      // //todo 判断是否过期
      if (overdue == false) {
        // 是否在项目的打卡时间内
        var timebool = checkTime(pro,ped);//注意：日期用“-”分隔
        if (timebool == true) {
          // 是否在打卡时间
          if (nopunch_time == true) {
            wx.showModal({
              title: '提示',
              content: '不在打卡时间，请在打卡时间内打卡',
              showCancel: false,
            })
          } else {

            request.requestPunch(
              {
                session3rd: session3rd,
                fid: fid,
                formid: formid,
              },
              (data) => {
                console.log('success')
                console.log(data)
                console.log(is_clock)
                //判断是否该领奖
                var medal = data.medal;
                that.setData({
                  'item.bg': '../../imgs/circle_bg03.gif',
                  'item.item1': nowday,
                  'item.is_clock': 0,
                  'item.punchday': parseInt(punchday++),
                })
                if (medal) {
                  that.setData({
                    'item.medal': medal,
                    'item.medal_show': false,
                    'item.mask_show': false,
                  })
                } else {
                  setTimeout(function () {
                    that.setData({
                      'item.mask_show': false,
                      'item.success_punch_show': false,
                    })
                  }, 500)
                }
                callback()
              }, (data) => {
                wx.showModal({
                  title: '提示',
                  content: '打卡失败，请稍后重试',
                  showCancel: false,
                })
              }
            )
          }
        } else {
          wx.showModal({
            content: '对不起，不在打卡周期内',
            showCancel: false,
          })
        }

      }
      else {
        wx.showModal({
          content: '对不起，您打卡的项目已过期',
          showCancel: false,
        })
      }
    }
  }
}



// 选择照片
function chooseImg(that, count, addImg) {
  wx.chooseImage({
    count: count,
    success: function (res) {
      console.log(res)
      var tempFilePaths = res.tempFilePaths.concat(addImg);
      if (tempFilePaths.length >9) {
        wx.showModal({
          title: '提示',
          content: '所选照片不得超过9张哦',
          showCancel: false,
        })
      } else {
        that.setData({
          'item.uploadimg': res.tempFilePaths.concat(addImg),
        })
        console.log(that.data.item.uploadimg)
      }

    },
    fail: function () {
      wx.showLoading({
        content: '对不起，选择失败',
      })
    }
  })
}
// 发布
function relese(that, images, filePath, cont, uploadimg, session3rd, fid, tt_day,formId) {
  if (app.trim(cont).length < 1 && uploadimg.length < 1) {
    wx.showModal({
      title: '提示',
      content: '图片和文字必须选一个哦',
      showCancel: false,
    })
    that.setData({
      'item.disabled': false,
    })
  } else {
    // 有图片的
    if (uploadimg.length > 0) {
      var that = that;
      var upLoadNum = 0;
      var uploadimg = uploadimg;
      var imgLength = parseInt(uploadimg.length - 1)
      var session3rd = session3rd;
      var fid = fid;
      var images = images;
      var filePath = filePath;
      var callback = callback;
      var tt_day = tt_day;
      var formId = formId;
      upLoadImgs(that, images, filePath, upLoadNum, imgLength, session3rd, fid, cont, tt_day, formId)
    } else {
      // 没有图片
      that.setData({
        'item.disabled': true,
      })
      wx.showToast({
        icon: 'loading',
        duration: 3000,
      })
      request.requestCircleRelese(
        {
          session3rd: session3rd,
          fid: fid,
          cont: cont,
          tt_day: tt_day,
          formId:formId,
        },
        (data) => {
          console.log('success')
          wx.showToast({
            icon: 'loading',
            duration: 0,
          })
          console.log(data)
          that.setData({
            'item.tuwen_show': false,
            'item.mask_show': true,
            'commentList': data.comment,
            'item.uploadimg':[],
            'item.disabled': false,
            'item.cont':'',
            'start':10,
            'item.gf_success_hidden':true,
          })
        },
        (data) => {
          console.log('fail')
        }
      )
    }
  }
}
var url = 'https://yjxg.suxcx.com/index.php?s=/w17'
// 上传多张照片
function upLoadImgs(that, images, filePath, upLoadNum, imgLength, session3rd, fid, cont, tt_day, formId) {
  wx.uploadFile({
    url: url + '/Yjuser/Yjfast/upload',
    filePath: filePath[upLoadNum],
    name: 'file',
    success: function (res) {
      console.log('上传中')
      console.log(res)
      if (that.data.images == '') {
        that.setData({
          images: parseInt(res.data)
        })
      } else {
        that.setData({
          images: that.data.images + ',' + parseInt(res.data)
        })

      }
      upLoadNum++;
      console.log(upLoadNum)
      console.log(that.data.images)
      if (upLoadNum <= imgLength) {
        upLoadImgs(that, images, filePath, upLoadNum, imgLength, session3rd, fid, cont, tt_day, formId)
      } else if (upLoadNum == (imgLength + 1)) {
        console.log('图片上传完毕');
        var img = that.data.images;
        console.log(img)
        that.setData({
          'item.disabled': true,
        })
        wx.showToast({
          icon: 'loading',
          duration: 3000,
        })
        request.requestCircleRelese(
          {
            session3rd: session3rd,
            fid: fid,
            cont: cont,
            img: img,
            tt_day: tt_day,
            formId: formId,
          },
          (data) => {
            console.log('success')
            wx.showToast({
              icon: 'loading',
              duration: 0,
            })
            console.log(data)
            that.setData({
              'item.tuwen_show': false,
              'item.mask_show': true,
              'commentList': data.comment,
              'item.uploadimg': [],
              'item.disabled': false,
              images:'',
              'item.cont': '',
              'start':10,
              'item.gf_success_hidden':true,

            })
          },
          (data) => {
            console.log('fail')
            app.wxLogin.call(that)
          }
        )
      }
    },
    fail: function (res) {
      console.log(res)
      console.log('上传接口调用失败')
    },
    complete: function () {
      console.log('上传接口调用完成')
    }
  })
}
// 登录
function Login(that, callback) {
  wx.login({
    success: function (res) {
      console.log(1)
      var code = res['code'];
      //2.小程序调用wx.getUserInfo得到rawData, signatrue, encryptData.
      wx.getUserInfo({
        success: function (info) {
          var rawData = info['rawData'];
          var signature = info['signature'];
          var encryptData = info['encryptData'];
          var encryptedData = info['encryptedData']; //注意是encryptedData不是encryptData...坑啊
          var iv = info['iv'];
          //3.小程序调用server获取token接口, 传入code, rawData, signature, encryptData.
          wx.request({
            url: url + '/Yjuser/Yjfast/login',
            data: {
              "code": code,
              "rawData": rawData,
              "signature": signature,
              "encryptData": encryptData,
              'iv': iv,
              'encryptedData': encryptedData
            },
            success: function (res) {
              console.log(res)
              if (res.statusCode != 200) {
                wx.showModal({
                  title: '登录失败'
                });
              } else {
                var session = res.data.session3rd;
                console.log(session);
                that.setData({
                  'session3rd': session,
                })
                callback(session)
              }
              typeof func == "function" && func(res.data);
            }
          });
        },
        fail: function () {
          wx.redirectTo({
            url: '../authorization/authorization',
          })
        },
      });
    }
  });
}
// 判断是否在时间
function time(that, beginTime, endTime, nowTime) {
  var strb = beginTime.split(":");
  if (strb.length != 2) {
    return false;
  }
  var stre = endTime.split(":");
  if (stre.length != 2) {
    return false;
  }

  var strn = nowTime.split(":");
  if (stre.length != 2) {
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

  if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
    console.log("当前时间是：" + n.getHours() + ":" + n.getMinutes() + "，在打卡范围内！");
    that.setData({
      // 'item.punch_show': false,
      'item.bg': '../../imgs/circle_bg02.png',
    })
  } else {
    console.log("当前时间是：" + n.getHours() + ":" + n.getMinutes() + "，不在打卡范围内！");
    that.setData({
      'item.bg': '../../imgs/circle_bg011.png',
      'item.nopunch_time': true,
    })
    return false;
  }
}

// 判断是否在某段周期内
 function checkTime(stime, etime) {
  //开始时间
   console.log(stime)
   console.log(etime)
  var arrs = stime.split("-");
  var startTime = new Date(arrs[0], arrs[1], arrs[2]);
  var startTimes = startTime.getTime();
  //结束时间
  var arre = etime.split("-");
  var endTime = new Date(arre[0], arre[1], arre[2]);
  var endTimes = endTime.getTime();
  //当前时间
  var thisDate = new Date();
  var thisDates = thisDate.getFullYear() + "-0" + (thisDate.getMonth() + 1) + "-" + thisDate.getDate();
  var arrn = thisDates.split("-");
  var nowTime = new Date(arrn[0], arrn[1], arrn[2]);
  var nowTimes = nowTime.getTime();
  if (nowTimes < startTimes || nowTimes > endTimes) {
    return false;
  }
  return true;
}

// 小时
function hour(time) {
  return time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
}
// 分钟
function minute(time) {
  return time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
}
// 秒
function day(time) {
  return time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
}
// 上传单张图片
function uploadimg1(that, uploadimg, callback) {
  wx.uploadFile({
    url: url + '/Yjuser/Yjfast/upload',
    filePath: uploadimg,
    name: 'file',
    success: function (res) {
      callback(res)
    }
  })
}

// 获取屏幕的scrollHeight
function scrollHeight(that, scrollHeight) {
  wx.getSystemInfo({    //页面显示获取设备屏幕高度，以适配scroll-view组件高度
    success: (res) => {
      that.setData({
        scrollHeight: (res.windowHeight + 300) // rpx转px 屏幕宽度/750
      });
    }
  })
}

// 获取网络状态
function getwork(){
  wx.getNetworkType(
    {
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType;
        if (networkType == 'none') {
          wx.showModal({
            title: '提示',
            content: '手机网络不太顺畅',
            showCancel: false,
          })
        }
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '手机网络不太顺畅',
          showCancel: false,
        })
      },
      complete: function () {

      }
  })
}

// 监听网络状态
function onwork(that){
  wx.onNetworkStatusChange(function (res) {
    console.log('wwww')
    that.setData(
      {
        'item.networkType': res.isConnected,
      }
    )
    if (res.isConnected == false) {
      wx.showModal({
        title: '提示',
        content: '手机网络不太顺畅',
        showCancel: false,
      })
    }
    console.log(that.data.item.networkType)
  }) 
}


module.exports = {
  formatTime: formatTime,
  imgheart: imgheart,
  previewImage: previewImage,
  showModel: showModel,
  onShare: onShare,
  share_model: share_model,
  rever_sure: rever_sure,
  reply_sure: reply_sure,
  punch: punch,
  punch1: punch1,
  chooseImg: chooseImg,
  relese: relese,
  Login: Login,
  time: time,
  hour: hour,
  minute: minute,
  day: day,
  uploadimg1: uploadimg1,
  scrollHeight: scrollHeight,
  getwork: getwork,
  onwork: onwork,
}

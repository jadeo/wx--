// pages/punch_record/punch_record.js
var request = require('../../request/request.js');
'use strict';
let choose_year = null,
  choose_month = null;
const conf = {
  data: {
    hasEmptyGrid: false,
    showPicker: false,
    session3rd: '',
    scrollHeight: '',
    formId:'',
    item: {
      fid: '',
      card_name: '',   //标题
      headimg: '',
      username: '',                   //用户名
      continuity_day: null,                 //连续打卡天数
      total_day: null,                      //累计打卡天数
      year: null,                          //当前年份
      month: null,                            //当前月份
      week: ['一', '二', '三', '四', '五', '六', '日'],
      day: [],
      userinfo: '',
      record: '',
      cur_year:'',
      cur_month:'',
      weeks_ch:'',
      empytGrids:[],
      days:[],
      hasEmptyGrid:false,

    }
  },
  onLoad(options) {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    // console.log(new Date(Date.UTC(cur_year, cur_month - 1, 1)).getDay())   //5
    // console.log(new Date(cur_year, cur_month, 0).getDate())  //31
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.setData({
      'item.cur_year':cur_year,
      'item.cur_month':cur_month,
     'item.weeks_ch':weeks_ch
    });
    var that = this;
    console.log(options)
    that.setData({
      'item.fid': options.fid,
      formId: options.formId,
    })
    console.log(this.data.formId)
    wx.getStorage({
      key: 'session',
      success: function (res) {
        that.setData({
          session3rd: res.data,
        })
        console.log(that.data.session3rd)
        punch_record.call(that)
      },
      fail: function () {
        wxLogin.call(that);
      }
    })
  },
  getThisMonthDays(year, month) {
    // 得到每月的天数
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    // 得到是周几
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    // console.log(firstDayOfWeek)   //5
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        'item.hasEmptyGrid': true,
        'item.empytGrids': empytGrids,
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        'item.empytGrids': []
      });
    }
    console.log(this.data.item.empytGrids)
  },
  calculateDays(year, month) {
    let days = [];

    const thisMonthDays = this.getThisMonthDays(year, month);
    console.log(thisMonthDays)
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({
        day: i,
        choosed: false
      });
    }
    this.setData({
      'item.days': days,
    });
    console.log(this.data.item.days)
  },
  handleCalendar(e) {
    var that=this;
    console.log(e)
    const handle = e.currentTarget.dataset.handle;
    console.log(handle)
    const cur_year = this.data.item.cur_year;
    const cur_month = this.data.item.cur_month;
    let formId = e.detail.formId;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      // this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        'item.cur_year': newYear,
        'item.cur_month': newMonth
      });
      let year = that.data.item.cur_year;
      let month = that.data.item.cur_month;
      let session3rd = this.data.session3rd;
      let fid=this.data.item.fid;
      console.log(year)
      console.log(month)
      request.requestPunchRecord({
        session3rd: session3rd,
        fid: fid,
        year: year,
        month: month,
        formId:formId,
      }, (data) => {
        console.log('success')
        console.log(data)
        console.log(data.userinfo)
        that.setData({
          'item.record': data,
        })
      }, (data) => {
        console.log('fail')
      })

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      // this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        'item.cur_year': newYear,
        'item.cur_month': newMonth
      });
      let year = that.data.item.cur_year;
      let month = that.data.item.cur_month;
      let session3rd = this.data.session3rd;
      let fid = this.data.item.fid;
      console.log(year)
      console.log(month)
      request.requestPunchRecord({
        session3rd: session3rd,
        fid: fid,
        year: year,
        month: month,
        formId: formId,
      }, (data) => {
        console.log('success')
        console.log(data)
        console.log(data.userinfo)
        that.setData({
          'item.record': data,
        })
      }, (data) => {
        console.log('fail')
      })
    }
  },
  // tapDayItem(e) {
  //   const idx = e.currentTarget.dataset.idx;
  //   const days = this.data.item.days;
  //   days[idx].choosed = !days[idx].choosed;
  //   this.setData({
  //     days,
  //   });
  // },
  chooseYearAndMonth() {
    const cur_year = this.data.item.cur_year;
    const cur_month = this.data.item.cur_month;
    let picker_year = [],
      picker_month = [];
    for (let i = 1900; i <= 2100; i++) {
      picker_year.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      picker_month.push(i);
    }
    const idx_year = picker_year.indexOf(cur_year);
    const idx_month = picker_month.indexOf(cur_month);
    this.setData({
      picker_value: [idx_year, idx_month],
      picker_year,
      picker_month,
      showPicker: true,
    });
  },
  pickerChange(e) {
    const val = e.detail.value;
    choose_year = this.data.picker_year[val[0]];
    choose_month = this.data.picker_month[val[1]];
  },
  tapPickerBtn(e) {
    const type = e.currentTarget.dataset.type;
    const o = {
      showPicker: false,
    };
    if (type === 'confirm') {
      o.cur_year = choose_year;
      o.cur_month = choose_month;
      this.calculateEmptyGrids(choose_year, choose_month);
      this.calculateDays(choose_year, choose_month);
    }

    this.setData(o);
  },

};

Page(conf);

// 请求打卡记录
function punch_record() {
  var session3rd = this.data.session3rd;
  var fid = this.data.item.fid;
  var that = this;
  var year=this.data.item.cur_year;
  var month=this.data.item.cur_month;
  var formId = this.data.formId;
  console.log(year)
  console.log(month)
  console.log(formId)
  request.requestPunchRecord({
    session3rd: session3rd,
    fid: fid,
    year:year,
    month:month,
    formId: formId,
  }, (data) => {
    console.log('success')
    console.log(data)
    console.log(data.userinfo)
    that.setData({
      'item.record': data,
    })
  }, (data) => {
    console.log('fail')
  })
}

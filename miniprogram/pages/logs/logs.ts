// logs.ts
// const util = require('../../utils/util.js')
import { formatTime } from '../../utils/util'

Page({
  data: {
    logs: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
  },
  onShow: function () {
    // 页面出现在前台时执行
    console.log('onshow函数执行')
  },

  onLoad() {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map((log: string) => {
        return {
          date: formatTime(new Date(log)),
          timeStamp: log
        }
      }),
    })
    console.log(wx.getStorageSync('logs'))
    console.log(this.data.logs)
    // @ts-ignore  登录
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    // wx.scanCode({
    //   success: (res) => {
    //     console.log(res)
    //   }
    // })
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        console.log(res.latitude, res.longitude)
      }
    })
  }


})

// logs.ts
// const util = require('../../utils/util.js')
import { formatTime } from '../../utils/util'

const defaultAvatarUrl = "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0"

Page({
  data: {
    logs: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    avatarUrl: defaultAvatarUrl,
    nickName: ""
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
    // 先从数据库中获取用户信息，获取不到就让用户填写
    if (this.data.avatarUrl == defaultAvatarUrl) {
      wx.showToast({
        title: '请先设置头像和昵称',
        icon: 'none',
        duration: 2000
      });
    }

    console.log(this.data.logs)
    // @ts-ignore  登录
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },

  onChooseAvatar(e: any) {
    const { avatarUrl } = e.detail
    this.setData({
      avatarUrl,
    })
    console.log(this.data);
  },

  onGetPhoneNumber(e : any) {
    // 需要开通小程序认证才能使用 getPhoneNumber 组件 [需要300R]
    // 拿着这个code，去请求业务后端，在后端逻辑里，再去请求微信官方接口 https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-info/phone-number/getPhoneNumber.html  并且由于是云托管调用，不需要填写access_token入参。
      console.log(e.detail.code); 
      
  }

})


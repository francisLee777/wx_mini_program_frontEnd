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
    avatarUrl: "",
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


    // 没法直接获取app中的全局变量，不然要借助全局缓存
    var app = getApp()
    this.setData({nickName : app.globalData.userInfo.nickName,avatarUrl : app.globalData.userInfo.avatarUrl})

    if (this.data.avatarUrl == defaultAvatarUrl || this.data.nickName == "") {
      wx.showToast({
        title: '请先设置头像和昵称',
        icon: 'none',
        duration: 2000
      });
    }

    // @ts-ignore  登录
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },

    // 新建昵称
     onInputNickName(e: any) {
       if (e.detail.value.username === ""){
        wx.showToast({
          title: '你没输入啊哥',
          icon: 'error',
          duration: 1500
        });
        return
       }
      const that = this
        wx.cloud.callContainer({
        "config": {
          "env": "prod-3gchwfph277dbd79"
        },
        "path": "/api/user/saveNickName",
        "header": {
          "X-WX-SERVICE": "golang-pfa8",
          "content-type": "application/json"
        },
        "method": "POST",
        // 昵称里面有中文，放到url里面麻烦，所以放 json body 里面
        "data": {"nickName":e.detail.value.username},
        "success":function(res){
          that.setData({nickName : res.data.data})
        }
      })
  },


  // 新建头像
   onChooseAvatar(e: any) {
    const that = this
    // 请求后端保存头像
      wx.cloud.callContainer({
      "config": {
        "env": "prod-3gchwfph277dbd79"
      },
      "path": "/api/user/saveIconURL?iconURL="+e.detail.avatarUrl,
      "header": {
        "X-WX-SERVICE": "golang-pfa8",
        "content-type": "application/json"
      },
      "method": "POST",
      "data": "",
      "success":function(){
        that.setData({ avatarUrl : e.detail.avatarUrl })
      }
    })
  },

  onGetPhoneNumber(e : any) {
    // 需要开通小程序认证才能使用 getPhoneNumber 组件 [需要300R]
    // 拿着这个code，去请求业务后端，在后端逻辑里，再去请求微信官方接口 https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-info/phone-number/getPhoneNumber.html  并且由于是云托管调用，不需要填写access_token入参。
      console.log(e.detail.code); 
  }

})
 
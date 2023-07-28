// app.ts

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

App<IAppOption>({
  globalData: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      city: "",
      country: "",
      gender: 1,
      language: "zh_CN",
      nickName: "",
      province: ""
    }
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log(logs)

    // 22年之后，无论通过什么方式都无法再获取用户的昵称和头像了，只能让用户手动填写[提供了快速填充能力]
    // https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/userProfile.html

    wx.cloud.init()

    // 先从数据库中获取用户信息，获取不到就让用户填写
    const that = this
    wx.cloud.callContainer({
      "config": {
        "env": "prod-3gchwfph277dbd79"
      },
      "path": "/api/user/getUserInfo",
      "header": {
        "X-WX-SERVICE": "golang-pfa8",
        "content-type": "application/json"
      },
      "method": "POST",
      "data": "",
      "success": function (res) {
        if (that.globalData.userInfo && res.data.data) {
          if (res.data.data.user_nickName !== "") that.globalData.userInfo.nickName = res.data.data.user_nickName
          if (res.data.data.user_icon_url !== "") that.globalData.userInfo.avatarUrl = res.data.data.user_icon_url
        }
        console.log("头像昵称初始化结果 ", that.globalData.userInfo);
        
      } 
    })
  },

})
// app.ts

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

App<IAppOption>({
  globalData: {
    userInfo:{
      avatarUrl:defaultAvatarUrl,
      city:"",
      country:"",
      gender:1,
      language:"zh_CN",
      nickName:"",
      province:""
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
    
  
    
  },

})
// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
Page({
  data: {
    motto: 'Hello World',
    foodList: [
      {
        id: 'f1',
        name: 'f1_name',
        count : 0
      },
      {
        id: 'f2',
        name: 'f2_name',
        count : 0
      },
      {
        id: 'f3',
        name: 'f3_name',
        count : 0
      },
      {
        id: 'f4',
        name: 'f4_name',
        count : 0
      }
    ],
    orderList :{}  // 是一个 map， key 是 id
  },
  // 事件处理函数
  onLoad() {
    // @ts-ignore
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e: any) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 事件响应函数
  plusTap: function (e: any) {
    var index = Number(e.currentTarget.id.split('-')[3])
    console.log(e)
    var food = this.data.foodList[index]
    console.log(food.count)
    this.setData({
      [`foodList[${index}].count`] :food.count + 1,
     [`orderList.${food.id}`] : {
       "id":food.id,
       "name":food.name,
       "count":food.count + 1
     }
    }, function () {
      // this is setData callback
    })
    console.log(this.data.orderList)
  },

  orderFormSubmit(e: any){
    var a = this.data.foodList
    wx.showModal({
      content: '确认订单?',
      success (res) {
        // app.globalData.userInfo
        if (res.confirm) {
          // 请求远程接口
          wx.request({
            url: 'www.lihaoyu20151613.top/hello', //仅为示例，并非真实的接口地址
            data: {
              x: a,
              y: 'this_is_y'
            },
            header: {
              'content-type': 'application/json' // 默认值  
            },
            success (res) {
              console.log(res.data)
            },
            fail(res){
              console.log(res)
            }
          })
          console.log(e);
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }



 


})

// 添加函数

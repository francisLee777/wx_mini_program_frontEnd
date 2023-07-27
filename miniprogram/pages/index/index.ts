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
        count: 0
      },
      {
        id: 'f2',
        name: 'f2_name',
        count: 0
      },
      {
        id: 'f3',
        name: 'f3_name',
        count: 0
      },
      {
        id: 'f4',
        name: 'f4_name',
        count: 0
      }
    ],
    orderList: {}  // 是一个 map， key 是 id
  },


  // 事件处理函数
  onLoad() {
    wx.cloud.init(),
      console.log("onLoad函数调用")
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
  // getUserInfo(e: any) {
  //   // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
  //   console.log(e)
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  //   console.log('啊啊啊啊');
  //   console.log(this.data);
  // },

  // 事件响应函数   添加菜品
  plusTap: function (e: any) {
    const tempArray = e.currentTarget.id.split('-')
    var index = Number(tempArray[tempArray.length - 1])
    var food = this.data.foodList[index]
    this.setData({
      [`foodList[${index}].count`]: food.count + 1,
      [`orderList.${food.id}`]: {
        "id": food.id,
        "name": food.name,
        "count": food.count + 1
      }
    }, function () {
    })
  },

  // 事件响应函数   添加菜品
  minusTap: function (e: any) {
    const tempArray = e.currentTarget.id.split('-')
    // 下标是从id字符串中取到的
    var index = Number(tempArray[tempArray.length - 1])
    var food = this.data.foodList[index]
      this.setData({
        [`foodList[${index}].count`]: food.count - 1,
        [`orderList.${food.id}`]: {
          "id": food.id,
          "name": food.name,
          "count": food.count - 1
        }
      }, function () {
      })
     // 如果减完了，需要从订单中移除
     if (food.count == 0) {
      this.setData({
        [`orderList.${food.id}`]: null
      }, function () {
      })
    }  
    console.log(this.data)
  },

  // 提交订单事件
  orderFormSubmit(e: any) {
    var orderMap: any = this.data.orderList
    var orderList: any = []
    for (const key in orderMap) {
      orderList.push(orderMap[key])
    }
     var tempReq : string = JSON.stringify(orderList)
    wx.showModal({
      content: '确认订单?',
        success(res) {
        // app.globalData.userInfo
        if (res.confirm) {
           wx.cloud.callContainer({
            "config": {
              "env": "prod-3gchwfph277dbd79"
            },
            "path": "/api/orderFood",
            "header": {
              "X-WX-SERVICE": "golang-pfa8",
              "content-type": "application/json"
            },
            "method": "POST",
            "data": tempReq,
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

})

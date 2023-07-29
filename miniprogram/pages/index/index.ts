// index.ts

import { formatTime } from "../../utils/util";

// 获取应用实例
const app = getApp<IAppOption>()

class FoodItem  {  
  id: string;  
  icon: string;  // 在定义的时候将 icon 设置为与 id 的值相同  
  name: string;  
  count: number;
  constructor(id:string,name: string ) {  
    this.id = id;  
    this.icon = id+".jpeg";  
    this.count = 0
    this.name = name;
  }  
};

Page({
  data: {
    motto: 'Hello World',
    foodList: [
      // 之后可以写到服务端接口里面
      new FoodItem("qing_cai_chao_xiang_gu",'青菜炒香菇'),
      new FoodItem("qing_chao_xi_hu_lu",'清炒西葫芦'),
      new FoodItem("tu_dou_shao_pai_gu",'土豆烧排骨'),
      new FoodItem("dou_fu_ji_yu_tang",'豆腐鲫鱼汤'),
      new FoodItem("hong_shao_niu_nan",'红烧牛腩'),
      new FoodItem("wu_cai_dan_chao_fan",'五彩蛋炒饭'),
      new FoodItem("fan_xie_chao_ji_dan",'番茄炒鸡蛋'),
      new FoodItem("fei_niu_fan",'肥牛饭'),
      new FoodItem("cong_you_ban_mian",'葱油拌面'),
    ],
    orderList:[],
    extra:""
  },

  onLoad() {
       wx.cloud.init()
  },

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

  // 放大图片
  openImg: function(e : any){
    wx.previewMedia({
      sources: [{url:"https://7072-prod-3gchwfph277dbd79-1315540309.tcb.qcloud.la/img/"+e.target.id}], // 图片的http链接 
    })
  },

  // 事件响应函数   减少菜品
  minusTap: function (e: any) {
    const tempArray = e.currentTarget.id.split('-')
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

  // 订单额外信息输入
  extraInputHandler(e:any){
    this.setData({extra:e.detail.value})
  },

  // 提交订单事件
  orderFormSubmit( ) {
    var orderMap: any = this.data.orderList
    var orderList: any = []
    for (const key in orderMap) {
      orderList.push(orderMap[key])
    }
    if (orderList.length == 0){
      wx.showToast({
        title: '你还没点菜',
        icon: 'error',
        duration: 1500
      });
      return
    }
    const that = this
    wx.showModal({
      title: '输入时间',
      placeholderText:"时间:如明天晚上,后天早上",
      editable: true,
        success(res) {
        if (res.confirm) {
        const  targetPeriod = res.content
          if(targetPeriod != "今天早上"&&targetPeriod != "今天中午"&&targetPeriod != "今天晚上"&&
          targetPeriod != "明天早上"&&targetPeriod != "明天中午"&&targetPeriod!= "明天晚上"&&
          targetPeriod != "后天早上"&&targetPeriod != "后天中午"&&targetPeriod != "后天晚上"){
            wx.showToast({
              title: '请正确设置时间',
              icon: 'error',
              duration: 1500
            });
            return
          }
          const reqBody = {"food_list":orderList,"target_period":targetPeriod,
          "extra":that.data.extra}
           wx.cloud.callContainer({
            "config": {
              "env": "prod-3gchwfph277dbd79"
            },
            "path": "/api/order/orderFood",
            "header": {
              "X-WX-SERVICE": "golang-pfa8",
              "content-type": "application/json"
            },
            "method": "POST",
            "data": reqBody,
          })
          // 重置当前的页面
          that.data.foodList.forEach(food => food.count =0)
          that.setData({
            orderList: [],
            foodList: that.data.foodList,
            extra : ''
          })

          wx.showToast({
            title: '成功提交啦~',
            icon: 'success',
            duration: 1500
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

})

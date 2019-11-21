// import QQMapWX from "@/common/jsdk/qqmap-wx-jssdk";

const http = {
 noLoading(data = {}, method = "post") {
    return new Promise((resolve, reject) => {
      wx.request({
        url: encodeURI("https://m.scxxsx.com/api/customer/services?json=" + JSON.stringify(data)),
        method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          //   'X-Bmob-Application-Id': bmobConfig.applicationId,
          //   'X-Bmob-REST-API-Key': bmobConfig.restApiKey,
          'Content-Type': 'application/json'
        }, // 设置请求的 header
        success: function (res) {
          // success
          resolve(res.data);

          if (res.statusCode != 200) {
            wx.showToast({
              title: "网络出错，稍后再试",
              icon: "none"
            });
            return false;
          }

        },
        fail: function (error) {
          // fail
          reject(error); //请求失败
        },
        complete: function () {
          // complete
        }
      })
    })
  },
  postCommon(data = {}, method = "get") {
    return new Promise((resolve, reject) => {
      wx.request({
        url: encodeURI("https://m.scxxsx.com/api/common/services?json=" + JSON.stringify(data)),
        method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          //   'X-Bmob-Application-Id': bmobConfig.applicationId,
          //   'X-Bmob-REST-API-Key': bmobConfig.restApiKey,
          'Content-Type': 'application/json'
        }, // 设置请求的 header
        success: function (res) {
          // success
          resolve(res.data);

          if (res.statusCode != 200) {
            wx.showToast({
              title: "网络出错，稍后再试",
              icon: "none"
            });
            return false;
          }

        },
        fail: function (error) {
          // fail
          reject(error); //请求失败
        },
        complete: function () {
          // complete
        }
      })
    })
  },
  postRequest(data = {}, method = "post") {
    wx.showLoading({
      title: '加载中',
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: encodeURI("https://m.scxxsx.com/api/customer/services?json=" + JSON.stringify(data)),
        method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          //   'X-Bmob-Application-Id': bmobConfig.applicationId,
          //   'X-Bmob-REST-API-Key': bmobConfig.restApiKey,
          'Content-Type': 'application/json;charset=UTF-8',
          // 'content-type': 'application/x-www-form-urlencoded' // 默认值
        }, // 设置请求的 header
        success: function (res) {
          // success
          wx.hideLoading();
          resolve(res.data);
        },
        fail: function (error) {
          // fail
          wx.hideLoading();
          reject(error);
        },
        complete: function () {
          // complete
          wx.hideLoading();
        }
      })
    })
  },
  post(data = {}, method = "post") {
    wx.showLoading({
      title: '加载中',
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: encodeURI("https://m.scxxsx.com/api/customer/services?json=" + JSON.stringify(data)),
        method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          //   'X-Bmob-Application-Id': bmobConfig.applicationId,
          //   'X-Bmob-REST-API-Key': bmobConfig.restApiKey,
          'Content-Type': 'application/json'
        }, // 设置请求的 header
        success: function (res) {
          // success
          wx.hideLoading();
          resolve(res);
        },
        fail: function (error) {
          // fail
          wx.hideLoading();
          reject(error);
        },
        complete: function () {
          // complete
          wx.hideLoading();
        }
      })
    })
  },
  postFile(data, method = 'post') {
    wx.showLoading({
      title: '上传中',
    })
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: encodeURI('https://m.scxxsx.com/api/uploadFile'),
        filePath: data.path,
        name: 'file',
        method: method,
        headers: {
          'Content-Type': 'multipart/form-data;'
        },
        success: function (res) {
          // success
          wx.hideLoading();
          resolve(res.data);
        },
        fail: function (error) {
          wx.hideLoading();
          // fail
          reject(error);
        },
        complete: function () {
          wx.hideLoading();
          // complete
        }

      })

    })
  },
  share(){
    return  {
     title: "山城乡鲜",
     desc:
       "山城乡鲜是一个专注于健康食品，包括水果、蔬菜、肉类、特产、海鲜、无公害及高品质的有机农产品等优质生鲜食材采购，并配套新鲜物流的服务平台。",
     path: ''
    }
   }




}


export default http;

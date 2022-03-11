import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
    id:''
  },
  // 处理文本输入事件
  handleInput(e){
    // console.log(e)
    let type = e.currentTarget.dataset.type
    let value = e.detail.value
    // console.log(type,value)
    if(type === "phone"){
      this.setData({
        phone: value
      })
    }else{
      this.setData({
        password: value
      })
    }
    
  },
  async login(){
    let {phone,password} = this.data // data中的数据解构
    // 前端验证
    if(!phone){
      wx.showToast({
        title: "手机号不能为空",
        icon: "none"
      })
      return
    }
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return;
    }
    if(!password){
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }

    //后端验证
    let res = await request('/login/cellphone',{phone,password,isLogin: true})
    // console.log(res)
    if(res.code === 200){
      // 登录成功
      wx.setStorageSync('userInfo',JSON.stringify(res.profile))
      wx.showToast({
        title: '登录成功'
      })
      wx.reLaunch({
        url: '/pages/personal/personal'
      })
    }else if(res.code ===502){
      //登录失败
      wx.showToast({
        title: '密码错误',
        icon: 'error'
      })
    }else{
      wx.showToast({
        title: '登录失败',
        icon: 'error'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 与personal页面通信
    // console.log(options)
  //   let {id }=options
  //   this.setData({
  //     id
  //   })
  // 自定义事件进行通信
    // console.log(this.getOpenerEventChannel())
    // let event = this.getOpenerEventChannel()
    // event.on('sendData',(data)=>{
    //   console.log(data)
    //   this.setData({
    //     obj: data
    //   })
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
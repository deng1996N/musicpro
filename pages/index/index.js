import request from '../../utils/request'
// pages/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    recommendList:[],
    topList: []
  },
  // 到推荐歌曲
  toRecom(){
    wx.navigateTo({
      url: '/pages/songPackage/pages/recommendSong/recommendSong'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:  function (options) {
    this.getIndexData()    
  },
  async getIndexData (){
    // 网络请求获取轮播图数据
    let bannersRes = await request('/banner',{type:1})
    // 网路请求获取推荐歌单数据
    let recommendRes = await request('/personalized')
    // 获取排行榜数据
    let index = 0
    let topArr =[]
    while(index < 4){
      let topList = await request('/top/list',{idx:index++})
      // console.log(topList.playlist.tracks.slice(0,5))
      let topItem = {name: topList.playlist.name, tracks: topList.playlist.tracks.slice(0, 5)}
      topArr.push(topItem)
      this.setData({
        topList : topArr
      })
    }
    this.setData({
      banners: bannersRes.banners,
      recommendList: recommendRes.result,
    })
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
    // console.log(this.data.banners)
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
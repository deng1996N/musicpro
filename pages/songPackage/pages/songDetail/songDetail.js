import PubSub from 'pubsub-js';
import moment from 'moment'
import request from '../../../../utils/request'
// 获取全局实例
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 音乐是否播放
    song: {}, // 歌曲详情对象
    musicId: '', // 音乐id
    recommendList: [],// 列表
    musicLink: '', // 音乐的链接
    currentTime: '00:00',  // 实时时间
    durationTime: '00:00', // 总时长
    currentWidth: 0, // 实时进度条的宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // options: 用于接收路由跳转的query参数
    // 原生小程序中路由传参，对参数的长度有限制，如果参数长度过长会自动截取掉
    // console.log(JSON.parse(options.songPackage));
    // console.log(options)
    // const eventChannel = this.getOpenerEventChannel()
    // eventChannel.on('sendList', function(data) {
    //   console.log(data)})
    let musicId = options.musicId
    let isPlay= options.isPlay
    this.setData({
      musicId,
      isPlay
    })
    this.getMusicInfo(musicId)
    
      // 创建控制音乐播放的实例
      this.backgroundAudioManager = wx.getBackgroundAudioManager();
      
      // 监视音乐播放/暂停/停止
      this.backgroundAudioManager.onPlay(() => {
        this.changePlayState(true);
        // 修改全局音乐播放的状态
        appInstance.globalData.musicId = musicId;
      });
      this.backgroundAudioManager.onPause(() => {
        this.changePlayState(false);
      });
      this.backgroundAudioManager.onStop(() => {
        this.changePlayState(false);
      });
      this.musicControl(isPlay, musicId, this.musicLink)

      // 监听音乐实时播放的进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      // console.log('总时长: ', this.backgroundAudioManager.duration);
      // console.log('实时的时长: ', this.backgroundAudioManager.currentTime);
      // 格式化实时的播放时间
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
      let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration * 450;
      this.setData({
        currentTime,
        currentWidth
      })

      
    });
    // 监听音乐播放自然结束
    this.backgroundAudioManager.onEnded(() => {
      // 自动切换至下一首音乐，并且自动播放
      // PubSub.publish('switchType', 'next')
      // 将实时进度条的长度还原成 0；时间还原成 0；
      this.setData({
        currentWidth: 0,
        currentTime: '00:00'
      })
    });
      
      
  },
  // 获取音乐详情的功能函数
  async getMusicInfo(musicId){
    let songData = await request('/song/detail', {ids: musicId});
    // songData.songs[0].dt 单位ms
    let durationTime = moment(songData.songs[0].dt).format('mm:ss');
    this.setData({
      song: songData.songs[0],
      durationTime
    })
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },
   // 修改播放状态的功能函数
   changePlayState(isPlay){
    // 修改音乐是否的状态
    this.setData({
      isPlay
    })
    //修改全局播放同步
    appInstance.globalData.isMusicPlay=isPlay
  },
  handleMusicPlay(){
    let isPlay = !this.data.isPlay;
    // 修改是否播放的状态
    this.setData({
      isPlay
    })
    
    let {musicId, musicLink} = this.data;
    this.musicControl(isPlay, musicId,musicLink);
  },
  // 点击进度条


  
  // 控制音乐播放/暂停的功能函数
  async musicControl(isPlay, musicId,musicLink){
    
    if(isPlay){ // 音乐播放
      if(!musicLink){
        // 获取音乐播放链接
        let musicLinkData = await request('/song/url', {id: musicId});
        musicLink = musicLinkData.data[0].url;
        
        this.setData({
          musicLink
        })
      }
      // 播放音乐
      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.song.name;
    }else { // 暂停音乐
      this.backgroundAudioManager.pause();
    }
    
  },
  showList(){

  },
  //点击切换上/下一首
  handleSwitch(e){
    // 获取推荐页面传来的id
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false);
    });
    this.data.musicLink=''
    PubSub.subscribe('sendId',(msg,val) => {
      // console.log(val)
      this.getMusicInfo(val)
      this.musicControl(true,val)
      PubSub.unsubscribe('sendId')
    })
    
    // 向推荐页面发送当前点击的按钮是上一首还是下一首
    PubSub.publish('curPlay',e.currentTarget.id)
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

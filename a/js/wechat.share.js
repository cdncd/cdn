var wechatShare = function(shareData) {};
if ($("html").html().indexOf('https://res.wx.qq.com/open/js/jweixin-1.3.0.js') === -1) {

var wechatData = {}; 
   wechatShare = function (shareData,isDebug) { 

       LoadScript("https://res.wx.qq.com/open/js/jweixin-1.3.0.js", function () { 
           try {

               $.ajax({
                   type: 'POST',
                   url: '/ServiceAPI/usercenter/Manager.aspx',
                   data: { action: 'getweahtjsconfig' },
                   dataType: 'json',
                   timeout: 30000,
                   success: function (data) {

                       if (data.id === 1) {
                           if (data.items) {

                               wechatData = data.items;
                               try {

                                   // 注意：所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。 
                                   // 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
                                   // 完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
                                   wx.config({
                                       debug: isDebug,
                                       appId: wechatData.appId,
                                       timestamp: wechatData.timestamp,
                                       nonceStr: wechatData.nonceStr,
                                       signature: wechatData.signature,
                                       jsApiList: [
                                           'checkJsApi', 'hideAllNonBaseMenuItem',
                                           'onMenuShareTimeline', //分享到朋友圈
                                           'onMenuShareAppMessage', //分享给朋友
                                           'onMenuShareQQ', //分享到QQ
                                           'onMenuShareWeibo', //分享到腾讯微博 
                                           'hideMenuItems'
                                       ]
                                   });
                                   wx.error(function (res) {
                                       console.log(res);
                                   });
                                   wx.ready(function () {
                                       wx.onMenuShareAppMessage(shareData);
                                       wx.onMenuShareTimeline(shareData);
                                       wx.onMenuShareQQ(shareData);
                                       wx.onMenuShareWeibo(shareData);

                                       console.log(shareData);
                                   });



                               } catch (e) {
                                   console.log(e);
                               }

                           }
                       }

                   },
                   error: function (xhr, type) {


                   }
               });

           } catch (e) {
               console.log(e);

           }
       });
        

    };
}


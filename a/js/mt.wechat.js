!(function () {
	var jsonpData = function(url, callback) {
        var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
        window[callbackName] = function(data) {
            delete window[callbackName];
            document.body.removeChild(script);
            callback(data);
        };
	    var script = document.createElement('script');
        script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
        document.body.appendChild(script);
    }
	
	var cloneObj = function(oldObj) { //复制对象方法
		if (typeof(oldObj) != 'object') return oldObj;
		if (oldObj == null) return oldObj;
		var newObj = new Object();
		for (var i in oldObj)
		newObj[i] = cloneObj(oldObj[i]);
		return newObj;
	}
	
	var extendObj = function() { //扩展对象
		var args = arguments;
		if (args.length < 2) return;
		var temp = cloneObj(args[0]); //调用复制对象方法
		for (var n = 1; n < args.length; n++) {
			for (var i in args[n]) {
				temp[i] = args[n][i];
			}
		}
		return temp;
    }

    var mtwc = {};

     mtwc = function (opt) {

         if (!(this instanceof mtwc)) {
             return new mtwc(opt);
        }
        var config = {
            title: document.title,
            desc: document.title,
            link: window.location.href,
            img: '',
            request_share_url: '/ServiceAPI/usercenter/Manager.aspx?action=getweahtjsconfig',
            success_callback: function () {

            },
            cancel_callback: function () {

            },
            debug: false,
            isShare:true
        }

        this.defaults = extendObj(config, opt);
        this.init();
    }
	

    mtwc.prototype = {
        init: function () {
            var self = this;
            self.doconfig();
        },
        doconfig: function () {
            var self = this;
            /*share*/
            var request_share_url = self.defaults.request_share_url;
            jsonpData(request_share_url, function(jdata){
				console.log('doconfig', jdata);
                console.log('defaluts', self.defaults);
                var msg = jdata.items;
                wx.config({
                    debug: self.defaults.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: msg.appId, // 必填，公众号的唯一标识
                    timestamp: msg.timestamp, // 必填，生成签名的时间戳
                    nonceStr: msg.nonceStr, // 必填，生成签名的随机串
                    signature: msg.signature,// 必填，签名，见附录1
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'chooseWXPay', 'onMenuShareWeibo', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'translateVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function () {
                    var share_title = self.defaults.title;
                    var share_desc = self.defaults.desc;
                    var share_link = self.defaults.link;
                    var share_img = self.defaults.img;
                    //分享到朋友圈
                    wx.onMenuShareTimeline({
                        title: share_title, // 分享标题
                        link: share_link, // 分享链接
                        imgUrl: share_img, // 分享图标
                        success: function () {
                            self.defaults.success_callback();
                        },
                        cancel: function () {
                            self.defaults.cancel_callback();
                        }
                    });
                    //分享给朋友
                    wx.onMenuShareAppMessage({
                        title: share_title, // 分享标题
                        desc: share_desc, // 分享描述
                        link: share_link, // 分享链接
                        imgUrl: share_img, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            self.defaults.success_callback();
                        },
                        cancel: function () {
                            self.defaults.cancel_callback();
                        }
                    });


                    wx.onMenuShareQQ({
                        title: share_title, // 分享标题
                        desc: share_desc, // 分享描述
                        link: share_link, // 分享链接
                        imgUrl: share_img, // 分享图标
                        success: function () {
                            self.defaults.success_callback();
                        },
                        cancel: function () {
                            self.defaults.cancel_callback();
                        }
                    });


                    wx.onMenuShareWeibo({
                        title: share_title, // 分享标题
                        desc: share_desc, // 分享描述
                        link: share_link, // 分享链接
                        imgUrl: share_img, // 分享图标
                        success: function () {
                            self.defaults.success_callback();
                        },
                        cancel: function () {
                            self.defaults.cancel_callback();
                        }
                    })
                });
			});
            /*share end*/
        }
    }
    // RequireJS && SeaJS
    if (typeof define === 'function') {
        define(function () {
            return mtwc;
        });

// NodeJS
    } else if (typeof exports !== 'undefined') {
        module.exports = mtwc;
    } else {
        this.mtwc = mtwc;
    }

})()

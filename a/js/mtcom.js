
if (!MT) var MT = {};
MT = {
    version: '0.2',
    ServiceUrl: "",
    isIphone: (navigator.userAgent.indexOf('iPhone') >= 0),
    isIpad: (navigator.userAgent.indexOf('iPad') >= 0),
    isAndroid: (navigator.userAgent.indexOf('Android') >= 0),
    isWeixin: (navigator.userAgent.indexOf('MicroMessenger') >= 0),
    wxCallback: [],
    ajax: function(options) {
        if (typeof options !== 'object') {
            var message = '请求传参应为 object 类型，但实际传了 ' + (typeof options) + ' 类型';
            console.log(message);
            return;
        }
        if (!options.url) {
            var message = '请求url 不能为空!';
            console.log(message);
            return;
        }

        options.url = MT.ServiceUrl + options.url;


        //options.headers = options.headers || {};
        // options.headers['mtclient'] = '';  //微信端 

        try {

            var success = options.success;
            if (typeof options.success == 'function') {
                options.success = function(data) {

                    success(data);
                    var srcdata = options.data;
                   // srcdata.url = options.url;
                    //TODO 
                    // try {  $.ajax({ type: 'GET',  url: 'http://llog.hyxmt.cn/e.html', data: srcdata,  dataType: 'jsonp' });  } catch (e) {  }
                }
            }
            var error = options.error;
            if (typeof options.error == 'function') {

                options.error = function(data) {

                    error(data);
                    //TODO 
                    var srcdata = options.data;
                   // srcdata.url = options.url;
                    //TODO 
                    try {
                        $.ajax({ type: 'GET', url: 'http://llog.hyxmt.cn/e.html', data: srcdata, dataType: 'jsonp' });
                    } catch (e) {
                    }

                }

            }

            $.ajax(options);

        } catch (e) {
            console.log(e);
            //出错提示 
        }


    },

    runCallback:function() {
        var arg = arguments,
            callback = arg[0],
            data = arg[1];

        if (typeof callback == 'function') {
            callback(data);
        }
    },
    jsonpData: function (url, callback)  {

        var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
        var script = document.createElement('script');
        window[callbackName] = function (data) {
            delete window[callbackName];
            document.body.removeChild(script);
            callback(data);
        };
      
        script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
        document.body.appendChild(script);
    },
    cloneObj: function (oldObj) { //复制对象方法
        var self = this;
        if (typeof (oldObj) != 'object') return oldObj;
        if (oldObj == null) return oldObj;
        var newObj = new Object();
        for (var i in oldObj)
            newObj[i] = self.cloneObj(oldObj[i]);
        return newObj;
    },
    extendObj: function () { //扩展对象
        var self = this;
        var args = arguments;
        if (args.length < 2) return;
        var temp = self.cloneObj(args[0]); //调用复制对象方法
        for (var n = 1; n < args.length; n++) {
            for (var i in args[n]) {
                temp[i] = args[n][i];
            }
        }
        return temp;
    },
    /*
         * JS对象缓存的变量
         * @property _js_cache
         * @type Object
         * @default {}
         * @private
         */
    _js_cache: {},
    /**
     * 本地缓存，存入方法
     * @namespace mjs
     * @method locCache_set
     * @param {String} k 需要存入缓存的Key
     * @param {All} v 需要存入缓存的内容
     * @param {Int} [e] 需要缓存的值的过期时间；默认为JO缓存到浏览器关闭，小于100000000时是需要缓存的秒数，反之是过期时间的时间戳
     * @param {String} [t='JO'] 缓存的类型，默认为JO类型，JO=JavaScript Object，LS=localStorage
     * @static
     */
    locCache_set: function (k, v, e, t) {
        //缓存时间的处理
        if (typeof (e) != 'number') {
            //如果没有缓存时间直接存入JS中
            t = "JO";
            e = 86400;
        } else if (e === 0) {
            //为0是删除之前的缓存
            this.locCache_remove(k);
            return;
        }
        //处理缓存时间
        this.locCache_expires(k, e, t);

        //存储到JS缓存
        this._js_cache[k] = v;

        //判断LS并且缓存
        if (localStorage && t == "LS") {
            if (typeof (v) == 'string' || typeof (v) == 'number') {
                v = v;
            } else if (typeof (v) == 'boolean') {
                v = '(-boolean-)' + v.toString();
            } else if (typeof (v) == 'object') {
                v = '(-object-)' + JSON.stringify(v);
            }
            localStorage.setItem(k, v);
            //保存过期时间部分
            localStorage.setItem('__expires__', JSON.stringify(this._js_cache['__expires__']['LS']));
        }
    },
    /**
     * 本地缓存，读取方法
     * @namespace mjs
     * @method locCache_get
     * @param {String} k 需要取得的缓存的Key
     * @returns {All} 返回对应的缓存数据
     * @static
     */
    locCache_get: function (k) {
        //得到缓存时间
        var e = this.locCache_expires(k);

        //过期处理
        if (!e || e < new Date().getTime()) {
            return undefined;
        }

        //读取JS缓存
        var o = this._js_cache[k];

        //如果没有取到，判断LS并取得
        if (!o && localStorage) {
            o = localStorage.getItem(k);
            if (o && o.indexOf("(-boolean-)") == 0) {
                o = (o == "(-boolean-)true");
            } else if (o && o.indexOf("(-object-)") == 0) {
                o = JSON.parse(o.substr(10));
            }
            this._js_cache[k] = o;
        }
        return o;
    },
    /**
     * 本地缓存，删除方法
     * @namespace mjs
     * @method locCache_remove
     * @param {String} k 需要删除缓存的Key
     * @static
     */
    locCache_remove: function (k) {
        //删除过期时间
        this.locCache_expires(k, null);
        //删除JS缓存
        delete this._js_cache[k];
        //判断LS并删除
        if (localStorage) {
            localStorage.removeItem(k);
            //保存过期时间部分
            localStorage.setItem('__expires__', JSON.stringify(this._js_cache['__expires__']['LS']));
        }
    },
    /**
     * 本地缓存，清理方法，自动将过期缓存清空
     * @namespace mjs
     * @method locCache_clear
     * @param {boolean} [all=false] 是否清空全部缓存；默认为否，只删除过期的缓存内容
     * @static
     */
    locCache_clear: function (all) {
        //删除所有
        if (all === true) {
            this._js_cache = {};
            localStorage.clear();
            return;
        }
        //得到缓存时间
        var es = this.locCache_expires();
        for (i in es) {
            for (k in es[i]) {
                if (es[i][k] < new Date().getTime()) {
                    this.locCache_remove(k);
                }
            }
        }
    },
    /**
     * 本地缓存，过期时间的操作
     * @namespace mjs
     * @method locCache_expires
     * @param {String} k 缓存的key
     * @param {Int|Null} [e] 缓存过期时间，如果带入0或null则删除缓存
     * @param {String} [t='JO'] 缓存的类型，默认是JO类型，JO=JavaScript Object，LS=localStorage
     * @returns {ALL} 如果只有k，返回此k对应的过期时间，否则返回整个过期时间数组
     * @static
     */
    locCache_expires: function (k, e, t) {
        t = t == 'LS' ? 'LS' : 'JO';
        //创建缓存时间JS对象
        if (!this._js_cache['__expires__']) {
            this._js_cache['__expires__'] = {
                'JO': {},
                'LS': !localStorage ? {} : JSON.parse(localStorage.getItem('__expires__')) || {}
            };
        }

        if (e === 0 || e === null) {
            //删除过期时间
            delete this._js_cache['__expires__']['JO'][k];
            delete this._js_cache['__expires__']['LS'][k];
        } else if (e !== undefined) {
            //存入过期时间
            this._js_cache['__expires__'][t][k] = e < 100000000 ? new Date().getTime() + e * 1000 : e || 0;
        }

        //如果存在k，返回对应过期时间
        if (k !== undefined) {
            return this._js_cache['__expires__']['JO'][k] || this._js_cache['__expires__']['LS'][k];
        }
        //读取所有的过期时间列表
        return this._js_cache['__expires__'];
    },
    /**
     * 本地缓存简单调用方法
     * @namespace mjs
     * @method locCache
     * @param {String} k 缓存的key
     * @param {All} [v=undefined] 需要缓存的数据，值为null是删除此缓存，不填写是得到缓存
     * @param {String} [t='JO'] 缓存的类型，LS=localStorage, CK=Cookie
     * @returns {All} 如果只带入k，则返回对应的缓存数据
     * @static
     * @deprecated Use `locCache_set`,`locCache_get`,`locCache_remove`
     */
    locCache: function (k, v, t) {
        if (v === undefined) {
            //得到内容
            return this.locCache_get(k);
        } else if (v === null) {
            //删除内容
            this.locCache_remove(k);
        }
        //缓存内容
        this.locCache_set(k, v, t);
    },
    defaults: {
        title: document.title,
        desc: document.title,
        link: window.location.href,
        img: '',
        service_url: '/ServiceAPI/usercenter/Manager.aspx?action=getweahtjsconfig',
        success: function () {

        },
        cancel: function () {

        },
        debug: false,
        isShare: true,
        isLocation:false
    },
     
    wxinit: function (opt) {
        var self = this;
        this.defaults = self.extendObj(self.defaults, opt); 
        self.doconfig();
    }, 
    
    wxready: function (fun) {
        var self = this;
        if (typeof fun == 'function') {
            self.wxCallback.push(fun);
        } else {
            console.log("not function!");
        }

    },
    /**
     * 
     * @param {} callback 
     * @returns {} 
     */
    get_signature: function (callback) {
        var self = this;
        var href = location.href,
            signature = self.locCache_get('signature' + href);
        if (signature) {
            signature = JSON.parse(signature);

            if (signature) {
                if (signature.url == href) {
                    callback(signature);
                    return;
                }
            }
          
        }
        self.jsonpData(self.defaults.service_url, function(jdata) { 
            var data = jdata.items; 
            self.locCache_set('signature' + href, JSON.stringify(data),7000, "LS");
            callback(data);
        });

    },
    doconfig: function () {
        var self = this;
        //初始化签名
        if (self.isWeixin) {
            self.get_signature(function(signature) {
                signature = signature || {};
                wx.config({
                    debug: self.defaults.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: signature.appId, // 必填，公众号的唯一标识
                    timestamp: signature.timestamp, // 必填，生成签名的时间戳
                    nonceStr: signature.nonceStr, // 必填，生成签名的随机串
                    signature: signature.signature,// 必填，签名，见附录1
                    jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'translateVoice', 'launch3rdApp', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'startSearchBeacons', 'stopSearchBeacons', 'onSearchBeacons','getLocalImgData'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function () {

                    self.checkWeiJsApi();

                    if (self.defaults.isShare) {
                        self.share();
                    }
                    if (self.defaults.isLocation) {
                        self.getLoc();
                    }
                    for (var i = 0; i < self.wxCallback.length; i++) {
                        self.wxCallback[i]();
                    }
                });

            });

        } 
    },

    share: function () {
        var self = this;
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
                self.defaults.success();
            },
            cancel: function () {
                self.defaults.cancel();
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
                self.defaults.success();
            },
            cancel: function () {
                self.defaults.cancel();
            }
        });


        wx.onMenuShareQQ({
            title: share_title, // 分享标题
            desc: share_desc, // 分享描述
            link: share_link, // 分享链接
            imgUrl: share_img, // 分享图标
            success: function () {
                self.defaults.success();
            },
            cancel: function () {
                self.defaults.cancel();
            }
        });


        wx.onMenuShareWeibo({
            title: share_title, // 分享标题
            desc: share_desc, // 分享描述
            link: share_link, // 分享链接
            imgUrl: share_img, // 分享图标
            success: function () {
                self.defaults.success();
            },
            cancel: function () {
                self.defaults.cancel();
            }
        })

    },
    openApp: function (schema, succCallback, failCallback) {
        if (schema.indexOf('imeituan://www.meituan.com') == 0) {
            wx.ready(function () {
                wx.invoke('launch3rdApp', {
                    'appID': 'wxa552e31d6839de85', // 公众号appID
                    'messageExt': schema.replace('imeituan://www.meituan.com', ''), // iOS使用此参数，第三方应用自定义简单数据
                    'extInfo': schema.replace('imeituan://www.meituan.com', '') // Android使用此参数，第三方应用自定义简单数据
                }, function (res) {
                    if (res.err_msg != 'launch_3rdApp:ok') {
                        failCallback(res);
                    } else {
                        succCallback(res);
                    }
                });
            });
        } else {
            //其他暂不支持
        }
    },
    getLoc: function() {
        //首先删除本域名的cookie 
     //   $.cookie('Lat', '', { path: '/' });
      //  $.cookie('Lng', '', { path: '/' });
      //  $.cookie('Lat')
        wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                var speed = res.speed; // 速度，以米/每秒计
                var accuracy = res.accuracy; // 位置精度
                $.cookie('Lat', latitude, { path: '/' });
                $.cookie('Lng', longitude, { path: '/' });
                console.log(JSON.stringify(res));
            }
        });
    },
    /**
       * 隐藏菜单单项，文档：
       * https://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
       */
    hideMenuItems: function (arr) {
        wx.ready(function () {
            arr = arr || [];
            wx.hideMenuItems({
                menuList: arr
            });
        });
    },

    checkWeiJsApi: function() {
        wx.checkJsApi({
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'translateVoice', 'launch3rdApp', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'startSearchBeacons', 'stopSearchBeacons', 'onSearchBeacons','getLocalImgData'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function (res) {

                if (res.errMsg == 'checkJsApi:ok') {
                    global.checkResult = res.checkResult;

                } else {
                    global.checkResult = {};
                }

               // console.log(JSON.stringify(res));
            
                // global.checkResult = res.checkResult;
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
            }
        });

    },

    /**
        * 得到两个经纬度之间的直线距离
        * @namespace mjs
        * @method getDistance
        * @param {Number} lat1 第一个纬度值
        * @param {Number} lng1 第一个经度值
        * @param {Number} lat2 第二个纬度值
        * @param {Number} lng2 第二个经度值
        * @returns {Number} 两个经纬度之间的直线距离，单位米
        * @static
        */
    getDistance: function (lat1, lng1, lat2, lng2) {
        var r1 = lat1 * Math.PI / 180,
            r2 = lat2 * Math.PI / 180,
            a = r1 - r2,
            b = lng1 * Math.PI / 180 - lng2 * Math.PI / 180,
            s = 6378137 * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(r1) * Math.cos(r2) * Math.pow(Math.sin(b / 2), 2)));
        return Math.round(s * 10) / 10;
    },
    /**
       * 发送日志之前，拼装日志必要的参数
       * 如：用户ID，session ID，log id等
       * @return {[type]}             [description]
       */
    getNecessityParam: function () {
        var paramArr = [
            // 用户ID，读cookie
            'client_id=' + getClientId(),
            // session id
            'session_id=' + getSessionId(),
            // 从用户打开程序开始，每次发送日志自动增加1
            'step_id=' + stepId++,
            // 产品标识，MO为mo
            'product=' + configProduct,
        ];
        // 来源
        if (referrerFlag) {
            paramArr.push('src=' + referrerFlag);
        }
        // 程序当前版本号
        if (configVersion) {
            paramArr.push('version=' + configVersion);
        }

        return paramArr;
    },
    /**
     * 获取拼接好 sessionID等字符串之后的对象
     * @param  {String} trackerData 原始日志对象
     * @return {Object}             组装好的日志对象
     */
    getFullLogObject: function (trackerData) {

        trackerData = trackerData || {};
        var paramArr = getNecessityParam(trackerData),
            logId = uuid(),
            // 切割后的日志数组，会遍历此数组，逐个发送请求
            requestList = [],
            // 日志content部分的字符串
            logContentStr = '';

        paramArr.push('log_id=' + logId);

        // 用户当前城市adcode、位置经纬度、图面中心点等信息
        if (!!trackerData.position && !isEmptyObject(trackerData.position)) {
            var position = pick(trackerData.position, 'adcode', 'mapcenter', 'userloc');
            if (!isEmptyObject(position)) {
                paramArr.push('position=' + JSON.stringify(trackerData.position));
            }
        }

        // 用户自定义操作描述，记录用户操作等信息
        if (!!trackerData.content && !isEmptyObject(trackerData.content)) {
            // 过滤content中没有用的数据
            var content = pick(trackerData.content, 'oprCategory', 'oprCmd', 'page', 'button', 'data');
            // 深度遍历content，将其叶子value进行uri编码
            content = deepEncodeObjValue({}, content);

            if (!isEmptyObject(content)) {
                logContentStr = JSON.stringify(content);
                paramArr.push('content=' + logContentStr);
            }
        }

        return {
            logId: logId,
            data: paramArr
        };
    }
};


function genRandNumber(startNum, endNum) {
    var randomNumber;
    randomNumber = Math.round(Math.random() * (endNum - startNum)) + startNum;
    return randomNumber;
}

var UNPOST_KEY = '_MT_P_';
var GET_KEY_PREFIX = '_MT_';

/**
 * 缓存从服务端获取的数据
 * @param key
 * @param value
 */
var _save = function (key, value) {
    var data = {
        data: value,
        cacheTime: new Date()
    }
    window.localStorage.setItem(GET_KEY_PREFIX + key, JSON.stringify(data));
}
/**
 * 获取本地已缓存的数据
 */
var _get = function (key) {
    return JSON.parse(window.localStorage.getItem(GET_KEY_PREFIX + key));
}

/**
 * 获取本地已缓存的数据 不管理时间
 */
var _get2 = function (key) {
    var obj = JSON.parse(window.localStorage.getItem(GET_KEY_PREFIX + key));
    if (obj) {
        return obj.data;
    } else {
        return null;
    }

}

/**
 * 删除本地已缓存的数据
 */
var _clear = function (key) {
    return window.localStorage.removeItem(GET_KEY_PREFIX + key);
}

/**
 * 清空本地缓存
 */
var clear = function () {
    var storage = window.localStorage;
    for (var key in storage) {
        if (key.indexOf(GET_KEY_PREFIX) == 0) {
            storage.removeItem(key);
        }
    }
    storage.removeItem(UNPOST_KEY);
}

var TipLoad = {};

TipLoad.loading = function (text, timeout) {
    var tip = text ? text : '加载中...';
    timeout = timeout || 1 * 1000;

    $('#jingle_popup_mask').show();
    $('#jingle_popup').show();
    $('#jingle_popup p').text(tip);

    setTimeout(function () { TipLoad.close() }, timeout);

}


TipLoad.close = function () {
    $('#jingle_popup_mask').hide();
    $('#jingle_popup').hide();
}
/* 

//取参数
*/
function GetQueryString(name, url) {

    if (url && url.indexOf('?') != -1) {
        var args = new Object(); //声明一个空对象 

        //获取URL中全部参数列表数据  
        var query = "&" + url.split("?")[1];

        if (query.indexOf('#') != -1) {
            query = query.split("#")[0];
        }

        var pairs = query.split("&"); // 以 & 符分开成数组 
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('='); // 查找 "name=value" 对 
            if (pos == -1) continue; // 若不成对，则跳出循环继续下一对 
            var argname = pairs[i].substring(0, pos); // 取参数名 
            var value = pairs[i].substring(pos + 1); // 取参数值 
            value = decodeURIComponent(value); // 若需要，则解码 
            args[argname] = value; // 存成对象的一个属性 
        }


        return args[name];

    } else {
        return null;
    }
}

/*  */
//截取字符串 包含中文处理 
//(串,长度,增加...) 
function subString(str, len, hasDot) {
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = str.replace(chineseRegex, "**").length;
    for (var i = 0; i < strLength; i++) {
        singleChar = str.charAt(i).toString();
        if (singleChar.match(chineseRegex) != null) {
            newLength += 2;
        }
        else {
            newLength++;
        }
        if (newLength > len) {
            break;
        }
        newStr += singleChar;
    }

    if (hasDot && strLength > len) {
        newStr += "...";
    }
    return newStr;
}


////
//$(function () {
//    //自动设置高度
//    $('html').height($(window).height());
//    $('#index_section').height($(window).height());
//    $(window).resize(function () {
//        $('html').height($(window).height());
//        $('#index_section').height($(window).height());
//    });


//});


var settings = {

    //page默认动画效果
    transitionType: 'slide',
    //自定义动画时的默认动画时间(非page转场动画时间)
    transitionTime: 250,
    //自定义动画时的默认动画函数(非page转场动画函数)
    transitionTimingFunc: 'ease-in',
    //toast 持续时间,默认为3s
    toastDuration: 3000
}
/*
* alias func
* 简化一些常用方法的写法
** /
/**
* 完善zepto的动画函数,让参数变为可选
*/
var Janim = function (el, animName, duration, ease, callback) {
    var d, e, c;
    var len = arguments.length;
    for (var i = 2; i < len; i++) {
        var a = arguments[i];
        var t = $.type(a);
        t == 'number' ? (d = a) : (t == 'string' ? (e = a) : (t == 'function') ? (c = a) : null);
    }
    $(el).animate(animName, d || settings.transitionTime, e || settings.transitionTimingFunc, c);
}

/*
*  
*  附加返回方法
*/
window.history.goback = function (url) {
    if (history.length >= 2) {
        history.back();
    } else {
        try {
            //如果有值
            if (url) {
                location.href = url;
            } else {
                location.href = "/a/";
            }

            // TipLoad.loading();
        } catch (e) {
            alert(e);
        }

    }
}

/*
*  
*  动态加载script 文件
*/
function LoadScript(url, callback) {
    callback = callback || function () { };
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = script.onreadystatechange = function () {
        if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
            //加载完成回调
            callback();
            // Handle memory leak in IE 
            script.onload = script.onreadystatechange = null;
        }
    };
    script.src = url;
    head.appendChild(script);
}




function CheckEmail(email) {
    return /^[\w\.\-\+]+@([\w\-]+\.)+[a-z]{2,4}$/ig.test(email)
}
function CheckPhone(phone) {
    return /^1[3|4|5|7|8][0-9]\d{8}$/.test(phone);
}
function CheckTel(tel) {
    return /(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)/.test(tel);
}
function CheckSite(site) {
    return /^http:\/\/+[a-z]{2,4}/.test(site);
}


//运行代码
function doRun(cod1) {
    cod = document.getElementById(cod1)
    var code = cod.value;
    if (code != "") {
        var newwin = window.open('', '', '');
        newwin.opener = null
        newwin.document.write(code);
        newwin.document.close();
    }
}


//添加查看图片 神童
/*
自动选择宽或高为标准
showGallery('url');
以宽度为标准
showGallery('url',true);
*/
$(function () {
    $('head').append('<style>.fs_gallery{background:rgba(0,0,0,0.9);position:fixed;left:0;top:0;right:0;bottom:0;z-index:99999}.fs_gallery_close{position:absolute;top:20px;right:20px;width:35px;height:35px;color:#ccc;font-size:34px;line-height:23px;text-align:center;cursor:pointer;z-index:102}.fs_gallery_close:before{content:"×"}.fs_gallery_close:hover{color:#fff}.fs_gallery_prev,.fs_gallery_next{position:absolute;width:80px;color:#888;font-size:30px;cursor:pointer;z-index:101}.fs_gallery_prev:hover,.fs_gallery_next:hover{background:rgba(0,0,0,0.1);color:#fff}.fs_gallery_prev{left:0;top:0;bottom:0}.fs_gallery_next{right:0;top:0;bottom:0}.fs_gallery_prev:before{content:"‹";position:absolute;height:30px;margin-top:-30px;top:50%;left:35px}.fs_gallery_next:before{content:"›";position:absolute;height:30px;margin-top:-30px;top:50%;left:35px}.fs_gallery_shuft{position:relative;width:9999999px}.fs_gallery_shuft:after{clear:both;content:"";display:block}.fs_gallery_shuft_item{float:left;position:relative;background-image:url(data:image/gif;base64,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);background-position:center center;background-repeat:no-repeat}.fs_gallery_shuft_item img{box-shadow:0 0 8px rgba(0,0,0,0.8);position:absolute;top:50%;left:50%}</style>');
});

function showGallery(img, isWidth) {
    var image = new Image();
    image.src = img;

    image.onload = function () {

        var bWidth = $(window).width();        //设置最大宽度
        var bHeight = $(window).height();
        var sHeight = image.height;
        var sWidth = image.width;


        if (image.width > bWidth || image.height > bHeight) {
            var scaling = 1;
            var wScaling = 1 - (image.width - bWidth) / image.width;
            var hScaling = 1 - (image.height - bHeight) / image.height;

            //取最小比例
            //是否指定以宽度为标准
            if (isWidth) {
                scaling = wScaling;
            } else {
                if (wScaling > hScaling) {
                    scaling = hScaling;
                } else {
                    scaling = wScaling;
                }
            }


            //计算缩小比例
            sWidth = image.width * scaling;
            sHeight = image.height * scaling;    //img元素设置高度时需进行等比例缩小
        }

        var margintop = sHeight / 2;
        var marginleft = sWidth / 2;

        var obj = { src: image.src, width: image.width, height: image.height, sHeight: sHeight, sWidth: sWidth, bHeight: bHeight, bWidth: bWidth, margintop: margintop, marginleft: marginleft };
        console.log(obj);

        var fs_gallery = '<div class="fs_gallery"> <div class="fs_gallery_close" onclick="closeGallery();"></div><div class="fs_gallery_shuft" style="transition-duration: 0ms; transform: translate(0px, 0px);"><div class="fs_gallery_shuft_item" style="width:' + obj.bWidth + 'px; height:' + obj.bHeight + 'px;overflow: auto;overflow-x: hidden;"><img src="' + obj.src + '" alt="" style="width:' + obj.sWidth + 'px;height:' + obj.sHeight + 'px;  margin-top: -' + obj.margintop + 'px;margin-left: -' + obj.marginleft + 'px; display: inline;"></div></div><div class="fs_gallery_thumbs"><div class="fs_gallery_thumbs_list"></div></div></div>';

        $("body").append(fs_gallery);
    };


}

function closeGallery() {
    $(".fs_gallery").remove();
}

//添加查看图片end

var islog = false;
//日志输出
var mconsole = {};
mconsole.log = function () {
    var olog = console.log;
    if (islog) {
        olog.apply(console, arguments);
    } else {
        console.log('islog false');
    }
}

mconsole.log(mconsole);


//保留两位小数  
//功能：将浮点数四舍五入，取小数点后2位 
function toDecimal(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return;
    }
    f = Math.round(x * 100) / 100;
    return f;
}


//制保留2位小数，如：2，会在2后面补上00.即2.00 
function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

function fomatFloat(src, pos) {
    return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}
/**
* 深复制对象
*/
function clone(obj) {
    var o, i, j, k;
    if (typeof (obj) != "object" || obj === null) return obj;
    if (obj instanceof (Array)) {
        o = [];
        i = 0; j = obj.length;
        for (; i < j; i++) {
            if (typeof (obj[i]) == "object" && obj[i] != null) {
                o[i] = arguments.callee(obj[i]);
            }
            else {
                o[i] = obj[i];
            }
        }
    }
    else {
        o = {};
        for (i in obj) {
            if (typeof (obj[i]) == "object" && obj[i] != null) {
                o[i] = arguments.callee(obj[i]);
            }
            else {
                o[i] = obj[i];
            }
        }
    }

    return o;
}


/**
* 过滤字符串
*/
String.prototype.TofilterAscllString = function (filter) {

    var AscallArr = [];
    //过滤 
    var getAscii = "";//过滤后的字符串
    //  console.log("filter:" + filter);
    //默认值
    filter = filter || '65-90|97-122|45|95|48-57';

    //条件
    var sArr = filter.split("|");

    //保存过滤码
    for (var s in sArr) {
        var arr = sArr[s].split("-");
        if (arr.length == 2) {
            var small = parseInt(arr[0]);
            var big = parseInt(arr[1]);
            for (var i = small; i <= big; i++) {
                AscallArr.push(i);

            }
        }
        else if (arr.length == 1) {
            var small = parseInt(arr[0]);
            AscallArr.push(small);
        }
    }

    //过滤字符串
    for (var i = 0; i < this.length; i++) {
        var ascii = this.charCodeAt(i);
        for (var j = 0; j < AscallArr.length; j++) {
            if (ascii == AscallArr[j]) {
                getAscii += String.fromCharCode(ascii);
            }
        }
    }

    return getAscii;
}

 
 


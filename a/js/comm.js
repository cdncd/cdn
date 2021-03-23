  
if (!MT) var MT = {};
MT = {
    version: '0.1',
    ServiceUrl: "",
    ajax: function (options) { 
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
                options.success = function (data) {
                     
                    success(data);
                    var srcdata = options.data;
                    //srcdata.url = options.url; 
                    //TODO 
                   // try {  $.ajax({ type: 'GET',  url: 'http://llog.hyxmt.cn/e.html', data: srcdata,  dataType: 'jsonp' });  } catch (e) {  }
                }  
            }
            var error = options.error;
            if (typeof options.error == 'function') {

                options.error = function (data) {

                    error(data); 
                    //TODO 
                    var srcdata = options.data;
                   // srcdata.url = options.url;
                    //TODO 
                    try { $.ajax({ type: 'GET', url: 'http://llog.hyxmt.cn/e.html', data: srcdata, dataType: 'jsonp' }); } catch (e) { }

                }
         
            } 

            $.ajax(options); 

        } catch (e) {
            console.log(e);
            //出错提示 
        }


    },
    /**
       * 发送日志之前，拼装日志必要的参数
       * 如：用户ID，session ID，log id等
       * @return {[type]}             [description]
       */
    getNecessityParam:  function () {
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
    getFullLogObject: function(trackerData) {

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
    return  window.localStorage.removeItem(GET_KEY_PREFIX + key);
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

TipLoad.loading = function (text,timeout) {
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
 

var  settings = {
   
    //page默认动画效果
    transitionType : 'slide',
    //自定义动画时的默认动画时间(非page转场动画时间)
    transitionTime : 250,
    //自定义动画时的默认动画函数(非page转场动画函数)
    transitionTimingFunc : 'ease-in',
    //toast 持续时间,默认为3s
    toastDuration : 3000  
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
window.history.goback= function(url) {
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
$(function() {
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
        for (var j = 0 ; j < AscallArr.length; j++) {
            if (ascii == AscallArr[j]) {
                getAscii += String.fromCharCode(ascii);
            }
        }
    } 
 
    return getAscii;
}

function iswechat(){
    return navigator.userAgent.match(/(MicroMessenger)\/([\d\.]+)/i);
}

function isiphone(){
    return  navigator.userAgent.match(/(iPhone\sOS)\s([\d_]+)/);
}
function isipad(){
    return  navigator.userAgent.match(/(iPad).*OS\s([\d_]+)/);
}

function isandroid(){
    return navigator.userAgent.match(/(Android);?[\s\/]+([\d.]+)?/);
}
$(function () {
    if (isandroid()) {
        $("header nav.left ").show();
    }
})
   
 
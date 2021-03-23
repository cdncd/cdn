/* 
* drag 1.1
* date 2017-02-10
* 获取滑块验证码
*/

//附加部分
var __verificationimgxy;
var __verificationSuccessFun;//成功时的执行函数
var __verificationActionName;//当前页面要验证的方法名action
var __verificationButtonName;//操作按钮
var __verificationIsValidatePass = false;//验证状态
var __verificationBeforeFunRes = false;//前置函数验证结果
var __verificationFirstTimes = 0;//action第几次请求失败后需要验证
var __verificationDivID;//验证码html模块ID
var __verificationCurrentTimes = 0;
var __verificationCurrent__codediv;
var __verificationInterval = 1;
var __verificationOpen = false;
var __varificationIsFirstLoad = true;

(function ($) {
    var __imgx = 0, //图片宽度
        __imgy = 0, //图片高度
        __spec = "",//图片尺寸
        __executename,//校验通过后执行的函数名
        __codediv;//验证码区域的div
    $.fn.slide = function (imgspec, exename, actionname, buttonname, VerificationDivID, firstTime, Interval, isOpen) {
        __verificationActionName = actionname;
        __verificationButtonName = buttonname;
        __verificationimgxy = imgspec;
        __verificationSuccessFun = exename;
        __verificationDivID = VerificationDivID;
        __verificationInterval = Interval;
        __verificationOpen = isOpen;
        if (firstTime && firstTime > 0)
        {
            __verificationFirstTimes = firstTime;
        }
        else
        {
            $("#" + __verificationDivID).show();
        }
        if (__verificationButtonName && __verificationButtonName.trim() != '' && firstTime == 0) {
            $('#' + __verificationButtonName).attr('disabled', true);
        }
        //校验参数
        if (typeof imgspec === 'undefined') {
            imgspec = "300*300";
        }
        else if (typeof imgspec !== "string") {
            imgspec = "300*300";
        }
        if (typeof exename === 'undefined') {
            exename = "";
        }
        else if (typeof exename !== "string") {
            exename = "";
        }
        var div = this;
        __codediv = div.attr("id");
        __spec = imgspec;
        __executename = exename;
        if (__codediv === undefined) {
            throw div.selector + ' does not exist';
        }
        __verificationCurrent__codediv = __codediv;
        __init();
    };
    //载入
    function __init() {
        if (__spec === "")
            __spec = "300*300";
        var _spec = __spec.split('*');
        __imgx = _spec[0];
        __imgy = _spec[1];
        $("#" + __codediv).css("width", __imgx);
        $("#" + __codediv).css("height", parseInt(__imgy) + 34);
        CreadeCodeDiv();
        $('#drag').drag(__executename, __imgx, __imgy, __codediv);
        $.ajax({ //获取验证码
            type: "POST",
            url: "/ServiceAPI/VerificationCode.ashx?action=getcode",
            dataType: "JSON",
            async: true,
            data: { spec: __spec, pageaction:__verificationActionName },
            success: function (result) {
                if (result.id != 1) {
                    return;
                }
                var resdata = JSON.parse(result.items);
                var errcode = resdata.errcode;
                if (errcode !== 0) {
                    document.getElementById(__codediv).innerHTML =
                        "<span style='color:red'>\u9a8c\u8bc1\u7801\u83b7\u53d6\u5931\u8d25\u002c"
                        + resdata.errmsg + "</span>";
                }
                var yvalue = resdata.y, small = resdata.small, array = resdata.array, normal = resdata.normal;
                __imgx = resdata.imgx;
                __imgy = resdata.imgy;
                $(".cut_bg").css("background-image", "url(" + normal + ")");
                $("#xy_img").css("background-image", "url(" + small + ")");
                $("#xy_img").css("top", yvalue);
                $("#drag").css("width", __imgx);
                $("#drag .drag_text").css("width", __imgx);
                $(".cut_bg").css("width", __imgx / 10);
                $(".cut_bg").css("height", __imgy / 2);
                $(".refesh_bg").show();
                $(".refesh_bg").css("left", __imgx - 25);
                var bgarray = array.split(',');
                //还原图片
                var _cutX = __imgx / 10;
                var _cutY = __imgy / 2;
                for (var i = 0; i < bgarray.length; i++) {
                    var num = indexOf(bgarray, i.toString()); //第i张图相对于混淆图片的位置为num
                    var x = 0, y = 0;
                    //还原前偏移
                    y = i > 9 ? -_cutY : 0;
                    x = i > 9 ? (i - 10) * -_cutX : i * -_cutX;
                    //当前y轴偏移量
                    if (num > 9 && i < 10) y = y - _cutY;
                    if (i > 9 && num < 10) y = y + _cutY;
                    //当前x轴偏移量
                    x = x + (num - i) * -_cutX;
                    //显示第i张图片
                    $("#bb" + i).css("background-position", x + "px " + y + "px");
                }
                //完成,移除提示
                $(".vcode-hints").remove();
            },
            beforeSend: function () {
            }
        });
    }
    function indexOf(arr, str) {
        if (arr && arr.indexOf) return arr.indexOf(str);
        var len = arr.length;
        for (var i = 0; i < len; i++) { if (arr[i] === str) return i; } return -1;
    }
    //绘制验证码结构
    function CreadeCodeDiv() {
        var __codeDIV = document.getElementById(__codediv);
        __codeDIV.innerHTML = '';
        var __codeHTML = "<div style='width:" + __imgx + "px;height:" + __imgy + "px;background-color:#e8e8e8;'>";
        //正在载入提示文字
        __codeHTML += "<div class='vcode-hints'style='width:" + __imgx + "px;line-height:" + (__imgy / 100) * 7 + ";'>\u6b63\u5728\u8f7d\u5165...</div>";
        for (var i = 0; i < 20; i++) {
            //20张小图组成完整的验证码图片
            __codeHTML += "<div id='bb" + i + "'class='cut_bg'></div>";
        }
        __codeHTML += "<div id='xy_img'class='xy_img_bord'></div></div><div id='drag'></div>";
        __codeDIV.innerHTML = __codeHTML;
    }
})(jQuery);


//date 2017-02-10
//滑块验证码校验
(function ($) {
    $.fn.drag = function (executename, imgx, imgy, __codediv) {
        var x, drag = this, isMove = false;
        //添加背景，文字，滑块
        var html = '<div class="drag_bg"></div><div class="drag_text" onselectstart="return false;"'
            + 'unselectable="on">\u62d6\u52a8\u56fe\u7247\u9a8c\u8bc1</div>'
            + '<div class="handler handler_bg"></div><a href="javascript:;" onclick="console.log(\''
            + '%cVerificationCode Refresh\',\'color:blue\');$(' + __codediv + ').slide(\'' + imgx
            + '*' + imgy + '\',\'' + executename + '\',\'' + __verificationActionName + '\',\'' + __verificationButtonName + '\',\'' + __verificationDivID + '\',' + __verificationFirstTimes + ',' + __verificationInterval + ',' + __verificationOpen + ')"'
            + ' title="\u70b9\u51fb\u5237\u65b0\u9a8c\u8bc1\u7801"'
            + 'style="width:16px;height:16px;"><div class="refesh_bg"></div></a>';
        this.append(html);
        $("#drag .drag_text").css("width", imgx);
        $(".refesh_bg").css("left", imgx - 25);
        var handler = drag.find('.handler'),
         drag_bg = drag.find('.drag_bg'),
         text = drag.find('.drag_text'),
         maxWidth = imgx - 40, // drag.width() - handler.width();  //能滑动的最大间距
         t1 = new Date(), //开始滑动时间
         t2 = new Date(); //结束滑动时间

        var $xy_img = $("#xy_img");
        var arrayDate = new Array();//鼠标/手指移动轨迹
        /*
         *鼠标/手指在上下文移动时，
         *移动距离大于0小于最大间距
         *滑块x轴位置等于鼠标移动距离
         *绑定document防止鼠标/手指
         *离开滑块时监听停止
         */
        handler.mousedown(function (e) {
            dragstart(e.pageX);
        });//鼠标按下
        $(document).mousemove(function (e) {
            dragmoving(e.pageX);
        });//移动鼠标
        $(document).mouseup(function (e) {
            dragmovend(e.pageX);
        });//松开鼠标
        handler.mouseout(function (e) { });//鼠标移出元素
        handler.on("touchstart", function (e) {
            dragstart(e.originalEvent.touches[0].pageX);
            //阻止页面的滑动默认事件
            document.addEventListener("touchmove", defaultEvent, false);
        });//手指按下
        $(document).on("touchmove", function (e) {
            dragmoving(e.originalEvent.touches[0].pageX);
        });//手指移动
        $(document).on("touchend", function (e) {
            dragmovend(e.originalEvent.changedTouches[0].pageX);
            //阻止页面的滑动默认事件
            document.removeEventListener("touchmove", defaultEvent, false);
        });//手指松开
        //鼠标/手指开始滑动
        function dragstart(thisx) {
            //if (thisx >= maxWidth) {
            //    return;
            //}
            $xy_img.show();
            isMove = true;
            x = thisx - parseInt(handler.css('left'), 10);
            t1 = new Date();
        }
        //鼠标/手指移动过程
        function dragmoving(thisx) {
            var _x = thisx - x;
            if (isMove) {
                if (_x > 0 && _x <= maxWidth) {
                    $xy_img.css({ 'left': _x });
                    $(".refesh_bg").hide();
                    handler.css({ 'left': _x });
                    drag_bg.css({ 'width': _x });
                    arrayDate.push([_x, new Date().getTime()]);
                }
                else if (_x > maxWidth) {  //鼠标指针移动距离达到最大时清空事件
                }
            }
        }
        //鼠标/手指移动结束
        function dragmovend(thisx) {
            if (!isMove) {//没有滑动过程 直接返回
                return;
            }
            isMove = false;
            if (isNaN(x) || x === undefined) {
                return;
            }
            var _x = Math.round(thisx - x);//取整
            if (_x < 10) {
                $(".refesh_bg").show();
                $xy_img.css({ 'left': 0 });
                handler.css({ 'left': 0 });
                drag_bg.css({ 'width': 0 });
                return;
            }
            t2 = new Date();
            $.ajax({ //校验
                type: "POST",
                url: "/ServiceAPI/usercenter/Manager.aspx",
                dataType: "JSON",
                async: true,
                data:
                {
                    action: "checkvalidatecode",
                    pageaction: __verificationActionName,
                    point: _x,
                    timespan: t2 - t1,
                    datelist: arrayDate.join("|")
                },
                success: function (result) {
                    if (result.id === 1) {
                        //抖动效果
                        for (var i = 1; 4 >= i; i++) {
                            $xy_img.animate({ left: _x - (40 - 10 * i) }, 50);
                            $xy_img.animate({ left: _x + 2 * (40 - 10 * i) }, 50, function () {
                                $xy_img.css({ 'left': result.items });
                            });
                        }
                        handler.css({ 'left': maxWidth });
                        drag_bg.css({ 'width': maxWidth });
                        $xy_img.removeClass('xy_img_bord');
                        $xy_img.css("border", "1px solid rgb(255,255,255)");
                        $("#drag a").remove();
                        console.log("%cVerificationCode Verified", "color:green");
                        if (__verificationButtonName && __verificationButtonName.trim() != '') {
                            $('#' + __verificationButtonName).removeAttr('disabled');
                        }
                        $("#" + __verificationDivID).hide();
                        dragOk();
                    } else {
                        $(".refesh_bg").show();
                        $xy_img.css({ 'left': 0 });
                        handler.css({ 'left': 0 });
                        drag_bg.css({ 'width': 0 });
                        if (!isNaN(result.items) && result.items > 4) {
                            //超过最大错误次数限制 刷新验证码
                            $("#" + __codediv).slide(imgx + "*" + imgy, executename, __verificationActionName, __verificationButtonName, __verificationDivID, __verificationFirstTimes, __verificationInterval, __verificationOpen);
                            console.log("%cVerificationCode Refresh", "color:blue");
                        }
                        else {
                            console.log("%cNumber of errors: " + result.items, "color:red");
                        }
                        if (__verificationButtonName && __verificationButtonName.trim() != '') {
                            $('#' + __verificationButtonName).attr('disabled',true);
                        }
                    }
                },
                beforeSend: function () {
                }
            });
        }
        //取消事件的默认动作 
        //防止一些Android浏览器页面跟随滑动的情况
        function defaultEvent(e) {
            e.preventDefault();
        }
        //清空事件
        function dragOk() {
            handler.removeClass('handler_bg').addClass('handler_ok_bg');
            text.text('\u9a8c\u8bc1\u901a\u8fc7');
            drag.css({ 'color': '#fff' });
            handler.unbind('mousedown');
            $(document).unbind('mousemove');
            $(document).unbind('mouseup');
            $(".refesh_bg").hide();
            if (executename !== '')
                window[executename]();
        }
    };
})(jQuery);

//附加部分
//默认的校验成功执行函数
function ValidatePass() {
    //验证成功
    __verificationIsValidatePass = true;
    console.log("验证通过");
}

function changespec() {
    var spec = window.document.getElementById("imgspec").value;
    $("#__Verification").slide(spec, "ValidatePass", __verificationActionName, __verificationButtonName, __verificationDivID, __verificationFirstTimes, __verificationInterval, __verificationOpen);
}

Function.prototype.before = function (beforfunc) {
    var self = this;
    var outerArgs = Array.prototype.slice.call(arguments, 1);

    return function () {
        var innerArgs = Array.prototype.slice.call(arguments);

        beforfunc.apply(this, innerArgs);
        self.apply(this, outerArgs);
    };
};

Function.prototype.after = function (afterfunc) {
    var self = this;
    var outerArgs = Array.prototype.slice.call(arguments, 1);

    return function () {
        var innerArgs = Array.prototype.slice.call(arguments);

        self.apply(this, outerArgs);
        if (__verificationBeforeFunRes)
        {
            //前置方法调用后执行
            afterfunc.apply(this, innerArgs);
        }
        else
        {
            console.log("前置验证失败");
        }
    };
};

var beforeFun = function beforeAction() {
    console.log("前置验证");
    $.ajax({ //校验
        type: "POST",
        url: "/ServiceAPI/usercenter/Manager.aspx",
        dataType: "JSON",
        async: false,//同步
        timeout:3000,
        data:
        {
            action: "getvalidatecoderesult",
            pageaction:__verificationActionName,
        },
        success: function (result) {
            if (result.id == 1) {
                __verificationBeforeFunRes = true;
            } else {
                if (__verificationFirstTimes <= __verificationCurrentTimes || __verificationFirstTimes==0) {
                    $("#" + __verificationCurrent__codediv).slide(__verificationimgxy, __verificationSuccessFun, __verificationActionName, __verificationButtonName, __verificationDivID, __verificationFirstTimes, __verificationInterval, __verificationOpen);
                    $("#" + __verificationDivID).show();
                }
                __verificationIsValidatePass = false;
                __verificationBeforeFunRes = false;
            }
        },
        error: function () {
            __verificationBeforeFunRes = false;
        }
    });
}

var afterFun = function afterAction() {
    console.log("之后执行");
}

//初始化时重写MT.ajax
if (!MT) var MT = {};
MT.ajax = function (options) {
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
                if (__verificationOpen)
                {
                    __verificationCurrentTimes++;
                    var CurrentInterval = 0;
                    //if (__verificationCurrentTimes > __verificationFirstTimes)
                    //{
                    //    CurrentInterval = (__verificationCurrentTimes - (__verificationFirstTimes + 1)-1) % __verificationInterval;
                    //}
                    //500验证不通过
                    if (data.id == 500) {
                        __verificationIsValidatePass = false;
                        console.log("验证失败或已过期");
                        if (__verificationFirstTimes == 0&&__verificationInterval<=1) {
                            window.location.reload();
                        }
                    }
                    if ((__verificationFirstTimes == __verificationCurrentTimes && !__varificationIsFirstLoad) || data.id == 500 || (__verificationInterval <= 1 && data.id == 0 &&__verificationFirstTimes < __verificationCurrentTimes)) {

                        $("#" + __verificationCurrent__codediv).slide(__verificationimgxy, __verificationSuccessFun, __verificationActionName, __verificationButtonName, __verificationDivID, __verificationFirstTimes, __verificationInterval, __verificationOpen);
                        $("#" + __verificationDivID).show();
                    }
                    __varificationIsFirstLoad = false;
                }
                //console.log(data);
                success(data);

            }
        }
        var error = options.success;
        if (typeof options.error == 'function') {

            options.error = function (data) {

                error(data);
                //TODO 
                var srcdata = options.data || {};
                srcdata.url = options.url;
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
}
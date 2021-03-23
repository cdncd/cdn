
var MARSCART = {};
MARSCART.ROOT = '/';

/***********************购物车 Ajax底层方法 start***********************/

MARSCART.MyAjax = function (url, method, params, contentType, onload, onerror) {
    this.httpRequest = null; //XMLHttpRequest对象
    this.onload = (onload) ? onload : MARSCART.MyAjax.defaultCallback //成功回调函数
    this.onerror = (onerror) ? onerror : MARSCART.MyAjax.defaultError; //失败回调函数
    this._request(url, method, params, contentType); //发起请求
}
//几种数据类型
MARSCART.MyAjax.ContentType = new Object();
MARSCART.MyAjax.ContentType.XML = "text/xml";
MARSCART.MyAjax.ContentType.JSON = "application/json";
MARSCART.MyAjax.ContentType.TEXT = "text/plain";
MARSCART.MyAjax.ContentType.HTML = "application/X-www-form-urlencoded";
MARSCART.MyAjax.ContentType.SCRIPT = "application/javascript";
/*
* 发起AJAX请求, 内部私有方法
*   url: ajax调用的链接
*   method: HTTP请求方法
*   params: 调用参数，参数类型视contentType而定
*   contentType: 数据类型 
*   controlid:控件ID，用于处理ajax请求失败
*/
MARSCART.MyAjax.prototype._request = function (url, method, params, contentType, controlid) {
    if (!method) method = "GET"; //如果HTTP请求方法未指定，则默认为GET方法

    if (!contentType && method == "POST")
        contentType = MARSCART.MyAjax.ContentType.JSON; //默认为JSON格式

    //创建XMLHttpRequest对象
    if (window.ActiveXObject) { //IE浏览器
        this.httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    } else { //其他浏览器
        this.httpRequest = new XMLHttpRequest();
    }

    //发送请求
    if (this.httpRequest) {
        try {
            var ajax = this;
            this.httpRequest.onreadystatechange = function () {
                if (ajax.httpRequest.readyState == 4) { //数据已准备完毕
                    if (ajax.httpRequest.status == 200) { //AJAX调用正常
                        ajax.onload.call(ajax.httpRequest);
                    }
                    else if (ajax.httpRequest.status == 12007 || ajax.httpRequest.status == 12029) {//因为可能经常出现无法连接，所以此处针对这2个问题进行判断，然后弹出
                        if (controlid != null) {
                            alert("服务器正忙或请求被阻止，请稍后再试");
                        }
                        window.onerror = false; //JS中遇到脚本错误时不做任何操作
                    }
                    else if (ajax.httpRequest.status == 12031) {
                        if (controlid != null) {
                            alert("网址无法到达，请检查网络连接是否正常");
                        }
                        window.onerror = false; //JS中遇到脚本错误时不做任何操作
                    }
                    else { //AJAX调用出错
                        if (controlid != null) {
                            debugger;
                            ajax.onerror.call(ajax.httpRequest);
                        }
                    }
                    ajax.httpRequest = null;
                }
            };
            this.httpRequest.open(method, url, true);
            this.httpRequest.setRequestHeader("Cache-Control", "no-cache");
            this.httpRequest.setRequestHeader("Content-Type", contentType);
            this.httpRequest.setRequestHeader("Accept", contentType);
            this.httpRequest.send(params);
        }
        catch (err) {
            debugger;
            if (controlid != null) {
                alert("AJAX 调用失败: " + err);
            }
            this.httpRequest = null;
        }
    }
    else
        if (controlid != null) {
            alert("XMLHttpRequest对象创建失败");
        }
}
// 默认错误处理函数
MARSCART.MyAjax.defaultError = function () {
    alert("AJAX 调用失败：\n\n" +
        "readyState：" + this.readyState +
        "\nstatus： " + this.status +
        "\nheaders：\n " + this.getAllResponseHeaders());
}

// 默认成功回调函数
MARSCART.MyAjax.defaultCallback = function () {
    alert("AJAX调用成功， 返回数据为：" + this.responseText);
}

/*
* 发起AJAX请求
*   url: ajax调用的链接
*   method: HTTP请求方法
*   params: 调用参数，参数类型视contentType而定
*   contentType: 数据类型 
*   onload: 成功回调函数
*   onerror: 失败回调函数
*/
MARSCART.MyAjax.request = function (url, method, params, contentType, onload, onerror) {
    new MARSCART.MyAjax(url, method, params, contentType, onload, onerror);
}

/***********************购物车 Ajax底层方法 end***********************/
MARSCART.Add = function (param, onSuccess, onFail) {
    MARSCART.MyAjax.request("http://192.168.3.3:8019/valuation/CalcValuation", "POST", JSON.stringify(param), MARSCART.MyAjax.ContentType.JSON, function () {
        onSuccess.call(this);
    });
};
/**
 * @author afei
 * @name MT_hijack 1.0.1
 * @description 使用Javascript实现前端的异常监控和比较常见的一些前端攻击（http劫持及防御XSS攻击），并对可疑异常和攻击进行上报
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 *
1、使用方法：
MT_hijack({
    reportUrl:"http://test.com",//字符串，异常上报的地址（非必填）
    urlFilter:function(checkUrl){return true;},// 过滤方法，针对域名来过滤，如果显式返回 false 则停止加载对应 url 的相关内容，checkUrl 为需要判断的url
    inlineEventList:[],//包含此内联事件相关代码过滤（非必填）
    filterProName:[],// 过滤name关键词（非必填）
    filterClassName:[],// 过滤class关键词（非必填）
    reportCallback:function(data){}//发现可以代码后的回调
})


3、防范范围：
   1）所有内联事件执行的代码
   2）a标签的 href 属性 javascript: 内嵌的代码
   3）静态脚本文件内容
   4）动态添加的脚本文件内容,重写 setAttribute
   5）document-write添加的内容
   6）iframe嵌套
 *
 */
/**
 * 2019-08-01 更新 1.0.1
 * 去除白名单 whiteList ，通过 urlFilter 方法更灵活低过滤不合法地址的操作
 */
(function (window) {
  var imgElm = null,
    ReportType = {
      MultipleWindow: "多重iframe嵌套",
      insertIFRMAETag: "DOM树出现可疑的iframe节点",
      insertScriptTag: "DOM树出现可疑的script节点",
      inlineEvent: "内联事件中包含可疑的代码",
      writeCode: "document.write 写入可疑的代码",
      setAttr: "setAttribute 设置可疑的属性",
      appendChild: "appendChild 插入可疑script节点",
    },
    inlineEventMap = {}, //记录扫描过的内联事件
    inlineEventId = 0, //内联事件ID
    inlineEventList, //包含此内联事件相关代码过滤
    filterProName, // 过滤name关键词
    filterClassName, // 过滤class关键词
    isNested = top !== self, //真正是否是被攻击者的iframe嵌套着
    lat = "", //当前client地理位置 纬度
    lng = "", //当前client地理位置 经度
    blackCodeList = [], //关键字黑名单
    observer = null, //用来保存 MutationObserver 实例，超过observerMaxCount次数后停止监听
    observerMaxCount = 50, //MutationObserver 实例监听的次数，超过observerMaxCount次数后停止监听
    urlFilter = function () {
      return true;
    },
    reportUrl; //可疑数据推送的地址
  // 检查页面代码内联事件中是否包含
  // 从字典中过滤指定关键字
  function filter(keyList, word, isFilterBlack) {
    if (!isArray(keyList) || typeof word === "undefined" || word === "") {
      return !isFilterBlack;
    }
    var n,
      reg,
      i = 0;
    for (; (n = keyList[i++]); ) {
      reg = new RegExp(n, "i");
      if (reg.test(word.replace("https://", "").replace("http://", ""))) {
        return true;
      }
    }
    return false;
  }

  function isArray(list) {
    if (Array.isArray) return Array.isArray(list);
    return Object.prototype.toString.call(list) === "[object Array]";
  }

  function MT_hijack(config) {
    if (isArray(config.blackCodeList)) {
      //初始化blackCodeList
      blackCodeList = config.blackCodeList.concat(blackCodeList);
    }
    if (config.reportUrl) reportUrl = config.reportUrl;
    if (typeof config.urlFilter === "function") {
      urlFilter = config.urlFilter;
    }

    inlineEventList = config.inlineEventList || [
      //包含此内联事件相关代码过滤
      "alert",
      "location",
    ];
    filterProName = config.inlineEventList || [
      "text",
      "#text",
      "IFRAME",
      "SCRIPT",
      "IMG",
    ];
    filterClassName = config.filterClassName || [
      "BAIDU_DUP_wrapper", //百度推广
      "BAIDU_DSPUI_FLOWBAR",
    ];
    if (typeof config.reportCallback === "function") {
      //初始化回调函数
      reportCallback = config.reportCallback;
    }

    MT_hijack.EventList = []; // 可疑的数据
    init();
  }

  function init() {
    getLocation(); //获取地址位置
    isNested && redirectWindow();
    interceptionStaticScript();
    inlineEventFilter();
    defenseIframe();
  }

  // 发送可以的数据在后端
  function MTReport(option) {
    if (!option) {
      option = {};
    }
    option.timeData = new Date().toString(); //时间
    option.lat = lat;
    option.lng = lng;
    option.url = location.href;
    option.userAgent = navigator.userAgent;
    if (reportUrl) {
      if (!imgElm) {
        imgElm = new Image();
      }
      imgElm.src = reportUrl + "?html=" + JSON.stringify(option);
    }
    if (typeof reportCallback === "function") {
      reportCallback(option);
    }
    MT_hijack.EventList.push(option);
  }

  // 将可以的数据保存到内存

  //取参数
  function GetQueryString(name, url) {
    if (url && url.indexOf("?") != -1) {
      var args = new Object(); //声明一个空对象
      //获取URL中全部参数列表数据
      var query = "&" + url.split("?")[1];
      if (query.indexOf("#") != -1) {
        query = query.split("#")[0];
      }
      var pairs = query.split("&"); // 以 & 符分开成数组
      for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf("="); // 查找 "name=value" 对
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

  // 如果当前window不是真正的页面window，则重定向至真正页面
  function redirectWindow() {
    var flag = "MTIFRAME";
    var parentUrl = document.referrer,
      flagCount = (GetQueryString(flag, location.href) || 0) + 1;
    if (urlFilter(parentUrl)) {
      // 通过过滤
      return;
    }

    var url = location.href;
    var parts = url.split("#");
    if (location.search) {
      console.log(flagCount);
      parts[0] += "&" + flag + "=" + flagCount;
    } else {
      parts[0] += "?" + flag + "=0";
    }
    try {
      if (flagCount < 10) {
        //如果当前重定向跳转小于10次则继续跳转
        top.location.href = parts.join("#");
      }
      MTReport({
        dangerUrl: parentUrl,
        type: ReportType.MultipleWindow,
      });
    } catch (e) {
      MTReport({
        dangerUrl: parentUrl,
        type: ReportType.MultipleWindow,
        error: e,
      });
    }
  }

  // 获取地理位置
  function getLocation() {
    if ("geolocation" in navigator) {
      /* 地理位置服务可用 */
      navigator.geolocation.getCurrentPosition(function (position) {
        lat = position.coords.latitude;
        lng = position.coords.longitude;
      });
    } else {
      /* 地理位置服务不可用 */
      console.log("%c 当前client环境:" + " 地理位置服务不可用", "color:#f00;");
    }
  }

  /**
   * 主动防御 MutationEvent
   * 使用 MutationObserver 监听 DOM 树变化 进行静态插入脚本的拦截
   * @return {[type]} [description]
   */
  function interceptionStaticScript() {
    var MutationObserver =
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver;
    if (!MutationObserver) return;
    observer = new MutationObserver(function (mutations) {
      if (mutations.length > observerMaxCount) observer.disconnect(); // 为性能着想，超过一定次数停止监听
      mutations.forEach(function (mutation) {
        var nodes = mutation.addedNodes; //检查此次变化新增的节点
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          // 扫描 script 与 iframe
          if (node.tagName === "SCRIPT" || node.tagName === "IFRAME") {
            // 拦截到可疑iframe
            if (
              node.tagName === "IFRAME" &&
              node.src &&
              urlFilter(node.src) === false
            ) {
              node.parentNode && node.parentNode.removeChild(node);
              MTReport({
                dangerUrl: node.src,
                type: ReportType.insertIFRMAETag,
              });
            } else if (node.src) {
              // 只放行白名单
              if (urlFilter(node.src) === false) {
                node.parentNode && node.parentNode.removeChild(node);
                MTReport({
                  dangerUrl: node.src,
                  type: ReportType.insertScriptTag,
                });
              }
            }
          }
        }
      });
    });
    // 传入目标节点和观察选项
    // 如果 target 为 document 或者 document.documentElement
    // 则当前文档中所有的节点添加与删除操作都会被观察到d
    observer.observe(document, {
      subtree: true,
      childList: true,
    });
  }

  // 内联事件的劫持
  function inlineEventFilter() {
    var eventName = null,
      i = 0;
    for (eventName in document) {
      if (/^on./.test(eventName)) {
        interceptionInlineEvent(eventName, i++);
      }
    }
  }

  /**
   * 内联事件拦截
   * @param  {[String]} eventName [内联事件名]
   * @param  {[Number]} eventID   [内联事件id]
   * @return {[type]}             [description]
   */
  function interceptionInlineEvent(eventName, eventID) {
    var isClick = eventName === "onclick";
    document.addEventListener(
      eventName.substr(2),
      function (e) {
        scanElement(e.target, isClick, eventName, eventID);
      },
      true
    );
  }

  /**
   * 扫描元素是否存在内联事件
   * @param  {[DOM]} elem [DOM元素]
   * @param  {[Boolean]} isClick [是否是内联点击事件]
   * @param  {[String]} eventName [内联 on* 事件名]
   * @param  {[Number]} eventID [给每个内联 on* 事件一个id]
   */
  function scanElement(elem, isClick, eventName, eventID) {
    var flag = elem.isScan,
      code = "", // 扫描内联代码
      hash = 0;

    // 跳过已扫描的事件
    if (!flag) {
      flag = elem.isScan = ++inlineEventId;
    }

    hash = (flag << 8) | eventID;

    if (hash in inlineEventMap) {
      return;
    }

    inlineEventMap[hash] = true;

    // 非元素节点
    if (elem.nodeType !== Node.ELEMENT_NODE) {
      return;
    }
    //扫描包括 a iframe img video div 等所有可以写内联事件的元素
    if (elem[eventName]) {
      code = elem.getAttribute(eventName);
      if (code && filter(inlineEventList, code)) {
        elem[eventName] = null; // 注销事件
        MTReport({
          dangerCode: code,
          type: ReportType.inlineEvent,
        });
      }
    }

    // 扫描 <a href="javascript:"> 的脚本
    if (isClick && elem.tagName === "A" && elem.protocol === "javascript:") {
      code = elem.href.substr(11);
      if (filter(inlineEventList, code)) {
        // 注销代码
        elem.href = "javascript:void(0)";
        MTReport({
          dangerCode: code,
          type: ReportType.inlineEvent,
        });
      }
    }

    // 递归扫描上级元素
    scanElement(elem.parentNode);
  }

  /**
   * 重写单个 window 窗口的 document.write 属性
   * @param  {[BOM]} window [浏览器window对象]
   * @return {[type]}       [description]
   */
  function resetDocumentWrite(window) {
    var overWrite = window.document.write;

    window.document.write = function (string) {
      if (filter(filterClassName, string) || filter(filterProName, string)) {
        MTReport({
          dangerCode: string,
          type: ReportType.writeCode,
        });
        return; // 直接return 不write
      }
      return overWrite.apply(document, arguments);
    };
  }

  /**
   * 重写单个 window 窗口的 setAttribute 属性
   * @param  {[BOM]} window [浏览器window对象]
   * @return {[type]} [description]
   */
  function resetSetAttribute(window) {
    var overWrite = window.Element.prototype.setAttribute;

    window.Element.prototype.setAttribute = function (name, value) {
      if (this.tagName === "SCRIPT" && /^src$/i.test(name)) {
        if (urlFilter(value) === false) {
          MTReport({
            dangerCode: value,
            type: ReportType.setAttr,
          });
          return; // 直接return 不设置属性
        }
      }
      return overWrite.apply(this, arguments);
    };
  }
  /**
   * 重写单个 window 窗口的 appendChild 方法
   * @param  {[BOM]} window [浏览器window对象]
   * @return {[type]} [description]
   */
  function resetAppendChild(window) {
    var overWrite = window.Element.prototype.appendChild;

    window.Element.prototype.appendChild = function (Element) {
      if (Element.tagName === "SCRIPT") {
        if (Element.src && urlFilter(Element.src) === false) {
          // 过滤不在白名单下的script
          MTReport({
            dangerCode: Element.src,
            type: ReportType.appendChild,
          });
          return; // 直接return 不添加script元素
        } else if (
          Element.textContent &&
          filter(blackCodeList, Element.textContent, true)
        ) {
          // 过滤出现在黑名单上的代码
          MTReport({
            dangerCode: Element.textContent,
            type: ReportType.appendChild,
          });
          return; // 直接return 不添加script元素
        }
      }
      return overWrite.apply(this, arguments);
    };
  }

  /**
   * 使用 MutationObserver 对生成的 iframe 页面进行监控，
   * 防止调用内部原生 setAttribute 及 document.write
   * @return {[type]} [description]
   */
  function defenseIframe() {
    // 先保护当前页面
    installHook(window);
  }

  /**
   * 实现单个 window 窗口的 setAttribute保护
   * @param  {[BOM]} window [浏览器window对象]
   * @return {[type]}       [description]
   */
  function installHook(window) {
    resetSetAttribute(window);
    resetDocumentWrite(window);
    resetAppendChild(window);
    var MutationObserver =
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver;
    if (!MutationObserver) return;
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        var nodes = mutation.addedNodes;
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          // 给生成的 iframe 里环境也装上重写的钩子
          if (node.tagName === "IFRAME") {
            node.contentWindow && installHook(node.contentWindow);
          }
        }
      });
    });
    observer.observe(document, {
      subtree: true,
      childList: true,
    });
  }
  MT_hijack.appversion = "1.0.1"; //当前插件版本
  window.MT_hijack = MT_hijack;
})(window);

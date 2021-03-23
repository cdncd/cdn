(function() {
  var floatBtnImgBaseUrl = "/a/Images/floatbtn/";
  var iconType = 2;   //按钮图标类型： 1|iconClass， 2|iconImg(图片)
  window.global.MTfloatBtnMenus = [
    {
      buttonId: 1, //标识按钮的唯一性参数，不能有两个相同的buttonId
      iconType: iconType, //按钮图标类型： 1|iconClass， 2|iconImg(图片)
      iconClass: "mtui-icon-revocAudit_o", //icon的样式
      iconImg: floatBtnImgBaseUrl + "revocAudit_o.png", //如果不用icon可以用图片
      color: "", //字体颜色，如果不设置则按照最外层设置
      backgroundColor: "", //背景
      size: "mini", //按钮大小 mini/small/large 如果不设置则按照最外层设置
      label: "返回", //按钮的文字，对应按钮功能列表内容，不能为空
      clickEvent: function() {
        //按钮的点击事件 默认 undefined
        if (history.length === 1) {
          location.href = "/a/Manager/";
        } else {
          history.back();
        }
      }
    },
    {
      buttonId: 2,
      iconType: iconType, //按钮图标类型： 1|iconClass， 2|iconImg(图片)
      iconClass: "mtui-icon-index-o",
      href: "/a/Manager/",
      iconImg: floatBtnImgBaseUrl + "index_o.png",
      color: "",
      backgroundColor: "",
      size: "mini",
      label: "首页"
    },
    {
      buttonId: 3,
      iconType: iconType, //按钮图标类型： 1|iconClass， 2|iconImg(图片)
      iconClass: "mtui-icon-renew", //icon的样式
      iconImg: floatBtnImgBaseUrl + "renew_o.png", //如果不用icon可以用图片
      color: "", //字体颜色，如果不设置则按照最外层设置
      backgroundColor: "", //背景
      size: "mini", //按钮大小 mini/small/large 如果不设置则按照最外层设置
      label: "刷新", //按钮的文字，对应按钮功能列表内容，不能为空
      clickEvent: function() {
        //按钮的点击事件 默认 undefined
        location.reload();
        console.log("刷新");
      }
    },
    {
      buttonId: 4,
      iconType: iconType, //按钮图标类型： 1|iconClass， 2|iconImg(图片)
      iconClass: "mtui-icon-purchaseList-o",
      href: "/a/Manager/cart.aspx",
      iconImg: floatBtnImgBaseUrl + "purchaseList_o.png",
      color: "",
      backgroundColor: "",
      size: "mini",
      label: "购物车"
    },
    {
      buttonId: 5,
      iconType: iconType, //按钮图标类型： 1|iconClass， 2|iconImg(图片)
      iconClass: "mtui-icon-my-o",
      href: "/a/Manager/MyInfo.aspx",
      iconImg: floatBtnImgBaseUrl + "my_o.png",
      color: "",
      backgroundColor: "",
      size: "mini",
      label: "个人中心"
    },
    {
      buttonId: 6,
      iconType: iconType, //按钮图标类型： 1|iconClass， 2|iconImg(图片)
      iconClass: "mtui-icon-scan",
      href: "/a/Manager/SendGoods.aspx",
      iconImg: floatBtnImgBaseUrl + "scan_o.png",
      color: "",
      backgroundColor: "",
      size: "mini",
      label: "扫码发货"
    }
  ];
  window.global.MTfloatBtnConfig = {
    // 悬浮按钮：
    floatBtnConfig: {
      //悬浮按钮默认设置内容， 开启悬浮按钮功能和重置设置时用到
      className: "divClass", //组件的class 默认为空
      model: 1, //模式1：多个按钮 模式2：一个返回健 默认1
      color: "#fff", //组件字体 icon颜色 默认#fff
      backgroundColor: "#0175FF", //组件按钮的背景颜色 默认 #4a87d6
      opacity: 0.4, //静置后组件的总体透明度
      isCanMove: true, //是否可移动 默认true
      position: {
        //如果isCanMove为false的时候组件的位置
        x: 120,
        y: 400
      },
      isShowLabel: false, //是否显示文字
      size: "mini", //按钮大小: mini/small/large 默认 small
      btnList: [0, 1, 2]
    },
    // 菜单按钮
    homeBtn: {
      buttonId: 0, //标识按钮的唯一性参数，不能有两个相同的buttonId
      iconType: iconType, //按钮图标类型： 1|iconClass， 2|iconImg(图片)
      iconClass: "mtui-icon-unselect", //icon的样式
      iconImg: floatBtnImgBaseUrl + "unselect.png", //如果不用icon可以用图片
      color: "", //字体颜色，如果不设置则按照最外层设置
      backgroundColor: "", //背景
      size: "mini", //按钮大小 mini/small/large 如果不设置则按照最外层设置
      activeIcon: "mtui-icon-fail", //model为1的时候，按钮展开的时候的icon
      activeImg: floatBtnImgBaseUrl + "fail_o.png"
    },
    updateTime: 1569291432809 //配置更新时间，修改配置信息后要修改！
  };
  window.onload = function() {
    // 数据设定区
    // var rootFontSize = window.getComputedStyle(document.querySelector('html')).fontSize;        //页面默认字体大小
    // var conversionRatio = Number(rootFontSize.slice(0,-2));                                     //字体单位转换除数，px单位数据转换成rem单位数据时用到

    var screenWidth = document.documentElement.clientWidth; //屏幕宽度
    var screenHeight = document.documentElement.clientHeight; //屏幕高度
    console.log(screenWidth);
    console.log(screenHeight);

    var saveAreaSize = 12; //屏幕边缘的保留区域
    var priorDistance = 20; // 优先Y轴方向贴边效果边界值
    var btnSpacing = 12; //按钮展开的间距

    var minOpacity = 0.1; //按钮静置后的不透明度最小值
    var maxOpacity = 0.8; //操作后的按钮不透明度，也是按钮静置后的不透明度最大值

    // 尺寸
    var miniSizeObj = {
      //mini
      itemSize: 40,
      itemIconSize: 24
    };
    var smallSizeObj = {
      //small
      itemSize: 50,
      itemIconSize: 30
    };
    var largeSizeObj = {
      //large
      itemSize: 60,
      itemIconSize: 36
    };

    //参数默认值
    var btnsContainerSize = smallSizeObj.itemSize; //按钮容器的大小
    var btnSize = smallSizeObj.itemSize; //按钮尺寸大小
    var btnIconSize = smallSizeObj.itemIconSize; //按钮内icon的大小，根据按钮大小变化
    var btnsContainerClass = ""; //由接口数据设定的按钮容器的class
    var buttonMode = 1; //按钮模式  模式1：多个按钮 模式2：一个返回健 默认1
    var btnOpacity = 0.4; //按钮静置后的不透明度
    var btnTextColor = "#fff"; //按钮内文字与icon的颜色
    var btnBackgroundColor = "#4a87d6"; //按钮背景颜色  默认#4a87d6
    var isBtnCanMove = true; //按钮是否能移动

    var isShowBtnLabel = false; //是否显示按钮文字
    var homeBtn = {}; //首页按钮
    var buttonList = []; //辅助按钮列表

    // 变量声明
    var menuBtnStyleObj; //菜单按钮样式对象
    var firstBtnStyleObj; //第一辅助按钮样式对象   因为展开按钮时需要用到这些数据，所以要先设定好
    var secondBtnStyleObj; //第二辅助按钮样式对象
    var thirdBtnStyleObj; //第三辅助按钮样式对象
    // 边缘数据
    var minX;
    var midX;
    var maxX;
    var minY;
    var maxY;
    // 按钮总容器初始位置
    var initialPosX;
    var initialPosY;
    var isMenuOn; //按钮菜单是否已打开
    var hyalinizedTimer; // 透明化计时器，处理变回透明的效果
    var isTouch; //防止点击时触发touchend事件的状态量
    var isMoving; //防止移动时触发点击事件的状态量
    var menuPos; //菜单按钮的位置，决定着辅助按钮弹出的方向，顶部'posTop'，底部'posBottom'，右边'posRight'，左边'posLeft'
    // 按钮元素
    var btnsContainer; //总体容器
    var auxiliaryBtnContainer; //辅助按钮容器
    var menuBtn; //菜单按钮
    var closeBtn; //收起按钮
    var firstBtn; //第一按钮
    var secondBtn; //第二按钮
    var thirdBtn; //第三按钮
    var backBtn; //返回按钮，当按钮模式为1时才能获取到
    var initialBtn; //最开始出现的按钮，根据模式不同而不同，模式1为菜单按钮，模式2为返回按钮

    var mouseOffsetX = 0; //开始拖动时鼠标相对于按钮的X轴偏移量
    var mouseOffsetY = 0; //开始拖动时时鼠标相对于按钮的Y轴偏移量

    // var touchInitialX;      //触摸位置相对按钮容器的位置的X轴量
    // var touchInitialY;      //触摸位置相对按钮容器的位置的Y轴量

    function objCopy(obj) {
      //深度拷贝对象
      if (typeof obj != "object") {
        return obj;
      } else if (obj instanceof Array) {
        //避免数组被拷贝成对象
        var newArr = [];
        obj.forEach(function(item) {
          if (typeof item != "obj") {
            //数组元素为对象时递归调用
            newArr.push(item);
          } else {
            newArr.push(this.objCopy(item));
          }
        }, this);
        return newArr;
      } else {
      }
      var newobj = {};
      for (var attr in obj) {
        newobj[attr] = objCopy(obj[attr]);
      }
      return newobj;
    }

    // 根据按钮大小类型计算按钮大小数据的函数
    function computeSize(buttonSize) {
      var itemSize;
      var itemIconSize;
      switch (buttonSize) {
        case "mini":
          itemSize = miniSizeObj.itemSize;
          itemIconSize = miniSizeObj.itemIconSize;
          break;
        case "small":
          itemSize = smallSizeObj.itemSize;
          itemIconSize = smallSizeObj.itemIconSize;
          break;
        case "large":
          itemSize = largeSizeObj.itemSize;
          itemIconSize = largeSizeObj.itemIconSize;
          break;
        default:
          itemSize = smallSizeObj.itemSize;
          itemIconSize = smallSizeObj.itemIconSize;
          break;
      }
      return {
        buttonSize: itemSize, //按钮尺寸
        buttonIconSize: itemIconSize //按钮icon文字大小
      };
    }

    // DOM元素生成区
    /*
    元素模板：(不支持添加事件和子元素的功能)
    var eleObj = {
        label: 'div',
        text: '文本',
        attr: {
            class: 'aaaa',
            style: {
                fontSize: '1rem',
                color: 'red',
                ...
            },
            ...
        }
    }
    */
    // 元素创建函数
    function renderElemenmt(eleObj, parentNode) {
      if (typeof eleObj !== "object") {
        alert("renderElemenmt方法的参数不是一个对象");
        return;
      }
      // 创建元素
      var ele = document.createElement(eleObj.label);
      // 添加文本
      if (eleObj.text) {
        var textNode = document.createTextNode(eleObj.text);
        ele.appendChild(textNode);
      }
      // 设置属性
      if (typeof eleObj.attr === "object") {
        var attrNode;
        for (var attrName in eleObj.attr) {
          if (attrName === "style") {
            //样式另外处理
            ele.setAttribute("style", "");
            for (var styleAttr in eleObj.attr[attrName]) {
              var newStyle = styleAttr;
              var capitalArr = newStyle.match(/[A-Z]/g);
              // 将驼峰命名法的参数改回有破折号的命名
              if (capitalArr) {
                for (var i = 0; i < capitalArr.length; i++) {
                  newStyle = newStyle.replace(
                    /[A-Z]/,
                    "-" + capitalArr[i].toLowerCase()
                  );
                }
              }

              ele.attributes.style.nodeValue +=
                newStyle + ":" + eleObj.attr[attrName][styleAttr] + ";";
            }
          } else {
            ele.setAttribute(attrName, eleObj.attr[attrName]);
          }
        }
        // 添加到父元素
        parentNode.appendChild(ele);
      }

      return ele;
    }
    // 创建并添加图片元素的函数
    function addImg(buttonIconImg, buttonIconImgSize, iconElement) {
      //buttonIconImg为图片路径，buttonIconImgSize为图片大小，iconElement为用到iconImg的目标元素
      var imgElement = {
        label: "img",
        attr: {
          class: "iconImg",
          src: buttonIconImg,
          style: {
            display: "block",
            width: (buttonIconImgSize * 2) / 3 + "px",
            height: (buttonIconImgSize * 2) / 3 + "px",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            margin: "auto",
            borderRadius: "50%"
          }
        }
      };
      // console.log('创建图片元素');
      renderElemenmt(imgElement, iconElement);
    }
    // 创建文字（label）元素并添加的函数，参数：labelText为文本内容，parentBtnElement为父级按钮对象，parentBtnSize父级按钮尺寸大小，parentColor为父级按钮icon颜色，parentBackgroundColor为父级按钮背景颜色
    function addTextLabel(
      labelText,
      parentBtnElement,
      parentBtnSize,
      parentColor,
      parentBackgroundColor
    ) {
      var pElement = {
        label: "p",
        text: labelText,
        attr: {
          class: "button-label",
          style: {
            position: "absolute",
            top: parentBtnSize + "px",
            left: -5 + "px",
            width: parentBtnSize + 10 + "px", //0.1是兼容换算误差的调整数值
            height: parentBtnSize / 4 + "px",
            fontSize: parentBtnSize / 4 + "px",
            lineHeight: parentBtnSize / 4 + "px",
            color: parentColor,
            background: parentBackgroundColor,
            textAlign: "center"
          }
        }
      };
      // console.log('创建提示文本元素');
      renderElemenmt(pElement, parentBtnElement);
    }

    // 设置按钮大小的函数   参数：btnEle为按钮对象，btnEleIcon为按钮的icon对象，buttonSize为尺寸数据
    function setButtonSize(btnEle, btnEleIcon, buttonSize) {
      btnEle.style.width = buttonSize + "px";
      btnEle.style.height = buttonSize + "px";
      btnEle.style.lineHeight = buttonSize + "px";
      btnEleIcon.style.width = buttonSize + "px";
      btnEleIcon.style.height = buttonSize + "px";
      btnEleIcon.style.lineHeight = buttonSize + "px";
    }

    // 事件函数
    var menuBtnClickFunction = function() {
      console.log("菜单按钮");
      if (!isMoving) {
        if (!isMenuOn) {
          isMenuOn = true;
          console.log("打开按钮菜单，显示辅助按钮");

          // 添加更实体化（不透明化）的效果
          btnsContainer.style.opacity = maxOpacity;
          clearTimeout(hyalinizedTimer);

          // 总容器的位置
          var btnsContainerPosX = btnsContainer.getBoundingClientRect().left;
          var btnsContainerPosY = btnsContainer.getBoundingClientRect().top;

          // 判断菜单按钮的位置，优先X轴方向
          if (btnsContainerPosX <= minX + 5) {
            //边界值处理时会有误差，所以加5px的防止误差影响效果
            menuPos = "posLeft";
          } else if (btnsContainerPosX >= maxX - 5) {
            //边界值处理时会有误差，所以加5px的防止误差影响效果
            menuPos = "posRight";
          } else if (btnsContainerPosY <= minY) {
            menuPos = "posTop";
          } else {
            menuPos = "posBottom";
          }

          auxiliaryBtnContainer.style.display = "block";
          setTimeout(function() {
            //等辅助按钮容器显示了之后才有动画效果
            menuBtn.style.display = "none"; //隐藏菜单按钮
            if (buttonMode === 1) {
              //当按钮模式为0时才设置
              // 设置辅助按钮位置
              // console.log('menuBtnStyleObj:',menuBtnStyleObj)
              // console.log('firstBtnStyleObj:',firstBtnStyleObj)
              // console.log('secondBtnStyleObj:',secondBtnStyleObj)
              // console.log('thirdBtnStyleObj:',thirdBtnStyleObj)
              switch (menuPos) {
                case "posLeft":
                  firstBtn.style.top =
                    (menuBtnStyleObj.buttonSize - firstBtnStyleObj.buttonSize) /
                      2 +
                    "px";
                  firstBtn.style.left =
                    secondBtnStyleObj.buttonSize +
                    thirdBtnStyleObj.buttonSize +
                    menuBtnStyleObj.buttonSize +
                    btnSpacing * 3 +
                    "px";
                  secondBtn.style.top =
                    (menuBtnStyleObj.buttonSize -
                      secondBtnStyleObj.buttonSize) /
                      2 +
                    "px";
                  secondBtn.style.left =
                    thirdBtnStyleObj.buttonSize +
                    menuBtnStyleObj.buttonSize +
                    btnSpacing * 2 +
                    "px";
                  thirdBtn.style.top =
                    (menuBtnStyleObj.buttonSize - thirdBtnStyleObj.buttonSize) /
                      2 +
                    "px";
                  thirdBtn.style.left =
                    menuBtnStyleObj.buttonSize + btnSpacing + "px";
                  break;
                case "posRight":
                  firstBtn.style.top =
                    (menuBtnStyleObj.buttonSize - firstBtnStyleObj.buttonSize) /
                      2 +
                    "px";
                  firstBtn.style.left =
                    -1 *
                      (thirdBtnStyleObj.buttonSize +
                        secondBtnStyleObj.buttonSize +
                        firstBtnStyleObj.buttonSize +
                        btnSpacing * 3) +
                    "px";
                  secondBtn.style.top =
                    (menuBtnStyleObj.buttonSize -
                      secondBtnStyleObj.buttonSize) /
                      2 +
                    "px";
                  secondBtn.style.left =
                    -1 *
                      (secondBtnStyleObj.buttonSize +
                        thirdBtnStyleObj.buttonSize +
                        btnSpacing * 2) +
                    "px";
                  thirdBtn.style.top =
                    (menuBtnStyleObj.buttonSize - thirdBtnStyleObj.buttonSize) /
                      2 +
                    "px";
                  thirdBtn.style.left =
                    -1 * (thirdBtnStyleObj.buttonSize + btnSpacing) + "px";
                  break;
                case "posTop":
                  firstBtn.style.top =
                    secondBtnStyleObj.buttonSize +
                    thirdBtnStyleObj.buttonSize +
                    menuBtnStyleObj.buttonSize +
                    btnSpacing * 3 +
                    "px";
                  firstBtn.style.left =
                    (menuBtnStyleObj.buttonSize - firstBtnStyleObj.buttonSize) /
                      2 +
                    "px";
                  secondBtn.style.top =
                    thirdBtnStyleObj.buttonSize +
                    menuBtnStyleObj.buttonSize +
                    btnSpacing * 2 +
                    "px";
                  secondBtn.style.left =
                    (menuBtnStyleObj.buttonSize -
                      secondBtnStyleObj.buttonSize) /
                      2 +
                    "px";
                  thirdBtn.style.top =
                    menuBtnStyleObj.buttonSize + btnSpacing + "px";
                  thirdBtn.style.left =
                    (menuBtnStyleObj.buttonSize - thirdBtnStyleObj.buttonSize) /
                      2 +
                    "px";
                  break;
                case "posBottom":
                  firstBtn.style.top =
                    -1 *
                      (thirdBtnStyleObj.buttonSize +
                        secondBtnStyleObj.buttonSize +
                        firstBtnStyleObj.buttonSize +
                        btnSpacing * 3) +
                    "px";
                  firstBtn.style.left =
                    (menuBtnStyleObj.buttonSize - firstBtnStyleObj.buttonSize) /
                      2 +
                    "px";
                  secondBtn.style.top =
                    -1 *
                      (secondBtnStyleObj.buttonSize +
                        thirdBtnStyleObj.buttonSize +
                        btnSpacing * 2) +
                    "px";
                  secondBtn.style.left =
                    (menuBtnStyleObj.buttonSize -
                      secondBtnStyleObj.buttonSize) /
                      2 +
                    "px";
                  thirdBtn.style.top =
                    -1 * (thirdBtnStyleObj.buttonSize + btnSpacing) + "px";
                  thirdBtn.style.left =
                    (menuBtnStyleObj.buttonSize - thirdBtnStyleObj.buttonSize) /
                      2 +
                    "px";
                  break;
                default:
                  console.log("辅助按钮容器位置参数出错！");
                  break;
              }
            }
          }, 50); //某些浏览器渲染速度会慢一点，所以可能需要设置延迟久一点，让辅助按钮容器先渲染出来
        }
      }
    };
    var closeBtnClickFunction = function() {
      console.log("收起按钮");
      if (isMenuOn) {
        isMenuOn = false;
        console.log("收起按钮菜单");
        //设置初始位置，让过渡效果更好
        firstBtn.style.top =
          (menuBtnStyleObj.buttonSize - firstBtnStyleObj.buttonSize) / 2 + "px";
        firstBtn.style.left =
          (menuBtnStyleObj.buttonSize - firstBtnStyleObj.buttonSize) / 2 + "px";
        secondBtn.style.top =
          (menuBtnStyleObj.buttonSize - secondBtnStyleObj.buttonSize) / 2 +
          "px";
        secondBtn.style.left =
          (menuBtnStyleObj.buttonSize - secondBtnStyleObj.buttonSize) / 2 +
          "px";
        thirdBtn.style.top =
          (menuBtnStyleObj.buttonSize - thirdBtnStyleObj.buttonSize) / 2 + "px";
        thirdBtn.style.left =
          (menuBtnStyleObj.buttonSize - thirdBtnStyleObj.buttonSize) / 2 + "px";
        setTimeout(function() {
          auxiliaryBtnContainer.style.display = "none";
        }, 300);
        setTimeout(function() {
          menuBtn.style.display = "block";
        }, 300);
        hyalinizedTimer = setTimeout(function() {
          //透明化
          btnsContainer.style.transition = "all 0.5s"; //添加过渡效果
          btnsContainer.style.opacity = btnOpacity;
          setTimeout(function() {
            btnsContainer.style.transition = "none"; //过度效果完成后移除过渡效果
          }, 500);
        }, 4500);
      }
    };
    var backBtnClickFunction = function() {
      console.log("返回按钮");
      clearTimeout(hyalinizedTimer);
      history.back();
      hyalinizedTimer = setTimeout(function() {
        //透明化，等页面返回后再执行，避免过渡效果失效
        btnsContainer.style.opacity = btnOpacity;
      }, 4000);
    };
    var initialBtnTouchMoveFunction = function(event) {
      isTouch = true; //拖动开始再设置isTouch，表明是touch
      if (isBtnCanMove) {
        //由接口数据判断能否移动
        if (!isMenuOn) {
          //按钮菜单收起后才能起效
          event.preventDefault();
          var x = event.targetTouches[0].clientX;
          var y = event.targetTouches[0].clientY;

          var posX = x - btnsContainerSize / 2; //移动位置的Y坐标
          var posY = y - btnsContainerSize / 2; //移动位置的X坐标

          // 越界数据矫正
          if (posX < minX) posX = minX;
          if (posX > maxX) posX = maxX;
          if (posY < minY) posY = minY;
          if (posY > maxY) posY = maxY;

          btnsContainer.style.top = posY + "px"; //转换单位并进行样式设置
          btnsContainer.style.left = posX + "px"; //转换单位并进行样式设置
        }
      }
    };
    var initialBtnTouchEndFunction = function(event) {
      if (isBtnCanMove) {
        //由接口数据判断能否移动
        if (isTouch) {
          //过滤点击事件的影响
          if (!isMenuOn) {
            //按钮菜单收起后才能起效
            var x = event.changedTouches[0].clientX;
            var y = event.changedTouches[0].clientY;

            var posX = x - btnsContainerSize / 2; //移动位置的X坐标
            var posY = y - btnsContainerSize / 2; //移动位置的Y坐标

            // 判断位置进行位置修正
            if (posX <= priorDistance) {
              //最优先处理贴近左右的
              posX = minX;
              // console.log(1)
            } else if (posX >= maxX - priorDistance) {
              posX = maxX;
              // console.log(2)
              // console.log(posX + '  ' + maxX)
              // console.log(maxX - priorDistance)
            } else if (posY <= priorDistance) {
              //然后优先处理贴近上下的
              posY = minY;
              // console.log(3)
            } else if (posY >= maxY - priorDistance) {
              posY = maxY;
              // console.log(4)
            } else if (posX < midX) {
              //其他情况贴向左右
              posX = minX;
              // console.log(5)
              // console.log(posY+ '  ' + maxY)
            } else {
              posX = maxX;
              // console.log(6)
            }

            // 越界数据矫正
            if (posX < minX) posX = minX;
            if (posX > maxX) posX = maxX;
            if (posY < minY) posY = minY;
            if (posY > maxY) posY = maxY;

            btnsContainer.style.transition = "all 0.5s"; //添加过渡效果
            btnsContainer.style.top = posY + "px"; //转换单位并进行样式设置
            btnsContainer.style.left = posX + "px"; //转换单位并进行样式设置
            setTimeout(function() {
              btnsContainer.style.transition = "none"; //过度效果完成后移除过渡效果
            }, 500);
            hyalinizedTimer = setTimeout(function() {
              btnsContainer.style.transition = "all 0.5s"; //添加过渡效果
              btnsContainer.style.opacity = btnOpacity;
              setTimeout(function() {
                btnsContainer.style.transition = "none"; //过度效果完成后移除过渡效果
              }, 500);
              // console.log(11)
            }, 4500);
          }
        }
        isTouch = false;
      }
    };
    var initialBtnTouchStartFunction = function(event) {
      if (isBtnCanMove) {
        //能移动才能在移动开始时取消透明效果
        if (buttonMode === 1) {
          if (!isMenuOn) {
            //按钮菜单收起后才能起效
            btnsContainer.style.opacity = maxOpacity;
            clearTimeout(hyalinizedTimer);
            // // 设置触摸位置相对按钮容器的位置数据，让按钮移动的整个过程更加平稳
            // touchInitialX = event.targetTouches[0].clientX - event.srcElement.offsetParent.parentNode.offsetLeft;
            // touchInitialY = event.targetTouches[0].clientY - event.srcElement.offsetParent.parentNode.offsetTop;
            // console.log(event)
            // console.log(touchInitialX)
            // console.log(touchInitialY)
          }
        } else if (buttonMode === 2) {
          //点击后直接跳转了，所以不用再设置计时器透明化
          btnsContainer.style.opacity = maxOpacity;
          clearTimeout(hyalinizedTimer);
        } else {
          console.log("按钮模式参数出错！");
        }
      }
    };
    var windowMouseMoveFunction = function(event) {
      // console.log(event)
      // console.log(event.screenX + 'px')
      // console.log(isMoving)
      isMoving = true;
      var x = event.clientX - mouseOffsetX;
      var y = event.clientY - mouseOffsetY;

      var posX;
      var posY;

      if (x >= maxX) {
        posX = maxX;
      } else if (x <= minX) {
        posX = minX;
      } else {
        posX = x;
      }

      if (y >= maxY) {
        posY = maxY;
      } else if (y <= minY) {
        posY = minY;
      } else {
        posY = y;
      }

      btnsContainer.style.left = posX + "px";
      btnsContainer.style.top = posY + "px";
    };
    var windowMouseUpFunction = function(event) {
      setTimeout(function() {
        // console.log(isMoving)
        isMoving = false;
      }, 10);
      window.removeEventListener("mousemove", windowMouseMoveFunction);

      // 按钮贴边效果
      if (!isMenuOn) {
        //按钮菜单收起后才能起效
        var x = btnsContainer.offsetLeft;
        var y = btnsContainer.offsetTop;

        var posX = x; //移动位置的X坐标
        var posY = y; //移动位置的Y坐标

        // console.log(x)
        // console.log(y)

        // 判断位置进行位置修正
        if (posX <= priorDistance) {
          //最优先处理贴近左右的
          posX = minX;
          // console.log(1)
        } else if (posX >= maxX - priorDistance) {
          posX = maxX;
          // console.log(2)
        } else if (posY <= priorDistance) {
          //然后优先处理贴近上下的
          posY = minY;
          // console.log(3)
        } else if (posY >= maxY - priorDistance) {
          posY = maxY;
          // console.log(4)
        } else if (posX < midX) {
          //其他情况贴向左右
          posX = minX;
          // console.log(5)
        } else {
          posX = maxX;
          // console.log(6)
        }

        // 越界数据矫正
        if (posX < minX) posX = minX;
        if (posX > maxX) posX = maxX;
        if (posY < minY) posY = minY;
        if (posY > maxY) posY = maxY;

        btnsContainer.style.transition = "all 0.5s"; //添加过渡效果
        btnsContainer.style.top = posY + "px"; //转换单位并进行样式设置
        btnsContainer.style.left = posX + "px"; //转换单位并进行样式设置
        setTimeout(function() {
          btnsContainer.style.transition = "none"; //过度效果完成后移除过渡效果
        }, 500);
        hyalinizedTimer = setTimeout(function() {
          btnsContainer.style.transition = "all 0.5s"; //添加过渡效果
          btnsContainer.style.opacity = btnOpacity;
          setTimeout(function() {
            btnsContainer.style.transition = "none"; //过度效果完成后移除过渡效果
          }, 500);
          // console.log(11)
        }, 4500);
      }
    };
    var initialBtnMouseDownFunction = function(event) {
      mouseOffsetX = event.clientX - btnsContainer.offsetLeft;
      mouseOffsetY = event.clientY - btnsContainer.offsetTop;

      btnsContainer.style.opacity = maxOpacity;
      clearTimeout(hyalinizedTimer);

      window.addEventListener("mousemove", windowMouseMoveFunction); //鼠标拖动按钮效果
      window.addEventListener("mouseup", windowMouseUpFunction); //拖动结束处理，包括贴边效果
    };

    // 进行创建元素的函数
    function doRender(data) {
      // DOM元素对象
      var suspensionButtonsWrapperElement = {
        label: "div",
        attr: {
          class: "suspension-buttons-wrapper " + btnsContainerClass,
          style: {
            position: "fixed",
            top: initialPosY + "px",
            left: initialPosX + "px",
            width: btnsContainerSize + "px",
            height: btnsContainerSize + "px",
            zIndex: 5000,
            transition: "opacity 0.5s",
            opacity: btnOpacity,
            MozUserSelect: "none",
            WebkitUserSelect: "none",
            userSelect: "none"
          }
        }
      };
      var buttonElement = {
        label: "div",
        attr: {
          class: "icon-wrapper",
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            width: btnSize + "px",
            height: btnSize + "px",
            textAlign: "center",
            background: btnBackgroundColor,
            borderRadius: "50%",
            transition: "all 0.5s ease",
            WebkitUserSelect: "none",
            userSelect: "none"
          }
        }
      };
      var iconElement = {
        label: "i",
        attr: {
          class: "MTF-icon",
          style: {
            display: "block",
            position: "relative",
            color: btnTextColor,
            fontSize: btnIconSize + "px",
            lineHeight: btnSize + "px",
            borderRadius: "50%"
          }
        }
      };
      var auxiliaryButtonsWrapperElement = {
        label: "div",
        attr: {
          class: "auxiliary-buttons-wrapper",
          style: {
            display: "none",
            position: "relative",
            top: 0,
            left: 0,
            width: btnsContainerSize + "px",
            height: btnsContainerSize + "px",
            opacity: 1
          }
        }
      };

      var bodyNode = document.body;
      // console.log(bodyNode);
      // console.log('创建悬浮按钮总容器');
      var suspensionButtonsWrapper = renderElemenmt(
        suspensionButtonsWrapperElement,
        bodyNode
      );
      // console.log('创建辅助按钮容器');
      var auxiliaryButtonsWrapper = renderElemenmt(
        auxiliaryButtonsWrapperElement,
        suspensionButtonsWrapper
      );

      // 根据按钮模式渲染按钮
      if (buttonMode === 1) {
        // 菜单按钮设置
        // console.log('创建菜单按钮');
        var menuButton = renderElemenmt(
          buttonElement,
          suspensionButtonsWrapper
        );
        // console.log('创建菜单按钮Icon');
        var menuButtonIcon = renderElemenmt(iconElement, menuButton);
        menuButton.classList.add("MTF-menu-button");
        menuButton.style.top = 0;
        menuButton.style.left = 0;
        menuButton.style.zIndex = 100;
        // menuButton.style.transition = 'all 0.5s';

        var menuBtnSize = menuBtnStyleObj.buttonSize; //菜单按钮大小
        var menuBtnIconSize = menuBtnStyleObj.buttonIconSize; //菜单按钮icon文字大小
        setButtonSize(menuButton, menuButtonIcon, menuBtnSize);
        menuButtonIcon.style.fontSize = menuBtnIconSize + "px";
        menuButtonIcon.style.color = homeBtn.color
          ? homeBtn.color
          : btnTextColor; //设置按钮icon颜色
        menuButtonIcon.style.background = homeBtn.backgroundColor
          ? homeBtn.backgroundColor
          : btnBackgroundColor; //设置按钮背景颜色
        if (homeBtn.iconType === 1) {
          //iconType为1时使用 iconClass
          menuButtonIcon.classList.add(homeBtn.iconClass);
        } else if (homeBtn.iconType === 2) {
          //iconType为2时使用图片
          addImg(homeBtn.iconImg, menuBtnSize, menuButtonIcon);
        } else {
          console.log("菜单按钮图片参数出错！");
        }

        if (data.isShowLabel) {
          addTextLabel(
            "展开",
            menuButton,
            menuBtnSize,
            menuBtnStyleObj.color,
            menuBtnStyleObj.backgroundColor
          ); //创建文本元素
        }
        // 辅助按钮设置
        //收起按钮
        // console.log('创建收起按钮');
        var closeButton = renderElemenmt(
          buttonElement,
          auxiliaryButtonsWrapper
        );
        // console.log('创建收起按钮Icon');
        var closeButtonIcon = renderElemenmt(iconElement, closeButton);
        closeButton.classList.add("MTF-close-button");
        //收起按钮样式设置
        if (homeBtn.iconType === 1) {
          //iconType为1时使用 iconClass
          closeButtonIcon.classList.add(homeBtn.activeIcon);
        } else if (homeBtn.iconType === 2) {
          //iconType为2时使用图片
          addImg(homeBtn.activeImg, menuBtnSize, closeButtonIcon); //尺寸大小和菜单按钮相同
        } else {
          console.log("收起按钮图片参数出错！");
        }

        setButtonSize(closeButton, closeButtonIcon, menuBtnSize);
        closeButtonIcon.style.fontSize = menuBtnIconSize + "px";
        closeButtonIcon.style.color = homeBtn.color
          ? homeBtn.color
          : btnTextColor; //设置按钮icon颜色
        closeButtonIcon.style.background = homeBtn.backgroundColor
          ? homeBtn.backgroundColor
          : btnBackgroundColor; //设置按钮背景颜色

        if (data.isShowLabel) {
          addTextLabel(
            "收起",
            closeButton,
            menuBtnSize,
            menuBtnStyleObj.color,
            menuBtnStyleObj.backgroundColor
          ); //创建文本元素
        }

        // 辅助按钮
        buttonList.forEach(function(item, index) {
          // console.log('创建功能按钮');
          var newButton = renderElemenmt(
            buttonElement,
            auxiliaryButtonsWrapper
          );
          // console.log('创建功能按钮Icon');
          var newButtonIcon = renderElemenmt(iconElement, newButton);
          var singleBtnStyleObj; //单独按钮样式对象
          var singleBtnSize; //单独按钮大小
          // var singleBtnIconSize;      //单独按钮icon大小

          // newButtonIcon.innerHTML = index         //开发用，要删除
          switch (
            index //设置class名并设置按钮尺寸大小
          ) {
            case 0:
              newButton.classList.add("MTF-first-button");
              singleBtnStyleObj = firstBtnStyleObj;
              break;
            case 1:
              newButton.classList.add("MTF-second-button");
              singleBtnStyleObj = secondBtnStyleObj;
              break;
            case 2:
              newButton.classList.add("MTF-third-button");
              singleBtnStyleObj = thirdBtnStyleObj;
              break;
            default:
              console.log("按钮数量出错！");
              break;
          }
          singleBtnSize = singleBtnStyleObj.buttonSize;
          // singleBtnIconSize = singleBtnStyleObj.buttonIconSize;

          setButtonSize(newButton, newButtonIcon, singleBtnSize);
          newButton.style.top =
            (menuBtnStyleObj.buttonSize - singleBtnStyleObj.buttonSize) / 2 +
            "px"; //设置初始位置，让过渡效果更好
          newButton.style.left =
            (menuBtnStyleObj.buttonSize - singleBtnStyleObj.buttonSize) / 2 +
            "px"; //设置初始位置，让过渡效果更好
          newButtonIcon.style.fontSize =
            singleBtnStyleObj.buttonIconSize + "px"; //设置按钮icon文字大小
          // 辅助按钮icon设置
          if (item.iconType === 1) {
            //iconType为1时使用 iconClass
            newButtonIcon.classList.add(item.iconClass);
          } else if (item.iconType === 2) {
            //iconType为2时使用图片
            addImg(item.iconImg, singleBtnSize, newButtonIcon);
          } else {
            console.log("收起按钮图片参数出错！");
          }

          if (item.clickEvent) {
            //设置点击事件处理函数
            newButtonIcon.onclick = item.clickEvent;
          } else if (item.href) {
            newButtonIcon.onclick = function() {
              location.href = item.href;
            };
          } else {
            console.log("按钮" + index + "的参数错误！");
          }
          newButtonIcon.style.color = item.color ? item.color : btnTextColor; //设置按钮icon颜色
          newButtonIcon.style.background = item.backgroundColor
            ? item.backgroundColor
            : btnBackgroundColor; //设置按钮背景颜色

          if (data.isShowLabel) {
            if (item.label) {
              addTextLabel(
                item.label,
                newButton,
                singleBtnSize,
                singleBtnStyleObj.color,
                singleBtnStyleObj.backgroundColor
              ); //创建文本元素
            }
          }
        });
      } else if (buttonMode === 2) {
        // console.log('创建返回按钮');
        var backButton = renderElemenmt(
          buttonElement,
          suspensionButtonsWrapper
        );
        // console.log('创建返回按钮Icon');
        var backButtonIcon = renderElemenmt(iconElement, backButton);
        // backButtonIcon.innerHTML = '返';         //开发用，要删除
        backButtonIcon.classList.add("MTF-back-button");
        backButton.style.top = 0;
        backButton.style.left = 0;
        backButton.style.zIndex = 100;

        var backBtnSize = menuBtnStyleObj.buttonSize; //菜单按钮大小
        var backBtnIconSize = menuBtnStyleObj.buttonIconSize; //菜单按钮icon文字大小
        setButtonSize(backButton, backButtonIcon, backBtnSize);
        backButtonIcon.style.fontSize = menuBtnIconSize + "px";
        // 返回按钮样式设置，根据homeBtn的数据设置
        if (homeBtn.iconType === 1) {
          //iconType为1时使用 iconClass
          backButtonIcon.classList.add(homeBtn.iconClass);
        } else if (homeBtn.iconType === 2) {
          //iconType为2时使用图片
          addImg(homeBtn.iconImg, backBtnSize, backButtonIcon); //尺寸大小和菜单按钮相同
        } else {
          console.log("收起按钮图片参数出错！");
        }
        backButtonIcon.style.color = homeBtn.color
          ? homeBtn.color
          : btnTextColor; //设置按钮icon颜色
        backButtonIcon.style.background = homeBtn.backgroundColor
          ? homeBtn.backgroundColor
          : btnBackgroundColor; //设置按钮背景颜色
        if (data.isShowLabel) {
          addTextLabel(
            "返回",
            backButton,
            backBtnSize,
            menuBtnStyleObj.color,
            menuBtnStyleObj.backgroundColor
          ); //创建文本元素
        }
      } else {
        console.log("按钮模式参数错误！");
      }

      console.log("按钮生成结束");
      return;
    }

    function createFloatBtn() {
      var data = null;

      // 获取传入的数据
      var api_isOpenFloatBtn = window.global.IsOpenMTfloatBtn;    // 是否能开启悬浮按钮功能
      var api_floatBtnConfig = window.global.MTfloatBtnConfig;
      var api_updateTime =
        (window.global.MTfloatBtnConfig &&
          window.global.MTfloatBtnConfig.updateTime) ||
        0;

      // 获取本地数据
      var local_isOpenFloatBtn = JSON.parse(
        localStorage.getItem("isOpenMTfloatBtnCache")
      );    // 是否已经开启悬浮按钮功能
      var local_floatBtnConfig =
        JSON.parse(localStorage.getItem("MTfloatBtnConfigCache")) || {};
      var local_updateTime =
        (local_floatBtnConfig && local_floatBtnConfig.updateTime) || 0;
      
      // 检查是否能开启按钮，以及是否已开启
      var isOpenFloatBtn; //按钮开启状态
      if (api_isOpenFloatBtn) {
        if(local_isOpenFloatBtn) {
          isOpenFloatBtn = true;
        }else {
          isOpenFloatBtn = false;
        }
      }else {
        isOpenFloatBtn = false;
      }
      // 根据配置的更新时间决定使用传入的数据还是本地数据
      var isApiData = !local_updateTime || api_updateTime >= local_updateTime;
      var floatBtnConfig = isApiData
        ? api_floatBtnConfig
        : local_floatBtnConfig;

      // console.log('----------------')
      // console.log(api_isOpenFloatBtn)
      // console.log(api_floatBtnConfig)
      // console.log(api_updateTime)
      // console.log('----------------')
      // console.log(local_isOpenFloatBtn)
      // console.log(local_floatBtnConfig)
      // console.log(local_updateTime)

      console.log("悬浮按钮开关：", isOpenFloatBtn);

      if (isOpenFloatBtn) {
        data = floatBtnConfig.floatBtnConfig;
        // 若本地存储没有按钮设置数据，则存储到本地存储
        if (!localStorage.getItem("MTfloatBtnConfigCache")) {
          var configCache = objCopy(floatBtnConfig);
          configCache.updateTime = Date.now();
          localStorage.setItem(
            "MTfloatBtnConfigCache",
            JSON.stringify(configCache)
          );
        }
      }

      // console.log('data:', data)

      if (data) {
        // 根据获取的数据设定初始数据
        btnsContainerClass = data.className;
        buttonMode = data.model;
        btnTextColor = data.color;
        btnBackgroundColor = data.backgroundColor;
        isBtnCanMove = data.isCanMove;
        isShowBtnLabel = data.isShowLabel;

        switch (
          data.size //设置默认按钮大小
        ) {
          case "mini":
            btnSize = miniSizeObj.itemSize;
            btnIconSize = miniSizeObj.itemIconSize;
            // console.log(1)
            break;
          case "small":
            btnSize = smallSizeObj.itemSize;
            btnIconSize = smallSizeObj.itemIconSize;
            // console.log(2)
            break;
          case "large":
            btnSize = largeSizeObj.itemSize;
            btnIconSize = largeSizeObj.itemIconSize;
            // console.log(3)
            break;
          default:
            btnSize = smallSizeObj.itemSize;
            btnIconSize = smallSizeObj.itemIconSize;
            // console.log(4)
            break;
        }
        // console.log('-----', data.size)

        // 根据获取的数据添加辅助按钮列表
        if (data.btnList) {
          data.btnList.forEach(function(item, index) {
            buttonList[index] = {};
            buttonList[index] = objCopy(window.global.MTfloatBtnMenus[item]);
          });
        } else {
          for (var i = 0; i < 3; i++) {
            buttonList[i] = {};
            buttonList[i] = objCopy(window.global.MTfloatBtnMenus[i]);
          }
        }

        homeBtn = objCopy(floatBtnConfig.homeBtn); //菜单按钮

        //按钮样式设置
        menuBtnStyleObj = computeSize(data.size); //菜单按钮样式对象
        btnsContainerSize = menuBtnStyleObj.buttonSize; //容器大小随菜单按钮大小变化而变化
        firstBtnStyleObj = computeSize(data.size); //第一辅助按钮样式对象   因为展开按钮时需要用到这些数据，所以要先设定好
        secondBtnStyleObj = computeSize(data.size); //第二辅助按钮样式对象
        thirdBtnStyleObj = computeSize(data.size); //第三辅助按钮样式对象

        //按钮背景颜色
        menuBtnStyleObj.backgroundColor = btnBackgroundColor;
        firstBtnStyleObj.backgroundColor = btnBackgroundColor;
        secondBtnStyleObj.backgroundColor = btnBackgroundColor;
        thirdBtnStyleObj.backgroundColor = btnBackgroundColor;
        //按钮字体颜色
        menuBtnStyleObj.color = btnTextColor;
        firstBtnStyleObj.color = btnTextColor;
        secondBtnStyleObj.color = btnTextColor;
        thirdBtnStyleObj.color = btnTextColor;
        //按钮尺寸
        if (homeBtn.size) {
          var tempObj = computeSize(homeBtn.size); //临时量
          menuBtnStyleObj.buttonSize = tempObj.buttonSize; //设置菜单按钮尺寸
          menuBtnStyleObj.buttonIconSize = tempObj.buttonIconSize; //设置菜单按钮icon尺寸
          btnsContainerSize = menuBtnStyleObj.buttonSize; //容器大小随菜单按钮大小变化而变化
          // console.log(11)
        }
        if (buttonList[0].size) {
          var tempObj = computeSize(buttonList[0].size);
          firstBtnStyleObj.buttonSize = tempObj.buttonSize;
          firstBtnStyleObj.buttonIconSize = tempObj.buttonIconSize;
          // console.log(22)
        }
        if (buttonList[1].size) {
          var tempObj = computeSize(buttonList[1].size);
          secondBtnStyleObj.buttonSize = tempObj.buttonSize;
          secondBtnStyleObj.buttonIconSize = tempObj.buttonIconSize;
          // console.log(33)
        }
        if (buttonList[2].size) {
          var tempObj = computeSize(buttonList[2].size);
          thirdBtnStyleObj.buttonSize = tempObj.buttonSize;
          thirdBtnStyleObj.buttonIconSize = tempObj.buttonIconSize;
          // console.log(44)
        }
        // console.log(firstBtnStyleObj)
        // console.log(secondBtnStyleObj)
        // console.log(thirdBtnStyleObj)
        //按钮字体颜色
        if (homeBtn.color) menuBtnStyleObj.color = homeBtn.color;
        if (buttonList[0].color) firstBtnStyleObj.color = buttonList[0].color;
        if (buttonList[1].color) secondBtnStyleObj.color = buttonList[1].color;
        if (buttonList[2].color) thirdBtnStyleObj.color = buttonList[2].color;

        //按钮背景颜色
        if (homeBtn.backgroundColor)
          menuBtnStyleObj.backgroundColor = homeBtn.backgroundColor;
        if (buttonList[0].backgroundColor)
          firstBtnStyleObj.backgroundColor = buttonList[0].backgroundColor;
        if (buttonList[1].backgroundColor)
          secondBtnStyleObj.backgroundColor = buttonList[1].backgroundColor;
        if (buttonList[2].backgroundColor)
          thirdBtnStyleObj.backgroundColor = buttonList[2].backgroundColor;

        // 边缘数据
        minX = saveAreaSize;
        midX = screenWidth / 2;
        maxX = screenWidth - btnsContainerSize - saveAreaSize;
        minY = saveAreaSize;
        maxY = screenHeight - btnsContainerSize - saveAreaSize;

        // 按钮总容器初始位置，要根据按钮大小设置，所以等按钮大小确定了再定义
        initialPosX = screenWidth - saveAreaSize - btnsContainerSize;
        initialPosY = screenHeight - saveAreaSize - 4 * btnsContainerSize;

        // console.log('+++',screenWidth)
        // console.log('+++',saveAreaSize)
        // console.log('+++',btnSize)

        if (!isBtnCanMove) {
          //不可移动时重新设定初始位置
          if (data.position.x <= saveAreaSize) {
            //检测并处理不合理的位置参数的x
            initialPosX = saveAreaSize;
          } else if (data.position.x >= maxX) {
            initialPosX = maxX;
          } else {
            initialPosX = data.position.x;
          }
          if (data.position.y <= saveAreaSize) {
            //检测并处理不合理的位置参数的y
            initialPosY = saveAreaSize;
          } else if (data.position.y >= maxY) {
            initialPosY = maxY;
          } else {
            initialPosY = data.position.y;
          }

          // 判断位置进行位置修正，当按钮位置不是在边缘时，修正为边缘位置
          if (initialPosX <= priorDistance) {
            //最优先处理贴近左右的
            initialPosX = minX;
            // console.log(1)
          } else if (initialPosX >= maxX - priorDistance) {
            initialPosX = maxX;
            // console.log(2)
            // console.log(initialPosX + '  ' + maxX)
            // console.log(maxX - priorDistance)
          } else if (initialPosY <= priorDistance) {
            //然后优先处理贴近上下的
            initialPosY = minY;
            // console.log(3)
          } else if (initialPosY >= maxY - priorDistance) {
            initialPosY = maxY;
            // console.log(4)
          } else if (initialPosX < midX) {
            //其他情况贴向左右
            initialPosX = minX;
            // console.log(5)
            // console.log(initialPosY+ '  ' + maxY)
          } else {
            initialPosX = maxX;
            // console.log(6)
          }
        }
        if (data.opacity) {
          //设置按钮静置后的透明度
          if (data.opacity < minOpacity) {
            //静置后的不透明度最小值为0.1
            btnOpacity = minOpacity;
          } else if (data.opacity < maxOpacity) {
            btnOpacity = data.opacity;
          } else {
            //静置后的不透明度最大值为0.8
            btnOpacity = maxOpacity;
          }
        }

        // 执行创建
        doRender(data);

        // 事件功能实现区
        isMenuOn = false; //按钮菜单是否已打开

        hyalinizedTimer; // 透明化计时器，处理变回透明的效果
        isTouch = false; //防止点击时触发touchend事件的状态量
        menuPos = "posLeft"; //菜单按钮的位置，决定着辅助按钮弹出的方向，顶部'posTop'，底部'posBottom'，右边'posRight'，左边'posLeft'

        // 获取按钮元素
        btnsContainer = document.querySelector(".suspension-buttons-wrapper"); //总体容器
        auxiliaryBtnContainer = document.querySelector(
          ".suspension-buttons-wrapper .auxiliary-buttons-wrapper"
        ); //辅助按钮容器
        menuBtn = document.querySelector(
          ".suspension-buttons-wrapper .MTF-menu-button"
        ); //菜单按钮
        closeBtn = document.querySelector(
          ".suspension-buttons-wrapper .MTF-close-button"
        ); //收起按钮
        firstBtn = document.querySelector(
          ".suspension-buttons-wrapper .MTF-first-button"
        ); //第一按钮
        secondBtn = document.querySelector(
          ".suspension-buttons-wrapper .MTF-second-button"
        ); //第二按钮
        thirdBtn = document.querySelector(
          ".suspension-buttons-wrapper .MTF-third-button"
        ); //第三按钮
        backBtn = document.querySelector(
          ".suspension-buttons-wrapper .MTF-back-button"
        ); //返回按钮，当按钮模式为1时才能获取到

        initialBtn; //最开始出现的按钮，根据模式不同而不同，模式1为菜单按钮，模式2为返回按钮
        if (buttonMode === 1) {
          initialBtn = menuBtn;
        } else if (buttonMode === 2) {
          initialBtn = backBtn;
        } else {
          console.log("按钮模式参数出错！");
        }

        if (buttonMode === 1) {
          // 打开按钮菜单
          menuBtn.onclick = menuBtnClickFunction;
          // 收起按钮菜单
          closeBtn.onclick = closeBtnClickFunction;
        } else if (buttonMode === 2) {
          // 返回按钮的功能
          backBtn.onclick = backBtnClickFunction;
        } else {
          console.log("按钮类型参数出错！");
        }

        // 初始按钮拖动效果
        initialBtn.ontouchmove = initialBtnTouchMoveFunction;
        // 初始按钮贴边效果
        initialBtn.ontouchend = initialBtnTouchEndFunction;
        // 取消更透明的效果
        initialBtn.ontouchstart = initialBtnTouchStartFunction;
        // 电脑端拖动效果
        initialBtn.onmousedown = initialBtnMouseDownFunction;
      } else {
        // console.log("创建按钮参数不能为空！");
        console.log('不开启悬浮按钮');
      }
    }
    createFloatBtn();
    window.createFloatBtn = createFloatBtn;
  };
})();

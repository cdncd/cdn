/**
 * @MT 微信 上传图片
 * Copyright (c) 2015, 猫态科技 Inc.
 * All rights reserved.
 * By 神童  2018
 */

(function () {
  // 常量
  var ALL_URL_HOST_LIST = ["mt-1kx3vuab1583115501", "file.myqcloud.com"]; // 程序默认会截取后端返回的url的域名，如果后端返回的url包含此数组的字符串片段，则不需要截取 by afei 2020/04/13
  var H5_TYPE = "H5";
  var WX_TYPE = "WX";
  var APP_TYPE = "APP";
  function bytesToSize(bytes) {
    if (bytes === 0) return "0 B";
    var k = 1024, // or 1024
      sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
  }

  var WxVision = (function () {
    var agent = navigator.userAgent.toLowerCase();
    var a =
      agent.match(/micromessenger\/(\d+\.\d+\.\d+)/) ||
      agent.match(/micromessenger\/(\d+\.\d+)/);
    return a ? a[1] : "";
  })();

  var IsWinWechat = (function () {
    var agent = navigator.userAgent.toLowerCase();
    return (
      agent.match(/windowswechat/i) == "windowswechat" &&
      agent.match(/micromessenger/i) == "micromessenger"
    );
  })();

  var GetImgDirectory = (function () {
    var dir = "";
    if (window.location.pathname) {
      var arr = window.location.pathname.split("/");

      dir = arr[arr.length - 1];

      if (dir) {
        dir = dir.replace(".aspx", "");
      }
    }

    return dir;
  })();

  //圆环对象
  function Cycle(opts) {
    this.width = opts.width;
    this.border = opts.border;
    this.height = opts.height;
    this.bgcolor = opts.bgcolor;
    this.pcolor = opts.pcolor;
    this.textcolor = opts.textcolor;
    this.percent = opts.percent;
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
  }

  //动态扩展内置方法
  Cycle.prototype = {
    constructor: Cycle, //声明指向构造器
    //设置参数
    update: function (percent) {
      var w = this.width;
      var h = this.height;
      var deg = percent || this.percent;
      var cradius = w / 2 - this.border;
      this.canvas.width = this.width;
      this.canvas.height = this.height;

      this.context.fillStyle = "rgba(255,255,255,0.5)";
      //绘制到画板中
      this.context.stroke();

      //清除画布
      this.context.clearRect(0, 0, w, h);
      //开始绘画
      this.context.beginPath();
      //设置圆的边框
      this.context.lineWidth = this.border;
      //绘制边框的颜色
      this.context.strokeStyle = this.bgcolor; //实心用fillstyle对应的方法是fill()
      //绘制圆
      this.context.arc(w / 2, h / 2, cradius, 0, 2 * Math.PI);
      //绘制到画板中
      this.context.stroke();

      //计算一个角度对应弧度是多少
      var d = ((deg * 3.6) / 180) * Math.PI;
      //重新绘制
      this.context.beginPath();
      //设置圆的边框
      this.context.lineWidth = this.border;
      //绘制边框的颜色
      this.context.strokeStyle = this.pcolor;
      //绘制圆
      this.context.arc(w / 2, h / 2, cradius, -Math.PI / 2, d - Math.PI / 2);
      //绘制到画板中
      this.context.stroke();

      //文字
      this.context.beginPath();
      //字体颜色
      this.context.fillStyle = this.textcolor;
      //字体样式
      this.context.font = "0.6rem 微软雅黑";

      var text = "压缩中";
      if (deg < 2) {
        text = "压缩中";
      }
      if (deg == 100) {
        text = "加载中";
      } else {
        text = deg + "%";
      }

      //获取文字宽度
      var textWidth = this.context.measureText(text).width;
      //绘制文字fillText("百分比",x,y);
      this.context.fillText(text, w / 2 - textWidth / 2, h / 2 + 6);
      return this;
    },
    GetImage: function () {
      return this.canvas.toDataURL("image/png", 1);
    },
  };
  var cycle = new Cycle({
    width: 60,
    height: 60,
    border: 10,
    percent: 0,
    bgcolor: "gray",
    pcolor: "green",
    textcolor: "#111",
  });

  window.compressImg = function (inputId, viewId, afterWidth, callback) {
    compressor({
      inputId: inputId,
      viewId: viewId,
      afterWidth: afterWidth,
      callback: callback,
    });
  };

  window.compressor = function (opt) {
    var inputFile = document.getElementById(opt.inputId);
    var viewElm = document.getElementById(opt.viewId);
    var placeholderImgSrc = viewElm.src;
    var itemId = opt.itemId;
    var isGetCompleteURL = opt.isGetCompleteURL || false; // 是否上传图片后获取完整的图片url，还是截取域名
    var afterWidth = opt.afterWidth || 1200; // 压缩后的图片宽度
    var maxSize = opt.maxSize || 1024 * 1024 * 3.5; // 图片最大体积
    var quality = opt.quality || 0.8; // 压缩率
    var callback = opt.callback; // 回调函数
    var beforeUpload = opt.beforeUpload; // 回调函数
    if (typeof callback !== "function") {
      callback = function () {};
    }
    if (typeof beforeUpload !== "function") {
      beforeUpload = function () {};
    }
    var imgType =
      opt.imgType ||
      "image/png,image/jpg,image/jpeg,image/pjpeg,image/gif,image/bmp,image/x-png";
    inputFile.addEventListener("click", function (e) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        window.event.returnValue == false;
      }
      opt.count = 1; // 只能选择一张照片
      opt.success = function (res) {
        //  h5 选择图片
        if (res.type === H5_TYPE) {
          var fileList = res.data;
          var file = fileList[0];
          if (file.size && file.size > maxSize) {
            alert(
              "对不起，您的图片" +
                bytesToSize(file.size) +
                "太大请把图片压缩在" +
                bytesToSize(maxSize) +
                "内再上传~"
            );
            return;
          } else if (imgType.indexOf(file.type) === -1) {
            alert("格式不正确");
            return;
          }
          // 压缩图片
          MT_H5_compress({
            file: file,
            quality: quality,
            afterWidth: afterWidth,
            isGetCompleteURL: isGetCompleteURL,
            fail: function (err) {
              console.error("图片压缩失败", err);
              callback("", itemId);
              alert("图片压缩失败" + JSON.stringify(err));
            },
            success: compressorSuccess,
          });
        }
        // 微信选图成功
        else if (
          res.type === WX_TYPE &&
          res.data.localIds &&
          res.data.localIds.length > 0
        ) {
          var data = res.data;
          wx.getLocalImgData({
            localId: data.localIds[0],
            success: function (result) {
              var arr = result.localData.split(",");
              //IPhone
              if (arr.length === 2) {
                arr[0] = "data:image/jpeg;base64";
              } else if (arr.length === 1) {
                //Android
                arr.unshift("data:image/jpeg;base64");
              }
              result.localData = arr.join(",");
              compressorSuccess(result.localData, isGetCompleteURL);
            },
            cancel: function () {
              callback("", itemId);
            },
            fail: function (err) {
              callback("", itemId);
              MT_chooseImg = H5_chooseImg;
              MT_chooseImg(opt);
            },
          });
        }
        // 原生APP 选图成功
        else if (res.type === APP_TYPE) {
          try {
            var data = JSON.parse(res.data);
            if (data.id === 1) {
              compressorSuccess(data.items, isGetCompleteURL);
            } else {
              MT_chooseImg = H5_chooseImg;
              MT_chooseImg(opt);
            }
          } catch (err) {
            MT_chooseImg = H5_chooseImg;
            MT_chooseImg(opt);
          }
        } else {
          alert("选择图片失败，请联系管理员");
          callback("", itemId);
        }
      };
      opt.fail = function (e) {
        console.error(e);
      };
      if (!!opt.currentImgUrl) {
        // 查看大图
        MT_previewImage({
          canUpdate: true,
          current: opt.currentImgUrl,
          updated: function () {
            MT_chooseImg(opt);
          },
          close: function () {
            console.log("关闭时间", opt.itemId);
          },
        });
        return;
      }
      MT_chooseImg(opt);
    });
    // 接收到 base64 的图片后的操作
    var compressorSuccess = function (base64, isGetCompleteURL) {
      viewElm.setAttribute("src", cycle.update(0).GetImage());
      var form = new FormData(); // FormData 对象
      var ImgDirectory =
        (window.global && window.global.ImgDirectory) || GetImgDirectory;

      form.append("action", "base64stringtoimage"); // 方法
      form.append("ImgDirectory", ImgDirectory); // 目录
      form.append("ImageDataBase64", base64); // 数据
      // 上传图片
      uploadBase64Img({
        serverUrl: "/ServiceAPI/usercenter/Manager.aspx",
        timeout: window.global && window.global.ImageUpdateTimeout,
        formData: form,
        fail: function (error) {
          console.error("上传失败", error);
          callback("", itemId);
          viewElm.setAttribute("src", placeholderImgSrc);
        },
        success: function (data) {
          if (data.id === 1) {
            // 判断返回的url是否包含 ALL_URL_HOST_LIST 里面是字符片段 by afei 2020/04/13
            var isExist = ALL_URL_HOST_LIST.find(function (str) {
              if (!str) return false;
              str = str.toLocaleLowerCase();
              return data.url.toLocaleLowerCase().indexOf(str) !== -1;
            });
            // 获取完全的url，不截取域名
            if (!!isExist || isGetCompleteURL) {
              viewElm.setAttribute("src", data.url);
              opt.currentImgUrl = data.url;
              callback(data.url, itemId);
            } else {
              var URL = window.URL || window.webkitURL;
              var url = new URL(data.url);
              var href = url.href;
              var pathname = url.pathname;
              var IsImageServer =
                (window.global && window.global.IsImageServer) || false;
              var ImageServer =
                (window.global && window.global.ImageServer) || "";
              if (IsImageServer && ImageServer) {
                href = ImageServer + url.pathname;
              }
              viewElm.setAttribute("src", href);
              opt.currentImgUrl = href;
              callback(pathname, itemId);
            }
          } else {
            callback("", itemId);
            alert(data.messages);
          }
        },
        progress: function (data) {
          viewElm.setAttribute(
            "src",
            cycle
              .update(Math.round((data.loaded / data.total) * 100))
              .GetImage()
          );
        },
        beforeUpload: function (xhr) {
          beforeUpload(xhr);
        },
      });
    };
  };
  //   原生h5上传图片时，压缩图片
  var MT_H5_compress = function (opt) {
    var file = opt.file,
      afterWidth = opt.afterWidth || 1200, // 压缩后的图片宽度
      fail = opt.fail, // 失败钩子
      quality = opt.quality,
      success = opt.success; // 压缩成功钩子，参数是压缩后的 base64 字符串
    var hidCanvas = document.createElement("canvas");
    if (!hidCanvas.getContext) {
      alert("对不起，您的浏览器不支持图片压缩及上传功能，请换个浏览器试试~");
      return;
    }
    var hidCtx = hidCanvas.getContext("2d");
    //获取图像的方位信息
    var orientation = 1;
    try {
      EXIF.getData(file, function () {
        orientation = parseInt(EXIF.getTag(file, "Orientation"));
        orientation = orientation ? orientation : 1;
        var URL = window.URL || window.webkitURL;
        var blob = URL.createObjectURL(file);
        var img = new Image();
        img.src = blob;
        img.addEventListener("load", function () {
          var upImgWidth = img.width,
            upImgHeight = img.height;
          if (upImgWidth < 10 || upImgWidth < 10) {
            alert("请不要上传过小的图片");
            return false;
          }
          //压缩换算后的图片高度
          var afterHeight = (afterWidth * upImgHeight) / upImgWidth;
          // 设置压缩canvas区域高度及宽度
          hidCanvas.setAttribute("height", afterHeight);
          hidCanvas.setAttribute("width", afterWidth);
          if (orientation === 3 || orientation === 4) {
            hidCtx.translate(afterWidth, afterHeight);
            hidCtx.rotate((180 * Math.PI) / 180);
          } else if (orientation === 5 || orientation === 6) {
            hidCtx.translate(afterHeight, 0);
            hidCtx.rotate((90 * Math.PI) / 180);
          } else if (orientation === 7 || orientation === 8) {
            hidCtx.translate(0, afterWidth);
            hidCtx.rotate((270 * Math.PI) / 180);
          }
          hidCtx.drawImage(this, 0, 0, afterWidth, afterHeight);
          var base64 = getImgBase64({
            img: this,
            hidCanvas: hidCanvas,
            hidCtx: hidCtx,
            width: afterWidth,
            height: afterHeight,
            orientation: orientation,
            quality: quality,
            fileType: file.type,
          });
          if (typeof success === "function") {
            success(base64, opt.isGetCompleteURL);
          }
        });
      });
    } catch (err) {
      if (typeof fail === "function") {
        fail(err);
      }
    }
  };
  var getImgBase64 = function (options) {
    if (navigator.userAgent.match(/iphone/i)) {
      getImgBase64 = function (options) {
        var hidCanvas = options.hidCanvas;
        var width = options.width;
        var height = options.height;
        var quality = options.quality;
        var orientation = options.orientation;
        var img = options.img;
        var fileType = options.fileType;
        var mpImg = new MegaPixImage(img);
        mpImg.render(hidCanvas, {
          maxWidth: width,
          maxHeight: height,
          quality: quality || 0.8,
          orientation: orientation || 1,
        });
        return hidCanvas.toDataURL(fileType, quality || 0.8);
      };
    } else if (navigator.userAgent.match(/Android/i)) {
      getImgBase64 = function (options) {
        var hidCtx = options.hidCtx;
        var afterWidth = options.width;
        var quality = options.quality;
        var afterHeight = options.height;
        // 修复android
        var encoder = new JPEGEncoder();
        return encoder.encode(
          hidCtx.getImageData(0, 0, afterWidth, afterHeight),
          quality * 100 || 80
        );
      };
    } else {
      getImgBase64 = function (options) {
        var hidCanvas = options.hidCanvas;
        var fileType = options.fileType;
        var quality = options.quality;
        return hidCanvas.toDataURL(fileType, (quality || 0.8) * 1);
      };
    }
    return getImgBase64(options);
  };
  // 统一选图的方式（原生h5、微信公众号、原生APP（未完成））
  var MT_chooseImg = function (options) {
    try {
      // 原生APP取图
      if (window.global && window.global.IsMountain && window.wxx) {
        MT_chooseImg = function (options) {
          var successTemp = options.success;
          options.success = function (data) {
            if (typeof successTemp === "function") {
              successTemp({ type: APP_TYPE, data: data });
            }
          };
          var failTemp = options.fail;
          options.fail = function (data) {
            try {
              if (typeof data === "string" && JSON.parse(data).id === 2) {
                console.log("取消选图");
                return;
              }
            } catch (err) {}
            // 微信、原生APP选择图片失败
            MT_chooseImg = H5_chooseImg;
            if (typeof failTemp === "function") {
              failTemp.apply(this, arguments);
            }
            options.success = successTemp;
            options.fail = failTemp;
            MT_chooseImg(options);
          };
          options.prams = {
            width: 750,
            height: 1334,
            quality: 0.8,
          };
          wxx.getLocalImgData(options);
        };
      }
      // 微信选择图片
      else if (!IsWinWechat && window.wx && WxVision > "6.5.0") {
        MT_chooseImg = function (options) {
          var successTemp = options.success;
          options.success = function (data) {
            if (typeof successTemp === "function") {
              successTemp({ type: WX_TYPE, data: data });
            }
          };
          var failTemp = options.fail;
          options.fail = function () {
            // 微信、原生APP选择图片失败
            MT_chooseImg = H5_chooseImg;
            if (typeof failTemp === "function") {
              failTemp.apply(this, arguments);
            }
            options.success = successTemp;
            options.fail = failTemp;
            MT_chooseImg(options);
          };
          window.wx.chooseImage(options);
        };
      }
      // h5选择图片
      else {
        MT_chooseImg = H5_chooseImg;
      }
      MT_chooseImg(options);
    } catch (err) {
      alert("选择图片异常" + JSON.stringify(err));
      console.error(err);
    }
  };
  // h5 取图片
  var uploadInputEle;
  var H5_chooseImg = function (options) {
    var _options = options,
      success = _options.success,
      fail = _options.fail,
      cancel = _options.cancel,
      sourceType = _options.sourceType || ["album", "camera"],
      count = _options.count || 1;
    try {
      if (!uploadInputEle) {
        uploadInputEle = document.createElement("input");
        uploadInputEle.setAttribute("type", "file");
        uploadInputEle.setAttribute("accept", "image/*");
      }
      uploadInputEle.onchange = function (event) {
        try {
          const targetElem = event.target;
          const curFiles = targetElem.files;
          console.log("curFiles", curFiles);
          if (curFiles.length === 0) {
            if (typeof cancel === "function") {
              cancel();
            }
          } else if (typeof success === "function") {
            success({ type: H5_TYPE, data: targetElem.files });
          }
        } catch (err) {
          if (typeof fail === "function") {
            fail(err);
          }
        }
        uploadInputEle.value = "";
      };
      if (sourceType.length === 1 && sourceType[0] === "camera") {
        uploadInputEle.setAttribute("capture", "camera");
      } else {
        uploadInputEle.removeAttribute("capture");
      }
      if (count === 1) {
        uploadInputEle.removeAttribute("multiple");
      } else {
        uploadInputEle.setAttribute("multiple", "multiple");
      }
      uploadInputEle.click();
    } catch (err) {
      console.error("h5选图失败错误", err);
    }
  };

  //  将 base64 图片 上传至服务器，默认为post请求
  /**
   *
   * @param {Object} options
   * @param {String} options.serverUrl  上传图片的api地址
   * @param {FormData} options.formData  需要上传的实体
   * @param {String} options.timeout  超时时间
   * @param {Function} options.fail  上传失败钩子
   * @param {Function} options.success  上传成功钩子
   * @param {Function} options.progress  上传过程中，进度事件钩子
   * @param {Function} options.beforeUpload  上传前的事件，显示返回 false 可以取消上传，原生的 xhr 实例作为参数
   */
  var uploadBase64Img = function (options) {
    var serverUrl = options.serverUrl,
      timeout = options.timeout || 60 * 1000,
      form = options.formData,
      fail = options.fail,
      beforeUpload = options.beforeUpload;
    success = options.success;
    progress = options.progress;
    if (typeof fail !== "function") {
      fail = function () {};
    }
    if (typeof success !== "function") {
      success = function () {};
    }
    if (typeof progress !== "function") {
      progress = function () {};
    }
    var xhr = new XMLHttpRequest();
    xhr.open("post", serverUrl, true); //post方式，url为服务器请求地址
    xhr.timeout = timeout;
    xhr.ontimeout = function (error) {
      xhr.abort();
      alert(
        "上传图片，超时，请重试" +
          +JSON.stringify(error) +
          "," +
          navigator.userAgent
      );
      fail({ type: "timeout", msg: "上传超时", error: error });
    };
    xhr.onload = function (event) {
      if (this.readyState === 4 && this.status === 200) {
        success(JSON.parse(this.responseText));
      } else {
        fail({ type: "error", msg: "上传出错", error: event });
      }
    };
    xhr.onerror = function (event) {
      alert(
        "上传图片，出错，请重试" +
          +JSON.stringify(event) +
          "," +
          navigator.userAgent
      );
      fail({ type: "error", msg: "上传出错", error: event });
    };
    xhr.upload.onprogress = function (event) {
      progress(event);
    };

    if (typeof beforeUpload === "function" && beforeUpload(xhr) !== false) {
      xhr.send(form);
    }
  };

  // 查看大图
  var MT_previewImage = function (options) {
    var canUpdate = options.canUpdate || false;
    var previewBox = document.createElement("div");
    var mark = document.createElement("div");
    var bigImg = document.createElement("img");
    previewBox.setAttribute(
      "style",
      "position: fixed;width: 100vw;height: 100vh;display: flex;justify-content: center;align-items: center;top: 0;left: 0;z-index: 250;"
    );
    mark.setAttribute(
      "style",
      "background-color: #000;position: absolute;left: 0;right: 0;top: 0;bottom: 0;"
    );
    bigImg.setAttribute(
      "style",
      "position: relative;width: 100%;z-index: 88;max-height: 83%;"
    );
    previewBox.appendChild(mark);
    previewBox.appendChild(bigImg);
    document.body.appendChild(previewBox);
    if (canUpdate) {
      var handleBox = document.createElement("div");
      var handleUpdate = document.createElement("div");
      handleUpdate.innerHTML =
        '<svg t="1562850340083" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2799" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><defs><style type="text/css"></style></defs><path d="M521.152 393.408l319.936-320 45.248 45.312-320 320z" fill="#dbdbdb" p-id="2800"></path><path d="M896 960H64V64h448v64H128v768h704V448h64v512z" fill="#dbdbdb" p-id="2801"></path></svg><span style="margin-left:10px;">更换</sapn>';
      handleBox.setAttribute(
        "style",
        " position: absolute;display: flex;left: 0;right: 0;bottom: 0;height: 48px;background-color: #0D0D0D;z-index: 88;color:#fff;font-size: 16px;"
      );
      handleUpdate.setAttribute(
        "style",
        "text-align: center;flex-grow: 1;display: flex;align-items: center;justify-content: center;"
      );
      handleBox.appendChild(handleUpdate);
      previewBox.appendChild(handleBox);
    }
    MT_previewImage = function (options) {
      var current = options.current;
      var closeHandle = options.close;
      var canUpdate = options.canUpdate || false;
      bigImg.src = current;
      mark.onclick = function () {
        previewBox.style.display = "none";
        if (typeof closeHandle === "function") {
          return closeHandle.apply(this, arguments);
        }
      };
      if (canUpdate) {
        handleUpdate.onclick = function () {
          var updatedHandle = options.updated;
          if (typeof updatedHandle === "function") {
            previewBox.style.display = "none";
            updatedHandle();
          }
        };
      }
      previewBox.style.display = "flex";
    };
    MT_previewImage(options);
  };

  //   导出工具方法
  window.MT_chooseImg = MT_chooseImg; // 选择图片
  window.MT_previewImage = MT_previewImage; // 查看大图
  window.MT_uploadBase64Img = uploadBase64Img; // 上次base64图片
})();

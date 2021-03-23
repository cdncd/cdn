    /**
     * @MT 微信 上传图片
	 * Copyright (c) 2015, 猫态科技 Inc.
	 * All rights reserved.
     */
(function () { 
    function bytesToSize(bytes) {
        if (bytes === 0) return '0 B';
        var k = 1024, // or 1024
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }

   
    var WxVision = function () {
        var agent = navigator.userAgent.toLowerCase();
        var a = agent.match(/micromessenger\/(\d+\.\d+\.\d+)/) || agent.match(/micromessenger\/(\d+\.\d+)/);
        return a ? a[1] : "";
    }();

    var IsWinWechat = function () {
        var agent = navigator.userAgent.toLowerCase(); 
        return agent.match(/windowswechat/i) == 'windowswechat' && agent.match(/micromessenger/i) == 'micromessenger'
       
    }();

    

    window.compressor = function (opt) {
      

        //如果是使用微信
        if (global.IsWeixinClientRequest && global.IsUseWeiXinSDKUpdatePic && wx) {


            if (WxVision > '6.5.0' && !IsWinWechat) {
                wxcompress(opt);
            } else {
                //微信版本不支持 使用原生选择图片
                var inputFile = document.getElementById(opt.inputId);
               // alert(inputFile.type);
                if (inputFile) {
                    inputFile.type = 'file';
                    inputFile.outerHTML = '<input type="file" accept="image/*" name="' + opt.inputId + '" id="' + opt.inputId +'">'
                } 
                //alert(inputFile.type);
                localcompress(opt);
            }  
           
        } else {
           
            localcompress(opt);
        }
    }
    /**
     * 微信试取图
     * @param {any} opt
     */
    var wxcompress = function (opt) {
        var inputId = opt.inputId;
        var viewId = opt.viewId;
        var afterWidth = opt.afterWidth;
        var callback = opt.callback;
        var itemId = opt.itemId;

        var inputFile = document.getElementById(inputId),
            viewImg = document.getElementById(viewId) 

        if (!viewImg) {
            var img2 = document.createElement('img');
            img2.id = viewId; 
            viewImg = img2; 
        }

        var imgSrc = viewImg.src;
        var loading = "/a/images/loading.gif";

        try {
            inputFile.addEventListener("click", function () { 
                imgSrc = imgSrc || viewImg.src;
                
                //加载提示
                viewImg.src = loading;
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        //  console.log("chooseImage", JSON.stringify(res));
                        // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片 
                        try {
                            if (global.checkResult.getLocalImgData) {
                                wx.getLocalImgData({
                                    localId: res.localIds[0], // 图片的localID
                                    success: function (result) {
                                        //  console.log("getLocalImgData", JSON.stringify(result), bytesToSize(result.localData.length));
                                        // localData是图片的base64数据，可以用img标签显示


                                        var arr = result.localData.split(',');
                                        //IPhone
                                        if (arr.length == 2) {
                                            arr[0] = "data:image/jpeg;base64";
                                        } else if (arr.length == 1) {
                                            //Android
                                            arr.unshift("data:image/jpeg;base64");
                                        }

                                        result.localData = arr.join(',');


                                        viewImg.setAttribute("src", result.localData);

                                        // 此处将得到的图片数据回调
                                        if (callback != undefined) {
                                            callback(result.localData, itemId);
                                        } else {
                                            viewImg.src = imgSrc;
                                        }

                                    },
                                    cancel: function (res) {
                                        viewImg.src = imgSrc;
                                        if (callback != undefined) {
                                            callback("", itemId);
                                        }
                                        //取消选择图片
                                    },
                                    fail: function (res) {
                                        viewImg.src = imgSrc;
                                        if (callback != undefined) {
                                            callback("", itemId);
                                        }

                                        alert("转换图片失败，请重试：" + JSON.stringify(res) + "," + navigator.userAgent);
                                    }
                                });
                            } else {

                                viewImg.src = imgSrc;
                                if (callback != undefined) {
                                    callback("", itemId);
                                }
                                alert("您的微信不支持,请升级您的微信\b\r" + navigator.userAgent);
                            }


                        } catch (ex) {
                            viewImg.src = imgSrc;
                            if (callback != undefined) {
                                callback("", itemId);
                            }
                            alert("转图片失败，请重试：" + JSON.stringify(ex) + "," + navigator.userAgent);
                        }

                    },
                    cancel: function (res) {
                        viewImg.src = imgSrc;
                        if (callback != undefined) {
                            callback("", itemId);
                        }
                        //取消选择图片
                    },
                    fail: function (res) {
                        viewImg.src = imgSrc;
                        if (callback != undefined) {
                            callback("", itemId);
                        }

                        alert("选择图片失败，请重试：" + JSON.stringify(res) + "," + navigator.userAgent);
                    }
                });



            }, false);

        } catch (e) {
            viewImg.src = imgSrc;
            if (callback != undefined) {
                callback("", itemId);
            }
            alert(e);
        }

    }
    /**
     * 原生方式取图
     * @param {any} opt
     */
    var localcompress = function (opt) {

        var inputId = opt.inputId;
        var viewId = opt.viewId;
        var afterWidth = opt.afterWidth;
        var callback = opt.callback;
        var itemId = opt.itemId;

        var inputFile = document.getElementById(inputId),
            viewImg = document.getElementById(viewId),
            hidCanvas = document.createElement('canvas'),
            hidCtx;
        var imgSrc = viewImg.src;
        var loading = "/a/images/loading.gif";

        //生成隐藏画布
        if (hidCanvas.getContext) {

        } else {

            alert("对不起，您的浏览器不支持图片压缩及上传功能，请换个浏览器试试~");

            return;
        }

       try { 
           

           inputFile.addEventListener("change", function () {

               hidCanvas = hidCanvas || document.createElement('canvas');
               imgSrc = imgSrc || viewImg.src;
               hidCtx = hidCtx || hidCanvas.getContext('2d');

               //加载提示
               viewImg.src = loading;
               var file = this.files[0];
               //通过 this.files 取到 FileList ，这里只有一个
               var self = this;
               var quality = '0.8'; //压缩率，默认值为0.8
               var type = 'image/png,image/jpg,image/jpeg,image/pjpeg,image/gif,image/bmp,image/x-png';
               var mixsize = 1024 * 1024 * 3.5;


               if (file.size && file.size > mixsize) {
                   alert("对不起，您的图片" + bytesToSize(file.size) + "太大请把图片压缩在" + bytesToSize(1024 * 1024 * 3.5) + "内再上传~");
                   // 处理失败会执行
                   viewImg.src = imgSrc;
                   return;

               } else if (type.indexOf(file.type) < 0) {
                   alert('格式不正确');
                   // 处理失败会执行
                   viewImg.src = imgSrc;
                   return;
               } else {
                   var orientation = 1;
                   //获取图像的方位信息
                   EXIF.getData(file, function () {
                       orientation = parseInt(EXIF.getTag(file, "Orientation"));
                       orientation = orientation ? orientation : 1;
                   });
                   var URL = URL || webkitURL;
                   var blob = URL.createObjectURL(file);
                   var img = new Image();
                   img.src = blob;
                   img.onload = function () {

                       var upImgWidth = img.width,
                           upImgHeight = img.height;



                       //压缩换算后的图片高度
                       var afterHeight = afterWidth * upImgHeight / upImgWidth;

                       if (upImgWidth < 10 || upImgWidth < 10) {
                           alert("请不要上传过小的图片");
                           viewImg.src = imgSrc;
                           self.value = "";
                           return false;
                       } else {
                           if (orientation <= 4) {
                               // 设置压缩canvas区域高度及宽度
                               hidCanvas.setAttribute("height", afterHeight);
                               hidCanvas.setAttribute("width", afterWidth);
                               if (orientation == 3 || orientation == 4) {
                                   hidCtx.translate(afterWidth, afterHeight);
                                   hidCtx.rotate(180 * Math.PI / 180);
                               }
                           } else {
                               // 设置压缩canvas区域高度及宽度
                               hidCanvas.setAttribute("width", afterWidth);
                               hidCanvas.setAttribute("height", afterHeight);

                               if (orientation == 5 || orientation == 6) {
                                   hidCtx.translate(afterHeight, 0);
                                   hidCtx.rotate(90 * Math.PI / 180);
                               } else if (orientation == 7 || orientation == 8) {
                                   hidCtx.translate(0, afterWidth);
                                   hidCtx.rotate(270 * Math.PI / 180);
                               }
                           }

                           hidCtx.drawImage(this, 0, 0, afterWidth, afterHeight);

                           var base64 = "";
                           if (navigator.userAgent.match(/iphone/i)) {
                               var mpImg = new MegaPixImage(img);
                               mpImg.render(hidCanvas, { maxWidth: afterWidth, maxHeight: afterHeight, quality: quality || 0.8, orientation: orientation || 1 });
                               base64 = hidCanvas.toDataURL(file.type, quality || 0.8);

                           } else if (navigator.userAgent.match(/Android/i)) {
                               // 修复android
                               var encoder = new JPEGEncoder();
                               base64 = encoder.encode(hidCtx.getImageData(0, 0, afterWidth, afterHeight),
                                   quality * 100 || 80);

                           } else {

                               base64 = hidCanvas.toDataURL(file.type, (quality || 0.8) * 1);
                           }

                           viewImg.src = base64;
                           if (callback != undefined) { callback(base64, itemId) };
                           self.value = "";

                           // 释放内存
                           hidCtx = null;
                           hidCanvas = null;
                           imgSrc = null;

                       }


                   };

               }

           }, false);

       } catch (e) {
           viewImg.src = imgSrc;
           if (callback != undefined) {
               callback("", itemId);
           }
           alert("图片处理异常2:" + JSON.stringify(e) + "," + navigator.userAgent);
       }
    }

    //
    window.compressImg = function (inputId, viewId, afterWidth, callback) { 

        compressor({ inputId: inputId, viewId: viewId, afterWidth: afterWidth, callback: callback });

    }
})();
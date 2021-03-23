/*! 
 * @version 1.0
 * @author 神童
 * 备注：此接口仅在 iOS WKWebview 下提供，用于兼容 iOS WKWebview 不支持 localId 直接显示图片的问题
 * 这是一个基于微信 获取本地图片接口
 *变化：1.2.0以下版本的JSSDK不再支持通过使用chooseImage api返回的localld以如：”img src=wxLocalResource://50114659201332”的方式预览图片。
 *适配建议：直接将JSSDK升级为1.2.0最新版本即可帮助页面自动适配，但在部分场景下可能无效，此时可以使用
 *getLocalImgData 接口来直接获取数据。
  * Date: 2017-06-16
 */ 
(function(){ 
    window.bytesToSize=function (bytes) {
        if (bytes === 0) return '0 B';
        var k = 1024, // or 1024
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }
	window.compressImg = function(inputId,viewId,afterWidth,callback){

		var inputFile = document.getElementById(inputId),
			viewImg = document.getElementById(viewId),
			hidCanvas = document.createElement('canvas');
	 
		var imgSrc = viewImg.src;
      
	    //生成隐藏画布
		if (hidCanvas.getContext) {
		    var hidCtx = hidCanvas.getContext('2d');
		}else{
			alert("对不起，您的浏览器不支持图片压缩及上传功能，请换个浏览器试试~");
		}

	    try { 
	        inputFile.addEventListener("click", function () {
		    hidCanvas = hidCanvas || document.createElement('canvas');
		    imgSrc = imgSrc || viewImg.src;
		    hidCtx = hidCtx ||  hidCanvas.getContext('2d');
	       //加载提示
	        viewImg.src = "data:image/gif;base64,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";
 
	            
	    if (wx) {

	                wx.chooseImage({
	                    count: 1, // 默认9
	                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
	                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                        success: function (res) { 
                            console.log("chooseImage", JSON.stringify(res));
	                        // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片 
                            try {

                                wx.getLocalImgData({
                                    localId: res.localIds[0], // 图片的localID
                                    success: function (result) {
                                        console.log("getLocalImgData", JSON.stringify(result), bytesToSize(result.localData.length));
                                        // localData是图片的base64数据，可以用img标签显示
                                        viewImg.setAttribute("src","data:image/jpeg;base64,"+ result.localData);
                                       
                                        // 此处将得到的图片数据回调
                                        if (callback != undefined) {
                                            callback("data:image/jpeg;base64," +result.localData);
                                        };
                                       
                                    }
                                }); 

	                        } catch (ex) {
                                alert("转图片失败：" + JSON.stringify(ex));
	                        } 

	                    },
	                    fail: function (res) {
	                        viewImg.src = imgSrc;
	                        alert("选择图片失败：" + JSON.stringify(res));
	                    }
	                });

	    } else {
	               viewImg.src = imgSrc;
	                alert("请使用微信打开!");
	            } 
	  
		}, false);

	    } catch (e) {

	        alert(e);
	    }
	}  

 })();
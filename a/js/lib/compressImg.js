/**
      CompressImg({  viewId: 'imgShow2',  afterWidth: 300,  imgSize:10,  callback: function(result) {  console.log(result);  }  });
    */
function CompressImg(opts) {

    if (!opts.viewId) {

        alert("显示图片ID必填!");
        return;
    }

    var inputFile = document.createElement('input');
    inputFile.type = "file";
    inputFile.value = "";
    inputFile.setAttribute('accept', 'image/*');
    inputFile.setAttribute('capture', 'camera');
    //accept="image/*" capture="camera" 
    //转换 后的图片宽度 默认800 px
    var afterWidth = opts.afterWidth || 800,
      imgSize = opts.imgSize || 3,
      callback = opts.callback;
    var viewImg = document.getElementById(opts.viewId);
    var hidCanvas = document.createElement('canvas'); 
    var imgSrc = viewImg.src;
      
    //生成隐藏画布
    if (hidCanvas.getContext) {
        var hidCtx = hidCanvas.getContext('2d');
    }else{
        alert("对不起，您的浏览器不支持图片压缩及上传功能，请换个浏览器试试~");
    }

    try {

        inputFile.addEventListener("change", function () {
            hidCanvas = hidCanvas || document.createElement('canvas');
            imgSrc = imgSrc || viewImg.src;
            hidCtx = hidCtx ||  hidCanvas.getContext('2d');
            //加载提示
            viewImg.src = "data:image/gif;base64,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";

            //通过 this.files 取到 FileList ，这里只有一个
            var self = this,
             p = new Image(),
             reader = new FileReader();
            reader.onload = function( evt ){
                var srcString = evt.target.result;

                if (srcString) {
                        
                    if (srcString.length > 1024 * imgSize*1000) {
                        inputFile = null;
                        viewImg.src = imgSrc;
                        alert("对不起，您的图片太大请压缩图片再上传~");

                        return;
                    }
                } 

                //安卓获取的base64数据无信息头，加之
                if(srcString.substring(5,10)!="image"){
                    p.src = srcString.replace(/(.{5})/,"$1image/jpeg;");
                }else{
                    p.src = srcString;
                }

                p.onload = function(){

                    var upImgWidth = p.width,
                        upImgHeight = p.height; 
                    //压缩换算后的图片高度
                    var afterHeight = afterWidth*upImgHeight/upImgWidth;
                    if(upImgWidth<10||upImgWidth<10){
                        alert("请不要上传过小的图片");
                        viewImg.src = imgSrc;
                        self.value = "";
                        return false;
                    } else {


                        // 设置压缩canvas区域高度及宽度
                        hidCanvas.height = afterHeight;
                        hidCanvas.width = afterWidth;
                        hidCtx.drawImage(p, 0, 0,afterWidth, afterHeight);

                        // 获取压缩后生成的img对象 
                        viewImg.src = hidCanvas.toDataURL("image/jpeg");
                       
                        self.value = "";
	               

                        // 释放内存
                        hidCtx = null;
                        hidCanvas = null;
                        imgSrc = null;

                        // 此处将得到的图片数据回调
                        if (callback != undefined) { callback(viewImg.src) };

                        inputFile = null;
                    }
                }
            }
            reader.readAsDataURL(this.files[0]);
        }, false);

    } catch (e) {

        alert(e);
    }
    $(inputFile).click();
    //inputFile
}
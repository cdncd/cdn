(function(){
        window.H5lock = function(obj){
            this.height = obj.height;
            this.width = obj.width;
            this.chooseType = Number(window.localStorage.getItem('chooseType')) || obj.chooseType;
        };


        H5lock.prototype.drawCle = function(x, y) { // 初始化解锁密码面板
            this.ctx.strokeStyle = '#CFE6FF';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.r, 0, Math.PI * 2, true);
            this.ctx.closePath();
            this.ctx.stroke();
        }
        H5lock.prototype.drawPoint = function() { // 初始化圆心
            for (var i = 0 ; i < this.lastPoint.length ; i++) {
                this.ctx.fillStyle = '#CFE6FF';
                this.ctx.beginPath();
                this.ctx.arc(this.lastPoint[i].x, this.lastPoint[i].y, this.r / 2, 0, Math.PI * 2, true);
                this.ctx.closePath();
                this.ctx.fill();
            }
        }
        H5lock.prototype.drawStatusPoint = function(type) { // 初始化状态线条
            for (var i = 0 ; i < this.lastPoint.length ; i++) {
                this.ctx.strokeStyle = type;
                this.ctx.beginPath();
                this.ctx.arc(this.lastPoint[i].x, this.lastPoint[i].y, this.r, 0, Math.PI * 2, true);
                this.ctx.closePath();
                this.ctx.stroke();
            }
        }
        H5lock.prototype.drawLine = function(po, lastPoint) {// 解锁轨迹
            this.ctx.beginPath();
            this.ctx.lineWidth = 3;
            this.ctx.moveTo(this.lastPoint[0].x, this.lastPoint[0].y);
            console.log(this.lastPoint.length);
            for (var i = 1 ; i < this.lastPoint.length ; i++) {
                this.ctx.lineTo(this.lastPoint[i].x, this.lastPoint[i].y);
            }
            this.ctx.lineTo(po.x, po.y);
            this.ctx.stroke();
            this.ctx.closePath();

        }
        H5lock.prototype.createCircle = function() {// 创建解锁点的坐标，根据canvas的大小来平均分配半径

            var n = this.chooseType;
            var count = 0;
            this.r = this.ctx.canvas.width / (2 + 4 * n);// 公式计算
            this.lastPoint = [];
            this.arr = [];
            this.restPoint = [];
            var r = this.r;
            for (var i = 0 ; i < n ; i++) {
                for (var j = 0 ; j < n ; j++) {
                    count++;
                    var obj = {
                        x: j * 4 * r + 3 * r,
                        y: i * 4 * r + 3 * r,
                        index: count
                    };
                    this.arr.push(obj);
                    this.restPoint.push(obj);
                }
            }
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            for (var i = 0 ; i < this.arr.length ; i++) {
                this.drawCle(this.arr[i].x, this.arr[i].y);
            }
            //return arr;
        }
        H5lock.prototype.getPosition = function(e) {// 获取touch点相对于canvas的坐标
            var rect = e.currentTarget.getBoundingClientRect();
            var po = {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
              };
            return po;
        }
        H5lock.prototype.update = function(po) {// 核心变换方法在touchmove时候调用
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

            for (var i = 0 ; i < this.arr.length ; i++) { // 每帧先把面板画出来
                this.drawCle(this.arr[i].x, this.arr[i].y);
            }

            this.drawPoint(this.lastPoint);// 每帧花轨迹
            this.drawLine(po , this.lastPoint);// 每帧画圆心

            for (var i = 0 ; i < this.restPoint.length ; i++) {
                if (Math.abs(po.x - this.restPoint[i].x) < this.r && Math.abs(po.y - this.restPoint[i].y) < this.r) {
                    this.drawPoint(this.restPoint[i].x, this.restPoint[i].y);
                    this.lastPoint.push(this.restPoint[i]);
                    this.restPoint.splice(i, 1);
                    break;
                }
            }

        }
        H5lock.prototype.checkPass = function(psw1, psw2) {// 检测密码
            var p1 = '',
            p2 = '';
            for (var i = 0 ; i < psw1.length ; i++) {
                p1 += psw1[i].index + psw1[i].index;
            }
            for (var i = 0 ; i < psw2.length ; i++) {
                p2 += psw2[i].index + psw2[i].index;
            }
            return p1 === p2;
        }
        H5lock.prototype.storePass = function (psw) {// touchend结束之后对密码和状态的处理
             var self = this;
            if (this.pswObj.step == 1) {
                if (this.checkPass(this.pswObj.fpassword, psw)) {
                    this.pswObj.step = 2;
                    this.pswObj.spassword = psw;
                    document.getElementById('h5lockTitle').innerHTML = '密码保存成功';
                    this.drawStatusPoint('#2CFF26');
                    window.localStorage.setItem('passwordxx', JSON.stringify(this.pswObj.spassword));
                    window.localStorage.setItem('chooseType', this.chooseType);
                } else {
                    document.getElementById('h5lockTitle').innerHTML = '两次不一致，重新输入';
                    this.drawStatusPoint('red');
                    delete this.pswObj.step;
                }
            } else if (this.pswObj.step == 2) {
                if (this.checkPass(this.pswObj.spassword, psw)) {
                    document.getElementById('h5lockTitle').innerHTML = '解锁成功';
                    this.drawStatusPoint('#2CFF26');
                    
                    $("#h5lockcontainer").hide();
                   // $('html').height($(window).height());
                  //  $('html').css('overflow', 'auto');
                    
                    $('#index_section').height($(window).height());
                    $('#index_section').css('overflow', 'auto');

                    //this.style.display = 'none';
                } else {
                    this.drawStatusPoint('red');
                    document.getElementById('h5lockTitle').innerHTML = '解锁失败';
                }
            } else {
                this.pswObj.step = 1;
                this.pswObj.fpassword = psw;
                document.getElementById('h5lockTitle').innerHTML = '再次输入';
            }

        }
        H5lock.prototype.makeState = function() {
            if (this.pswObj.step == 2) {
              //  $("#updatePassword").show();
                document.getElementById('updatePassword').style.display = 'block';
                //document.getElementById('chooseType').style.display = 'none';
               // $("#h5lockTitle").text('请解锁');
                document.getElementById('h5lockTitle').innerHTML = '请解锁';
            } else if (this.pswObj.step == 1) {
                //$("#updatePassword").hide();
               // document.getElementById('chooseType').style.display = 'none';
               document.getElementById('updatePassword').style.display = 'none';
            } else {
               // $("#updatePassword").hide();
                document.getElementById('updatePassword').style.display = 'none';
                //document.getElementById('chooseType').style.display = 'block';
            }
        }
        H5lock.prototype.setChooseType = function(type){
            chooseType = type;
            init();
        }
        H5lock.prototype.updatePassword = function () {
            var self = this;
            // prompt dialog
            alertify.prompt("请输入密码验证", function (e, str) {
                // str is the input text
                if (e) {
                    try { 
                        TipLoad.loading("",60*1000);
                        $.ajax({
                            type: "POST",
                            url: '/ServiceAPI/usercenter/Manager.aspx',
                            data: { action: 'checkresetpassword', password: str },
                            dataType: "json",
                            success: function (data) {
                                TipLoad.close();
                                if (data.id == 1) {
                                    window.localStorage.removeItem('passwordxx');
                                    window.localStorage.removeItem('chooseType');
                                    self.pswObj = {};
                                    document.getElementById('h5lockTitle').innerHTML = '请设置新解锁图案';
                                    self.reset();
                                   
                                }
                                if (data.id == 2) {
                                    alertify.alert(data.messages, function () {
                                        location.href = location.href;
                                    });
                                } else {
                                    // 不成功 
                                    alertify.error(data.messages);
                                }
                            },
                            error: function (data) {
                                TipLoad.close();
                                // 不成功 
                                alertify.error('设置新解锁图案异常');
                            }
                        });
                    } catch (e) {
                        TipLoad.close();
                    }
                  

                } else {
                    // user clicked "cancel"
                }
            }, "");

          
        }
        H5lock.prototype.initDom = function () {
            var width = window.screen.width;
            var height = window.screen.height;
             
            var str = '<h3 id="h5lockTitle" style="">请设置解锁图案 </h3>' +
                    '<a href="javascript:history.goback(\'/a/Manager/\')" id="re" style="position: absolute;left: 5px;top: 10px;color:#fff;font-size: 18px;"><i class="icon previous"></i>返回</a>' +
                    '<a id="updatePassword" style="position: absolute;right: 5px;top: 5px;color:#fff;font-size: 12px;display:none;">重置密码</a>' +
                    '<canvas id="canvas" width="320" height="320" style="width:320px;height:320px;background-color: #305066;display: inline-block;margin-top: 20px;position: absolute; left:50%;margin-left:-160px;"></canvas> ';

            //如果有ID
            if ($("#h5lockcontainer").html()) { 
                $("#h5lockcontainer").html(str);
                $("#h5lockcontainer").show();
            } else {
                var wrap = document.createElement('div');
                //  wrap.setAttribute('style', 'position: fixed;top:0;left:0;right:0;bottom:0;background-color: #305066;z-index:1000;width:' + width + "px;height:" + height + "px");
                wrap.setAttribute('style', 'position: fixed;top:0;left:0;right:0;bottom:0;background-color: #305066;z-index:1000;width:100%;height:100%');
                wrap.setAttribute('id', 'h5lockcontainer');
                wrap.innerHTML = str;
                document.body.appendChild(wrap);
            } 
            
          
            


        }
        H5lock.prototype.init = function() {
            this.initDom();
            this.pswObj = window.localStorage.getItem('passwordxx') ? {
                step: 2,
                spassword: JSON.parse(window.localStorage.getItem('passwordxx'))
            } : {};
            this.lastPoint = [];
            this.makeState();
            this.touchFlag = false;
            this.canvas = document.getElementById('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.createCircle();
           this.bindEvent();
        }
        H5lock.prototype.reset = function() 
        {

            this.makeState();
            this.createCircle();
        }
        H5lock.prototype.bindEvent = function() {
            var self = this;
            this.canvas.addEventListener("touchstart", function (e) {
                e.preventDefault();// 某些android 的 touchmove不宜触发 所以增加此行代码
                 var po = self.getPosition(e);
                 console.log(po);
                 for (var i = 0 ; i < self.arr.length ; i++) {
                    if (Math.abs(po.x - self.arr[i].x) < self.r && Math.abs(po.y - self.arr[i].y) < self.r) {

                        self.touchFlag = true;
                        self.drawPoint(self.arr[i].x,self.arr[i].y);
                        self.lastPoint.push(self.arr[i]);
                        self.restPoint.splice(i,1);
                        break;
                    }
                 }
             }, false);
             this.canvas.addEventListener("touchmove", function (e) {
                if (self.touchFlag) {
                    self.update(self.getPosition(e));
                }
             }, false);
             this.canvas.addEventListener("touchend", function (e) {
                 if (self.touchFlag) {
                     self.touchFlag = false;
                     self.storePass(self.lastPoint);
                     setTimeout(function(){

                        self.reset();
                    }, 300);
                 }


             }, false);
             document.addEventListener('touchmove', function(e){
               // e.preventDefault();
             },false);
             document.getElementById('updatePassword').addEventListener('click', function(){
                 self.updatePassword();
              });
        }

       
})();

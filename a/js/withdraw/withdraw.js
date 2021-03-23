//正则
// var regexp = {
//     isChinese: (str) => (/^[\u2E80-\u9FFF]{2,4}$/g.test(str)),         //中文名
//     email: (str) => (/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/g.test(str)),
//     phone: (str) => (/^[1][0-9]{10}$/g.test(str)),
//     callPhone: (str) => (/^(\d{3,4}-)?\d{7,8}$/.test(str)),
//     bankNumber: (str) => (/^([1-9]{1})(\d{15}|\d{18})$/.test(str.replace(/\s+/g, ""))),    //银行卡
//     idCard: (str) => (/^(\d{15}$)|(^\d{17}([0-9]|X))$/.test(str)),         //身份证
//     number:(str)=>(/^\d+*$/g.test(str)),                               //纯数字
//     str:(str)=>(/^[A-Za-z\u4e00-\u9fa5]{0,}$/.test(str)),              //纯英文
//     isPasswd:(str)=>(/^(w){6,20}$/.test(str)),                         //密码
//     isRegisterUserName:(str)=>(/^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/.test(str)),         //登录名，已字母开头
//     isPostalCode:(str)=>(/^[1-9][0-9]{5}$/.test(str)),                 //邮政编码
//     feifazifu:(str)=>(/[@#\$%\^&\*]+/g.test(str)),                    //非法字符
// }

var regexp = {
    phone: function(str){return /^[1][0-9]{10}$/g.test(str.replace(/\s+/g, ""));},
    chinaName: function(str){return /^[\u2E80-\u9FFF]{2,4}$/g.test(str.replace(/\s+/g, ""))},
    idCard: function(str){return /^(\d{15}$)|(^\d{17}([0-9]|X))$/.test(str.replace(/\s+/g, ""))},
    bankCard: function(str){return /^([1-9]{1})(\d{15}|\d{18})$/.test(str.replace(/\s+/g, ""))},
    password: function(str){return /^(?:(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])).{6,20}$/.test(str.replace(/\s+/g, ""))},
    wechat: function(str){return /^[a-zA-Z]{1}[\-_a-zA-Z0-9]{5,19}$/.test(str.replace(/\s+/g, ""))}
}

//获取url参数
// window.getQueryString = function(name){
// 	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
// 		var r = window.location.search.substr(1).match(reg);
// 	if (r != null) {
// 		return unescape(r[2]);
// 	}
// 	return null;
// }
function getQueryString(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
}

function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}


function request(option){
    // option = {
    //     url: '/ServiceAPI/usercenter/Manager.aspx?action=',
    //     action: '',
    //     data: {},
    //     method: 'GET',
    //     onsuccess: function(){},
    //     onfail: function(){},
    // }
    var loading = mtui.loading.open("加载中...", { className: "custom-classname" });
    $.ajax({
        url: '/ServiceAPI/usercenter/Manager.aspx?action='+option.action,
        method: option.method || 'GET',
        data: option.data || {},
        dataType: 'json',
        success: function(data){
            mtui.loading.close();
            if(option.onsuccess) option.onsuccess(data)
        },
        error: function(err){
            mtui.loading.close();
            mtui.Toast("网络丢失，请稍后重试")
            if(option.onfail) option.onfail(err)
        }
    })
}

// function inputMaxLength(that,len){
//     if(that.value.length>len) that.value=that.value.slice(0,len)
// }

// function inputNumber(ev,codeLength,maxLength,onadd,onreduce){
//     if(ev.keyCode != 8){
//         if(codeLength < maxLength){
//             if(ev.keyCode > 47 && ev.keyCode < 58 || ev.keyCode > 95 && ev.keyCode < 106){
//                 onadd();
//             }else{
//                 ev.preventDefault();
//             }
//         }else{
//             ev.preventDefault();
//         }
//     }else{
//         onreduce();
//     }
// }

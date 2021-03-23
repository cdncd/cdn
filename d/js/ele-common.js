if(!Vue || !Element || !$) console.error("common.js 是基于Vue,ElementUI,jq的!")
else{
    Date.prototype.format = function(fmt) { 
        var o = { 
           "M+" : this.getMonth()+1,                 //月份 
           "d+" : this.getDate(),                    //日 
           "h+" : this.getHours(),                   //小时 
           "m+" : this.getMinutes(),                 //分 
           "s+" : this.getSeconds(),                 //秒 
           "q+" : Math.floor((this.getMonth()+3)/3), //季度 
           "S"  : this.getMilliseconds()             //毫秒 
       }; 
       if(/(y+)/.test(fmt)) {
               fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
       }
        for(var k in o) {
           if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt; 
    }

    Vue.prototype.toast = function(text,type){
        Vue.prototype.$message({
            message: text,
            center: true,
            type: type,
            showClose: true,
            duration: 1500,
        });
    }

    Vue.prototype.cloneObj = function(obj){
        var newObj = (obj.constructor === Array) ? [] : {};
        for(var k in obj){
            if(obj[k] === null || (typeof obj[k] != "object")){
                newObj[k] = obj[k];
            }else{
                newObj[k] = Vue.prototype.cloneObj(obj[k]);
            }
        }
        return newObj;
    }

    Vue.prototype.MT = {};
    Vue.prototype.MT.request = function(option){
        // option = {
        //     url: '',
        //     action: '',
        //     async: true,
        //     method: 'POST',
        //     loadingText: '加载中...',
        //     loadingLock: true,
        //     data: {},
        //     onsuccess: function(){},
        //     onfail: function(){}
        // }
        this.loading = Vue.prototype.$loading({
            lock: option.loadingLock == undefined ? true : false,
            text: option.loadingText || '加载中...',
        });
        that = this;
        $.ajax({
            url: option.url || window.baseUrl + (option.action || ''),
            dataType: 'json',
            async: option.async || true,
            method: option.method || 'POST',
            data: option.data || {},
            success: function(data){
                console.log("请求data",data)
                that.loading.close();
                if(option.onsuccess) option.onsuccess(data);
            },
            error: function(err){
                console.log("请求err",err)
                that.loading.close();
                Vue.prototype.$message({
                    message: '网络丢失，请稍后重试',
                    center: true,
                    type: 'error',
                    showClose: true,
                    duration: 1500,
                });
                if(option.onfail) option.onfail(err);
            }
        })
    }
}
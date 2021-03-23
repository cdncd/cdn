$(document).ready(function () {
    refreshMiniCart();

});

function refreshMiniCart() {
    var rand = genRandNumber(0, 10000); 

    try {

        $.ajax({
            type: 'POST',
            url: '/ServiceAPI/usercenter/Cart.aspx',
            data: { action: 'getwapminicart', rand: rand },
            dataType: 'json',
            timeout: 30000,
            success: function (data) {

                if (data.id == 1) {
                    $('#shopingCart').html(data.messages);
                } 
            } 
        });

    } catch (e) {

        
    }

}
 

function genRandNumber(startNum, endNum) {
    var randomNumber;
    randomNumber = Math.round(Math.random() * (endNum - startNum)) + startNum; 
    return randomNumber;
}


function addCart() {
    var rand = genRandNumber(0, 10000);
    var id, num;
    num = $("#num").val();
    id = $("#id").val();
    
    
    if (num < 1) {
        alertify.alert('请输入礼品数量！');
        return;

    }

    try {

        $.ajax({
            type: 'POST',
            url: '/ServiceAPI/usercenter/Cart.aspx',
            data: { action: 'addcart', rand: rand, num: num, id: id },
            dataType: 'json',
            timeout: 30000,
            success: function (data) {

                if (data.id == 1) {
                    refreshMiniCart();
                } else if (data.id == 2) {

                    alertify.alert(data.messages, function () {
                        location.href = "login.aspx";
                    });

                } else {
                     
                    alertify.alert(data.messages);
                }
            }
        });

    } catch (e) {


    }
     

}

function addProduct(pid) {
    var pnum = $("#pnum").val();
    $("#id").val(pid);
    if (pnum > 1) {
        $("#num").val(pnum);
    }

    addCart();
}




function updatecart(id) {
    var rand = genRandNumber(0, 10000);
    var num = $("#ProductNumber_" + id).val();


    try {

        $.ajax({
            type: 'POST',
            url: '/ServiceAPI/usercenter/Cart.aspx',
            data: { action: 'updatecart', rand: rand, num: num, id: id },
            dataType: 'json',
            timeout: 30000,
            success: function (data) {

                if (data.id == 1) {
                    ListCart();
                }  else {
                    ListCart();
                    alertify.alert(data.messages);
                }
            }
        });

    } catch (e) {


    } 
 
}


function DeleteCart(id, titleName) {
    var rand = genRandNumber(0, 10000);

    alertify.confirm('请确认要删除礼品 ' + titleName + '!', function (e) {
        if (e) {
           
            try {
                //主录入,成功返回空值
                $.ajax({
                    type: 'POST',
                    url: '/ServiceAPI/usercenter/Cart.aspx',
                    data: { action: 'delcart', id: id, rand: rand },
                    dataType: 'json',
                    timeout: 30000,
                    success: function (data) {
                        
                        if (data.id == 1) {
                            ListCart();
                            alertify.alert(data.messages);

                        }  else {
                            ListCart();
                            alertify.alert(data.messages);
                        }

                    },
                    error: function (xhr, type) {
                     
                        alertify.error('超时,或服务错误');
                    }
                });

            } catch (e) {
                
                alert(e);
            }


        } else {
            //不选择..
        }

    }); 



}


function ListCart() {
    var rand = genRandNumber(0, 10000);
    refreshMiniCart();

    try {

        $.ajax({
            type: 'POST',
            url: '/a/mall/AjaxCart.aspx',
            data: { action: 'listcart', rand: rand },
            dataType: 'html',
            timeout: 30000,
            success: function (html) { 
                $("#cartlist").html(html);
            }
        });

    } catch (e) {


    }

 

}

//兑换积分提示
function ExchangeGiftTip(gif_id, tip) { 

    alertify.confirm(tip, function (e) {
        if (e) { 
                //兑换
                ExchangeGift(gif_id); 

        } else {
            //不选择..
        }

    });


}
//兑换积分方法
function ExchangeGift(gif_id) {
 
        var rand = genRandNumber(0, 10000); 
        try {
            //主录入,成功返回空值
            $.ajax({
                type: 'POST',
                url: 'AjaxExchangeGift.aspx',
                data: { action: 'exchangegift', idgifId: gif_id, rand: rand },
                dataType: 'json',
                timeout: 30000,
                success: function (data) {

                    if (data.id == 1) {
                       
                        alertify.alert(data.messages);

                    } else if (data.id == 2) {

                        alertify.alert(data.messages, function () {
                            window.location.href = "/a/mall/login.aspx";
                        }); 

                    } else {
                        
                        alertify.alert(data.messages);
                    }

                },
                error: function (xhr, type) {

                    alertify.error('超时,或服务错误');
                }
            });

        } catch (e) {

            alert(e);
        }

        

   
}
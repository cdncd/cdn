var CON_PAYTYPE = {//线下：1, 预存金额：3, 预存货：5, 代理记账：7, 在线支付：11  分期：100
  OFFLINE: 1,
  PRESTORED: 3,
  STOCK: 5,
  BOOKKEEP: 7,
  ONLINE: 11,
  INSTALLMENT: 100
};

// 获取对象
var BusinessPayMap = null; // 统一的在线支付配置
var CustomerPaySceneMap = null; // 按品牌代理级别的配置方式
var CustomerPaySceneType = null; // 配置类型
var SourcesKey = 'H5'; // 支付环境 默认H5
if (!!window.wxx) {
  SourcesKey = 'APP'; // APP
  /*判断是否在微信端*/
} else if (/MicroMessenger/i.test(navigator.userAgent)) {
  SourcesKey = "WECHAT_PUBLIC"; // 微信环境
}



// 初始化
function GlobalDataInit() {
  if (BusinessPayMap !== null) return;
  if (!window.GlobalData || !window.GlobalData.BusinessPay) return;
  CustomerPaySceneType = window.GlobalData.CustomerPaySceneType; // 配置类型  这个值同会导致 window.GlobalData.CustomerPayScene 的数据结构不同
  // 处理在线支付配置
  try {
    var BusinessPay = JSON.parse(window.GlobalData.BusinessPay);
    BusinessPayMap = handleBusinessPayMap(BusinessPay); // 业务对象
  } catch (err) {
    console.error("BusinessPayMap", err)
    alert("在线支付配置出错，请联系管理员")
  }
  // 处理支付方式配置
  try {
    var CustomerPaySscenes = JSON.parse(window.GlobalData.CustomerPayScene);
    if (CustomerPaySceneType === 1) {
      CustomerPaySceneMap = handleCustomerPaySceneMap1(CustomerPaySscenes); // 统一的支付方式
    } else {
      CustomerPaySceneMap = handleCustomerPaySceneMap2(CustomerPaySscenes); // 按品牌按级别的支付方式
    }
  } catch (err) {
    console.error(err)
    alert("支付方式配置，请联系管理员")
  }
}

// 处理在线支付配置对象
function handleBusinessPayMap(BusinessPay) {
  if (!Array.isArray(BusinessPay)) return null;
  var BusinessPayMap = {};
  for (var Business of BusinessPay) {
    BusinessPayMap[Business.Business_ID] = { Sources: {}, BusinessName: Business.BusinessName };
    for (var Source of Business.Sources) {
      BusinessPayMap[Business.Business_ID].Sources[Source.SourceKey] = Source;
    }
  }
  return BusinessPayMap;
}

// 统一的支付方式
function handleCustomerPaySceneMap1(CustomerPaySscenes) {
  if (!Array.isArray(CustomerPaySscenes)) return null;
  var CustomerPaySceneMap = {};
  // 处理下单对象
  for (var CustomerPayScene of CustomerPaySscenes) {
    CustomerPaySceneMap[CustomerPayScene.OrderTarget] = { BusinessPayMap: {} };
    // 处理品牌和对应级别的支付配置
    for (var Business of CustomerPayScene.Businesss) {
      CustomerPaySceneMap[CustomerPayScene.OrderTarget].BusinessPayMap[Business.Business_ID] = Business
    }
  }
  return CustomerPaySceneMap;
}
// 按品牌按级别的支付方式
function handleCustomerPaySceneMap2(CustomerPaySscenes) {
  if (!Array.isArray(CustomerPaySscenes)) return null;
  var CustomerPaySceneMap = {};
  // 处理下单对象
  for (var CustomerPayScene of CustomerPaySscenes) {
    CustomerPaySceneMap[CustomerPayScene.OrderTarget] = { Brands: {} };
    // 处理不同品牌
    for (var Brand of CustomerPayScene.Brands) {
      CustomerPaySceneMap[CustomerPayScene.OrderTarget].Brands[Brand.Brand_ID] = { Brand_ID: Brand.Brand_ID, BrandName: Brand.BrandName, BrandLevels: {} };
      // 处理品牌不同级别
      for (var BrandLevel of Brand.BrandLevels) {
        CustomerPaySceneMap[CustomerPayScene.OrderTarget].Brands[Brand.Brand_ID].BrandLevels[BrandLevel.BrandLevel] = { BrandLevel: BrandLevel.BrandLevel, BrandLevelName: BrandLevel.BrandLevelName, BusinessPayMap: {} }
        // 处理品牌和对应级别的支付配置
        for (var Business of BrandLevel.Businesss) {
          CustomerPaySceneMap[CustomerPayScene.OrderTarget].Brands[Brand.Brand_ID].BrandLevels[BrandLevel.BrandLevel].BusinessPayMap[Business.Business_ID] = Business
        }
      }
    }
  }
  return CustomerPaySceneMap;
}

// 初始化配置
GlobalDataInit();
function getAccountMethodHelper(key, options) {
  var OrderTarget = options.OrderTarget;
  var Business_ID = options.Business_ID;
  var BrandID = options.BrandID;
  var BrandLevel = options.BrandLevel;
  if (!CustomerPaySceneMap) return [];
  // 统一的配置
  if (OrderTarget !== 1) { OrderTarget = 2 }
  try {
    if (CustomerPaySceneType === 1) {
      var list = CustomerPaySceneMap[OrderTarget].BusinessPayMap[Business_ID][key] || [];
      var res = list.filter(function (item) { return item.AccountMethodSate === 1 }); // 只返回可使用的
      return res;
    } else {
      // 按照级别的配置
      var list = CustomerPaySceneMap[OrderTarget].Brands[BrandID].BrandLevels[BrandLevel].BusinessPayMap[Business_ID][key] || [];;
      var res = list.filter(function (item) { return item.AccountMethodSate === 1 }); // 只返回可使用的
      return res;
    }
  } catch (err) {
    console.error("支付方式配置获取失败", err);
    alert("支付方式配置获取失败")
    return [];
  }
}

// 获取订单支付方式
var getAccountMethodList = function (options) {
  return getAccountMethodHelper('AccountMethod', options)
}

// 获取邮费支付方式
var getAccountMethodPostageList = function (options) {
  return getAccountMethodHelper('AccountMethodPostage', options)
}

// 获取在线支付的支付方式
var getOnlinePayList = function (Business_ID, evn = SourcesKey) {
  if (!BusinessPayMap) return [];
  try {
    return BusinessPayMap[Business_ID].Sources[evn].SourcePays
  } catch (err) {
    console.error("获取在线支付的配置方式", err);
    alert("获取在线支付的配置方式失败")
    return [];
  }
}

(function () {
  // 判断是线上环境还是本地环境，页面 url 中不包含一下字符可看作是线上环境
  // 根据当前业务需求而已，虽然不够严谨
  function isReallyPro() {
    if (location.protocol.slice(0, 4) !== "http") return false;
    var localList = ["localhost", "127.0.0.1", "192.168"];
    var hostname = location.hostname;
    var isIP = parseInt(hostname) - parseInt(hostname) === 0;
    return !localList.some(function (item) {
      if (hostname === item) return true;
      if (isIP) {
        return hostname.indexOf(item) !== -1;
      }
      return false;
    });
  }
  // 如果不是真实生产环境则不处理报告
  if (!isReallyPro()) return;
  var user = {},
    tags = {};
  if (window.config) {
    if (window.config.openid) {
      user.openid = window.config.openid;
    }
  }
  if (window.global) {
    if (window.global.openid) {
      user.openid = window.global.openid;
    }
    if (window.global.CurrentUserID) {
      user.id = window.global.CurrentUserID; // 当前 代理ID
    }
    if (window.global.TempleName) {
      tags.TempleName = window.global.TempleName; // 模板名
    }
    if (window.global.BrandName) {
      tags.BrandName = window.global.BrandName; // 品牌名
    }
  }
  // 详情见：https://docs.sentry.io/platforms/javascript/
  Sentry.init({
    dsn: "https://c61b04e1cba14b9bb6cd7bbc26261bf8@gg.hyxmt.cn/3", // 项目的 DSN 可以管理后台获取
    beforeSend: function (event) {
      // 可以向 event.tags 添加字段，相对于 scope.setTag
      if (event.tags) {
        for (var key in tags) {
          event.tags[key] = tags[key];
        }
      }
      // 可以向 event.user 添加字段，相对于 scope.setUser
      if (event.user) {
        for (var key in user) {
          event.user[key] = user[key];
        }
      }
      return event;
    },
  });
})();

/**
 * 引入神策
 */
function initSa(env) {
  (function (para) {
    var p = para.sdk_url,
      n = para.name,
      w = window,
      d = document,
      s = 'script',
      x = null,
      y = null;
    w['sensorsDataAnalytic201505'] = n;
    w[n] = w[n] || function (a) {
      return function () {
        (w[n]._q = w[n]._q || []).push([a, arguments]);
      };
    };
    var ifs = ['track', 'quick', 'register', 'registerPage', 'registerOnce', 'clearAllRegister', 'trackSignup',
      'trackAbtest', 'setProfile', 'setOnceProfile', 'appendProfile', 'incrementProfile', 'deleteProfile',
      'unsetProfile', 'identify', 'login', 'logout', 'trackLink', 'clearAllRegister'
    ];
    for (var i = 0; i < ifs.length; i++) {
      w[n][ifs[i]] = w[n].call(null, ifs[i]);
    }
    if (!w[n]._t) {
      x = d.createElement(s), y = d.getElementsByTagName(s)[0];
      x.async = 1;
      x.src = p;
      y.parentNode.insertBefore(x, y);
      w[n].para = para;
    }
  })({
    sdk_url: 'https://static.sensorsdata.cn/sdk/1.9.13/sensorsdata.min.js',
    name: 'sa',
    server_url: 'http://analysis.1byongche.com:8106/sa?project=' + (env == 'production' ? 'production_user' : 'default'),
    heatmap: {
      //是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
      clickmap: 'default',
      //是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
      scroll_notice_map: 'default'
    }
  });
}



/**
 * ua
 */
(function () {
  var ua = window.navigator.userAgent.toLowerCase();
  window.platform = {
    isiPhone: ua.match(/iphone/i) !== null,
    isAndroid: ua.match(/android/i) !== null
  };
  if (window.platform.isiPhone) {
    document.body.className = 'iphone';
  } else if (window.platform.isAndroid) {
    document.body.className = 'android';
  }
})();

/**
 * 初始化页面
 */
(function () {
  /**
   * ajax请求
   */
  var ajax = (function () {
    var xhr;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else {
      xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
    }
    return function (url, options) {
      if (typeof url === 'object') {
        options = url;
        url = options.url;
      }

      options = options || {};
      options.loading && window.loading.show();

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          options.loading && window.loading.hide();
          if (xhr.status == 200) {
            options.success && options.success(JSON.parse(xhr.responseText));
          } else {
            options.error(null, xhr.status);
          }
          options.complete && options.complete();
        }
      };
      var params = '';
      if (options.data && typeof options.data == 'object') {
        var arr = [];
        Object.keys(options.data).forEach(function (item) {
          arr.push(item + '=' + options.data[item]);
        });
        params = arr.join('&');
      }
      if (options.method.toLowerCase() == 'get') {
        url = url + '?' + params;
      }
      xhr.open(options.method || 'post', url, true);
      xhr.setRequestHeader(
        'Content-type',
        'application/x-www-form-urlencoded'
      );
      xhr.send(params);
    };
  })();
  /**
   * 设置微信分享信息
   * @param {String} title 分享标题
   * @param {String} desc 分享描述
   */
  function wxjssdk(title, desc) {
    var wx = window.wx;
    window.wxShareData = {
      // 分享标题，根据情况修改
      title: title,
      // 分享描述，根据情况修改
      desc: desc,
      // 分享链接，必须与当前页面对应的公众号JS安全域名一致
      link: location.href,
      // 分享缩略图参考尺寸300*300，根据情况修改
      imgUrl: 'https://h5.1byongche.com/static/img/logo.png'
    };

    ajax({
      url: 'https://h5.1byongche.com/api/weixin/sign?url=' + encodeURIComponent(location.href.split(
        '#')[0]),
      method: 'get',
      success: function (res) {
        wx.config({
          // 可以开启debug模式，页面会alert出错误信息
          debug: false,
          appId: res.appId,
          timestamp: res.timestamp,
          nonceStr: res.noncestr,
          signature: res.signature,
          // 配置所需的API列表
          jsApiList: ['checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage'
          ]
        });
      }
    });

    wx.ready(function () {
      // 分享到朋友圈
      wx.onMenuShareTimeline({
        title: window.wxShareData.title,
        desc: window.wxShareData.desc,
        link: window.wxShareData.link,
        imgUrl: window.wxShareData.imgUrl,
        trigger: function () {
          // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
        },
        success: function () {
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      });
      // 分享给朋友
      wx.onMenuShareAppMessage({
        title: window.wxShareData.title,
        desc: window.wxShareData.desc,
        link: window.wxShareData.link,
        imgUrl: window.wxShareData.imgUrl,
        success: function () {
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      });
    });
  }

  /**
   * 添加loading和toast到dom
   */
  function initElement() {
    var $loading = document.createElement('div');
    $loading.className = 'loading';
    $loading.innerHTML = '<div class="lds-ring">' +
      '<div></div>' +
      '<div></div>' +
      '<div></div>' +
      '<div></div>' +
      '</div>';
    var $toast = document.createElement('div');
    $toast.className = 'toast';
    document.body.appendChild($loading);
    document.body.appendChild($toast);

    var toastOpacityTimer = null;
    var toastDisplayTimer = null;

    window.showToast = function (text) {
      if (toastOpacityTimer) {
        clearTimeout(toastOpacityTimer);
      }
      if (toastDisplayTimer) {
        clearTimeout(toastDisplayTimer);
      }
      $toast.innerText = text;
      $toast.style.display = 'block';
      setTimeout(function () {
        $toast.style.opacity = '1';
      }, 0);
      toastOpacityTimer = setTimeout(function () {
        $toast.style.opacity = '0';
        toastDisplayTimer = setTimeout(function () {
          $toast.style.display = 'none';
        }, 300);
      }, 3000);
    };

    window.loading = {
      show: function () {
        $loading.style.display = 'block';
      },
      hide: function () {
        $loading.style.display = 'none';
      }
    };
  }

  /**
   * 获取URL中的query信息
   */
  function getQuery() {
    var ret = {};
    location.search.replace('?', '').split('&').forEach(function (item) {
      var queryItem = item.split('=');
      ret[queryItem[0]] = queryItem[1];
    });
    return ret;
  }

  // 获取与原生通信的bridge
  var setupWebViewJavascriptBridge = function (callback) {
    if (window.WebViewJavascriptBridge) {
      return callback(window.WebViewJavascriptBridge);
    } else {
      document.addEventListener('WebViewJavascriptBridgeReady', function () {
        callback(window.WebViewJavascriptBridge);
      }, false);
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
      document.documentElement.removeChild(WVJBIframe);
    }, 0);
  };

  function checkTel(tel) {
    var reg = /^((1[1-9][0-9])+\d{8})$/;
    return reg.test(tel);
  }

  window.initPage = function (config) {
    window.env = config.env || (location.href.match('h5.1byongche.com') ? 'production' : 'test');
    if (config.sa || (config.sa === undefined && window.env == 'production')) {
      initSa(window.env);
      window.sa.quick('autoTrack', {
        platForm: 'h5'
      }); //神策系统必须是1.4最新版及以上
    }
    initElement();
    if(window.env == 'production'){
      wxjssdk(config.shareTitle, config.shareDesc);
    }
    window.getQuery = getQuery;
    window.ajax = ajax;
    window.setupWebViewJavascriptBridge = setupWebViewJavascriptBridge;
    window.checkTel = checkTel;
    window.$ = document.querySelector.bind(document);
  };
})(window);
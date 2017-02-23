// AUTHOR:   SongErwei
// ROLE:     全局都需要的，公共js，都发布成一个文件：global.js
// CREATED:  2017-02-18 17:35:56
 
// AUTHOR:   SongErwei
// FILE:     _util.js
// ROLE:     some common basic utilities 
// CREATED:  2015-12-17 10:14:02

function tlog(text) {
  console.log(text);
}

function todo(text) {
  tlog("@@todo: " + text);	
}

function olog(pre, obj) {
  var t = pre + JSON.stringify(obj);
  var max = 500;
  if (t.length < max) {
    tlog(t)
  } else {
    tlog(t.substring(0, max) + ' ... [total: ' + t.length + ']')
  }
}

function assert(expr) {
  assert1(expr, "I'm warning you!!!");
}

function assert1(expr, msg) {
  console.assert(expr, msg);
}

function being(obj) {
  return (obj != undefined)
}

// if it is not empty, can be used for array, string, etc, has  .length
function has(s) {
  return (being(s) && s.length > 0)
}


/* get query string */
function qs(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

/*
 * 我们约定：若有N部分取后面的N-1部分，例：
 * 		www.xxtao.com  取：xxtao.com
 *    www.some.xxtao.com  取：some.xxtao.com
 */
function get_top_domain_name() {
  var host = location.hostname;
  return host.substring(host.indexOf('.') + 1);
}

/* 
 * gulp会把下面的return值替换为如'https://www.xxtao.com:80'的值
 */
function make_api_origin() {
  return 'gulp_make_api_origin';
}

function is_www(){
  var host_name = location.hostname;
  if(host_name.split('.')[0].contains('m')){
    return false;
  }else{
    return true;
  }
}
function is_on_mobile() {
  return !is_www();
}

function as_int(s) {
  return parseInt(s);
}

/* 仅保留整数部分 */
function int_only(num) {
  return Math.floor(num);
}

function all_hanzi(t) {
  // ^表示NOT
  var re = /[^\u4e00-\u9fa5]/;
  return !re.test(t); 
}

// cookie 1-------------

function get_cookies() {
  var pairs = document.cookie.split(";");
  var cookies = {};
  for (var i = 0; i < pairs.length; i++){
    var pair = pairs[i].split("=");
    cookies[pair[0]] = unescape(pair[1]);
  }

  return cookies;
}

function get_cookie(name) {
  return get_cookies()[name];
}

function has_cookie(name) {
  var val = get_cookie(name);
  return (val !== undefined && val.length > 0);
}


// cookie 2-------------
//
// Original JavaScript code by Chirp Internet: www.chirp.com.au
// Please acknowledge use of this code by including this header.

function getCookie(name)
{
  var re = new RegExp(name + "=([^;]+)");
  var value = re.exec(document.cookie);
  return (value != null) ? unescape(value[1]) : null;
}
function setCookie(c_name,value,expiredays)
{
  var exdate=new Date();
  exdate.setDate(exdate.getDate()+expiredays);
  document.cookie=c_name+ "=" +escape(value)+';path=/;'+
    ((expiredays==null) ? "" : "expires="+exdate.toGMTString());

}
function hasCookie(name) {
  var val = getCookie(name);
  return (val !== null); 
}


function is_phone_valid(phone) {
  //var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
  var reg = /^1\d{10}$/; // 放宽手机号的检验，只要以1打头的11位数字即可
  return reg.test(phone);
}

assert(is_phone_valid('13712345678'));
assert(is_phone_valid('10123456789'));
assert(is_phone_valid('10000000000'));
assert(!is_phone_valid('20000000000'));
assert(!is_phone_valid('101234567891'));
assert(!is_phone_valid('010123456789'));
assert(!is_phone_valid('10000000000a'));
assert(!is_phone_valid('+10123456789'));

function safe_func(func) {
  if (func != undefined) {
    return func
  } else {
    return function(x) {}
  }
}

function can_click_now(cla){
  if ($(cla).attr("work") == undefined) {
    $(cla).attr("work","yes");
    tlog("can`t click for 5s")
    setTimeout(function() {
      $(cla).removeAttr("work");
      tlog("can click")
    }, 3000)

    return true;
  } else {
    return false;
  }
}

// 有时，只能用px值。故，需自己将rem转换为px
function rem_to_px(rem) {                                   
  return rem * parseFloat($('html').css('font-size'));
}


// 检查IE版本; 如果非IE，返回false
// http://stackoverflow.com/questions/19999388/check-if-user-is-using-ie-with-jquery
function detectIE() {
  var ua = window.navigator.userAgent;

  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // IE 12 => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}

function isAndroid() {
  var md = new MobileDetect(window.navigator.userAgent);
  tlog(md.os());
  return /android/i.test(md.os());
}


// Javascript File
// AUTHOR:   SongErwei
// FILE:     api.js
// ROLE:     api基础、公用方法和对象 
// CREATED:  2016-01-24 11:04:50

var api = {
  url: (function() {
    var url = make_api_origin() + "/index.php";
    tlog(url);
    return url;
  })()
}; 

function api_ajax(query, cb, config) {
  _api_ajax('get', api.url, query.r, query, cb, {}, config);
}

function api_ajax_temp(query, cb) {
  _api_ajax_temp('get', api.url, query.r, query, cb);
}

function api_ajax_post(r, data, cb, config) {
  var url = api.url + '?r=' + r;
  _api_ajax('post', url, r, data, cb, {}, config);
}

function api_ajax_post_form_data(r, form_data, cb) {
  var url = api.url + '?r=' + r;
  var ext = {
    processData: false,
    contentType: false
  };
  _api_ajax('post', url, r, form_data, cb, ext);
}

// 第三方的jquery插件（比如上传图片），不能直接用$.ajax时，会用此方法。以给前端同学一个统一的回调方式
function api_std_succ_callback(cb, json, date) {
  cb && cb.always && cb.always(json, date);
  if ("1" == json.succ) {
    cb && cb.succ && cb.succ(json, date);
  } else {
    cb && cb.fail && cb.fail(json, date);
  }
}

//
// cb: callback
//
//param: r, for log only
function _api_ajax(method, url, r, data, cb, ext, config) {
  //	var loading = true;
  //	if (config && !config.loading) {
  //		loading = false;
  //	}

  olog("[>" + method + "](" + r + "): ", data);
  $.ajax(url, $.extend({
    method: method,
    data: data,
    dataType: "json",
    timeout: 30000,
    xhrFields: {
      withCredentials: true
    },
    success: function(json, status, xhr) {
      olog("[<resp](" + r + "): ", json);
      api_std_succ_callback(cb, json, json.now);
    },

    error: function(xhr, status, thrown) {
      // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
      if (status == "timeout") {
        tlog(r + ' 请求超时!');
      }
      var code = as_int(xhr.status);
      tlog("[!err!](" + r + "): status: " + code + ", msg: " + thrown);
      cb && cb.always && cb.always();

      var errorCallback = cb.error || cb.fail;
      errorCallback && errorCallback({msg:"连接失败"}) ;
    }
  }, ext || {}));
}

/*
 * assert query中必须含有某key（用于警告程序员时调用此方法，不用于检查用户输入）
 */ 
function api_assert_has_key(data, key) {
  assert1(data[key] != undefined, "You must post key: " + key);
}
function api_assert_has_keys(data, keys) {
  keys.forEach(function(key, i) {
    assert1(data[key] != undefined, "You must post key: " + key);
  })
}

// api pattern: 
/*
function api_xxx(x, y, cb) {
  var q = {
    r: "some/xxx",
    'x': x,
    'y': y,
  };

  api_ajax(q, cb);
}

function use_xxx() {
  api_xxx('some', 'some', {
    succ: function(json) {
    //do succ
    },

    // optional
    fail: function(json) {
    // do fail
    },
  });
}

*/



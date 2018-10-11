let SIGN_REGEXP = /([yMdhsm])(\1*)/g;
let DEFAULT_PATTERN = 'yyyy-MM-dd';
function padding (s, len) {
  len = len - (s + '').length;
  for (let i = 0; i < len; i++) {
    s = '0' + s;
  }
  return s;
}

const utils = {
  // 获取url中的参数
  getQueryStringByName: function (name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
    let context = '';
    if (r != null) {
      context = r[2]
    }
    reg = null;
    r = null;
    return context == null || context === '' || context === 'undefined' ? '' : context;
  },
  // 格式化日期
  formatDate: {
    format: function (date, pattern) {
      pattern = pattern || DEFAULT_PATTERN;
      return pattern.replace(SIGN_REGEXP, function ($0) {
        switch ($0.charAt(0)) {
        case 'y':
          return padding(date.getFullYear(), $0.length);
        case 'M':
          return padding(date.getMonth() + 1, $0.length);
        case 'd':
          return padding(date.getDate(), $0.length);
        case 'w':
          return date.getDay() + 1;
        case 'h':
          return padding(date.getHours(), $0.length);
        case 'm':
          return padding(date.getMinutes(), $0.length);
        case 's':
          return padding(date.getSeconds(), $0.length);
        }
      });
    },
    parse: function (dateString, pattern) {
      let matchs1 = pattern.match(SIGN_REGEXP);
      let matchs2 = dateString.match(/(\d)+/g);
      if (matchs1.length === matchs2.length) {
        let _date = new Date(1970, 0, 1);
        for (let i = 0; i < matchs1.length; i++) {
          let _int = parseInt(matchs2[i]);
          let sign = matchs1[i];
          switch (sign.charAt(0)) {
          case 'y':
            _date.setFullYear(_int);
            break;
          case 'M':
            _date.setMonth(_int - 1);
            break;
          case 'd':
            _date.setDate(_int);
            break;
          case 'h':
            _date.setHours(_int);
            break;
          case 'm':
            _date.setMinutes(_int);
            break;
          case 's':
            _date.setSeconds(_int);
            break;
          }
        }
        return _date;
      }
      return null;
    }
  },
  // 延迟执行
  debounce (func, wait, immediate) {
    // immediate默认为false
    let timeout, args, context, timestamp, result;
    let later = function () {
      // 当wait指定的时间间隔期间多次调用_.debounce返回的函数，则会不断更新timestamp的值，导致last < wait && last >= 0一直为true，从而不断启动新的计时器延时执行func
      let last = Date.now() - timestamp;
      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };
    return function () {
      context = this;
      args = arguments;
      timestamp = Date.now();
      // 第一次调用该方法时，且immediate为true，则调用func函数
      let callNow = immediate && !timeout;
      // 在wait指定的时间间隔内首次调用该方法，则启动计时器定时调用func函数
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }
      return result;
    };
  },
  // 判断是否是数组
  isArray (o) {
    return Object.prototype.toString.call(o) === '[object Array]'
  },
  // 深度拷贝
  deepCopy: function (o) {
    if (o instanceof Array) {
      let n = [];
      for (let i = 0; i < o.length; ++i) {
        n[i] = utils.deepCopy(o[i]);
      }
      return n;
    } else if (o instanceof Object) {
      let n = {}
      for (let i in o) {
        n[i] = utils.deepCopy(o[i]);
      }
      return n;
    } else {
      return o;
    }
  },
  // 加
  add (a, b) {
    let c, d, e;
    try {
      c = a.toString().split('.')[1].length;
    } catch (f) {
      c = 0;
    }
    try {
      d = b.toString().split('.')[1].length;
    } catch (f) {
      d = 0;
    }
    e = Math.pow(10, Math.max(c, d))
    return (utils.mul(a, e) + utils.mul(b, e)) / e
  },
  // 减
  sub (a, b) {
    let c, d, e;
    try {
      c = a.toString().split('.')[1].length;
    } catch (f) {
      c = 0;
    }
    try {
      d = b.toString().split('.')[1].length;
    } catch (f) {
      d = 0;
    }
    e = Math.pow(10, Math.max(c, d))
    return (utils.mul(a, e) - utils.mul(b, e)) / e
  },
  // 乘
  mul (a, b) {
    let c = 0
    let d = a.toString()
    let e = b.toString()
    try {
      c += d.split('.')[1].length;
    } catch (f) {
    }
    try {
      c += e.split('.')[1].length;
    } catch (f) {
    }
    return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c);
  },
  // 除
  div (a, b) {
    let c, d
    let e = 0
    let f = 0
    try {
      e = a.toString().split('.')[1].length;
    } catch (g) {
    }
    try {
      f = b.toString().split('.')[1].length;
    } catch (g) {
    }
    c = Number(a.toString().replace('.', ''))
    d = Number(b.toString().replace('.', ''))
    return utils.mul(c / d, Math.pow(10, f - e))
  },
  // 获取分页适配器 - 因为element-ui 分页page和现有系统分页headNum 不兼容
  getHeadNumAdapter (page = 1, pageSize = 0, index = 0) {
    return utils.mul(pageSize, page - 1) + index + 1
  },
  // 公用正则表达式
  reg: {
    telPhone: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,   // 固话
    // 手机号
    tel: /^1[34578]\d{9}$/,
    // 邮箱
    email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
    // 密码：大小写字母、数字组成的6-16位字符,不能纯数字或字母
    password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z.]{6,16}$/,
    // IP
    ip: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
  },
  // 验证手机号
  checkTel (rule, value, callback) {
    if (!value) {
      return callback(new Error('电话号码不能为空'))
    }
    if (!(utils.reg.tel.test(value))) {
      callback(new Error('手机号码格式有误'))
      return false
    } else {
      callback()
    }
  },
  // 验证固话
  checkTelPhone (rule, value, callback) {
    if (!value) {
      return callback(new Error('电话号码不能为空'))
    }
    if (!(utils.reg.telPhone.test(value))) {
      callback(new Error('电话号码格式有误'))
      return false;
    } else {
      callback()
    }
  },
  // 验证电话
  checkTelAndTelPhone (rule, value, callback) {
    if (!value) {
      return callback(new Error('电话号码不能为空'))
    }
    if (!(utils.reg.telPhone.test(value) || utils.reg.tel.test(value))) {
      callback(new Error('电话号码格式有误'))
      return false;
    } else {
      callback()
    }
  },
  // 验证email
  checkEmail (rule, value, callback) {
    if (value === '') {
      return callback()
    }
    if (!(utils.reg.email.test(value))) {
      callback(new Error('邮箱格式有误'))
      return false
    } else {
      callback()
    }
  },
  checkPassword (rule, value, callback) {
    if (!value) {
      return callback(new Error('密码不能为空'))
    }
    if (!(utils.reg.password.test(value))) {
      callback(new Error('密码格式是大小写字母、数字组成的6-16位字符,不能纯数字或字母'))
      return false
    } else {
      callback()
    }
  },
  // 验证输入框是否可以为空
  checkNumber (rule, value, callback) {
    if (value === '') {
      return callback()
    }
    if (!(Number.isInteger(value))) {
      callback(new Error('必须是数字'))
      return false;
    } else {
      callback()
    }
  },
  checkIP (rule, value, callback) {
    if (value === '') {
      return callback()
    }
    if (!(utils.reg.ip.test(value))) {
      callback(new Error('IP格式有误'))
      return false;
    } else {
      callback()
    }
  },
  // dataPicker 选择今天之前的时间（包括今天）
  pickerOptionsBefore: {
    shortcuts: [
      {
        text: '今天',
        onClick (picker) {
          picker.$emit('pick', new Date())
        }
      },
      {
        text: '昨天',
        onClick (picker) {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24)
          picker.$emit('pick', date)
        }
      },
      {
        text: '一周前',
        onClick (picker) {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', date)
        }
      },
      {
        text: '一个月前',
        onClick (picker) {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
          picker.$emit('pick', date)
        }
      },
      {
        text: '三个月前',
        onClick (picker) {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 90)
          picker.$emit('pick', date)
        }
      }
    ],
    disabledDate (time) {
      return time.getTime() > Date.now() - 8.64e6
    }
  },
  // 时间选择器（开始和结束时间同时选择）
  pickerOptionsBefore2: {
    shortcuts: [{
      text: '昨天',
      onClick (picker) {
        const end = new Date(new Date().setHours(0, 0, 0, 0))
        const start = new Date(new Date().setHours(0, 0, 0, 0))
        start.setTime(start.getTime() - 86400000);
        end.setTime(end.getTime())
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近一周',
      onClick (picker) {
        const end = new Date(new Date().setHours(0, 0, 0, 0))
        const start = new Date(new Date().setHours(0, 0, 0, 0))
        start.setTime(start.getTime() - 86400000 * 7)
        end.setTime(end.getTime())
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近一个月',
      onClick (picker) {
        const end = new Date(new Date().setHours(0, 0, 0, 0))
        const start = new Date(new Date().setHours(0, 0, 0, 0))
        start.setTime(start.getTime() - 86400000 * 30)
        end.setTime(end.getTime())
        picker.$emit('pick', [start, end])
      }
    }]
  },
  // 根据数组的id, pId生成二叉树，调用示例
  getTree (rootId, list) {
    let arr = []
    for (let i = 0, len = list.length; i < len; i++) {
      if (list[i].pId === rootId) {
        list[i].children = this.getTree(list[i].id, list)
        arr.push(list[i])
      }
    }
    return arr
  },
  // 元素全屏
  requestFullScreen (element) {
    // 判断各种浏览器，找到正确的方法
    let requestMethod = element.requestFullScreen || // W3C
      element.webkitRequestFullScreen ||    // Chrome等
      element.mozRequestFullScreen || // FireFox
      element.msRequestFullScreen // IE11
    if (requestMethod) {
      requestMethod.call(element)
    } else if (typeof window.ActiveXObject !== 'undefined') {  // for Internet Explorer
      let wscript = new window.ActiveXObject('WScript.Shell')
      if (wscript !== null) {
        wscript.SendKeys('{F11}')
      }
    }
  },
  // 退出全屏 判断浏览器种类
  exitFullScreen () {
    // 判断各种浏览器，找到正确的方法
    let exitMethod = document.exitFullscreen || // W3C
      document.mozCancelFullScreen ||    // Chrome等
      document.webkitExitFullscreen || // FireFox
      document.webkitExitFullscreen; // IE11
    if (exitMethod) {
      exitMethod.call(document);
    } else if (typeof window.ActiveXObject !== 'undefined') { // for Internet Explorer
      var wscript = new window.ActiveXObject('WScript.Shell')
      if (wscript !== null) {
        wscript.SendKeys('{F11}')
      }
    }
  },
  // 是不是处于全屏状态
  checkFullScreen () {
    var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled
    // to fix : false || undefined == undefined
    if (isFull === undefined) {
      isFull = false
    }
    return isFull
  },
  // 公用打印
  print (parent) {
    let el = document.getElementById('__print-wrap')
    if (!el) {
      el = document.createElement('div')
    }
    el.id = '__print-wrap'
    el.className = 'printable print-only'
    el.style.width = '100%'
    el.innerHTML = parent.innerHTML
    // 小图标不打印
    el.querySelectorAll('.el-collapse-item__arrow').forEach(item => {
      item.classList.add('print-exclude')
    })
    el.querySelectorAll('.el-collapse-item__wrap').forEach(item => {
      item.style.border = 'none'
    })
    document.body.appendChild(el)
    window.print()
  }
}

export default utils

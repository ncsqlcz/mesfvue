import Vue from 'vue'
import boxVue from './main.vue'

const defaults = {
  title: '',
  paramNames: []
}

const Constructor = Vue.extend(boxVue)

let currentMsg, instance

const defaultCallback = action => {
  if (currentMsg) {
    let callback = currentMsg.callback
    if (typeof callback === 'function') {
      if (instance.selected) {
        callback(instance.list, action)
      } else {
        callback(action)
      }
    }
    if (currentMsg.resolve) {
      if (action === 'selected') {
        if (instance.list) {
          currentMsg.resolve({ rows: instance.list, action })
        } else {
          currentMsg.resolve(action)
        }
      } else if (action === 'cancel' && currentMsg.reject) {
        currentMsg.reject(action)
      }
    }
  }
}

const initInstance = () => {
  instance = new Constructor({
    el: document.createElement('div')
  })

  instance.callback = defaultCallback
}

const AddParams = function (options, callback) {
  if (typeof options === 'string') {
    options = {
      message: options
    }
    if (typeof arguments[1] === 'string') {
      options.title = arguments[1]
    }
  } else if (options.callback && !callback) {
    callback = options.callback
  }

  return new Promise((resolve, reject) => { // eslint-disable-line
    currentMsg = {
      options: Object.assign({}, defaults, AddParams.defaults, options),
      callback: callback,
      resolve: resolve,
      reject: reject
    }
    // 创建单例
    if (!instance || instance.reRender) {
      instance = null
      initInstance()
    }
    // 初始化action为空
    instance.action = ''
    // 隐藏之后显示
    if (!instance.visible) {
      // 合并options
      let options = currentMsg.options
      for (let prop in options) {
        if (options.hasOwnProperty(prop)) {
          instance[prop] = options[prop]
        }
      }
      instance.initList()
      instance.callback(instance.action, instance)
      document.body.appendChild(instance.$el)
      Vue.nextTick(() => {
        instance.visible = true
      })
    }
  })
}

// 设置默认配置
AddParams.setDefaults = defaults => {
  AddParams.defaults = defaults
}

// 显示弹框
AddParams.show = (title, options) => {
  if (typeof title === 'object') {
    options = title
    title = ''
  } else if (title === undefined) {
    title = ''
  }
  return AddParams(Object.assign({
    title: title
  }, options))
}
// 手动关闭弹框
AddParams.close = () => {
  this.action = ''
  this.visible = false
}

export default AddParams
export { AddParams }

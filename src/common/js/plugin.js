export default {
    install: function (Vue, options) {
        let SIGN_REGEXP = /([yMdhsm])(\1*)/g;
        let DEFAULT_PATTERN = 'yyyy-MM-dd';
        function padding (s, len) {
            len = len - (s + '').length;
            for (let i = 0; i < len; i++) {
                s = '0' + s;
            }
            return s;
        }
        // 如果直接引用utils, 会增加打包体积
        let utils = {
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
            }
        }

        // 全局格式化时间
        Vue.prototype.formatDate = function (timestamp, rule = 'yyyy-MM-dd hh:mm:ss') {
            if (timestamp === null || timestamp === '') {
                return ''
            } else {
                return utils.formatDate.format(new Date(timestamp), rule)
            }
        }

        // 计算方差
        let variance = function (numbers) {
            let mean = 0;
            let sum = 0;
            for (let i = 0; i < numbers.length; i++) {
                sum += numbers[i];
            }
            mean = sum / numbers.length;
            sum = 0;
            for(let i = 0; i < numbers.length; i++){
                sum += Math.pow(numbers[i] - mean , 2);
            }
            return sum / numbers.length;
        };
        // 注册全局指令
        Vue.directive('scanCode', {
            bind: function (el, binding, vnode) {
                // console.log(el)
                // 记录按下的时间
                let code = ''
                let lastCode = ''
                let nextCode = ''
                let startTime = ''
                let endTime = ''
                let timeArr = [] // 时间间隔
                let elInput = null
                let timer = setInterval(() => {
                    elInput = el.querySelector('.el-select__input')
                    if (elInput) {
                        clearInterval(timer)
                        bindEvent()
                    }
                }, 100)

                // 绑定事件
                let bindEvent = function () {
                    // 持续输入，记录时间间隔
                    elInput.addEventListener('keydown', function (e) {
                        endTime = new Date().getTime()
                        timeArr.push(endTime - startTime)
                        startTime = endTime
                        // 按回车结束输入
                        if(e.keyCode === 13) {
                            // 去掉第一个数据
                            timeArr.shift()
                            // 去掉最后一个数据
                            timeArr.pop()

                            // 方差小于500 是有效数据
                            // console.log(variance(timeArr))
                            if (variance(timeArr) < 500 && timeArr.length > 4) {
                                // console.log('扫码枪')
                                // 触发扫码枪输入
                                setTimeout(() => {
                                    vnode.componentInstance.$emit('scanChange', vnode.componentInstance.value)
                                })
                            } else {
                                // console.log('非扫码枪')
                                // 非扫码枪输入的数据要清除掉
                                setTimeout(() => {
                                    vnode.componentInstance.value.pop()
                                    // 触发扫码枪输入
                                    vnode.componentInstance.$emit('scanChange', vnode.componentInstance.value)
                                })
                            }
                            
                            
                            timeArr = []
                        }
                    })
                }
            },
            inserted: function (el, binding, vnode) {
                // console.log(getComputedStyle(el).width)
            },
            update: function (el, binding, vnode) {
                // console.log(el)
            },
            componentUpdated: function (el, binding, vnode) {
                // console.log(el)
            },
            unbind: function (el, binding, vnode) {}
        })
    }
}
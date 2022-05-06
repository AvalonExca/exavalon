// 查询字符串转成对象
function parseQueryString(query) {
    var obj = {}
    query.split('&').forEach(function (item) {
        var s = item.split('=')
        obj[s[0]] = s[1]
    })
    return obj
}

// 对象转化成查询字符串
function queryStringify(obj) {
    var str = ''
    for (var k in obj) {
        str += k + '=' + obj[k] + '&'
    }
    return str.slice(0, -1)
}

// 求范围内的随机整数
function rounderNum(min, max) {
    return Math.floor(Math.random() * (Math.abs(max - min) + 1)) + Math.min(min, max)
}

// 随机的颜色字符串

function color() {
    return color = `rgb(${rounderNum(0, 255)},${rounderNum(0, 255)},${rounderNum(0, 255)})`
}

// 获取时间差
function diffTime(time1, time2) {
    var s = Math.ceil(Math.abs(time2 - time1) / 1000)
    return {
        day: parseInt(s / (60 * 60 * 24)),
        hours: parseInt(s % (60 * 60 * 24) / (60 * 60)),
        minutes: parseInt(s % (60 * 60) / 60),
        seconds: s % 60
    }
}

// 运动函数
function move(ele, options, fn) {
    let count = 0
    for (let k in options) {
        count++
        if (k === 'opacity') {
            options[k] = options[k] * 100
        }
        let time = setInterval(function () {
            let start
            if (k === 'opacity') {
                start = window.getComputedStyle(ele)[k] * 100
            } else {
                start = parseInt(window.getComputedStyle(ele)[k])
            }
            let moveStance = (options[k] - start) / 10
            if (moveStance > 0) {
                moveStance = Math.ceil((options[k] - start) / 10)
            } else {
                moveStance = Math.floor((options[k] - start) / 10)
            }
            if (start === options[k]) {
                clearInterval(time)
                count--
                if (count === 0) fn && fn()
            } else {
                if (k === 'opacity') {
                    ele.style[k] = (start + moveStance) / 100
                } else {
                    ele.style[k] = start + moveStance + 'px'
                }
            }
        }, 30)
    }
}
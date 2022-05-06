// 轮播图功能实现

// 获取元素
const imgBox = document.querySelector('.t-img')
const bannerBox = document.querySelector('.grid-col2-t')
const pointBox = document.querySelector('.circle')

// 定义变量 用来表示显示的是第几张图片(理解成索引也可以)
let index = 1

let time = 0

// 定义一个开关
let flag = true


// 复制元素
copyEle()
function copyEle() {
    // 复制第一个节点(元素)
    const first = imgBox.firstElementChild.cloneNode(true)
    // console.log(first);
    // 复制最后一个节点(元素)
    const last = imgBox.lastElementChild.cloneNode(true)

    // 插入到imgBox中
    imgBox.appendChild(first)
    imgBox.insertBefore(last, imgBox.firstElementChild)

    // 修改imgBox盒子的宽度
    imgBox.style.width = imgBox.children.length * 100 + '%'

    // 让1号元素显示不是5号 就是让imgBox往左移动一个banner盒子的宽度
    imgBox.style.left = -1 * bannerBox.clientWidth + 'px'

}

// 设置焦点
setPoint()
function setPoint() {
    // 拿到显示的图片的数量
    let num = imgBox.children.length - 2
    // 根据我们拿到的数量来循环生成对应的焦点
    for (let i = 0; i < num; i++) {
        // 创建节点
        let li = document.createElement('li')

        // 同时添加一个类名
        li.className = 'item'
        // 添加一个自定义属性
        li.dataset.id = i


        // 插入节点
        pointBox.appendChild(li)
        // 添加默认的类名让焦点有特殊的样式
        if (i === 0) li.classList.add('current')
    }
}

// 自动轮播
autoPlay()
function autoPlay() {
    // 设置定时器 让图片每间隔一定的时间切换一张
    time = setInterval(function () {
        // 判断开关是不是开启状态 如果不是就不执行后面的操作
        if (flag === false) return
        // 关闭开关
        flag = false
        index++
        // 动起来
        move(imgBox, { left: -index * bannerBox.clientWidth }, moveEnd)
    }, 2000)
}

// 运动结束
function moveEnd() {
    // 回到第一张
    if (index === imgBox.children.length - 1) {
        // 设置为第一张
        index = 1
        // 运动到第一张
        imgBox.style.left = -index * bannerBox.clientWidth + 'px'
    }
    // 回到最后一张
    if (index === 0) {
        index = imgBox.children.length - 2
        imgBox.style.left = -index * bannerBox.clientWidth + 'px'
    }

    for (let i = 0; i < pointBox.children.length; i++) {
        pointBox.children[i].classList.remove('current')
    }
    pointBox.children[index - 1].classList.add('current')

    // 代码执行到这里 所有的运动都结束
    // 已经到了结束的结束 
    flag = true
}

// 点击切换
clickChange()
function clickChange() {
    // 因为有左右按钮和焦点需要点击 我们利用事件委托来设置
    // 给功能的上级来添加点击事件 bannerBox
    bannerBox.addEventListener('click', e => {
        // console.log(111);
        // 事件对象兼容
        e = e || window.event
        // 获取目标元素
        let target = e.target || e.srcElement
        // 判断是不是我要点击的元素了  左按钮
        if (target.className === 'arrow-l') {
            // 判断开关是不是开启状态 如果不是就不执行后面的操作
            if (flag === false) return

            // 关闭开关
            flag = false
            index--
            move(imgBox, { left: -index * bannerBox.clientWidth }, moveEnd)
            // console.log(111);
        }
        // 判断是不是我要点击的元素了 右按钮
        if (target.className === 'arrow-r') {
            // 判断开关是不是开启状态 如果不是就不执行后面的操作
            if (flag === false) return

            // 关闭开关
            flag = false

            index++
            move(imgBox, { left: -index * bannerBox.clientWidth }, moveEnd)
            // console.log(222);
        }
        // 点击焦点
        if (target.className === 'item') {
            // 判断开关是不是开启状态 如果不是就不执行后面的操作
            if (flag === false) return

            // 关闭开关
            flag = false
            // console.log(333);
            index = target.dataset.id - 0 + 1
            move(imgBox, { left: -index * bannerBox.clientWidth }, moveEnd)
        }
    })
}
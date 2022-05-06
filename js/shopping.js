class shopping {
    constructor() {

        this.checkLogin();

        this.getShopGoods();

        this.bindEve();

    }
    // 绑定事件
    bindEve() {
        // 商品信息内删除按钮
        this.$('.cart-list').addEventListener('click', this.dispenseEve.bind(this))
        // 全选按钮
        this.$('.cart-th input').addEventListener('click', this.clickAllCheched.bind(this))

    }

    // 操作购物车页面门槛  
    async checkLogin() {
        // 获取token判断是否登录
        const TOKEN = localStorage.getItem('token');
        // 判断是否登录过期
        axios.defaults.headers.common['authorization'] = TOKEN;
        let userId = localStorage.getItem('user_id')
        let { data, status } = await axios.get('http://localhost:8888/users/info/' + userId);
        // 如无token值，则未登录
        if (!TOKEN || data.code == 401) {
            location.assign('./login.html?ReturnUrl=./cart.html')
        }
    }

    // 获取购物车数据
    async getShopGoods() {
        const TOKEN = localStorage.getItem('token');
        let userId = localStorage.getItem('user_id')
        // 转换token值属性
        axios.defaults.headers.common['authorization'] = TOKEN;
        let { data, status } = await axios.get('http://localhost:8888/cart/list?id=' + userId);
        // console.log(shop);
        if (status == 200) {
            // console.log(data);

            // 判断现在是否还在有效期
            if (data.code == 401) location.assign('./login.html?ReturnUrl=./cart.html')

            // 判断接口状态
            if (data.code == 1) {
                let html = '';
                data.cart.forEach(goods => {
                    // console.log(goods);
                    html += `<ul class="goods-list yui3-g" data-id="${goods.goods_id}">
                    <li class="yui3-u-3-8 pr">
                        <input type="checkbox" class="good-checkbox">
                        <div class="good-item">
                            <div class="item-img">
                                <img src="${goods.img_small_logo}">
                            </div>
                            <div class="item-msg">${goods.title}</div>
                        </div>
                    </li>
                    <li class="yui3-u-1-108" style="width: 75px;">
                        
                    </li>
                    <li class="yui3-u-1-8">
                        <span class="price">${goods.current_price}</span>
                    </li>
                    <li class="yui3-u-1-8">
                        <div class="clearfix">
                            <a href="javascript:;" class="increment mins">-</a>
                            <input autocomplete="off" type="text" value="${goods.cart_number}" minnum="1" class="itxt">
                            <a href="javascript:;" class="increment plus">+</a>
                        </div>
                        <div class="youhuo">有货<span class="you-num">${goods.goods_number}</span>件</div>
                    </li>
                    <li class="yui3-u-1-8">
                        <span class="sum">${(Math.ceil(goods.current_price * goods.cart_number * 100)) / 100}</span>
                    </li>
                    <li class="yui3-u-1-8">
                        <div class="del1">
                            <a href="javascript:;">删除</a>
                        </div>
                        <div>移到我的关注</div>
                    </li>
                </ul>`
                });
                this.$('.cart-list').innerHTML = html;
            }


            // (Math.ceil(goods.current_price * goods.cart_number * 100)) / 100


        }

    }

    // 将商品操作进行委托
    // 使用分发方法(同一目录下有多个按钮，用以区分)
    dispenseEve({ target }) {
        // console.log(target);
        // 判断是否是删除按钮
        if (target.parentNode.classList.contains('del1')) {

            this.delGoods(target);

            // 获取商品id
            let ulObj = target.parentNode.parentNode.parentNode;
            let id = ulObj.dataset.id;
            // console.log(id);

            // 获取用户id
            let userId = localStorage.getItem('user_id');

            // 发送数据，并删除商品


        }

        // 判断是否是选中按钮
        if (target.classList.contains('good-checkbox')) {
            this.getOneGoodsCheck(target);
            // 统计商品数量与价格的方法
            this.getNPGoods()
        }

    }

    // 删除操作
    delGoods(target) {
        let that = this
        //弹窗询问是否删除 
        let layerIndex = layer.open(
            {
                title: '最后再问您一下',
                content: '您真的要删除吗',
                btn: ['删除', '再想想'],
                yes: function () {
                    // 获取商品id
                    let ulObj = target.parentNode.parentNode.parentNode;
                    let id = ulObj.dataset.id;
                    // console.log(id);

                    // 获取用户id
                    let userId = localStorage.getItem('user_id');
                    axios.get('http://localhost:8888/cart/remove?id=' + userId + '&goodsId=' + id)
                        .then(res => {
                            let { data, status } = res;
                            // console.log(data,status);

                            // 删除成功后关闭弹窗并删除所选商品
                            if (data.code == 1) {
                                // 关闭删除询问弹窗
                                layer.close(
                                    layerIndex
                                );

                                // 弹出删除成功通知
                                layer.open(
                                    {
                                        title: '已删除',
                                        content: '你看,没了',
                                        btn: ['知道了']
                                    })

                                // 删除所选商品
                                ulObj.remove();
                                // 统计商品数量与价格的方法
                                that.getNPGoods()

                            }

                        })

                }

            }
        )
    }

    // 单个商品选中按钮的回调方法
    getOneGoodsCheck(target) {
        // 如果取消，则全选按钮也取消
        if (!target.checked) {
            this.$('.cart-th input').checked = false;
            return;
        }

        // 如果全部选中，则全选按钮也选中
        if (target.checked) {
            // 寻找页面中没有被选中的商品
            let res = Array.from(this.$('.good-checkbox')).find(
                checkbox => {
                    return !checkbox.checked
                }
            );

            //当返回undefined时，单项商品全部已选 
            if (!res) this.$('.cart-th input').checked = true;

        }
    }

    // 获取所选商品的数量和价格
    getNPGoods() {
        let goods = document.querySelectorAll('.goods-list');
        // console.log(goods);
        let totalNum = 0;
        let totalPrice = 0;
        goods.forEach(one => {
            // console.log(one);
            // 计算已选中商品的数量与价格
            if (one.firstElementChild.firstElementChild.checked) {
                console.log(one);
                // 数量
                totalNum = one.querySelector('.itxt').value - 0 + totalNum;
                totalPrice = one.querySelector('.sum').innerHTML - 0 + totalPrice;

            }
        })
        // console.log(totalNum);
        // console.log(totalPrice);

        // 将的得到的数量与价格加到总计上
        this.$('.sumprice-top strong').innerHTML = totalNum;
        this.$('.sumprice-top .summoney span').innerHTML = totalPrice;

    }

    // 实现全选
    clickAllCheched(eve) {
        // console.log(eve.target);
        // 全选按钮状态获取
        let checked = eve.target.checked;
        this.oneGoodsCheck(checked)

        // 商品数量价格统计
        this.getNPGoods()
    }

    // 设置单个商品状态
    oneGoodsCheck(checkStatus) {
        let goodsList = this.$('.goods-list')
        goodsList.forEach(
            ul => {
                // console.log(ul);
                // 找到单个商品的选中按钮,并赋给其当前全选按钮状态
                ul.firstElementChild.firstElementChild.checked = checkStatus;
            }
        )
    }

    $(tag) {
        let res = document.querySelectorAll(tag)
        return res.length == 1 ? res[0] : res;
    }
}
new shopping();
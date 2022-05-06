class List {
    constructor() {
        // 给属性赋值，并调用方法
        this.getData();
        // 使用事件委托加入购物车
        this.$('.sk_bd ul').addEventListener('click', this.addCartFn.bind(this))
    }

    // 获取数据
    async getData() {

        let { data, status } = await axios.get('http://localhost:8888/goods/list?current=1')
        // console.log( data, status );

        // 判断返回值数据，追加数据
        if (status == 200) {
            let html = '';
            data.list.forEach(goods => {
                // console.log(goods);
                html += `<li class="sk_goods" data-id="${goods.goods_id}">
                <a href="detail.html"><img src="${goods.img_big_logo}" alt=""></a>
                <h5 class="sk_goods_title">${goods.title}</h5>
                <p class="sk_goods_price"><em>${goods.current_price}</em> <del>${goods.price}</del></p>
                <div class="sk_goods_progress">
                    已售<i>${goods.sale_type}</i>
                    <div class="bar">
                        <div class="bar_in"></div>
                    </div>
                    剩余<em>${goods.goods_number}</em>件
                </div>
                <a href="#none" class="sk_goods_buy">立即抢购</a>
            </li>`;

            });
            this.$('.sk_bd ul').innerHTML = html;
        }
    }

    // 加入购物车的方法
    async addCartFn(eve) {
        // console.log(this);
        // 判断登陆状态
        let token = localStorage.getItem('token')
        // 未登录，跳转到登陆界面
        // console.log(token);
        if (!token) location.assign('./login.html?ReturnUrl=./list.html')
        // 已登陆，添加到购物车界面

        // 判断点击目标
        if (eve.target.classList.contains('sk_goods_buy')) {
            let lisObj = eve.target.parentNode;
            let goodsId = lisObj.dataset.id;
            // console.log(goodsId);
            let userId = localStorage.getItem('user_id')

            // 获取到两个id后，发送请求
            if (!userId || !goodsId) throw new Error('There is a problem with the ID');
            axios.defaults.headers.common['authorization'] = token;
            // 发送post请求(设置请求的格式，否则默认为josn格式，server不接收
            axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            let param = `id=${userId}&goodsId=${goodsId}`

            let {data,status} = await axios.post('http://localhost:8888/cart/add',
                // 获取商品id
                    param
                );
                // console.log(data,status);
            if(status == 200){
                if(data.code == 1){
                    // 成功加入购物车
                    layer.open({
                        content:'成功加入购物车',
                        btn: ['去结算','我知道了'],
                        yes:function (index,layero) {
                            location.assign('./cart.html')
                        }
                        
                    })
                }
            }
                
        }


    }

    $(tag) {
        let res = document.querySelectorAll(tag)
        return res.length == 1 ? res[0] : res;
    }
}
new List
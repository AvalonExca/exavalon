class signin {
    constructor() {
        // 登录按钮绑定事件
        this.$('.login-w .over').addEventListener('click', this.clickFn.bind(this));
    }
    clickFn() {
        // 获取页面中的表单
        let forms = document.forms[0].elements;
        let username = forms.uname.value;
        let password = forms.password.value;
        // 判断是否输入了账号密码
        if (!forms.uname.value.trim() || !forms.password.value.trim()) throw new Error('Cannot be empty')
        console.log(username, password);
        // 执行登陆操作
        // 发送post请求
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

        // 编码参数(账号密码)
        let data = `username=${username}&password=${password}`;

        axios.post('http://localhost:8888/users/login',
            data
        ).then(Data => {
            let { status, data } = Data;
            if (status == 200) {

                //判断登录是否成功
                // 成功
                if (data.code == 1) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user_id', data.user.id);

                    // 回去
                    location.assign(location.search.split('=')[1])
                }else {
                // 失败
                layer.open(
                    {
                        title:'登陆提示',
                        content:'用户名或密码输入有误'
                    }
                )
                }


            }
        })
    }

    $(tag) {
        let res = document.querySelectorAll(tag)
        return res.length == 1 ? res[0] : res;
    }
}
new signin;
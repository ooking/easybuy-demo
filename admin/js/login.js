layui.use(['form', 'layer'], function () {
    var form = layui.form;
    var layer = layui.layer;

    // 檢查是否已登入
    const user = MockData.getCurrentUser();
    if (user && user.role === 'admin') {
        window.location.href = 'index.html';
    }

    // 監聽提交
    form.on('submit(login)', function (data) {
        const username = data.field.username; // 管理員使用用戶名作為電話號碼
        const password = data.field.password;

        const result = MockData.login(username, password);
        if (result.success) {
            if (result.user.role === 'admin') {
                window.location.href = 'index.html';
            } else {
                layer.msg('拒絕訪問：非管理員帳號');
            }
        } else {
            layer.msg(result.message);
        }
        return false;
    });
});

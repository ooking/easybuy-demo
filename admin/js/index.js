layui.use(['element', 'layer'], function () {
    var element = layui.element;
    var layer = layui.layer;
    var $ = layui.$;

    // 驗證檢查
    const user = MockData.getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
    }

    $('#logoutBtn').click(function () {
        MockData.logout();
        window.location.href = 'login.html';
    });
});

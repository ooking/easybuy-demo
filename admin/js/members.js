layui.use(['table', 'form', 'layer'], function () {
    var table = layui.table;
    var form = layui.form;
    var layer = layui.layer;
    var $ = layui.$;

    // 驗證檢查
    const user = MockData.getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
    }

    // 輔助函數：直接獲取用戶，因為 MockData 沒有公開 getAllUsers
    function getUsers() {
        return JSON.parse(localStorage.getItem(MockData.KEY_USERS)).filter(u => u.role === 'client');
    }

    function addUser(user) {
        const users = JSON.parse(localStorage.getItem(MockData.KEY_USERS));
        user.id = Date.now();
        user.role = 'client';
        users.push(user);
        localStorage.setItem(MockData.KEY_USERS, JSON.stringify(users));
    }

    // 渲染表格
    function renderTable() {
        const data = getUsers();
        table.render({
            elem: '#memberTable',
            data: data,
            cols: [[
                { field: 'id', title: 'ID', width: 120, sort: true },
                { field: 'name', title: '姓名' },
                { field: 'phone', title: '電話' },
                { fixed: 'right', title: '操作', toolbar: '#barDemo', width: 150 }
            ]],
            page: true
        });
    }
    renderTable();

    // 新增會員
    $('#addMemberBtn').click(function () {
        layer.open({
            type: 1,
            title: '新增會員',
            area: ['500px', '400px'],
            content: $('#memberForm').html(),
            success: function (layero, index) {
                form.on('submit(saveMember)', function (data) {
                    addUser(data.field);
                    layer.close(index);
                    renderTable();
                    layer.msg('會員已新增');
                    return false;
                });
            }
        });
    });

    // 工具列
    table.on('tool(memberTable)', function (obj) {
        if (obj.event === 'del') {
            layer.confirm('確定要刪除嗎？', function (index) {
                obj.del();
                layer.close(index);
            });
        }
    });

    $('#logoutBtn').click(function () {
        MockData.logout();
        window.location.href = 'login.html';
    });
});

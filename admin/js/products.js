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

    // 渲染表格
    function renderTable() {
        const data = MockData.getProducts();
        table.render({
            elem: '#productTable',
            data: data,
            cols: [[
                { field: 'id', title: 'ID', width: 80, sort: true },
                { field: 'name', title: '名稱' },
                { field: 'price', title: '價格' },
                { field: 'currency', title: '幣種' },
                { field: 'scheduleId', title: '日程 ID' },
                { fixed: 'right', title: '操作', toolbar: '#barDemo', width: 150 }
            ]],
            page: true
        });
    }
    renderTable();

    // 新增產品
    $('#addProductBtn').click(function () {
        layer.open({
            type: 1,
            title: '新增產品',
            area: ['500px', '600px'],
            content: $('#productForm').html(),
            success: function (layero, index) {
                // 填充日程選擇
                const schedules = MockData.getSchedules();
                const $select = layero.find('#scheduleSelect');
                schedules.forEach(s => {
                    $select.append(`<option value="${s.id}">${s.title}</option>`);
                });
                form.render('select');

                form.on('submit(saveProduct)', function (data) {
                    MockData.addProduct(data.field);
                    layer.close(index);
                    renderTable();
                    layer.msg('產品已新增');
                    return false;
                });
            }
        });
    });

    // 工具列
    table.on('tool(productTable)', function (obj) {
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

layui.use(['table', 'layer', 'form'], function () {
    var table = layui.table;
    var layer = layui.layer;
    var form = layui.form;
    var $ = layui.$;

    // 驗證檢查
    const user = MockData.getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
    }

    // 輔助函數：結算訂單
    function settleOrder(id, finalPrice, finalCurrency) {
        const orders = JSON.parse(localStorage.getItem(MockData.KEY_ORDERS));
        const order = orders.find(o => o.id === id);
        if (order) {
            order.status = 'settled';
            order.finalPrice = finalPrice;
            order.finalCurrency = finalCurrency;
            localStorage.setItem(MockData.KEY_ORDERS, JSON.stringify(orders));
        }
    }

    // 渲染表格
    function renderTables() {
        const allOrders = MockData.getAllOrders();
        const users = JSON.parse(localStorage.getItem(MockData.KEY_USERS));

        const enrich = (list) => list.map(o => {
            const u = users.find(u => u.id === o.userId);
            return { ...o, userName: u ? u.name : '未知' };
        });

        const purchased = enrich(allOrders.filter(o => o.status === 'purchased'));
        const settled = enrich(allOrders.filter(o => o.status === 'settled'));

        table.render({
            elem: '#settleTable',
            data: purchased,
            cols: [[
                { field: 'id', title: 'ID', width: 80 },
                { field: 'productName', title: '產品' },
                { field: 'userName', title: '客戶' },
                { field: 'price', title: '原價' },
                { field: 'currency', title: '原幣種' },
                { fixed: 'right', title: '操作', toolbar: '#barDemo', width: 100 }
            ]],
            page: true
        });

        table.render({
            elem: '#historyTable',
            data: settled,
            cols: [[
                { field: 'id', title: 'ID', width: 80 },
                { field: 'productName', title: '產品' },
                { field: 'userName', title: '客戶' },
                { field: 'finalPrice', title: '最終價格' },
                { field: 'finalCurrency', title: '幣種' },
                { field: 'status', title: '狀態' }
            ]],
            page: true
        });
    }
    renderTables();

    // 工具列
    table.on('tool(settleTable)', function (obj) {
        if (obj.event === 'settle') {
            layer.open({
                type: 1,
                title: '結算訂單',
                area: ['500px', '400px'],
                content: $('#settleForm').html(),
                success: function (layero, index) {
                    // 填充表單
                    layero.find('input[name="productName"]').val(obj.data.productName);
                    layero.find('input[name="originalPrice"]').val(obj.data.price + ' ' + obj.data.currency);

                    form.on('submit(confirmSettle)', function (data) {
                        settleOrder(obj.data.id, data.field.finalPrice, data.field.finalCurrency);
                        layer.close(index);
                        renderTables();
                        layer.msg('訂單已結算');
                        return false;
                    });
                }
            });
        }
    });

    $('#logoutBtn').click(function () {
        MockData.logout();
        window.location.href = 'login.html';
    });
});

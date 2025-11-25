layui.use(['table', 'layer'], function () {
    var table = layui.table;
    var layer = layui.layer;
    var $ = layui.$;

    // 驗證檢查
    const user = MockData.getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
    }

    // 輔助函數：更新訂單狀態
    function updateOrderStatus(id, status) {
        const orders = JSON.parse(localStorage.getItem(MockData.KEY_ORDERS));
        const order = orders.find(o => o.id === id);
        if (order) {
            order.status = status;
            localStorage.setItem(MockData.KEY_ORDERS, JSON.stringify(orders));
        }
    }

    // 渲染表格
    function renderTable() {
        // 獲取所有狀態為 'cart' 的訂單
        const allOrders = MockData.getAllOrders();
        const toBuy = allOrders.filter(o => o.status === 'cart');

        // 豐富用戶名稱（可選，但對管理員有幫助）
        const users = JSON.parse(localStorage.getItem(MockData.KEY_USERS));
        const data = toBuy.map(o => {
            const u = users.find(u => u.id === o.userId);
            return { ...o, userName: u ? u.name : '未知' };
        });

        table.render({
            elem: '#tobuyTable',
            data: data,
            cols: [[
                { field: 'id', title: 'ID', width: 80, sort: true },
                { field: 'productName', title: '產品' },
                { field: 'quantity', title: '數量', width: 80 },
                { field: 'userName', title: '客戶' },
                { field: 'price', title: '預估價格' },
                { fixed: 'right', title: '操作', toolbar: '#barDemo', width: 200 }
            ]],
            page: true
        });
    }
    renderTable();

    // 工具列
    table.on('tool(tobuyTable)', function (obj) {
        if (obj.event === 'buy') {
            layer.confirm('標記為已購買？', function (index) {
                updateOrderStatus(obj.data.id, 'purchased');
                obj.del();
                layer.close(index);
                layer.msg('已標記為已購買');
            });
        } else if (obj.event === 'cancel') {
            layer.confirm('取消此項目？', function (index) {
                // 從訂單列表移除或標記為已取消
                // 目前我們直接移除它（取消）
                MockData.removeFromCart(obj.data.id);
                obj.del();
                layer.close(index);
                layer.msg('項目已取消');
            });
        }
    });

    $('#logoutBtn').click(function () {
        MockData.logout();
        window.location.href = 'login.html';
    });
});

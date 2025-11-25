layui.use(['table', 'form', 'layer', 'laydate'], function () {
    var table = layui.table;
    var form = layui.form;
    var layer = layui.layer;
    var laydate = layui.laydate;
    var $ = layui.$;

    // 驗證檢查
    const user = MockData.getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
    }

    // 渲染表格
    function renderTable() {
        const data = MockData.getSchedules();
        table.render({
            elem: '#scheduleTable',
            data: data,
            cols: [[
                { field: 'id', title: 'ID', width: 80, sort: true },
                { field: 'title', title: '標題' },
                { field: 'destination', title: '目的地' },
                { field: 'date', title: '日期' },
                { field: 'deadline', title: '截止日期' },
                { field: 'status', title: '狀態' },
                { fixed: 'right', title: '操作', toolbar: '#barDemo', width: 150 }
            ]],
            page: true
        });
    }
    renderTable();

    // 新增日程
    $('#addScheduleBtn').click(function () {
        layer.open({
            type: 1,
            title: '新增日程',
            area: ['500px', '500px'],
            content: $('#scheduleForm').html(),
            success: function (layero, index) {
                laydate.render({ elem: layero.find('#datePicker')[0] });
                laydate.render({ elem: layero.find('#deadlinePicker')[0] });

                form.on('submit(saveSchedule)', function (data) {
                    MockData.addSchedule(data.field);
                    layer.close(index);
                    renderTable();
                    layer.msg('日程已新增');
                    return false;
                });
            }
        });
    });

    // 工具列
    table.on('tool(scheduleTable)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('確定要刪除嗎？', function (index) {
                // 在真實應用中，從伺服器刪除。這裡我們需要更新 MockData 以支援刪除。
                // 目前僅從 UI 移除以顯示互動。
                obj.del();
                layer.close(index);
            });
        } else if (obj.event === 'edit') {
            layer.alert('編輯功能在此演示中尚未完全實作（需要更新模擬數據邏輯）。');
        }
    });

    $('#logoutBtn').click(function () {
        MockData.logout();
        window.location.href = 'login.html';
    });
});

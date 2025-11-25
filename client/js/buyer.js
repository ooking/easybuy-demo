$(document).ready(function () {
    // 驗證檢查
    const user = MockData.getCurrentUser();
    if (!user || (user.role !== 'buyer' && user.role !== 'admin')) {
        alert('無權訪問');
        window.location.href = 'index.html';
        return;
    }

    // 獲取日程 ID
    const urlParams = new URLSearchParams(window.location.search);
    const scheduleId = urlParams.get('scheduleId');

    if (!scheduleId) {
        alert('未選擇行程');
        window.location.href = 'index.html';
        return;
    }

    // 獲取日程信息
    const schedules = MockData.getSchedules();
    const schedule = schedules.find(s => s.id == scheduleId);
    if (schedule) {
        $('#scheduleTitle').text(schedule.title + ' - 訂購清單');
    }

    let allItems = [];

    function renderList(items) {
        const $list = $('#buyerList');
        $list.empty();

        if (items.length === 0) {
            $list.html('<p class="has-text-grey has-text-centered">暫無訂購數據。</p>');
            return;
        }

        items.forEach(item => {
            let statusBadge = '';
            let actionButtons = '';

            if (item.buyingStatus === 'purchased') {
                statusBadge = '<span class="tag is-success">已購買</span>';
                actionButtons = `
                    <button class="button is-small is-warning is-outlined update-status" data-id="${item.productId}" data-status="out_of_stock">標記缺貨</button>
                    <button class="button is-small is-light update-status" data-id="${item.productId}" data-status="pending">重置</button>
                `;
            } else if (item.buyingStatus === 'out_of_stock') {
                statusBadge = '<span class="tag is-danger">缺貨</span>';
                actionButtons = `
                    <button class="button is-small is-success is-outlined update-status" data-id="${item.productId}" data-status="purchased">標記已買</button>
                    <button class="button is-small is-light update-status" data-id="${item.productId}" data-status="pending">重置</button>
                `;
            } else {
                statusBadge = '<span class="tag is-light">待處理</span>';
                actionButtons = `
                    <button class="button is-small is-success update-status" data-id="${item.productId}" data-status="purchased">標記已買</button>
                    <button class="button is-small is-danger update-status" data-id="${item.productId}" data-status="out_of_stock">標記缺貨</button>
                `;
            }

            const html = `
                <div class="box">
                    <article class="media">
                        <div class="media-left">
                            <figure class="image is-64x64">
                                <img src="${item.image}" alt="${item.productName}">
                            </figure>
                        </div>
                        <div class="media-content">
                            <div class="content">
                                <p>
                                    <strong>${item.productName}</strong>
                                    <br>
                                    總訂購數量: <span class="title is-5">${item.totalQuantity}</span>
                                    <br>
                                    狀態: ${statusBadge}
                                </p>
                            </div>
                            <div class="buttons">
                                ${actionButtons}
                            </div>
                        </div>
                    </article>
                </div>
            `;
            $list.append(html);
        });
    }

    function loadData() {
        allItems = MockData.getAggregatedOrders(scheduleId);
        renderList(allItems);
    }

    loadData();

    // 搜尋功能
    $('#searchInput').on('input', function () {
        const term = $(this).val().toLowerCase();
        const filtered = allItems.filter(item => item.productName.toLowerCase().includes(term));
        renderList(filtered);
    });

    // 更新狀態
    $(document).on('click', '.update-status', function () {
        const productId = $(this).data('id');
        const status = $(this).data('status');

        MockData.updateBuyingStatus(scheduleId, productId, status);
        loadData(); // 重新載入以更新顯示
    });
});

$(document).ready(function () {
    // 驗證檢查
    const user = MockData.getCurrentUser();
    if (!user || user.role !== 'client') {
        window.location.href = 'login.html';
        return;
    }

    function loadOrders() {
        // 獲取用戶的所有訂單（不包括購物車狀態）
        const allOrders = MockData.getAllOrders().filter(o => o.userId === user.id);
        const settledOrders = allOrders.filter(o => o.status === 'settled');
        const purchasedOrders = allOrders.filter(o => o.status === 'purchased');

        const $list = $('#orderList');
        $list.empty();

        if (settledOrders.length === 0 && purchasedOrders.length === 0) {
            $list.html('<p class="has-text-grey has-text-centered">目前沒有進行中的訂單。</p>');
            return;
        }

        if (settledOrders.length > 0) {
            $list.append('<h3 class="title is-5">待付款</h3>');
            settledOrders.forEach(item => {
                const html = `
                    <div class="card product-card">
                        <div class="card-content">
                            <p class="title is-6">${item.productName}</p>
                            <p class="subtitle is-6">
                                數量: ${item.quantity}<br>
                                最終價格: <span class="has-text-danger">${item.finalPrice || '待定'} ${item.finalCurrency || ''}</span>
                            </p>
                            <div class="content">
                                <span class="tag is-warning">請付款</span>
                                <p class="is-size-7 mt-2">取貨地點: 7-11 門市 A</p>
                            </div>
                        </div>
                    </div>
                `;
                $list.append(html);
            });
        }

        if (purchasedOrders.length > 0) {
            $list.append('<h3 class="title is-5 mt-4">已購買 (等待結算)</h3>');
            purchasedOrders.forEach(item => {
                const html = `
                    <div class="card product-card">
                        <div class="card-content">
                            <p class="title is-6">${item.productName}</p>
                            <p class="subtitle is-6">
                                數量: ${item.quantity}<br>
                                預估價格: ${item.price} ${item.currency}
                            </p>
                            <span class="tag is-info">已購買</span>
                        </div>
                    </div>
                `;
                $list.append(html);
            });
        }
    }

    loadOrders();
});

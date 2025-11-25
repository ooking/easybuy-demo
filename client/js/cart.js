$(document).ready(function () {
    // 驗證檢查
    const user = MockData.getCurrentUser();
    if (!user || user.role !== 'client') {
        window.location.href = 'login.html';
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
        $('#scheduleTitle').text(schedule.title);
    }

    function updateSummary() {
        const cartItems = MockData.getCart(user.id, scheduleId);
        let totalQuantity = 0;
        let totalAmount = 0;
        let currency = 'HKD';

        cartItems.forEach(item => {
            // 只計算未購買/未結算的商品
            if (item.status !== 'purchased' && item.status !== 'settled') {
                const qty = parseInt(item.quantity) || 0;
                const price = parseFloat(item.price) || 0;
                totalQuantity += qty;
                totalAmount += price * qty;
                if (item.currency) currency = item.currency;
            }
        });

        $('#totalQuantity').text(totalQuantity);
        $('#totalAmount').text(totalAmount.toLocaleString());
        $('#currencyLabel').text(currency);

        if (cartItems.length > 0) {
            $('#cartSummary').removeClass('is-hidden');
        } else {
            $('#cartSummary').addClass('is-hidden');
        }
    }

    function loadCart() {
        const cartItems = MockData.getCart(user.id, scheduleId);
        const $list = $('#cartList');
        $list.empty();

        if (cartItems.length === 0) {
            $list.html('<p class="has-text-grey has-text-centered">您的購物車是空的。</p>');
        } else {
            cartItems.forEach(item => {
                const isPurchased = item.status === 'purchased' || item.status === 'settled';
                const removeBtn = isPurchased
                    ? `<span class="tag is-success">已購買</span>`
                    : `<button class="button is-danger is-small remove-btn" data-id="${item.id}">移除</button>`;

                const html = `
                    <div class="card product-card" style="flex-direction: row; height: auto;">
                        <div class="card-content" style="width: 100%;">
                            <div class="media">
                                <div class="media-content">
                                    <p class="title is-6">${item.productName}</p>
                                    <div class="field is-horizontal" style="margin-bottom: 0;">
                                        <div class="field-label is-normal" style="flex-grow: 0; margin-right: 10px; text-align: left;">
                                            <label class="label">${item.price} ${item.currency} x</label>
                                        </div>
                                        <div class="field-body">
                                            <div class="field">
                                                <div class="control" style="width: 80px;">
                                                    <input class="input is-small quantity-input" type="number" min="1" value="${item.quantity}" data-id="${item.id}" ${isPurchased ? 'disabled' : ''}>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="media-right">
                                    ${removeBtn}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                $list.append(html);
            });
        }
        updateSummary();
    }

    loadCart();

    // 處理通知關閉
    $(document).on('click', '.notification .delete', function () {
        $(this).parent().remove();
    });

    // 更新數量
    $(document).on('change', '.quantity-input', function () {
        const orderId = $(this).data('id');
        const newQuantity = $(this).val();
        if (newQuantity < 1) {
            alert('數量不能小於 1');
            $(this).val(1);
            return;
        }
        MockData.updateCartItemQuantity(orderId, newQuantity);
        updateSummary();
    });

    // 移除商品
    $(document).on('click', '.remove-btn', function () {
        const orderId = $(this).data('id');
        if (confirm('確定要移除此商品嗎？')) {
            MockData.removeFromCart(orderId);
            loadCart();
        }
    });
});

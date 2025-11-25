$(document).ready(function () {
    // 驗證檢查
    const user = MockData.getCurrentUser();
    if (!user || !['client', 'buyer', 'admin'].includes(user.role)) {
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

    // 載入商品
    const products = MockData.getProducts(scheduleId);
    const cartItems = MockData.getCart(user.id); // 獲取購物車項目
    const $list = $('#productList');

    // 檢查商品是否在購物車中的輔助函數
    function isProductInCart(productId) {
        return cartItems.some(item => item.productId == productId && (item.status !== 'purchased' && item.status !== 'settled'));
    }

    if (products.length === 0) {
        $list.html('<p class="has-text-grey has-text-centered" style="width:100%; margin-top:20px;">此行程暫無商品。</p>');
    } else {
        products.forEach(p => {
            const cartItem = cartItems.find(item => item.productId == p.id && (item.status !== 'purchased' && item.status !== 'settled'));
            const quantity = cartItem ? cartItem.quantity : 0;

            let actionHtml = '';
            if (quantity > 0) {
                actionHtml = `
                    <div class="field has-addons is-justify-content-center mt-2">
                        <div class="control">
                            <button class="button is-small is-danger decrease-qty" data-id="${p.id}">
                                <span class="icon is-small"><i class="fas fa-minus"></i></span>
                            </button>
                        </div>
                        <div class="control">
                            <input class="input is-small has-text-centered" type="text" value="${quantity}" readonly style="width: 50px;">
                        </div>
                        <div class="control">
                            <button class="button is-small is-success increase-qty" data-id="${p.id}">
                                <span class="icon is-small"><i class="fas fa-plus"></i></span>
                            </button>
                        </div>
                    </div>
                `;
            } else {
                actionHtml = `
                    <button class="button is-small is-primary is-fullwidth mt-2 add-to-cart" data-id="${p.id}">
                        訂購
                    </button>
                `;
            }

            const html = `
                <div class="product-item">
                    <div class="card product-card">
                        <div class="card-image">
                            <figure class="image is-4by3 clickable-image" data-id="${p.id}" style="cursor: pointer;">
                                <img src="${p.image}" alt="${p.name}">
                            </figure>
                        </div>
                        <div class="card-content">
                            <p class="title is-6" style="margin-bottom: 5px;">${p.name}</p>
                            <p class="product-price">${p.price} ${p.currency}</p>
                            <div id="action-${p.id}">
                                ${actionHtml}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $list.append(html);
        });
    }

    // 顯示截止日期
    const schedules = MockData.getSchedules();
    const schedule = schedules.find(s => s.id == scheduleId);
    if (schedule && schedule.deadline) {
        $('#footerDeadline').text(schedule.deadline);
    } else {
        $('#footerDeadline').text('N/A');
    }

    // 更新購物車摘要
    function updateCartSummary() {
        const currentCartItems = MockData.getCart(user.id, scheduleId);
        let totalQuantity = 0;
        let totalAmount = 0;
        let currency = 'HKD'; // 預設貨幣

        currentCartItems.forEach(item => {
            if (item.status !== 'purchased' && item.status !== 'settled') {
                const qty = parseInt(item.quantity) || 0;
                const price = parseFloat(item.price) || 0;
                totalQuantity += qty;
                totalAmount += price * qty;
                if (item.currency) currency = item.currency;
            }
        });

        $('#footerTotalQuantity').text(`${totalQuantity} 件`);
        $('#footerTotalAmount').text(`${currency} ${totalAmount.toLocaleString()}`);
    }

    // 初始載入摘要
    updateCartSummary();

    // 重新渲染單個商品的按鈕區域
    function renderProductAction(productId) {
        const cartItems = MockData.getCart(user.id, scheduleId);
        const cartItem = cartItems.find(item => item.productId == productId && (item.status !== 'purchased' && item.status !== 'settled'));
        const quantity = cartItem ? cartItem.quantity : 0;

        let actionHtml = '';
        if (quantity > 0) {
            actionHtml = `
                <div class="field has-addons is-justify-content-center mt-2">
                    <div class="control">
                        <button class="button is-small is-danger decrease-qty" data-id="${productId}">
                            <span class="icon is-small"><i class="fas fa-minus"></i></span>
                        </button>
                    </div>
                    <div class="control">
                        <input class="input is-small has-text-centered" type="text" value="${quantity}" readonly style="width: 50px;">
                    </div>
                    <div class="control">
                        <button class="button is-small is-success increase-qty" data-id="${productId}">
                            <span class="icon is-small"><i class="fas fa-plus"></i></span>
                        </button>
                    </div>
                </div>
            `;
        } else {
            actionHtml = `
                <button class="button is-small is-primary is-fullwidth mt-2 add-to-cart" data-id="${productId}">
                    加入購物車
                </button>
            `;
        }
        $(`#action-${productId}`).html(actionHtml);
    }

    // 加入購物車
    $(document).on('click', '.add-to-cart', function () {
        const productId = $(this).data('id');
        const product = products.find(p => p.id == productId);
        MockData.addToCart(user.id, product);
        renderProductAction(productId);
        updateCartSummary();
    });

    // 增加數量
    $(document).on('click', '.increase-qty', function () {
        const productId = $(this).data('id');
        const cartItems = MockData.getCart(user.id, scheduleId);
        const cartItem = cartItems.find(item => item.productId == productId && (item.status !== 'purchased' && item.status !== 'settled'));

        if (cartItem) {
            MockData.updateCartItemQuantity(cartItem.id, cartItem.quantity + 1);
            renderProductAction(productId);
            updateCartSummary();
        }
    });

    // 減少數量
    $(document).on('click', '.decrease-qty', function () {
        const productId = $(this).data('id');
        const cartItems = MockData.getCart(user.id, scheduleId);
        const cartItem = cartItems.find(item => item.productId == productId && (item.status !== 'purchased' && item.status !== 'settled'));

        if (cartItem) {
            if (cartItem.quantity > 1) {
                MockData.updateCartItemQuantity(cartItem.id, cartItem.quantity - 1);
            } else {
                MockData.removeFromCart(cartItem.id);
            }
            renderProductAction(productId);
            updateCartSummary();
        }
    });

    // 商品詳情 Modal
    $(document).on('click', '.clickable-image', function () {
        const productId = $(this).data('id');
        const product = products.find(p => p.id == productId);

        if (product) {
            $('#modalImage').attr('src', product.image);
            $('#modalTitle').text(product.name);
            $('#modalPrice').text(`${product.price} ${product.currency}`);
            $('#modalDescription').text(product.desc || '暫無描述');
            $('#productModal').addClass('is-active');
        }
    });

    // 關閉 Modal
    $('.modal-close, .modal-background').click(function () {
        $('#productModal').removeClass('is-active');
    });
});

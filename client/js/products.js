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

    // 載入產品
    const products = MockData.getProducts(scheduleId);
    const cartItems = MockData.getCart(user.id); // 獲取購物車項目
    const $list = $('#productList');

    // 檢查產品是否在購物車中的輔助函數
    function isProductInCart(productId) {
        return cartItems.some(item => item.productId == productId && (item.status !== 'purchased' && item.status !== 'settled'));
    }

    if (products.length === 0) {
        $list.html('<p class="has-text-grey has-text-centered" style="width:100%; margin-top:20px;">此行程暫無產品。</p>');
    } else {
        products.forEach(p => {
            const inCart = isProductInCart(p.id);
            const buttonClass = inCart ? 'is-success' : 'is-primary';
            const buttonText = inCart ? '已選購' : '加入購物車';
            const disabledAttr = inCart ? 'disabled' : '';

            const html = `
                <div class="product-item">
                    <div class="card product-card">
                        <div class="card-image">
                            <figure class="image is-4by3">
                                <img src="${p.image}" alt="${p.name}">
                            </figure>
                        </div>
                        <div class="card-content">
                            <p class="title is-6" style="margin-bottom: 5px;">${p.name}</p>
                            <p class="product-price">${p.price} ${p.currency}</p>
                            <button class="button is-small ${buttonClass} is-fullwidth mt-2 add-to-cart" data-id="${p.id}" ${disabledAttr}>
                                ${buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            $list.append(html);
        });
    }

    // 加入購物車
    $(document).on('click', '.add-to-cart', function () {
        const $btn = $(this);
        if ($btn.attr('disabled')) return; // 防止重複點擊

        const productId = $btn.data('id');
        const product = products.find(p => p.id == productId);

        MockData.addToCart(user.id, product);

        // 更新按鈕狀態
        $btn.removeClass('is-primary').addClass('is-success').text('已選購').attr('disabled', true);

    });
});

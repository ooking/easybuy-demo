$(document).ready(function () {
    // 驗證檢查
    const user = MockData.getCurrentUser();
    if (!user || user.role !== 'client') {
        window.location.href = 'login.html';
        return;
    }

    // 載入日程
    const schedules = MockData.getSchedules();
    const $list = $('#scheduleList');

    if (schedules.length === 0) {
        $list.html('<p class="has-text-grey has-text-centered">目前沒有即將到來的行程。</p>');
    } else {
        schedules.forEach(s => {
            const cartItems = MockData.getCart(user.id, s.id);
            const cartCount = cartItems.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);

            const html = `
                <div class="card schedule-card" style="margin-bottom: 20px;">
                    <div class="card-content" onclick="window.location.href='products.html?scheduleId=${s.id}'" style="cursor: pointer;">
                        <div class="media">
                            <div class="media-content">
                                <p class="title is-5">${s.title}</p>
                                <p class="subtitle is-6"><i class="fas fa-map-marker-alt"></i> ${s.destination}</p>
                            </div>
                        </div>
                        <div class="content">
                            ${s.desc}
                            <br>
                            <small class="has-text-grey">日期: ${s.date}</small>
                            <br>
                            <span class="tag is-warning">截止日期: ${s.deadline}</span>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a href="products.html?scheduleId=${s.id}" class="card-footer-item has-text-primary">
                            <span>選購商品</span>
                        </a>
                        <a href="cart.html?scheduleId=${s.id}" class="card-footer-item has-text-info">
                            <span class="icon"><i class="fas fa-shopping-cart"></i></span>
                            <span>購物車 (${cartCount})</span>
                        </a>
                    </footer>
                </div>
            `;
            $list.append(html);
        });
    }

    // 登出
    $('#logoutBtn').click(function () {
        MockData.logout();
        window.location.href = 'login.html';
    });
});

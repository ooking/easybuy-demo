$(document).ready(function () {
    // 驗證檢查
    const user = MockData.getCurrentUser();
    if (!user || !['client', 'buyer', 'admin'].includes(user.role)) {
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

            let buyerHtml = '';
            if (user.role === 'buyer' || user.role === 'admin') {
                buyerHtml = `
                    <a href="buyer.html?scheduleId=${s.id}" class="card-footer-item has-text-danger">
                        <span class="icon"><i class="fas fa-clipboard-list"></i></span>
                        <span>買手看板</span>
                    </a>
                `;
            }

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
                            <small class="has-text-grey">出發日期: ${s.date}</small>
                            <br>
                            <span class="tag is-warning">截止日期: ${s.deadline}</span>
                            <div class="tags mt-2">
                                <span class="tag is-info is-light">貨幣: ${s.currency || 'JPY'}</span>
                                <span class="tag is-success is-light">匯率: ${s.rate || 0.23}</span>
                                <span class="tag ${s.status === 'active' ? 'is-danger' : 'is-primary'}">${s.status === 'upcoming' ? '待出發' : (s.status === 'active' ? '購買中' : s.status)}</span>
                            </div>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a href="products.html?scheduleId=${s.id}" class="card-footer-item has-text-primary">
                            <span>選購商品</span>
                        </a>
                        <a href="#" class="card-footer-item has-text-info">
                            <span class="icon"><i class="fas fa-shopping-cart"></i></span>
                            <span>訂購 (${cartCount})</span>
                        </a>
                        ${buyerHtml}
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

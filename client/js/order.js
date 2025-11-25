$(document).ready(function () {
    // 驗證檢查
    const user = MockData.getCurrentUser();
    if (!user || !['client', 'buyer', 'admin'].includes(user.role)) {
        window.location.href = 'login.html';
        return;
    }

    function loadOrders() {
        const groupedOrders = MockData.getOrdersBySchedule(user.id);
        const $list = $('#orderList');
        $list.empty();

        if (groupedOrders.length === 0) {
            $list.html('<p class="has-text-grey has-text-centered">目前沒有訂單紀錄。</p>');
            return;
        }

        groupedOrders.forEach(group => {
            const statusText = group.status === 'pending_payment' ? '待付款' : (group.status === 'completed' ? '交收完畢' : group.status);
            const statusClass = group.status === 'pending_payment' ? 'is-warning' : 'is-success';

            let itemsHtml = '';
            group.items.forEach(item => {
                itemsHtml += `
                    <div class="box is-shadowless" style="margin-bottom: 10px; background-color: #f9f9f9;">
                        <article class="media">
                            <div class="media-content">
                                <div class="content">
                                    <p>
                                        <strong>${item.productName}</strong>
                                        <br>
                                        數量: ${item.quantity} | 單價: ${item.price} ${item.currency}
                                    </p>
                                </div>
                            </div>
                        </article>
                    </div>
                `;
            });

            const html = `
                <div class="card schedule-card">
                    <header class="card-header toggle-details" data-id="${group.scheduleId}" style="cursor: pointer;">
                        <p class="card-header-title">
                            ${group.scheduleTitle}
                        </p>
                        <button class="card-header-icon" aria-label="more options">
                            <span class="icon">
                                <i class="fas fa-angle-down" id="icon-${group.scheduleId}"></i>
                            </span>
                        </button>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <div class="columns is-mobile">
                                <div class="column">
                                    <p class="heading">總數量</p>
                                    <p class="title is-6">${group.totalQuantity}</p>
                                </div>
                                <div class="column">
                                    <p class="heading">總價 (TWD)</p>
                                    <p class="title is-6">$${group.totalPriceTWD.toLocaleString()}</p>
                                </div>
                                <div class="column">
                                    <p class="heading">狀態</p>
                                    <span class="tag ${statusClass}">${statusText}</span>
                                </div>
                            </div>
                        </div>
                        <div id="details-${group.scheduleId}" class="is-hidden mt-4">
                            <h6 class="title is-6">訂購明細</h6>
                            ${itemsHtml}
                        </div>
                    </div>
                </div>
            `;
            $list.append(html);
        });

        // 綁定點擊事件
        $('.toggle-details').click(function () {
            const id = $(this).data('id');
            $(`#details-${id}`).toggleClass('is-hidden');
            $(`#icon-${id}`).toggleClass('fa-angle-down fa-angle-up');
        });
    }

    loadOrders();
});

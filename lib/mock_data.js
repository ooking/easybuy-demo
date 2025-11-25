/**
 * 代購系統模擬數據服務 (Daigou System Mock Data Service)
 * 使用 localStorage 處理數據持久化
 */

const MockData = {
    KEY_USERS: 'easybuy_users',
    KEY_SCHEDULES: 'easybuy_schedules',
    KEY_PRODUCTS: 'easybuy_products',
    KEY_ORDERS: 'easybuy_orders',
    KEY_CURRENT_USER: 'easybuy_current_user',

    init: function () {
        // 初始化用戶
        let users = JSON.parse(localStorage.getItem(this.KEY_USERS));
        if (!users) {
            users = [
                { id: 1, phone: '0988888888', password: '123', name: '客戶 A', role: 'client' },
                { id: 2, phone: 'admin', password: 'admin', name: '代購管理員', role: 'admin' },
                { id: 3, phone: 'king', password: 'king', name: 'King (買手)', role: 'buyer' }
            ];
            localStorage.setItem(this.KEY_USERS, JSON.stringify(users));
        } else {
            // 檢查並添加 King 用戶 (如果不存在)
            const kingExists = users.find(u => u.phone === 'king');
            if (!kingExists) {
                users.push({ id: 3, phone: 'king', password: 'king', name: 'King (買手)', role: 'buyer' });
                localStorage.setItem(this.KEY_USERS, JSON.stringify(users));
            }
        }

        if (!localStorage.getItem(this.KEY_SCHEDULES)) {
            const initialSchedules = [
                { id: 1, title: '11月 大阪行', destination: '日本大阪', date: '2025-11-30', deadline: '2025-11-29', desc: '購買藥妝和零食。', status: 'active', currency: 'JPY', rate: 0.23 },
                { id: 2, title: '12月 東京行', destination: '日本東京', date: '2025-12-02', deadline: '2025-12-01', desc: '電子商品和時尚服飾。', status: 'upcoming', currency: 'JPY', rate: 0.23 },
                { id: 3, title: '1月 首爾行', destination: '韓國首爾', date: '2026-01-15', deadline: '2026-01-14', desc: '美妝保養品與流行服飾。', status: 'upcoming', currency: 'KRW', rate: 0.024 },
                { id: 4, title: '2月 上海行', destination: '中國上海', date: '2026-02-20', deadline: '2026-02-19', desc: '特色伴手禮與茶葉。', status: 'upcoming', currency: 'CNY', rate: 4.4 }
            ];
            localStorage.setItem(this.KEY_SCHEDULES, JSON.stringify(initialSchedules));
        }
        if (!localStorage.getItem(this.KEY_PRODUCTS)) {
            // 範例商品
            const initialProducts = [
                { id: 1, scheduleId: 1, name: '資生堂 安耐曬金瓶防曬霜', price: 3000, currency: 'JPY', rate: 0.23, image: 'https://placehold.co/150?text=Anessa', desc: '超強防水防汗，夏日必備。' },
                { id: 2, scheduleId: 1, name: '東京香蕉蛋糕 (8入)', price: 1000, currency: 'JPY', rate: 0.23, image: 'https://placehold.co/150?text=Banana', desc: '東京必買伴手禮，口感綿密。' },
                { id: 3, scheduleId: 1, name: 'SK-II 青春露 230ml', price: 18000, currency: 'JPY', rate: 0.23, image: 'https://placehold.co/150?text=SK-II', desc: '神仙水，穩定肌膚狀況。' },
                { id: 4, scheduleId: 1, name: '明治 膠原蛋白粉', price: 2000, currency: 'JPY', rate: 0.23, image: 'https://placehold.co/150?text=Meiji', desc: '美容養顏，補充膠原蛋白。' },
                { id: 5, scheduleId: 1, name: 'Calbee 薯條三兄弟', price: 880, currency: 'JPY', rate: 0.23, image: 'https://placehold.co/150?text=Calbee', desc: '北海道限定，酥脆好吃。' },
                { id: 6, scheduleId: 1, name: 'DHC 純橄欖護唇膏', price: 500, currency: 'JPY', rate: 0.23, image: 'https://placehold.co/150?text=DHC', desc: '滋潤保濕，不黏膩。' },
                { id: 7, scheduleId: 1, name: '參天 FX 眼藥水 (銀裝)', price: 600, currency: 'JPY', rate: 0.23, image: 'https://placehold.co/150?text=Santen', desc: '清涼感十足，緩解眼部疲勞。' },
                { id: 8, scheduleId: 1, name: '龍角散 粉末 (蜜桃味)', price: 700, currency: 'JPY', rate: 0.23, image: 'https://placehold.co/150?text=Ryukakusan', desc: '緩解喉嚨不適，口味清香。' },
                { id: 9, scheduleId: 1, name: '肌研 極潤保濕化妝水', price: 900, currency: 'JPY', rate: 0.23, image: 'https://placehold.co/150?text=HadaLabo', desc: '高保濕力，肌膚水潤。' },
                { id: 10, scheduleId: 1, name: 'EVE A錠 止痛藥 (60錠)', price: 800, currency: 'JPY', rate: 0.23, image: 'https://placehold.co/150?text=EVE', desc: '快速緩解頭痛、生理痛。' },
                { id: 11, scheduleId: 2, name: '任天堂 Switch OLED 主機', price: 37980, currency: 'JPY', rate: 0.23, image: 'https://placehold.co/150?text=Switch', desc: '色彩更鮮豔，遊戲體驗升級。' },
                { id: 12, scheduleId: 2, name: 'Sony WH-1000XM5 耳機', price: 42000, currency: 'JPY', rate: 0.23, image: 'https://placehold.co/150?text=Sony', desc: '頂級降噪，音質絕佳。' },
                { id: 13, scheduleId: 2, name: '三宅一生 Bao Bao 手提包', price: 45000, currency: 'JPY', rate: 0.23, image: 'https://placehold.co/150?text=BaoBao', desc: '幾何設計，時尚獨特。' },
                { id: 14, scheduleId: 2, name: 'Royce 生巧克力 (原味)', price: 780, currency: 'JPY', rate: 0.23, image: 'https://placehold.co/150?text=Royce', desc: '入口即化，濃郁巧克力香。' },
                { id: 15, scheduleId: 2, name: '富士山杯 (田島硝子)', price: 5500, currency: 'JPY', rate: 0.23, image: 'https://placehold.co/150?text=FujiGlass', desc: '精緻工藝，杯底有富士山。' },
                { id: 16, scheduleId: 2, name: '象印 不鏽鋼保溫杯 480ml', price: 2500, currency: 'JPY', rate: 0.23, image: 'https://placehold.co/150?text=Zojirushi', desc: '保溫保冷效果佳，輕量設計。' },
                { id: 17, scheduleId: 2, name: 'Uniqlo 發熱衣 (女款)', price: 1500, currency: 'JPY', rate: 0.23, image: 'https://placehold.co/150?text=Uniqlo', desc: '冬季保暖必備，輕薄舒適。' },
                { id: 18, scheduleId: 2, name: '白色戀人 巧克力餅乾 (12入)', price: 800, currency: 'JPY', rate: 0.23, image: 'https://placehold.co/150?text=Shiroi', desc: '北海道經典名產。' },
                { id: 19, scheduleId: 2, name: '一蘭拉麵 博多細麵 (5入)', price: 2000, currency: 'JPY', rate: 0.23, image: 'https://placehold.co/150?text=Ichiran', desc: '在家也能享受一蘭美味。' },
                { id: 20, scheduleId: 2, name: '鬼滅之刃 公仔 (炭治郎)', price: 3500, currency: 'JPY', rate: 0.23, image: 'https://placehold.co/150?text=DemonSlayer', desc: '精緻還原，收藏價值高。' }
            ];
            localStorage.setItem(this.KEY_PRODUCTS, JSON.stringify(initialProducts));
        }
        if (!localStorage.getItem(this.KEY_ORDERS)) {
            const initialOrders = [
                // 待付款訂單 (大阪行)
                { id: 101, userId: 1, productId: 1, productName: '資生堂 安耐曬金瓶防曬霜', price: 3000, currency: 'JPY', quantity: 2, status: 'pending_payment', scheduleId: 1 },
                { id: 102, userId: 1, productId: 2, productName: '東京香蕉蛋糕 (8入)', price: 1000, currency: 'JPY', quantity: 3, status: 'pending_payment', scheduleId: 1 },
                // 交收完畢訂單 (東京行 - 假設是過去的行程)
                { id: 103, userId: 1, productId: 11, productName: '任天堂 Switch OLED 主機', price: 37980, currency: 'JPY', quantity: 1, status: 'completed', scheduleId: 2 }
            ];
            localStorage.setItem(this.KEY_ORDERS, JSON.stringify(initialOrders));
        }
    },

    // 用戶方法
    login: function (phone, password) {
        let users = JSON.parse(localStorage.getItem(this.KEY_USERS));
        if (!users) {
            // 如果 users 為 null，嘗試重新初始化
            this.init();
            users = JSON.parse(localStorage.getItem(this.KEY_USERS));
        }

        if (!users) {
            return { success: false, message: '系統錯誤：無法載入用戶數據' };
        }

        const user = users.find(u => u.phone === phone && u.password === password);
        if (user) {
            localStorage.setItem(this.KEY_CURRENT_USER, JSON.stringify(user));
            return { success: true, user: user };
        }
        return { success: false, message: '帳號或密碼錯誤' };
    },

    getCurrentUser: function () {
        return JSON.parse(localStorage.getItem(this.KEY_CURRENT_USER));
    },

    logout: function () {
        localStorage.removeItem(this.KEY_CURRENT_USER);
    },

    // 日程方法
    getSchedules: function () {
        return JSON.parse(localStorage.getItem(this.KEY_SCHEDULES));
    },

    addSchedule: function (schedule) {
        const schedules = this.getSchedules();
        schedule.id = Date.now();
        schedules.push(schedule);
        localStorage.setItem(this.KEY_SCHEDULES, JSON.stringify(schedules));
    },

    // 商品方法
    getProducts: function (scheduleId) {
        const products = JSON.parse(localStorage.getItem(this.KEY_PRODUCTS));
        if (scheduleId) {
            return products.filter(p => p.scheduleId == scheduleId);
        }
        return products;
    },

    addProduct: function (product) {
        const products = JSON.parse(localStorage.getItem(this.KEY_PRODUCTS));
        product.id = Date.now();
        products.push(product);
        localStorage.setItem(this.KEY_PRODUCTS, JSON.stringify(products));
    },

    // 訂單/購物車方法
    // 購物車只是狀態為 'cart' 的訂單
    getCart: function (userId, scheduleId) {
        const orders = JSON.parse(localStorage.getItem(this.KEY_ORDERS));
        let cartItems = orders.filter(o => o.userId === userId && o.status === 'cart');
        if (scheduleId) {
            cartItems = cartItems.filter(o => o.scheduleId == scheduleId);
        }
        return cartItems;
    },

    // 獲取按行程分組的訂單
    getOrdersBySchedule: function (userId) {
        const orders = JSON.parse(localStorage.getItem(this.KEY_ORDERS));
        const userOrders = orders.filter(o => o.userId === userId && o.status !== 'cart');
        const schedules = this.getSchedules();

        // 按 scheduleId 分組
        const grouped = {};
        userOrders.forEach(order => {
            if (!grouped[order.scheduleId]) {
                const schedule = schedules.find(s => s.id == order.scheduleId);
                grouped[order.scheduleId] = {
                    scheduleId: order.scheduleId,
                    scheduleTitle: schedule ? schedule.title : '未知行程',
                    status: order.status, // 假設同一行程訂單狀態一致，或取第一個
                    items: [],
                    totalQuantity: 0,
                    totalPriceTWD: 0 // 這裡簡化，實際可能需要匯率轉換
                };
            }
            grouped[order.scheduleId].items.push(order);
            grouped[order.scheduleId].totalQuantity += order.quantity;

            // 簡單匯率轉換模擬 (JPY -> TWD 0.23, KRW -> TWD 0.024, CNY -> TWD 4.4)
            let rate = 0.23;
            if (order.currency === 'KRW') rate = 0.024;
            if (order.currency === 'CNY') rate = 4.4;

            grouped[order.scheduleId].totalPriceTWD += Math.round(order.price * order.quantity * rate);
        });

        return Object.values(grouped);
    },

    // 買手儀表板方法
    getAggregatedOrders: function (scheduleId) {
        const orders = JSON.parse(localStorage.getItem(this.KEY_ORDERS));
        // 只獲取該行程且非購物車狀態的訂單
        const scheduleOrders = orders.filter(o => o.scheduleId == scheduleId && o.status !== 'cart');

        const aggregated = {};
        scheduleOrders.forEach(order => {
            if (!aggregated[order.productId]) {
                aggregated[order.productId] = {
                    productId: order.productId,
                    productName: order.productName,
                    totalQuantity: 0,
                    buyingStatus: order.buyingStatus || 'pending', // pending, purchased, out_of_stock
                    image: '' // 需要從商品列表獲取圖片
                };
                // 嘗試獲取商品圖片
                const products = this.getProducts(scheduleId);
                const product = products.find(p => p.id == order.productId);
                if (product) {
                    aggregated[order.productId].image = product.image;
                }
            }
            aggregated[order.productId].totalQuantity += order.quantity;
            // 如果有任何訂單標記為已購買或缺貨，則更新聚合狀態 (這裡簡化處理，以最後更新為準或統一更新)
            if (order.buyingStatus) {
                aggregated[order.productId].buyingStatus = order.buyingStatus;
            }
        });

        return Object.values(aggregated);
    },

    updateBuyingStatus: function (scheduleId, productId, status) {
        const orders = JSON.parse(localStorage.getItem(this.KEY_ORDERS));
        let updated = false;
        orders.forEach(order => {
            if (order.scheduleId == scheduleId && order.productId == productId && order.status !== 'cart') {
                order.buyingStatus = status;
                updated = true;
            }
        });
        if (updated) {
            localStorage.setItem(this.KEY_ORDERS, JSON.stringify(orders));
        }
    },

    addToCart: function (userId, product) {
        const orders = JSON.parse(localStorage.getItem(this.KEY_ORDERS));
        // 檢查是否已在購物車中
        const existing = orders.find(o => o.userId === userId && o.productId === product.id && o.status === 'cart');
        if (existing) {
            existing.quantity += 1;
        } else {
            orders.push({
                id: Date.now(),
                userId: userId,
                productId: product.id,
                productName: product.name,
                price: product.price,
                currency: product.currency,
                quantity: 1,
                status: 'cart', // cart, ordered, purchased, settled
                scheduleId: product.scheduleId
            });
        }
        localStorage.setItem(this.KEY_ORDERS, JSON.stringify(orders));
    },

    removeFromCart: function (orderId) {
        let orders = JSON.parse(localStorage.getItem(this.KEY_ORDERS));
        orders = orders.filter(o => o.id !== orderId);
        localStorage.setItem(this.KEY_ORDERS, JSON.stringify(orders));
    },

    updateCartItemQuantity: function (orderId, quantity) {
        const orders = JSON.parse(localStorage.getItem(this.KEY_ORDERS));
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.quantity = parseInt(quantity, 10);
            localStorage.setItem(this.KEY_ORDERS, JSON.stringify(orders));
        }
    },

    // 管理員方法
    getAllOrders: function () {
        return JSON.parse(localStorage.getItem(this.KEY_ORDERS));
    }
};

MockData.init();

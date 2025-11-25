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
        if (!localStorage.getItem(this.KEY_USERS)) {
            const initialUsers = [
                { id: 1, phone: '13800138000', password: '123', name: '客戶 A', role: 'client' },
                { id: 2, phone: 'admin', password: 'admin', name: '代購管理員', role: 'admin' }
            ];
            localStorage.setItem(this.KEY_USERS, JSON.stringify(initialUsers));
        }
        if (!localStorage.getItem(this.KEY_SCHEDULES)) {
            const initialSchedules = [
                { id: 1, title: '11月 大阪行', destination: '日本大阪', date: '2025-11-30', deadline: '2025-11-29', desc: '購買藥妝和零食。', status: 'active' },
                { id: 2, title: '12月 東京行', destination: '日本東京', date: '2025-12-02', deadline: '2025-12-01', desc: '電子產品和時尚服飾。', status: 'upcoming' }
            ];
            localStorage.setItem(this.KEY_SCHEDULES, JSON.stringify(initialSchedules));
        }
        if (!localStorage.getItem(this.KEY_PRODUCTS)) {
            // 範例產品
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
            localStorage.setItem(this.KEY_ORDERS, JSON.stringify([]));
        }
    },

    // 用戶方法
    login: function (phone, password) {
        const users = JSON.parse(localStorage.getItem(this.KEY_USERS));
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

    // 產品方法
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

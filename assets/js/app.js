// ===================== Мобильное меню =====================
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
burger?.addEventListener('click', () => {
    const visible = mobileNav.style.display === 'flex';
    mobileNav.style.display = visible ? 'none' : 'flex';
});

// ===================== Баннер скидки =====================
const discountBanner = document.getElementById('discountBanner');
const hideBannerBtn = document.getElementById('hideBannerBtn');

function updateDiscountBanner() {
    const hasDiscount = localStorage.getItem('ap_discount20') === 'true';
    const dismissed = localStorage.getItem('ap_discount20_dismissed') === 'true';

    if (hasDiscount && !dismissed) discountBanner?.classList.add('show');
    else discountBanner?.classList.remove('show');
}

hideBannerBtn?.addEventListener('click', () => {
    localStorage.setItem('ap_discount20_dismissed', 'true');
    updateDiscountBanner();
});

// ===================== Модальные окна =====================
const authModal = document.getElementById('authModal');
const authBackdrop = document.getElementById('authBackdrop');
const authClose = document.getElementById('authClose');
const openLoginBtn = document.getElementById('openLoginBtn');
const openRegisterBtn = document.getElementById('openRegisterBtn');

function openAuth(type = 'login') {
    authModal?.classList.add('show');
    document.body.style.overflow = 'hidden';
    setActiveTab(type);
}

function closeAuth() {
    authModal?.classList.remove('show');
    document.body.style.overflow = '';
}

openLoginBtn?.addEventListener('click', () => openAuth('login'));
openRegisterBtn?.addEventListener('click', () => openAuth('register'));
authBackdrop?.addEventListener('click', closeAuth);
authClose?.addEventListener('click', closeAuth);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAuth(); });

// ===================== Вкладки вход / регистрация =====================
const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

function setActiveTab(type) {
    const isLogin = type === 'login';
    tabLogin?.classList.toggle('active', isLogin);
    tabRegister?.classList.toggle('active', !isLogin);
    loginForm?.classList.toggle('active', isLogin);
    registerForm?.classList.toggle('active', !isLogin);
}

tabLogin?.addEventListener('click', () => setActiveTab('login'));
tabRegister?.addEventListener('click', () => setActiveTab('register'));

// ===================== Регистрация =====================
function validateEmailOrPhone(v) {
    if (!v) return false;

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^\+?\d[\d\s\-()]{6,}$/;

    return emailRe.test(v) || phoneRe.test(v);
}

registerForm?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPassword').value.trim();

    if (!validateEmailOrPhone(email)) return alert('Введите корректный email или телефон');
    if (pass.length < 6) return alert('Пароль должен быть не короче 6 символов');

    localStorage.setItem('ap_registered', 'true');
    localStorage.setItem('ap_discount20', 'true');
    localStorage.removeItem('ap_discount20_dismissed');

    // Бонус за регистрацию
    const bonuses = JSON.parse(localStorage.getItem('bonuses') || '{"balance":0,"history":[]}');
    bonuses.balance += 500;
    bonuses.history.unshift({
        date: new Date().toLocaleDateString('ru-RU'),
        desc: 'Бонус за регистрацию',
        amount: 500
    });
    localStorage.setItem('bonuses', JSON.stringify(bonuses));

    closeAuth();
    updateDiscountBanner();
    alert('Аккаунт создан! Вам начислено +500 бонусов 🎁');
});

// ===================== Вход =====================
loginForm?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value.trim();

    if (!validateEmailOrPhone(email) || pass.length < 6)
        return alert('Введите корректные данные для входа');

    closeAuth();
});

// ===================== Корзина =====================
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cartCount) cartCount.textContent = cart.length;
}
updateCartCount();

// ===================== ТОВАРЫ (с версионированием) =====================

const PRODUCTS_VERSION = 2; // 🚀 меняешь цифру — у всех обновляются товары автоматически

const DEFAULT_PRODUCTS = [
    { id: 1, name: 'Семейные улыбки', category: 'family', size: 'm', price: 4990, image: 'assets/img/p1.jpg' },
    { id: 2, name: 'Горная ромашка', category: 'holiday', size: 's', price: 1990, image: 'assets/img/p2.jpg' },
    { id: 3, name: 'Геймер', category: 'funny', size: 'l', price: 2399, image: 'assets/img/p3.jpg' },
    { id: 4, name: 'Just be cool', category: 'funny', size: 'xl', price: 1399, image: 'assets/img/p4.jpg' },

    // 🔥 Три новых товара
    {
        id: 101,
        name: "Футболка с принтом (tshort1)",
        category: "family",
        size: "m",
        price: 1999,
        image: "assets/img/products/tshort1.jpg"
    },
    {
        id: 102,
        name: "Футболка праздничная (tshort2)",
        category: "holiday",
        size: "m",
        price: 1999,
        image: "assets/img/products/tshort2.jpg"
    },
    {
        id: 103,
        name: "Футболка — Ваш принт (tshort3)",
        category: "funny",
        size: "m",
        price: 1999,
        image: "assets/img/products/tshort3.jpg"
    }
];

// Версионирование
function loadProducts() {
    const savedVersion = Number(localStorage.getItem("ap_products_version"));
    const savedProducts = localStorage.getItem("ap_products");

    if (!savedProducts || savedVersion !== PRODUCTS_VERSION) {
        localStorage.setItem("ap_products", JSON.stringify(DEFAULT_PRODUCTS));
        localStorage.setItem("ap_products_version", PRODUCTS_VERSION);
        return [...DEFAULT_PRODUCTS];
    }

    try {
        return JSON.parse(savedProducts);
    } catch {
        localStorage.setItem("ap_products", JSON.stringify(DEFAULT_PRODUCTS));
        return [...DEFAULT_PRODUCTS];
    }
}

function saveProducts(list) {
    localStorage.setItem("ap_products", JSON.stringify(list));
}

const getProducts = () => loadProducts();

// ===================== Каталог =====================
const productList = document.getElementById('productList');
const filterCategory = document.getElementById('filterCategory');
const filterSize = document.getElementById('filterSize');
const sortOrder = document.getElementById('sortOrder');

let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function renderProducts(items) {
    if (!productList) return;

    productList.innerHTML = items.map(p => {
        return `
            <div class="product">
                <img src="${p.image}" alt="${p.name}">
                <div class="p-title">${p.name}</div>
                <div class="p-price">${p.price.toLocaleString()} ₸</div>
                <button class="btn btn-green addCart" data-id="${p.id}">В корзину</button>
            </div>
        `;
    }).join('');

    document.querySelectorAll('.addCart').forEach(btn => {
        btn.addEventListener('click', () => addToCart(btn.dataset.id));
    });
}

function applyFilters() {
    let products = [...getProducts()];

    const cat = filterCategory?.value;
    const size = filterSize?.value;
    const sort = sortOrder?.value;

    if (cat && cat !== 'all') products = products.filter(p => p.category === cat);
    if (size && size !== 'all') products = products.filter(p => p.size === size);

    if (sort === 'priceAsc') products.sort((a, b) => a.price - b.price);
    else if (sort === 'priceDesc') products.sort((a, b) => b.price - a.price);

    renderProducts(products);
}

filterCategory?.addEventListener('change', applyFilters);
filterSize?.addEventListener('change', applyFilters);
sortOrder?.addEventListener('change', applyFilters);

if (productList) renderProducts(getProducts());

// ===================== Добавление в корзину =====================
function addToCart(id) {
    const products = getProducts();
    const product = products.find(p => p.id == id);
    if (!product) return;

    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartCount();
    alert(`Товар “${product.name}” добавлен в корзину`);
}

// ===================== Оформление заказа =====================
function completeOrder(total, name, contact, items) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const id = orders.length + 1;

    orders.push({
        id,
        name,
        contact,
        items,
        total,
        date: new Date().toLocaleDateString('ru-RU'),
        status: 'В обработке',
        bonus: Math.round(total * 0.05)
    });

    localStorage.setItem('orders', JSON.stringify(orders));

    const bonuses = JSON.parse(localStorage.getItem('bonuses') || '{"balance":0,"history":[]}');
    const amount = Math.round(total * 0.05);

    bonuses.balance += amount;
    bonuses.history.unshift({
        date: new Date().toLocaleDateString('ru-RU'),
        desc: 'Бонус за заказ',
        amount
    });

    localStorage.setItem('bonuses', JSON.stringify(bonuses));

    localStorage.removeItem('cart');
    updateCartCount();
}

// ===================== Реферальная система =====================
function handleReferral() {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');

    if (!ref || localStorage.getItem('ref_used')) return;

    localStorage.setItem('ref_used', 'true');

    const bonuses = JSON.parse(localStorage.getItem('bonuses') || '{"balance":0,"history":[]}');
    bonuses.balance += 300;

    bonuses.history.unshift({
        date: new Date().toLocaleDateString('ru-RU'),
        desc: `Бонус за реферала (${ref})`,
        amount: 300
    });

    localStorage.setItem('bonuses', JSON.stringify(bonuses));
}
handleReferral();

// ===================== АДМИН - ТОВАРЫ =====================
let currentImageBase64 = null;

document.getElementById('p_image')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) {
        currentImageBase64 = null;
        return;
    }

    const reader = new FileReader();
    reader.onload = ev => {
        currentImageBase64 = ev.target.result;
    };
    reader.readAsDataURL(file);
});

// Сохранение товара
document.getElementById('btnSaveProduct')?.addEventListener('click', () => {
    const id = document.getElementById('p_id').value;
    const name = document.getElementById('p_name').value.trim();
    const price = Number(document.getElementById('p_price').value);
    const category = document.getElementById('p_category').value;
    const size = document.getElementById('p_size').value;
    const description = document.getElementById('p_description').value.trim();

    if (!name || !price) return alert('Введите название и цену');

    let list = getProducts();

    if (id) {
        const idx = list.findIndex(p => p.id == id);
        if (idx !== -1) {
            list[idx].name = name;
            list[idx].price = price;
            list[idx].category = category;
            list[idx].size = size;
            list[idx].description = description;
            if (currentImageBase64) list[idx].image = currentImageBase64;
        }
    } else {
        const newId = list.length ? Math.max(...list.map(p => p.id)) + 1 : 1;

        list.push({
            id: newId,
            name,
            price,
            category,
            size,
            description,
            image: currentImageBase64 || 'assets/img/no-photo.png'
        });
    }

    saveProducts(list);
    alert('Товар сохранён!');
    resetProductForm();
    renderProductsAdmin();
    applyFilters();
});

function resetProductForm() {
    document.getElementById('p_id').value = '';
    document.getElementById('p_name').value = '';
    document.getElementById('p_price').value = '';
    document.getElementById('p_category').value = 'family';
    document.getElementById('p_size').value = 'm';
    document.getElementById('p_description').value = '';
    document.getElementById('p_image').value = '';
    currentImageBase64 = null;
}

// Отрисовка товаров в админке
function renderProductsAdmin() {
    const tbody = document.getElementById('productsBody');
    if (!tbody) return;

    const list = getProducts();

    if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="7">Товаров нет</td></tr>';
        return;
    }

    tbody.innerHTML = list.map(p => `
        <tr>
            <td>${p.id}</td>
            <td><img src="${p.image}" class="product-thumb"></td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${p.size}</td>
            <td>${p.price.toLocaleString()} ₸</td>
            <td>
                <button class="btn-edit" onclick="editProduct(${p.id})">Изменить</button>
                <button class="btn-delete" onclick="deleteProduct(${p.id})">Удалить</button>
            </td>
        </tr>
    `).join('');
}

renderProductsAdmin();

function editProduct(id) {
    const list = getProducts();
    const p = list.find(x => x.id == id);
    if (!p) return;

    document.getElementById('p_id').value = p.id;
    document.getElementById('p_name').value = p.name;
    document.getElementById('p_price').value = p.price;
    document.getElementById('p_category').value = p.category;
    document.getElementById('p_size').value = p.size;
    document.getElementById('p_description').value = p.description || '';

    currentImageBase64 = null;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteProduct(id) {
    if (!confirm('Удалить товар?')) return;

    let list = getProducts();
    list = list.filter(p => p.id != id);
    saveProducts(list);

    renderProductsAdmin();
    applyFilters();
}

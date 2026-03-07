const cart = [];
let totalPrice = 0;
let allProducts = [];

const heroSlides = [
    {
        videos: ['shop1.mp4', 'shop2.mp4'],
        title: 'Next-Gen Tech,<br>Today\'s Prices.',
        subtitle: 'Phones, laptops, accessories and more — all in one place.',
        btn: 'Shop Now'
    },
    {
        videos: ['food1.mp4', 'food2.mp4'],
        title: 'Fresh Food,<br>Delivered Fast.',
        subtitle: 'Groceries, meals, and snacks delivered straight to your door.',
        btn: 'Order Now'
    },
    {
        videos: ['clothes1.mp4', 'clothes2.mp4'],
        title: 'Style That<br>Speaks Volumes.',
        subtitle: 'Trending fashion, shoes, and accessories at unbeatable prices.',
        btn: 'Browse Fashion'
    }
];

let currentSlide = 0;
let currentVideo = 0;
let heroInterval = null;
let videoSwapInterval = null;

function init() {
    loadProducts();
    setupDrawer();
    setupCartDrawer();
    updateCartCount();
    setupDemoNotice();
    setupDeadLinks();
    trimNavbar();
    setupHeroCarousel();
}

function setupDrawer() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const drawer = document.getElementById('drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerClose = document.getElementById('drawer-close');

    if (hamburgerBtn && drawer && drawerOverlay) {
        hamburgerBtn.addEventListener('click', () => {
            drawer.classList.add('open');
            drawerOverlay.classList.add('active');
        });
    }

    function closeDrawer() {
        if (drawer && drawerOverlay) {
            drawer.classList.remove('open');
            drawerOverlay.classList.remove('active');
        }
    }

    if (drawerClose) {
        drawerClose.addEventListener('click', closeDrawer);
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeDrawer);
    }
}

function setupCartDrawer() {
    const cartBtn = document.getElementById('cart-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartClose = document.getElementById('cart-drawer-close');

    if (cartBtn && cartDrawer && cartOverlay) {
        cartBtn.addEventListener('click', () => {
            cartDrawer.classList.add('open');
            cartOverlay.classList.add('active');
        });
    }

    function closeCartDrawer() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.remove('open');
            cartOverlay.classList.remove('active');
        }
    }

    if (cartClose) {
        cartClose.addEventListener('click', closeCartDrawer);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartDrawer);
    }
}

function loadProducts() {
    fetch('src/data/products.json')
        .then(response => response.json())
        .then(products => {
            allProducts = products;
            displayProducts(products);
        })
        .catch(error => console.error('Error loading products:', error));
}

function displayProducts(products) {
    const productContainer = document.getElementById('product-list');
    if (!productContainer) return;

    productContainer.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            ${product.image
                ? `<img class="product-image" src="${product.image}" alt="${product.name}">`
                : `<div class="product-emoji">${product.emoji}</div>`
            }
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button data-id="${product.id}">Add to Cart</button>
        `;

        const btn = productElement.querySelector('button');
        btn.addEventListener('click', () => addToCart(product.id));

        productContainer.appendChild(productElement);
    });
}

function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    totalPrice += product.price;
    updateCartCount();
    renderCartDrawer();
    showAddedFeedback(productId);
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index === -1) return;

    totalPrice -= cart[index].price * cart[index].qty;
    cart.splice(index, 1);

    updateCartCount();
    renderCartDrawer();
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const total = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCount.textContent = total;
    }
}

function renderCartDrawer() {
    const itemsContainer = document.getElementById('cart-drawer-items');
    const totalEl = document.getElementById('cart-total-price');
    const emptyMsg = document.getElementById('cart-empty-msg');
    const checkoutBtn = document.getElementById('cart-checkout-btn');

    if (!itemsContainer) return;

    itemsContainer.innerHTML = '';

    if (cart.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'block';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        if (totalEl) totalEl.textContent = '$0.00';
        return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';
    if (checkoutBtn) checkoutBtn.style.display = 'block';

    cart.forEach(item => {
        const el = document.createElement('div');
        el.classList.add('cart-drawer-item');
        el.innerHTML = `
            ${item.image
                ? `<img class="cart-item-image" src="${item.image}" alt="${item.name}">`
                : `<span class="cart-item-emoji">${item.emoji}</span>`
            }
            <div class="cart-item-details">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                <span class="cart-item-qty">Qty: ${item.qty}</span>
            </div>
            <button class="cart-item-remove">Remove</button>
        `;

        el.querySelector('.cart-item-remove').addEventListener('click', () => {
            removeFromCart(item.id);
        });

        itemsContainer.appendChild(el);
    });

    if (totalEl) {
        totalEl.textContent = '$' + totalPrice.toFixed(2);
    }
}

function showAddedFeedback(productId) {
    const btn = document.querySelector(`button[data-id="${productId}"]`);
    if (btn) {
        const original = btn.textContent;
        btn.textContent = '✓ Added!';
        btn.style.backgroundColor = '#2e7d32';
        setTimeout(() => {
            btn.textContent = original;
            btn.style.backgroundColor = '';
        }, 1200);
    }
}

function setupHeroCarousel() {
    const video = document.getElementById('hero-video');
    const title = document.getElementById('hero-title');
    const subtitle = document.getElementById('hero-subtitle');
    const btn = document.getElementById('hero-btn');
    const content = document.getElementById('hero-content');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    const dots = document.querySelectorAll('.hero-dot');

    if (!video || !title || !subtitle) return;

    currentVideo = 0;

    function swapVideo(src) {
        video.style.opacity = '0';
        setTimeout(() => {
            video.src = src;
            video.load();
            video.addEventListener('loadeddata', function onLoaded() {
                video.removeEventListener('loadeddata', onLoaded);
                video.play().catch(() => {});
                video.style.opacity = '1';
            });
        }, 300);
    }

    function startVideoSwap() {
        clearInterval(videoSwapInterval);

        videoSwapInterval = setInterval(() => {
            const slide = heroSlides[currentSlide];
            currentVideo = (currentVideo + 1) % slide.videos.length;
            swapVideo(slide.videos[currentVideo]);
        }, 4500);
    }

    function goToSlide(index, direction) {
        clearInterval(videoSwapInterval);

        if (!direction) {
            direction = index > currentSlide ? 'right' : 'left';
        }

        currentSlide = (index + heroSlides.length) % heroSlides.length;
        currentVideo = 0;
        const slide = heroSlides[currentSlide];

        content.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        content.style.opacity = '0';
        content.style.transform = direction === 'right' ? 'translateX(-300px)' : 'translateX(300px)';

        swapVideo(slide.videos[0]);

        setTimeout(() => {
            title.innerHTML = slide.title;
            subtitle.textContent = slide.subtitle;
            if (btn) btn.textContent = slide.btn;

            content.style.transition = 'none';
            content.style.transform = direction === 'right' ? 'translateX(600px)' : 'translateX(-600px)';
            void content.offsetHeight;

            content.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            content.style.opacity = '1';
            content.style.transform = 'translateX(0)';

            setTimeout(() => {
                content.style.opacity = '';
                content.style.transform = '';
                content.style.transition = '';
            }, 550);
        }, 300);

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });

        setTimeout(() => {
            startVideoSwap();
        }, 900);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1, 'left');
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1, 'right');
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goToSlide(i);
        });
    });

    startVideoSwap();
}

function setupDemoNotice() {
    const notice = document.getElementById('demo-notice');
    const closeBtn = document.getElementById('demo-notice-close');

    if (!notice) return;

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            dismissNotice(notice);
        });
    }
}

function dismissNotice(notice) {
    notice.classList.remove('visible');
    setTimeout(() => {
        notice.style.display = 'none';
    }, 1000);
}

function showDemoNotice() {
    const notice = document.getElementById('demo-notice');
    if (!notice) return;

    notice.style.display = '';
    notice.classList.add('visible');

    clearTimeout(notice._timeout);
    notice._timeout = setTimeout(() => {
        dismissNotice(notice);
    }, 4300);
}

function setupDeadLinks() {
    const deadLinks = document.querySelectorAll('a[href="#"]');
    deadLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showDemoNotice();
        });
    });

    const drawerLinks = document.querySelectorAll('.drawer-section a');
    drawerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showDemoNotice();
        });
    });

    const topLinks = document.querySelectorAll('.top-link, .lang-link');
    topLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showDemoNotice();
        });
    });

    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showDemoNotice();
        });
    }

    const heroBtn = document.getElementById('hero-btn');
    if (heroBtn) {
        heroBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showDemoNotice();
        });
    }
}

function trimNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    function hideOverflow() {
        const items = navbar.querySelectorAll('.nav-dropdown, #navbar > a');
        const navRight = navbar.getBoundingClientRect().right;

        items.forEach(item => {
            item.style.display = '';
        });

        items.forEach(item => {
            const itemRight = item.getBoundingClientRect().right;
            if (itemRight > navRight) {
                item.style.display = 'none';
            }
        });
    }

    hideOverflow();
    window.addEventListener('resize', hideOverflow);
}

window.onload = init;
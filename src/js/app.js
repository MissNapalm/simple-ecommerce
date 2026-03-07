const cart = [];
let totalPrice = 0;

function init() {
    loadProducts();
    setupDrawer();
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

function loadProducts() {
    fetch('src/data/products.json')
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
        })
        .catch(error => console.error('Error loading products:', error));
}

function displayProducts(products) {
    const productContainer = document.getElementById('product-list');
    if (!productContainer) return;
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
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productContainer.appendChild(productElement);
    });
}

function addToCart(productId) {
    fetch('src/data/products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                cart.push(product);
                totalPrice += product.price;
                alert(`${product.name} added to cart!`);
            }
        })
        .catch(error => console.error('Error adding to cart:', error));
}

window.onload = init;
const cart = [];
let totalPrice = 0;

function init() {
    loadProducts();
    setupEventListeners();
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
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <div class="product-emoji">${product.emoji}</div>
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

function setupEventListeners() {
    document.getElementById('view-cart').addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
}

window.onload = init;
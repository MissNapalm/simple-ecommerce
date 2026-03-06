const productsData = require('../data/products.json');

function getProducts() {
    return productsData;
}

function displayProducts() {
    const products = getProducts();
    const productContainer = document.getElementById('product-list');

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');

        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>Price: $${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;

        productContainer.appendChild(productElement);
    });
}

export { getProducts, displayProducts };
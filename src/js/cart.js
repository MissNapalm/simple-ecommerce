const cart = [];

function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
}

function removeFromCart(productId) {
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex > -1) {
        cart.splice(productIndex, 1);
    }
}

function calculateTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function getCartItems() {
    return cart;
}

export { addToCart, removeFromCart, calculateTotal, getCartItems };
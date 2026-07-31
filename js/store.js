// store.js - Cart state, UI logic, and PayPal Integration

const CART_KEY = 'hope_beckett_cart';
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

const cartBtn = document.getElementById('open-cart');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartBadge = document.querySelector('.cart-badge');
const cartItemsContainer = document.getElementById('cart-items-container');
const subtotalEl = document.getElementById('cart-subtotal');
const checkoutBtn = document.getElementById('checkout-btn');
const paypalContainer = document.getElementById('paypal-button-container');

// Init
updateCartUI();

// Event Listeners
if(cartBtn) cartBtn.addEventListener('click', toggleCart);
if(closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
if(cartOverlay) cartOverlay.addEventListener('click', toggleCart);

document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        const title = btn.getAttribute('data-title');
        const price = parseFloat(btn.getAttribute('data-price'));
        const img = btn.getAttribute('data-img');
        
        addToCart({ id, title, price, img, quantity: 1 });
        showToast(`Added ${title} to cart`);
        toggleCart(true); 
    });
});

if(checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if(cart.length === 0) {
            showToast('Your cart is empty', 'error');
            return;
        }
        
        // Hide default checkout button and show PayPal buttons
        checkoutBtn.style.display = 'none';
        paypalContainer.style.display = 'block';
        
        // Render PayPal Buttons if they haven't been rendered yet
        if(paypalContainer.children.length === 0) {
            renderPayPalButtons();
        }
    });
}

function renderPayPalButtons() {
    if(window.paypal) {
        window.paypal.Buttons({
            createOrder: function(data, actions) {
                // Calculate dynamic total
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: total.toFixed(2)
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    showToast('Transaction completed by ' + details.payer.name.given_name);
                    cart = [];
                    saveCart();
                    updateCartUI();
                    
                    // Reset UI
                    checkoutBtn.style.display = 'block';
                    paypalContainer.style.display = 'none';
                    setTimeout(() => toggleCart(false), 2000);
                });
            },
            onError: function(err) {
                console.error(err);
                showToast('An error occurred during checkout.', 'error');
            }
        }).render('#paypal-button-container');
    }
}

// Functions
function toggleCart(forceOpen = false) {
    if(forceOpen === true) {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('open');
    } else {
        cartDrawer.classList.toggle('open');
        cartOverlay.classList.toggle('open');
    }
    
    // Reset Checkout button state on close
    if(checkoutBtn && paypalContainer) {
        checkoutBtn.style.display = 'block';
        paypalContainer.style.display = 'none';
    }
}

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if(existing) {
        existing.quantity += 1;
    } else {
        cart.push(product);
    }
    saveCart();
    updateCartUI();
}

// Ensure updateQuantity is in global scope for inline onclicks in innerHTML
window.updateQuantity = function(id, delta) {
    const item = cart.find(item => item.id == id);
    if(item) {
        item.quantity += delta;
        if(item.quantity <= 0) {
            cart = cart.filter(i => i.id != id);
        }
        saveCart();
        updateCartUI();
    }
}

window.removeItem = function(id) {
    cart = cart.filter(item => item.id != id);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartUI() {
    if(!cartBadge || !cartItemsContainer || !subtotalEl) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;

    if(cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center" style="color: var(--c-text-secondary); margin-top: 2rem;">Your cart is empty.</p>';
        subtotalEl.textContent = '$0.00';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-title" style="font-size: 0.9rem;">${item.title}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-qty-ctrl">
                    <button class="qty-btn" onclick="window.updateQuantity('${item.id}', -1)">-</button>
                    <input type="text" class="qty-input" value="${item.quantity}" readonly>
                    <button class="qty-btn" onclick="window.updateQuantity('${item.id}', 1)">+</button>
                </div>
                <button class="remove-item" onclick="window.removeItem('${item.id}')">Remove</button>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if(!toast) return;
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

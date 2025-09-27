// cart.js - Updated version

document.addEventListener("DOMContentLoaded", function () {
    loadCartItems();
    setupCheckoutModal();
});

function loadCartItems() {
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    const tbody = document.querySelector("tbody");
    
    // Clear existing rows
    tbody.innerHTML = "";
    
    if (cart.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-shopping-cart" style="font-size: 48px; margin-bottom: 20px; display: block;"></i>
                    <h3>Your cart is empty</h3>
                    <p>Start shopping to add items to your cart</p>
                    <a href="./home.html" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #19183B; color: white; text-decoration: none; border-radius: 5px;">Go Shopping</a>
                </td>
            </tr>
        `;
        updateCartSummary();
        return;
    }
    
    // Display each item in cart
    cart.forEach(item => {
        displayCartItem(item);
    });
    
    updateCartSummary();
}

function displayCartItem(item) {
    const tbody = document.querySelector("tbody");
    
    const row = document.createElement("tr");
    
    row.innerHTML = `
        <td>${item.name}</td>
        <td><img src="${item.image_url}" width="80" alt="${item.name}"></td>
        <td>${item.price} EGP</td>
        <td>
            <button class="qty-btn minus" onclick="decreaseQuantity('${item.id}')">-</button>
            <input type="number" value="${item.quantity}" min="1" class="quantity-input" id="qty-${item.id}">
            <button class="qty-btn plus" onclick="increaseQuantity('${item.id}')">+</button>
        </td>
        <td class="subtotal">${(item.price * item.quantity).toFixed(2)} EGP</td>
        <td><button class="remove-btn" onclick="removeItem('${item.id}')"><i class="fas fa-trash"></i></button></td>
    `;
    
    tbody.appendChild(row);
    
    // Add event listener for direct input changes
    const qtyInput = row.querySelector(".quantity-input");
    qtyInput.addEventListener("change", function () {
        let quantity = parseInt(qtyInput.value, 10) || 1;
        
        // Ensure minimum quantity is 1
        if (quantity < 1) {
            quantity = 1;
            qtyInput.value = 1;
        }
        
        // Ensure maximum quantity is reasonable
        if (quantity > 100) {
            quantity = 100;
            qtyInput.value = 100;
        }
        
        updateItemQuantity(item.id, quantity);
    });
}

function updateItemQuantity(productId, quantity) {
    let cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = quantity;
        localStorage.setItem("shoppingCart", JSON.stringify(cart));
        
        // Update display
        const subtotalCell = document.querySelector(`#qty-${productId}`).closest("tr").querySelector(".subtotal");
        subtotalCell.textContent = `${(item.price * quantity).toFixed(2)} EGP`;
        
        updateCartSummary();
        updateCartCount(); // Update navbar count
    }
}

function increaseQuantity(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    let quantity = parseInt(qtyInput.value, 10) || 1;
    
    if (quantity < 100) {
        quantity++;
        qtyInput.value = quantity;
        updateItemQuantity(productId, quantity);
    }
}

function decreaseQuantity(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    let quantity = parseInt(qtyInput.value, 10) || 1;
    
    if (quantity > 1) {
        quantity--;
        qtyInput.value = quantity;
        updateItemQuantity(productId, quantity);
    }
}

function removeItem(productId) {
    let cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    
    // Reload cart items
    loadCartItems();
    updateCartCount(); // Update navbar count
    
    // Show notification
    if (typeof showNotification === 'function') {
        showNotification('Item removed from cart');
    }
}

function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    
    let subtotal = 0;
    let totalDiscount = 0;
    
    // Calculate subtotal and total discount
    cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;
        
        // Calculate discount if there's an original price higher than current price
        if (item.originalPrice && item.originalPrice > item.price) {
            const itemDiscount = (item.originalPrice - item.price) * item.quantity;
            totalDiscount += itemDiscount;
        }
    });
    
    // Apply additional discount if subtotal >= 500
    const additionalDiscount = subtotal >= 500 ? 50 : 0;
    totalDiscount += additionalDiscount;
    
    const total = subtotal - totalDiscount;
    
    // Update summary display
    document.getElementById("subtotal").textContent = subtotal.toFixed(2) + " EGP";
    
    if (totalDiscount > 0) {
        document.getElementById("discount").textContent = "-" + totalDiscount.toFixed(2) + " EGP";
        document.getElementById("discount").style.color = "green";
        
        // Show discount breakdown if needed
        if (additionalDiscount > 0) {
            document.getElementById("discount").title = `Includes ${additionalDiscount} EGP special discount`;
        }
    } else {
        document.getElementById("discount").textContent = "0 EGP";
        document.getElementById("discount").style.color = "";
    }
    
    document.getElementById("total").textContent = total.toFixed(2) + " EGP";
    
    // Update checkout button state
    const checkoutBtn = document.querySelector(".checkout-btn");
    if (cart.length === 0) {
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = "Cart is Empty";
        checkoutBtn.style.background = "#ccc";
        checkoutBtn.style.cursor = "not-allowed";
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = "Proceed to Checkout";
        checkoutBtn.style.background = "";
        checkoutBtn.style.cursor = "pointer";
    }
}

function setupCheckoutModal() {
    const checkoutBtn = document.querySelector(".checkout-btn");
    const modal = document.getElementById("success-modal");
    const okBtn = document.getElementById("ok-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    
    checkoutBtn.addEventListener("click", function () {
        const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
        
        if (cart.length === 0) {
            if (typeof showNotification === 'function') {
                showNotification("Your cart is empty!");
            } else {
                alert("Your cart is empty!");
            }
            return;
        }
        
        modal.style.display = "flex";
    });
    
    okBtn.addEventListener("click", function () {
        // Clear the cart
        localStorage.removeItem("shoppingCart");
        
        // Update navbar count
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }
        
        // Show success message
        if (typeof showNotification === 'function') {
            showNotification("Order placed successfully! Thank you for shopping with us.");
        }
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = "home.html";
        }, 1000);
    });
    
    cancelBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });
    
    // Close modal when clicking outside
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}

// Update cart count in navbar (if function exists in main.js)
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartElement = document.querySelector(".cart-item");
    if (cartElement) {
        cartElement.textContent = totalItems;
    }
}

// Fallback notification function if not available in main.js
if (typeof showNotification === 'undefined') {
    window.showNotification = function(message) {
        // Create simple notification
        const notification = document.createElement("div");
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: #19183B;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            font-weight: bold;
            transition: all 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 3000);
    };
}

// Make functions available globally
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.removeItem = removeItem;
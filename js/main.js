// Global variables
let currentUser = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing main.js...');
    
    // Initialize all components
    initializeDarkMode();
    loadUserData();
    updateUserName();
    updateCartCount();
    setupEventListeners();
    
    // Check if we're on product page and initialize accordingly
    if (window.location.pathname.includes('product.html')) {
        initializeProductPage();
    }
    
    console.log('main.js initialization complete');
});

// Initialize dark mode functionality
function initializeDarkMode() {
    const darkModeToggle = document.querySelector('.barkmode');
    
    if (!darkModeToggle) {
        console.log('Dark mode toggle not found');
        return;
    }
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        darkModeToggle.title = 'Switch to Light Mode';
    } else {
        document.body.classList.remove('dark');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        darkModeToggle.title = 'Switch to Dark Mode';
    }
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark');
        
        if (document.body.classList.contains('dark')) {
            localStorage.setItem('darkMode', 'enabled');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            darkModeToggle.title = 'Switch to Light Mode';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            darkModeToggle.title = 'Switch to Dark Mode';
        }
    });
    
    console.log('Dark mode initialized');
}

// Setup event listeners
function setupEventListeners() {
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        const userCheckbox = document.getElementById('user');
        const cartCheckbox = document.getElementById('cart');
        const settCheckbox = document.getElementById('sett');
        
        if (userCheckbox && !event.target.closest('.user')) {
            userCheckbox.checked = false;
        }
        
        if (cartCheckbox && !event.target.closest('.cart')) {
            cartCheckbox.checked = false;
        }
        
        if (settCheckbox && !event.target.closest('.setting')) {
            settCheckbox.checked = false;
        }
    });
    
    // Update cart list when cart is opened
    const cartCheckbox = document.getElementById('cart');
    if (cartCheckbox) {
        cartCheckbox.addEventListener('click', function() {
            if (this.checked) {
                updateCartList();
            }
        });
    }
    
    // Add scroll event listener for scroll-to-top button (if exists)
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', toggleScrollToTopButton);
        scrollToTopBtn.addEventListener('click', scrollToTop);
    }
}

// Load user data from localStorage
function loadUserData() {
    const userData = localStorage.getItem('users');
    const btnlogout = document.getElementById("logout");

    if (userData) {
        try {
            const parsedData = JSON.parse(userData);

            // If data is an array
            if (Array.isArray(parsedData) && parsedData.length > 0) {
                currentUser = parsedData[0];
            } 
            // If data is a single object
            else if (typeof parsedData === "object") {
                currentUser = parsedData;
            }

            // Update name in navbar
            if (currentUser) {
                const userNameElement = document.getElementById("user-name");
                if (userNameElement) {
                    userNameElement.textContent = currentUser.username || currentUser.fullname || "User";
                }
                if (btnlogout) btnlogout.textContent = "Logout";
            }
        } catch (err) {
            console.error("Error parsing user data:", err);
            setGuest();
        }
    } else {
        setGuest();
    }
}

// Fallback function if no user is found
function setGuest() {
    currentUser = { name: "Guest" };
    const userNameElement = document.getElementById("user-name");
    if (userNameElement) {
        userNameElement.textContent = "Guest";
    }
    const btnlogout = document.getElementById("logout");
    if (btnlogout) btnlogout.textContent = "Login";
}

// Update user name in navbar
function updateUserName() {
    const userNameElement = document.getElementById("user-name");
    if (userNameElement && currentUser) {
        userNameElement.textContent = currentUser.username || currentUser.fullname || currentUser.name || "User";
    }
}

// Update cart count in navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartElement = document.querySelector(".cart-item");
    if (cartElement) {
        cartElement.textContent = totalItems;
    }
}

// Update cart list display
function updateCartList() {
    const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    const cartList = document.querySelector(".cart-list ul");
    
    if (!cartList) return;
    
    // Clear existing items
    cartList.innerHTML = "";
    
    if (cart.length === 0) {
        cartList.innerHTML = '<li style="text-align: center; color: #666; padding: 10px;">Your cart is empty</li>';
        return;
    }
    
    // Add cart items
    cart.forEach(item => {
        const cartItem = document.createElement("li");
        cartItem.className = "cart-item-details";
        cartItem.innerHTML = `
            <img src="${item.image_url}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price} L.E × ${item.quantity}</div>
                <div class="cart-quantity-controls">
                    <button class="cart-quantity-btn" onclick="decreaseCartQuantity('${item.id}')">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="cart-quantity-input" readonly>
                    <button class="cart-quantity-btn" onclick="increaseCartQuantity('${item.id}')">+</button>
                    <button class="cart-remove-btn" onclick="removeFromCart('${item.id}')">×</button>
                </div>
            </div>
        `;
        cartList.appendChild(cartItem);
    });
    
    // Add total and checkout button
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItem = document.createElement("li");
    totalItem.innerHTML = `
        <div style="text-align: center; padding: 10px;">
            <div style="font-weight: bold; margin-bottom: 10px; color: #fff;">Total: ${total.toFixed(2)} L.E</div>
            <a href="./cart.html" style="background: #19183B; color: white; padding: 8px 15px; border-radius: 20px; text-decoration: none; font-size: 14px; display: inline-block;">Checkout</a>
        </div>
    `;
    cartList.appendChild(totalItem);
}

// Increase quantity in cart
function increaseCartQuantity(productId) {
    let cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += 1;
        localStorage.setItem("shoppingCart", JSON.stringify(cart));
        updateCartCount();
        updateCartList();
    }
}

// Decrease quantity in cart
function decreaseCartQuantity(productId) {
    let cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
            localStorage.setItem("shoppingCart", JSON.stringify(cart));
            updateCartCount();
            updateCartList();
        } else {
            removeFromCart(productId);
        }
    }
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    
    updateCartCount();
    updateCartList();
    showNotification("Item removed from cart");
}

// Show notification
function showNotification(message) {
    // Create notification element
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
        transform: translateX(100%);
    `;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = "translateX(0)";
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = "translateX(100%)";
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Toggle scroll to top button visibility
function toggleScrollToTopButton() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Logout function
function logout() {
    // Clear all localStorage data except dark mode preference
    const darkModePreference = localStorage.getItem('darkMode');
    localStorage.clear();
    
    // Restore dark mode preference
    if (darkModePreference) {
        localStorage.setItem('darkMode', darkModePreference);
    }
    
    // Reset user to guest
    currentUser = { name: "Guest" };
    updateUserName();
    
    // Close user dropdown
    const userCheckbox = document.getElementById("user");
    if (userCheckbox) {
        userCheckbox.checked = false;
    }
    
    showNotification("Logged out successfully - Redirecting to login...");
    
    // Update cart to reflect it's empty
    updateCartCount();
    updateCartList();
    
    // Redirect to login page after a short delay
    setTimeout(() => {
        window.location.href = "./Loginpage/Login.html";
    }, 1500);
}

// Initialize product page specific functionality
function initializeProductPage() {
    console.log('Initializing product page functionality...');
    // This function is called only on product.html
    // The actual product page logic remains in product.js
}

// Export functions for global access
window.increaseCartQuantity = increaseCartQuantity;
window.decreaseCartQuantity = decreaseCartQuantity;
window.removeFromCart = removeFromCart;
window.logout = logout;
window.updateCartCount = updateCartCount;
window.updateCartList = updateCartList;
window.showNotification = showNotification;
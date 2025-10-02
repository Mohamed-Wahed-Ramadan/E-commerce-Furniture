
let currentUser = null;


document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing main.js...');
    

    initializeDarkMode();
    loadUserData();
    updateUserName();
    updateCartCount();
    setupEventListeners();
    

    if (window.location.pathname.includes('product.html')) {
        initializeProductPage();
    }
    
    console.log('main.js initialization complete');
});


function initializeDarkMode() {
    const darkModeToggle = document.querySelector('.barkmode');
    
    if (!darkModeToggle) {
        console.log('Dark mode toggle not found');
        return;
    }
    

    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        darkModeToggle.title = 'Switch to Light Mode';
    } else {
        document.body.classList.remove('dark');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        darkModeToggle.title = 'Switch to Dark Mode';
    }
    

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


function setupEventListeners() {

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
    

    const cartCheckbox = document.getElementById('cart');
    if (cartCheckbox) {
        cartCheckbox.addEventListener('click', function() {
            if (this.checked) {
                updateCartList();
            }
        });
    }
    

    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', toggleScrollToTopButton);
        scrollToTopBtn.addEventListener('click', scrollToTop);
    }
}


function loadUserData() {
    const userData = localStorage.getItem('users');
    const btnlogout = document.getElementById("logout");

    if (userData) {
        try {
            const parsedData = JSON.parse(userData);


            if (Array.isArray(parsedData) && parsedData.length > 0) {
                currentUser = parsedData[0];
            } 

            else if (typeof parsedData === "object") {
                currentUser = parsedData;
            }


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


function setGuest() {
    currentUser = { name: "Guest" };
    const userNameElement = document.getElementById("user-name");
    if (userNameElement) {
        userNameElement.textContent = "Guest";
    }
    const btnlogout = document.getElementById("logout");
    if (btnlogout) btnlogout.textContent = "Login";
}

function updateUserName() {
    const userNameElement = document.getElementById("user-name");
    if (userNameElement && currentUser) {
        userNameElement.textContent = currentUser.username || currentUser.fullname || currentUser.name || "User";
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartElement = document.querySelector(".cart-item");
    if (cartElement) {
        cartElement.textContent = totalItems;
    }
}

function updateCartList() {
    const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    const cartList = document.querySelector(".cart-list ul");
    
    if (!cartList) return;
    
    cartList.innerHTML = "";
    
    if (cart.length === 0) {
        cartList.innerHTML = '<li style="text-align: center; color: #666; padding: 10px;">Your cart is empty</li>';
        return;
    }
    
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

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    
    updateCartCount();
    updateCartList();
    showNotification("Item removed from cart");
}

function showNotification(message) {
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
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = "translateX(0)";
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = "translateX(100%)";
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

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

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function logout() {
    if (currentUser.name === "Guest") {
        window.location.href = "./Loginpage/Login.html";
        return;
    }
    
    const darkModePreference = localStorage.getItem('darkMode');
    localStorage.clear();
    
    if (darkModePreference) {
        localStorage.setItem('darkMode', darkModePreference);
    }
    
    currentUser = { name: "Guest" };
    updateUserName();
    
    const userCheckbox = document.getElementById("user");
    if (userCheckbox) {
        userCheckbox.checked = false;
    }
    
    showNotification("Logged out successfully - Redirecting to login...");
    
    updateCartCount();
    updateCartList();
    
    setTimeout(() => {
        window.location.href = "./Loginpage/Login.html";
    }, 1500);
}
function initializeProductPage() {
    console.log('Initializing product page functionality...');

window.increaseCartQuantity = increaseCartQuantity;
window.decreaseCartQuantity = decreaseCartQuantity;
window.removeFromCart = removeFromCart;
window.logout = logout;
window.updateCartCount = updateCartCount;
window.updateCartList = updateCartList;
window.showNotification = showNotification;
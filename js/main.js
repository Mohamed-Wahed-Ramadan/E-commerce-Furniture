// Dark mode functionality
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.querySelector('.barkmode');
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark');
        
        if (document.body.classList.contains('dark')) {
            localStorage.setItem('darkMode', 'enabled');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
    
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
});

// Load user data from localStorage
function loadUserData() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
    } else {
        // Default user if not logged in
        currentUser = { name: 'Guest' };
        const btnlogout = document.getElementById("logout");
        btnlogout.innerText = "Login";
    }
}
// Update user name in navbar
function updateUserName() {
    const userNameElement = document.getElementById('user-name');
    if (userNameElement && currentUser) {
        userNameElement.textContent = currentUser.name;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    showLoadingScreen();
    
    // Load user data first
    loadUserData();
    
    setTimeout(() => {
        loadAndDisplayProducts();
        updateCartCount();
        updateCartList();
        updateUserName(); // Add this line
        
        // ... rest of the code
    }, 2000);
});

function logout() {
    // مسح كل بيانات الـ localStorage
    localStorage.clear();
    
    if(currentUser=="Guest"){
        setTimeout(() => {
        window.location.href = './login.html';
    }, 1500);
    }
    // إعادة تعيين المستخدم إلى ضيف
    currentUser = { name: 'Guest', role: 'guest' };
    updateUserName();
    
    // إغلاق dropdown المستخدم
    const userCheckbox = document.getElementById('user');
    if (userCheckbox) {
        userCheckbox.checked = false;
    }
    
    showNotification('Logged out successfully - Redirecting to login...');
    
    // تحديث السلة لتعكس أنها فارغة
    updateCartCount();
    updateCartList();
    
    // الانتقال لصفحة login بعد تأخير بسيط لرؤية الnotification
    setTimeout(() => {
        window.location.href = './login.html';
    }, 1500);
}
/////////////////////////////////////////////////

// Update cart list display
function updateCartList() {
    const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    const cartList = document.querySelector('.cart-list ul');
    
    if (!cartList) return;
    
    // Clear existing items
    cartList.innerHTML = '';
    
    if (cart.length === 0) {
        cartList.innerHTML = '<li style="text-align: center; color: #666; padding: 10px;">Your cart is empty</li>';
        return;
    }
    
    // Add cart items
    cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.className = 'cart-item-details';
        cartItem.innerHTML = `
            <img src="${item.image_url}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price} L.E × ${item.quantity}</div>
                <div class="cart-quantity-controls">
                    <button class="cart-quantity-btn" onclick="decreaseCartQuantity('${item.id}')">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="cart-quantity-input" readonly>
                    <button class="cart-quantity-btn" onclick="increaseCartQuantity('${item.id}')">+</button><pre> </pre>
                    <button class="cart-remove-btn" onclick="removeFromCart('${item.id}')">×</button>
                </div>
            </div>
        `;
        cartList.appendChild(cartItem);
    });
    
    // Add total and checkout button
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItem = document.createElement('li');
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
    let cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += 1;
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartCount();
        updateCartList();
    }
}

// Decrease quantity in cart
function decreaseCartQuantity(productId) {
    let cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            updateCartCount();
            updateCartList();
        } else {
            removeFromCart(productId);
        }
    }
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    
    updateCartCount();
    updateCartList();
    showNotification('Item removed from cart');
}

document.addEventListener('DOMContentLoaded', function() {
    // ...
    updateCartList(); // يتم استدعاؤها هنا
    // ...
});

// Update cart list when cart checkbox is clicked
const cartCheckbox = document.getElementById('cart');
if (cartCheckbox) {
    cartCheckbox.addEventListener('click', function() {
        if (this.checked) {
            updateCartList(); // يتم تحديث المحتوى عند فتح السلة
        }
    });
}

// Update cart count in navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartElement = document.querySelector('.cart-item');
    if (cartElement) {
        cartElement.textContent = totalItems;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // ...
    updateCartCount(); // يتم استدعاؤها هنا عند تحميل الصفحة
    // ...
});

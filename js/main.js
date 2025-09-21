// ===== DOM Elements =====
const userBtn = document.getElementById('userBtn');
const userMenu = document.getElementById('userMenu');
const cartBtn = document.getElementById('cartBtn');
const cartDropdown = document.getElementById('cartDropdown');
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const cartCount = document.getElementById('cartCount');
const totalPriceElement = document.getElementById('totalPrice');

// ===== State Management =====
let cartItems = [
    { id: 1, name: 'كرسي مكتبي', price: 150, quantity: 2 },
    { id: 2, name: 'طاولة خشبية', price: 300, quantity: 1 }
];

let isDarkMode = localStorage.getItem('darkMode') === 'true';

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    updateCartDisplay();
    setupEventListeners();
});

// ===== Theme Management =====
function initTheme() {
    if (isDarkMode) {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    } else {
        document.body.removeAttribute('data-theme');
        themeIcon.className = 'fas fa-moon';
    }
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    
    if (isDarkMode) {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    } else {
        document.body.removeAttribute('data-theme');
        themeIcon.className = 'fas fa-moon';
    }
    
    // Add rotation animation
    themeBtn.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        themeBtn.style.transform = 'rotate(0deg)';
    }, 300);
}

// ===== Dropdown Management =====
function toggleUserMenu() {
    const isActive = userMenu.classList.contains('active');
    
    // Close all dropdowns first
    closeAllDropdowns();
    
    if (!isActive) {
        userMenu.classList.add('active');
        userBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    }
}

function toggleCartDropdown() {
    const isActive = cartDropdown.classList.contains('active');
    
    // Close all dropdowns first
    closeAllDropdowns();
    
    if (!isActive) {
        cartDropdown.classList.add('active');
        cartBtn.style.background = '#708993';
    }
}

function closeAllDropdowns() {
    userMenu.classList.remove('active');
    cartDropdown.classList.remove('active');
    userBtn.style.background = 'rgba(255, 255, 255, 0.1)';
    cartBtn.style.background = '#A1C2BD';
}

// ===== Mobile Menu =====
function toggleMobileMenu() {
    const isActive = mobileMenu.classList.contains('active');
    
    if (isActive) {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
    } else {
        mobileMenu.classList.add('active');
        hamburger.classList.add('active');
        closeAllDropdowns(); // Close other menus
    }
}

// ===== Cart Management =====
function updateCartDisplay() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    totalPriceElement.textContent = totalPrice;
    
    renderCartItems();
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: #708993;">السلة فارغة</div>';
        return;
    }
    
    cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p class="item-price">$${item.price}</p>
            </div>
            <div class="item-controls">
                <button class="qty-btn minus" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="qty">${item.quantity}</span>
                <button class="qty-btn plus" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function updateQuantity(itemId, change) {
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItem(itemId);
        } else {
            updateCartDisplay();
        }
    }
}

function removeItem(itemId) {
    cartItems = cartItems.filter(item => item.id !== itemId);
    updateCartDisplay();
    
    // Add animation effect
    const itemElement = document.querySelector(`[data-id="${itemId}"]`);
    if (itemElement) {
        itemElement.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            updateCartDisplay();
        }, 300);
    }
}

// ===== Event Listeners =====
function setupEventListeners() {
    // Theme toggle
    themeBtn.addEventListener('click', toggleTheme);
    
    // User dropdown
    userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleUserMenu();
    });
    
    // Cart dropdown
    cartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCartDropdown();
    });
    
    // Mobile menu
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target) && !userBtn.contains(e.target) &&
            !cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
            closeAllDropdowns();
        }
    });
    
    // Prevent dropdown close when clicking inside
    userMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    cartDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Close mobile menu when clicking on a category
    const mobileCategories = document.querySelectorAll('.mobile-category');
    mobileCategories.forEach(category => {
        category.addEventListener('click', () => {
            toggleMobileMenu();
        });
    });
    
    // User menu item actions
    const userMenuItems = document.querySelectorAll('.user-menu-item');
    userMenuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const text = item.textContent.trim();
            
            if (text.includes('الذهاب للسلة')) {
                console.log('Navigating to cart...');
                // Add your cart navigation logic here
                alert('الانتقال إلى صفحة السلة');
            } else if (text.includes('طلباتي')) {
                console.log('Navigating to orders...');
                // Add your orders navigation logic here
                alert('الانتقال إلى صفحة الطلبات');
            } else if (text.includes('تسجيل الخروج')) {
                console.log('Logging out...');
                // Add your logout logic here
                if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                    alert('تم تسجيل الخروج بنجاح');
                }
            }
            
            closeAllDropdowns();
        });
    });
    
    // Checkout button action
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', () => {
        if (cartItems.length === 0) {
            alert('السلة فارغة!');
            return;
        }
        
        console.log('Proceeding to checkout...');
        alert('الانتقال إلى صفحة الدفع');
        closeAllDropdowns();
    });
    
    // Category navigation
    const categoryLinks = document.querySelectorAll('.nav-categories a, .mobile-category');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.textContent.trim();
            console.log(`Navigating to category: ${category}`);
            alert(`الانتقال إلى قسم: ${category}`);
        });
    });
    
    // Logo home navigation
    const logoLink = document.querySelector('.logo-link');
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Navigating to home...');
        alert('العودة إلى الصفحة الرئيسية');
    });
    
    // Responsive handling
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
        
        // Adjust cart dropdown position on mobile
        if (window.innerWidth <= 480) {
            cartDropdown.style.right = '-80px';
        } else if (window.innerWidth <= 768) {
            cartDropdown.style.right = '-50px';
        } else {
            cartDropdown.style.right = '0';
        }
    });
}

// ===== Utility Functions =====
function addToCart(productId, productName, productPrice) {
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    
    // Show notification
    showNotification(`تم إضافة ${productName} إلى السلة`);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: var(--text-light);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== Animation Functions =====
function animateCartCount() {
    cartCount.style.animation = 'none';
    cartCount.offsetHeight; // Trigger reflow
    cartCount.style.animation = 'bounce 0.6s ease';
}

// ===== CSS Animations (to be added to CSS) =====
const additionalStyles = `
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            transform: scale(1);
        }
        40%, 43% {
            transform: scale(1.3);
        }
        70% {
            transform: scale(1.1);
        }
        90% {
            transform: scale(1.05);
        }
    }
    
    @keyframes slideOut {
        0% {
            transform: translateX(0);
            opacity: 1;
        }
        100% {
            transform: translateX(100px);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .cart-item {
        animation: fadeIn 0.3s ease;
    }
`;

// Add additional styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ===== Debug Functions (for development) =====
function debugCartState() {
    console.log('Current cart items:', cartItems);
    console.log('Total items:', cartItems.reduce((sum, item) => sum + item.quantity, 0));
    console.log('Total price:', cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0));
}

// Make functions available globally for testing
window.addToCart = addToCart;
window.debugCartState = debugCartState;
window.showNotification = showNotification;
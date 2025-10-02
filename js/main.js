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
            } else if (typeof parsedData === "object") {
                currentUser = parsedData;
            }

            if (currentUser) {
                const userNameElement = document.getElementById("user-name");
                if (userNameElement) {
                    userNameElement.textContent = currentUser.username || currentUser.fullname || "User";
                }
                if (btnlogout) btnlogout.textContent

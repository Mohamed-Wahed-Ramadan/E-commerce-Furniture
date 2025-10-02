let products = [];

document.addEventListener('DOMContentLoaded', function() {
    showLoadingScreen();
    
    setTimeout(() => {
        loadAndDisplayProducts();
        updateCartCount();
        updateCartList();
        
        window.addEventListener('scroll', toggleScrollToTopButton);
        
        document.getElementById('scrollToTop').addEventListener('click', scrollToTop);
        
        const overlay = document.querySelector('.slide-overlay');
        overlay.addEventListener('click', function() {
            closeSlide();
        });
        
        hideLoadingScreen();
    }, 2000);
});

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

async function loadAndDisplayProducts() {
    try {
        const response = await fetch('./js/jsonscript.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        products = await response.json();
        console.log('Products loaded:', products);
        
        displayProductsByCategory();
        
    } catch (error) {
        console.error('Error loading products:', error);
        showErrorMessage('Error loading products. Please check if the JSON file exists.');
    }
}

function displayProductsByCategory() {
    createCategorySections();
    
    const productsByCategory = groupProductsByCategory(products);
    
    Object.keys(productsByCategory).forEach(category => {
        displayCategoryProducts(category, productsByCategory[category]);
    });
}

function groupProductsByCategory(products) {
    return products.reduce((grouped, product) => {
        const category = product.category;
        if (!grouped[category]) {
            grouped[category] = [];
        }
        grouped[category].push(product);
        return grouped;
    }, {});
}

function createCategorySections() {
    const categories = [...new Set(products.map(product => product.category))];
    const mainContent = document.querySelector('.main-content');
    
    mainContent.innerHTML = '';
    
    categories.forEach((category, index) => {
        createNewSection(category, mainContent);
    });
}

function createNewSection(category, container) {
    const sectionHTML = `
        <section class="cat-${category.toLowerCase().replace(/\s+/g, '')} sec-pro" id="${category.toLowerCase().replace(/\s+/g, '')}">
            <div class="title">
                <h2>${category}</h2>
                <span class="title-border"></span>
            </div>
            <br><br>
            <div class="pro-items">
                <!-- Products will be inserted here -->
            </div>
        </section>
    `;
    
    container.insertAdjacentHTML('beforeend', sectionHTML);
}

function displayCategoryProducts(category, categoryProducts) {
    const sectionId = category.toLowerCase().replace(/\s+/g, '');
    const section = document.getElementById(sectionId);
    
    if (!section) {
        console.error(`Section not found for category: ${category}`);
        return;
    }
    
    const proItems = section.querySelector('.pro-items');
    if (!proItems) {
        console.error(`pro-items container not found for category: ${category}`);
        return;
    }
    
    proItems.innerHTML = '';
    
    categoryProducts.forEach(product => {
        const productCard = createProductCard(product);
        proItems.appendChild(productCard);
    });
    
    console.log(`Displayed ${categoryProducts.length} products for category: ${category}`);
}

function createProductCard(product) {
    const proBody = document.createElement('div');
    proBody.className = 'pro-body';
    proBody.dataset.productId = product.id;
    
    const discountedPrice = calculateDiscountedPrice(product.price, product.discount_percentage);
    const hasDiscount = product.discount_percentage > 0;
    
    proBody.innerHTML = `
        <img src="${product.image_url}" alt="${product.name}" loading="lazy">
        
        <span class="p-style"></span>
        <span class="p-style2"></span>
        <span class="price">${discountedPrice} L.E</span>
        
        <span class="a-style"></span>
        <span class="a-style2"></span>
        <span class="add">
            <button class="btnAdd" onclick="addToCart('${product.id}')">
                <i class="fas fa-plus"></i>
            </button>
        </span>
        
        ${hasDiscount ? `<span class="dis">${product.discount_percentage}%</span>` : ''}
        
        <span class="stars">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="far fa-star"></i>
        </span>
        
        <button class="more-details" onclick="showProductDetails('${product.id}')">More Details</button>
    `;
    
    return proBody;
}

function calculateDiscountedPrice(originalPrice, discountPercentage) {
    if (discountPercentage > 0) {
        return Math.round(originalPrice - (originalPrice * discountPercentage / 100));
    }
    return originalPrice;
}

function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    localStorage.setItem('shown-product', JSON.stringify(product));
    
    const existingSlide = document.querySelector('.show-slide');
    if (existingSlide) {
        existingSlide.remove();
    }
    
    const slide = document.createElement('div');
    slide.className = 'show-slide';
    
    const discountedPrice = calculateDiscountedPrice(product.price, product.discount_percentage);
    
    slide.innerHTML = `
        <button class="close-slide" onclick="closeSlide()">&times;</button>
        <img src="${product.image_url}" alt="${product.name}" class="show-img">
        <h2>${product.name}</h2>
        <p>${product.short_description}</p>
        
        <div class="quantity-controls">
            <span class="show-price">${discountedPrice} L.E</span>
            <button class="quantity-btn" onclick="decreaseQuantity()">-</button>
            <input type="number" value="1" min="1" max="10" class="quantity-input" id="slide-quantity">
            <button class="quantity-btn" onclick="increaseQuantity()">+</button>
        </div>
        
        <div class="slide-buttons">
            <button class="addcart" onclick="addToCartFromSlide('${product.id}')">Add to Cart</button>
            <button class="product-bage">
                <a href="./product.html" onclick="saveProductForDetails('${product.id}')">For More Details</a>
            </button>
        </div>
    `;
    
    document.body.appendChild(slide);
    
    const overlay = document.querySelector('.slide-overlay');
    overlay.classList.add('active');
    
    setTimeout(() => {
        slide.classList.add('active');
        
        slide.scrollTop = 0;
    }, 100);
    
    document.body.style.overflow = 'hidden';
}

function closeSlide() {
    const slide = document.querySelector('.show-slide');
    const overlay = document.querySelector('.slide-overlay');
    
    if (slide) {
        slide.classList.remove('active');
        setTimeout(() => {
            if (slide.parentNode) {
                slide.parentNode.removeChild(slide);
            }
        }, 300);
    }
    
    if (overlay) {
        overlay.classList.remove('active');
    }
    
    document.body.style.overflow = '';
    
    localStorage.removeItem('shown-product');
}

function increaseQuantity() {
    const quantityInput = document.getElementById('slide-quantity');
    if (quantityInput) {
        let value = parseInt(quantityInput.value) || 1;
        if (value < 10) {
            value++;
            quantityInput.value = value;
        }
    }
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('slide-quantity');
    if (quantityInput) {
        let value = parseInt(quantityInput.value) || 1;
        if (value > 1) {
            value--;
            quantityInput.value = value;
        }
    }
}

function saveProductForDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        localStorage.setItem('selectedProduct', JSON.stringify(product));
    }
}

function addToCartFromSlide(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    const quantityInput = document.getElementById('slide-quantity');
    const quantity = parseInt(quantityInput.value) || 1;
    
    let cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        const discountedPrice = calculateDiscountedPrice(product.price, product.discount_percentage);
        cart.push({
            id: product.id,
            name: product.name,
            price: discountedPrice,
            originalPrice: product.price,
            discount: product.discount_percentage,
            image_url: product.image_url,
            quantity: quantity
        });
    }
    
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    
    updateCartCount();
    updateCartList();
    
    showNotification(`${product.name} added to cart!`);
    
    closeSlide();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const discountedPrice = calculateDiscountedPrice(product.price, product.discount_percentage);
        cart.push({
            id: product.id,
            name: product.name,
            price: discountedPrice,
            originalPrice: product.price,
            discount: product.discount_percentage,
            image_url: product.image_url,
            quantity: 1
        });
    }
    
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    
    updateCartCount();
    updateCartList();
    
    showNotification(`${product.name} added to cart!`);
    
    console.log('Product added to cart:', product.name);
}

function updateCartList() {
    const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    const cartList = document.querySelector('.cart-list ul');
    
    if (!cartList) return;
    
    cartList.innerHTML = '';
    
    if (cart.length === 0) {
        cartList.innerHTML = '<li style="text-align: center; color: #666; padding: 10px;">Your cart is empty</li>';
        return;
    }
    
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

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    
    updateCartCount();
    updateCartList();
    showNotification('Item removed from cart');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartElement = document.querySelector('.cart-item');
    if (cartElement) {
        cartElement.textContent = totalItems;
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
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
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function showErrorMessage(message) {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 50px; width: 100%; color: #ff4444;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px;"></i>
                <h3>Error Loading Products</h3>
                <p>${message}</p>
                <button onclick="location.reload()" style="
                    background: #19183B; 
                    color: white; 
                    border: none; 
                    padding: 10px 20px; 
                    border-radius: 5px; 
                    cursor: pointer; 
                    margin-top: 15px;
                ">Try Again</button>
            </div>
        `;
    }
}

function toggleScrollToTopButton() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

window.addToCart = addToCart;
window.showProductDetails = showProductDetails;
window.addToCartFromSlide = addToCartFromSlide;
window.removeFromCart = removeFromCart;
window.saveProductForDetails = saveProductForDetails;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.increaseCartQuantity = increaseCartQuantity;
window.decreaseCartQuantity = decreaseCartQuantity;
window.closeSlide = closeSlide;
window.products = products;
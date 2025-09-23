// Global variables
let products = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadAndDisplayProducts();
});

// Load products from JSON file
async function loadAndDisplayProducts() {
    try {
        const response = await fetch('./js/jsonscript.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        products = await response.json();
        console.log('Products loaded:', products);
        
        // Display products by category
        displayProductsByCategory();
        
    } catch (error) {
        console.error('Error loading products:', error);
        showErrorMessage('Error loading products. Please check if the JSON file exists.');
    }
}

// Display products organized by category
function displayProductsByCategory() {
    // Create sections for each category
    createCategorySections();
    
    // Group products by category
    const productsByCategory = groupProductsByCategory(products);
    
    // Display each category
    Object.keys(productsByCategory).forEach(category => {
        displayCategoryProducts(category, productsByCategory[category]);
    });
}

// Group products by category
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

// Create sections for each category
function createCategorySections() {
    const categories = [...new Set(products.map(product => product.category))];
    const existingSection = document.querySelector('.cat-corner');
    
    // Clear existing content except the first section
    const sectionsToRemove = document.querySelectorAll('.sec-pro:not(.cat-corner)');
    sectionsToRemove.forEach(section => section.remove());
    
    categories.forEach((category, index) => {
        if (index === 0) {
            // Update the existing section
            updateExistingSection(category);
        } else {
            // Create new sections for other categories
            createNewSection(category);
        }
    });
}

// Update the existing section
function updateExistingSection(category) {
    const existingSection = document.querySelector('.cat-corner');
    const title = existingSection.querySelector('.title h2');
    const proItems = existingSection.querySelector('.pro-items');
    
    if (title) {
        title.textContent = category;
    }
    
    if (proItems) {
        // Clear existing products
        proItems.innerHTML = '';
    }
    
    // Update section attributes
    existingSection.className = `cat-${category.toLowerCase().replace(/\s+/g, '')} sec-pro`;
    existingSection.id = category.toLowerCase().replace(/\s+/g, '');
}

// Create new section for a category
function createNewSection(category) {
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
    
    // Insert the new section after the last section
    const lastSection = document.querySelector('.sec-pro:last-of-type');
    lastSection.insertAdjacentHTML('afterend', sectionHTML);
}

// Display products for a specific category
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
    
    // Clear existing content
    proItems.innerHTML = '';
    
    // Create product cards
    categoryProducts.forEach(product => {
        const productCard = createProductCard(product);
        proItems.appendChild(productCard);
    });
    
    console.log(`Displayed ${categoryProducts.length} products for category: ${category}`);
}

// Create individual product card
function createProductCard(product) {
    const proBody = document.createElement('div');
    proBody.className = 'pro-body';
    proBody.dataset.productId = product.id;
    
    // Calculate discounted price
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

// Calculate discounted price
function calculateDiscountedPrice(originalPrice, discountPercentage) {
    if (discountPercentage > 0) {
        return Math.round(originalPrice - (originalPrice * discountPercentage / 100));
    }
    return originalPrice;
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    
    // Check if product already exists in cart
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
    
    // Save cart to localStorage
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    
    // Update cart UI
    updateCartCount();
    
    // Show success message
    showNotification(`${product.name} added to cart!`);
    
    console.log('Product added to cart:', product.name);
}

// Show product details
// function showProductDetails(productId) {
//     const product = products.find(p => p.id === productId);
//     if (!product) {
//         console.error('Product not found:', productId);
//         return;
//     }
    
//     // Save product details for detailed view
//     localStorage.setItem('selectedProduct', JSON.stringify(product));
    
//     // For now, show alert with details (you can replace with modal or slide)
//     const discountedPrice = calculateDiscountedPrice(product.price, product.discount_percentage);
//     const discountText = product.discount_percentage > 0 ? `\nDiscount: ${product.discount_percentage}%\nOriginal Price: ${product.price} L.E` : '';
    
//     alert(`Product Details:\n\nName: ${product.name}\nCategory: ${product.category}\nPrice: ${discountedPrice} L.E${discountText}\n\nDescription: ${product.short_description}`);
// }
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    // Save product details for detailed view
    localStorage.setItem('selectedProduct', JSON.stringify(product));

    // Redirect to Product Details page
    window.location.href = 'product.html';
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

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
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
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Show error message
function showErrorMessage(message) {
    const proItems = document.querySelector('.pro-items');
    if (proItems) {
        proItems.innerHTML = `
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

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});

// Export functions for global access
window.addToCart = addToCart;
window.showProductDetails = showProductDetails;
window.products = products;
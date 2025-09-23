let cartContainer = document.getElementById("cards-container");

// Load products from JSON file
async function loadAndDisplayProducts() {
  try {
    const response = await fetch("./js/jsonscript.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    products = await response.json();
    console.log("Products loaded:", products);

    var productData = ``;
    for (var product of products) {
      if (product.discount_percentage > 0) {
        productData += `
        <div class="card" id="myCard">
        <img src=${product.image_url} alt="Card Image" />
        <div class="card-content">
          <h3>${product.name}</h3>
          <h5>${product.category}</h5>
          <p>${product.short_description}</p>
          <span class="old-price">${
            product.price
          }$</span> <span class="new-price">${
          product.price - (product.price * product.discount_percentage) / 100
        }$</span>
          <br>
          <br>
          <a href="#" class="btn">details </a>
        <button onclick="addToCart('${
          product.id
        }')" class="btn">Add to Cart</button>
          </div>
      </div>

    `;
      }
    }
    cartContainer.innerHTML = productData;
  } catch (error) {
    console.error("Error loading products:", error);
    showErrorMessage(
      "Error loading products. Please check if the JSON file exists."
    );
  }
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) {
    console.error("Product not found:", productId);
    return;
  }

  // Get existing cart from localStorage
  let cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");

  // Check if product already exists in cart
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const discountedPrice =
      product.price - (product.price * product.discount_percentage) / 100;
    cart.push({
      id: product.id,
      name: product.name,
      price: discountedPrice,
      originalPrice: product.price,
      discount: product.discount_percentage,
      image_url: product.image_url,
      quantity: 1,
    });
  }

  // Save cart to localStorage
  localStorage.setItem("shoppingCart", JSON.stringify(cart));

  // Update cart UI
  updateCartCount();

  // Show success message
  showNotification(`${product.name} added to cart!`);

  console.log("Product added to cart:", product.name);
}
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
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
// Update cart count in navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartElement = document.querySelector('.cart-item');
    if (cartElement) {
        cartElement.textContent = totalItems;
    }
}
loadAndDisplayProducts();

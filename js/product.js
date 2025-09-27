document.addEventListener("DOMContentLoaded", function () {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));
  if (!product) {
    document.body.innerHTML = "<h2 style='text-align:center;margin-top:100px;color:#ff4444;'>No product selected!</h2>";
    return;
  }

  document.getElementById("productImage").src = product.image_url;
  document.getElementById("productImage").alt = product.name;
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productCategory").textContent = product.category;
  document.getElementById("productDescription").textContent = product.short_description;
  document.getElementById("detailed_description").textContent = product.detailed_description;

  // Price with discount
  const discountedPrice = product.discount_percentage > 0 
    ? Math.round(product.price - (product.price * product.discount_percentage / 100)) 
    : product.price;

  document.getElementById("productPrice").textContent = `${discountedPrice} L.E`;
  document.getElementById("productDiscount").textContent = product.discount_percentage > 0 
    ? `(${product.discount_percentage}% OFF)` 
    : "";

  document.getElementById("addToCartBtn").addEventListener("click", () => {
    let cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        ...product,
        price: discountedPrice,
        quantity: 1
      });
    }

    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    
    // تحديث السلة فوراً
    updateCartUI();
  });
});

// دالة مساعدة لتحديث واجهة السلة
function updateCartUI() {
  // تحديث العداد
  const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const cartElement = document.querySelector(".cart-item");
  if (cartElement) {
    cartElement.textContent = totalItems;
  }
  
  // إذا فيه notification function استخدمها، وإلا استخدم alert
  if (typeof showNotification === 'function') {
    const product = JSON.parse(localStorage.getItem("selectedProduct"));
    showNotification(`${product.name} added to cart!`);
  }
}

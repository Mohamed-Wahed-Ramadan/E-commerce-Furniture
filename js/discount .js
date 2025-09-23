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
         <a href="#" class="btn">add to Cart </a>
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
loadAndDisplayProducts();

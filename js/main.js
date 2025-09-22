let userName = localStorage.getItem("username");
if (userName) {
  document.getElementById("user-name").textContent = userName;
}



////////////////////////////////////

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartList = document.querySelector(".cart-list ul");
let cartNum = document.querySelector(".cart-item");

function renderCart() {
  cartList.innerHTML = "";
  let total = 0;
  
  cart.forEach((item, index) => {
    total += item.price * item.qty;
    let li = document.createElement("li");
    li.innerHTML = `
      <div>
        <img src="${item.img}" width="40" height="40">
        <span>${item.name}</span>
        <span>${item.price} EGP</span>
      </div>
      <div>
        <button onclick="decreaseQty(${index})">-</button>
        <span>${item.qty}</span>
        <button onclick="increaseQty(${index})">+</button>
        <button onclick="removeItem(${index})">🗑️</button>
      </div>
    `;
    cartList.appendChild(li);
  });

  // الإجمالي + زرار الذهاب للسلة
  let totalLi = document.createElement("li");
  totalLi.innerHTML = `
    <hr>
    <div><strong>Total: ${total} EGP</strong></div>
    <button onclick="goToCart()">Go to Cart</button>
  `;
  cartList.appendChild(totalLi);

  cartNum.textContent = cart.length;
  localStorage.setItem("cart", JSON.stringify(cart));
}

function increaseQty(i) {
  cart[i].qty++;
  renderCart();
}

function decreaseQty(i) {
  cart[i].qty--;
  if (cart[i].qty < 1) {
    cart.splice(i,1);
  }
  renderCart();
}

function removeItem(i) {
  cart.splice(i,1);
  renderCart();
}

function goToCart() {
  window.location.href = "./cart.html";
}

renderCart();


// ///////////////////////////////////////
// document.querySelector(".barkmode").addEventListener("click", () => {
//   document.body.classList.toggle("dark");
//   localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
// });

// // عند تحميل الصفحة
// if (localStorage.getItem("theme") === "dark") {
//   document.body.classList.add("dark");
// }
const barkModeBtn = document.querySelector(".barkmode i");

document.querySelector(".barkmode").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  
  // غيّر الأيقونة حسب الوضع
  if (document.body.classList.contains("dark")) {
    barkModeBtn.classList.remove("fa-moon");
    barkModeBtn.classList.add("fa-sun");
  } else {
    barkModeBtn.classList.remove("fa-sun");
    barkModeBtn.classList.add("fa-moon");
  }

  // احفظ الاختيار في localStorage
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// عند تحميل الصفحة
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  barkModeBtn.classList.remove("fa-moon");
  barkModeBtn.classList.add("fa-sun");
}

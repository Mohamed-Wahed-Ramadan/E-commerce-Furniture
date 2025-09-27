let data = new XMLHttpRequest();
let myData;

data.open("GET","js/jsonscript.json");

data.onreadystatechange=function () {
    if(data.readyState === 4 && data.status === 200) {
        myData = JSON.parse(data.responseText);

        myData.forEach(item => displayItem(item));
        updateCartSummary();
    }
}
data.send();

function updateCartSummary(){
    let subtotal = 0;

    document.querySelectorAll("tbody tr").forEach(row => {
        let totalCell = row.querySelectorAll("td")[4];
        let value = parseFloat(totalCell.textContent) || 0;
        subtotal += value;
    });

    let discount = subtotal >= 500 ? 50 : 0;

    let total = subtotal - discount;

    document.getElementById("subtotal").textContent = subtotal + " EGP";
    document.getElementById("discount").textContent = "-" + discount + " EGP";
    document.getElementById("total").textContent = total + " EGP";
}

function displayItem(item){
    let tbody = document.querySelector("tbody");
    // tbody.innerHTML = "";
    
    let row = document.createElement("tr");
    
    row.innerHTML = `<td>${item.name}</td>
    <td><img src="${item.image_url}" width = "80"></td>
    <td>${item.price} EGP </td>
    <td><input type = "number" value="1" min="1"></td>
    <td>${item.price} EGP</td>
    <td><button class="remove-btn"><i class="fas fa-trash"></i><button></td>`;
    
    tbody.appendChild(row);
    
    let qtyInput = row.querySelector("input");
    let totalCell = row.querySelectorAll("td")[4];
    
    qtyInput.addEventListener("input", function () {
        let quantity = parseInt(qtyInput.value, 10) || 0;
        
        totalCell.textContent = `${item.price * quantity} EGP`
        updateCartSummary();
    });
    
    let removeBtn = row.querySelector(".remove-btn");
    removeBtn.addEventListener("click", function() {
        row.remove();
        updateCartSummary();
    });
}

const checkoutBtn = document.querySelector(".checkout-btn");
const modal = document.getElementById("success-modal");
const okBtn = document.getElementById("ok-btn");
const cancelBtn = document.getElementById("cancel-btn");

checkoutBtn.addEventListener("click", function () {
    modal.style.display = "flex";
});

okBtn.addEventListener("click", function () {
    window.location.href = "home.html"; // Replace with your main page
});

cancelBtn.addEventListener("click", function () {
    modal.style.display = "none"; // just close modal
});

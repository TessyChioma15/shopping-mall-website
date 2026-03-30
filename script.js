// =====================
// CART SYSTEM
// =====================

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;

// Calculate total on load
cart.forEach(item => total += item.price);

// Update UI on load
updateCartUI();

function addToCart(product, price) {
    cart.push({ product, price });

    total += price;

    saveCart();
    updateCartUI();
}

function updateCartUI() {
    let cartItems = document.getElementById("cart-items");
    let cartCount = document.getElementById("cart-count");
    let totalDisplay = document.getElementById("total");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    cart.forEach((item, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
      ${item.product} - ₦${item.price}
      <button onclick="removeItem(${index})">❌</button>
    `;
        cartItems.appendChild(li);
    });

    if (cartCount) cartCount.innerText = cart.length;
    if (totalDisplay) totalDisplay.innerText = total;
}

function removeItem(index) {
    total -= cart[index].price;
    cart.splice(index, 1);

    saveCart();
    updateCartUI();
}

function clearCart() {
    cart = [];
    total = 0;

    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// =====================
// DELIVERY SYSTEM
// =====================

function getDeliveryFee(state) {
    if (state === "imo") return 1500;

    else if (
        state === "abia" ||
        state === "anambra" ||
        state === "enugu" ||
        state === "ebonyi"
    ) return 2500;

    else if (
        state === "rivers" ||
        state === "delta" ||
        state === "bayelsa"
    ) return 3000;

    else if (
        state === "lagos" ||
        state === "abuja"
    ) return 4000;

    else return 4500;
}

function updateDelivery() {
    let state = document.getElementById("state")?.value;
    if (!state) return;

    let fee = getDeliveryFee(state);

    document.getElementById("delivery").innerText = fee;
}

// =====================
// PAYSTACK CHECKOUT (BUY NOW)
// =====================

function checkout() {
    let state = document.getElementById("state")?.value;

    if (!state) {
        alert("Please select delivery state");
        return;
    }

    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    let delivery = getDeliveryFee(state);
    let finalTotal = total + delivery;

    let handler = PaystackPop.setup({
        key: "YOUR_PUBLIC_KEY_HERE", // PUT YOUR PAYSTACK KEY
        email: "customer@email.com",
        amount: finalTotal * 100,
        currency: "NGN",

        callback: function (response) {
            alert("Payment successful!");
            clearCart();
        },

        onClose: function () {
            alert("Payment cancelled");
        }
    });

    handler.openIframe();
}

// =====================
// BUY NOW (SINGLE PRODUCT)
// =====================

function buyNow(product, price) {
    let state = document.getElementById("state")?.value;

    if (!state) {
        alert("Select delivery state first");
        return;
    }

    let delivery = getDeliveryFee(state);
    let finalTotal = price + delivery;

    let handler = PaystackPop.setup({
        key: "YOUR_PUBLIC_KEY_HERE",
        email: "customer@email.com",
        amount: finalTotal * 100,
        currency: "NGN",

        callback: function () {
            alert("Payment successful!");
        }
    });

    handler.openIframe();
}

// =====================
// WHATSAPP ORDER
// =====================

function orderNow(product, price) {
    let state = document.getElementById("state")?.value;

    if (!state) {
        alert("Select delivery state");
        return;
    }

    let delivery = getDeliveryFee(state);
    let finalTotal = price + delivery;

    let message = `Hello, I want to order:
Product: ${product}
Price: ₦${price}
Delivery: ₦${delivery}
Total: ₦${finalTotal}
Location: ${state}`;

    let phone = "2348135002003"; // PUT YOUR NUMBER

    let url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}

// =====================
// SEARCH FUNCTION
// =====================

function searchProduct() {
    let input = document.getElementById("search").value.toLowerCase();
    let products = document.getElementsByClassName("card");

    for (let i = 0; i < products.length; i++) {
        let text = products[i].innerText.toLowerCase();

        if (text.includes(input)) {
            products[i].style.display = "block";
        } else {
            products[i].style.display = "none";
        }
    }
}
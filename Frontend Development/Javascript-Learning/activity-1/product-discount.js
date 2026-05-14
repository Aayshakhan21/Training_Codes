document.getElementById("productForm").addEventListener("submit", function (event) {
    event.preventDefault(); 

    let productName = document.getElementById("productName").value;
    let price = Number(document.getElementById("price").value);

    let finalPrice;

    if (price > 1000) {
        finalPrice = price - (price * 0.10); // 10% discount
    } else {
        finalPrice = price;
    }

    document.getElementById("result").innerText =
        "Product: " + productName +
        " | Final Price: ₹" + finalPrice;
});
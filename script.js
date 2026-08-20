let totalInventoryValue = 0;


function addProduct() {

    // Getting values from input boxes
    let productName = document.getElementById("productName").value;

    let productQuantity = document.getElementById("productQuantity").value;

    let productPrice = document.getElementById("productPrice").value;


    // Checking if fields are empty
    if (
        productName === "" ||
        productQuantity === "" ||
        productPrice === ""
    ) {
        alert("Please fill all the fields!");

        return;
    }


    // Convert quantity and price into numbers
    productQuantity = Number(productQuantity);

    productPrice = Number(productPrice);


    // Calculate product total
    let productTotal = productQuantity * productPrice;


    // Add total to inventory value
    totalInventoryValue =
        totalInventoryValue + productTotal;


    // Create a new table row
    let table =
        document.getElementById("inventoryList");


    let row =
        table.insertRow();


    // Add product data to the row
    row.insertCell(0).innerHTML =
        productName;

    row.insertCell(1).innerHTML =
        productQuantity;

    row.insertCell(2).innerHTML =
        "₹" + productPrice;

    row.insertCell(3).innerHTML =
        "₹" + productTotal;


    // Delete button
    let deleteButton =
        document.createElement("button");


    deleteButton.innerHTML =
        "Delete";


    deleteButton.className =
        "delete-btn";


    // Delete product when button is clicked
    deleteButton.onclick =
        function () {

            totalInventoryValue =
                totalInventoryValue - productTotal;


            document.getElementById(
                "totalValue"
            ).innerHTML =
                totalInventoryValue;


            row.remove();
        };


    // Add delete button to last cell
    row.insertCell(4)
        .appendChild(deleteButton);


    // Update total inventory value
    document.getElementById(
        "totalValue"
    ).innerHTML =
        totalInventoryValue;


    // Clear input fields
    document.getElementById(
        "productName"
    ).value = "";


    document.getElementById(
        "productQuantity"
    ).value = "";


    document.getElementById(
        "productPrice"
    ).value = "";
}
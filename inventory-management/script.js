
/* ==========================================
   STOCKIFY - INVENTORY MANAGEMENT SYSTEM
   Main JavaScript File
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ======================================
    // 1. DOM ELEMENTS
    // ======================================

    const productTableBody = document.getElementById("productTableBody");
    const addProductBtn = document.getElementById("addProductBtn");
    const productSearch = document.getElementById("productSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const statusFilter = document.getElementById("statusFilter");

    const totalProducts = document.getElementById("totalProducts");
    const totalStock = document.getElementById("totalStock");
    const lowStock = document.getElementById("lowStock");
    const inventoryValue = document.getElementById("inventoryValue");


    // ======================================
    // 2. SAMPLE INVENTORY DATA
    // ======================================

    const defaultProducts = [
        {
            id: "PRD-001",
            name: "Wireless Headphones",
            category: "Electronics",
            price: 2499,
            quantity: 125,
            threshold: 10
        },
        {
            id: "PRD-002",
            name: "USB-C Hub",
            category: "Accessories",
            price: 1299,
            quantity: 8,
            threshold: 10
        },
        {
            id: "PRD-003",
            name: "Office Chair",
            category: "Furniture",
            price: 5999,
            quantity: 42,
            threshold: 10
        },
        {
            id: "PRD-004",
            name: "Bluetooth Speaker",
            category: "Electronics",
            price: 1899,
            quantity: 0,
            threshold: 10
        },
        {
            id: "PRD-005",
            name: "Laptop Stand",
            category: "Accessories",
            price: 899,
            quantity: 76,
            threshold: 10
        },
        {
            id: "PRD-006",
            name: "Mechanical Keyboard",
            category: "Accessories",
            price: 3499,
            quantity: 12,
            threshold: 10
        },
        {
            id: "PRD-007",
            name: "Wireless Mouse",
            category: "Electronics",
            price: 799,
            quantity: 5,
            threshold: 10
        }
    ];


    // ======================================
    // 3. LOCAL STORAGE
    // ======================================

    let products = [];

    try {
        const savedProducts = localStorage.getItem("stockifyProducts");
        products = savedProducts
            ? JSON.parse(savedProducts)
            : defaultProducts;
        
        if (!Array.isArray(products)) {
            products = defaultProducts;
        }
    } catch (error) {
        console.error("Unable to load saved products:", error);
        products = defaultProducts;
    }

    function saveProducts() {
        localStorage.setItem(
            "stockifyProducts",
            JSON.stringify(products)
        );
    }


    // ======================================
    // 4. PRODUCT STATUS
    // ======================================

    function getProductStatus(product) {

        if (product.quantity === 0) {
            return "Out of Stock";
        }

        if (product.quantity <= product.threshold) {
            return "Low Stock";
        }

        return "In Stock";
    }


    // ======================================
    // 5. RENDER PRODUCT TABLE
    // ======================================

    function renderProducts() {

        const searchText = productSearch.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedStatus = statusFilter.value;

        const filteredProducts = products.filter(product => {

            const matchesSearch =
                product.name.toLowerCase().includes(searchText) ||
                product.id.toLowerCase().includes(searchText);

            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;

            const matchesStatus =
                selectedStatus === "all" ||
                getProductStatus(product) === selectedStatus;

            return matchesSearch && matchesCategory && matchesStatus;
        });

        productTableBody.innerHTML = "";

        if (filteredProducts.length === 0) {

            productTableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align:center; padding:30px;">
                        No products found.
                    </td>
                </tr>
            `;

            updateDashboard();
            return;
        }

        filteredProducts.forEach(product => {

            const status = getProductStatus(product);

            let statusClass = "in-stock";

            if (status === "Low Stock") {
                statusClass = "low-stock";
            }

            if (status === "Out of Stock") {
                statusClass = "out-stock";
            }

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>
                    <input type="checkbox" aria-label="Select product">
                </td>

                <td class="product-name">
                    ${escapeHTML(product.name)}
                </td>

                <td>#${escapeHTML(product.id)}</td>

                <td>${escapeHTML(product.category)}</td>

                <td>${formatCurrency(product.price)}</td>

                <td>${product.quantity}</td>

                <td>
                    <span class="status-badge ${statusClass}">
                        ${status}
                    </span>
                </td>

                <td>
                    <div class="product-actions">
                        <button class="edit-btn" data-id="${escapeHTML(product.id)}" title="Edit product">
                            Edit
                        </button>

                        <button class="stock-btn" data-id="${escapeHTML(product.id)}" title="Adjust stock">
                            Stock
                        </button>

                        <button class="delete-btn" data-id="${escapeHTML(product.id)}" title="Delete product">
                            Delete
                        </button>
                    </div>
                </td>
            `;

            productTableBody.appendChild(row);
        });

        updateDashboard();
        renderAlerts();
    }


    // ======================================
    // 6. UPDATE DASHBOARD STATISTICS
    // ======================================

    function updateDashboard() {

        const productCount = products.length;

        const stockCount = products.reduce(
            (sum, product) => sum + product.quantity, 0
        );

        const lowStockCount = products.filter(
            product => getProductStatus(product) === "Low Stock"
        ).length;

        const totalValue = products.reduce(
            (sum, product) => sum + product.price * product.quantity, 0
        );

        totalProducts.textContent = productCount;
        totalStock.textContent = stockCount.toLocaleString("en-IN");
        lowStock.textContent = lowStockCount;
        inventoryValue.textContent = formatCompactCurrency(totalValue);
    }


    // ======================================
    // 7. FORMAT CURRENCY
    // ======================================

    function formatCurrency(amount) {
        return "₹" + Number(amount).toLocaleString("en-IN");
    }

    function formatCompactCurrency(amount) {

        if (amount >= 100000) {
            return "₹" + (amount / 100000).toFixed(2) + "L";
        }

        if (amount >= 1000) {
            return "₹" + (amount / 1000).toFixed(1) + "K";
        }

        return formatCurrency(amount);
    }


    // ======================================
    // 8. PREVENT HTML INJECTION
    // ======================================

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[character]);
    }


    // ======================================
    // 9. CREATE PRODUCT MODAL
    // ======================================

    const modal = document.createElement("div");

    modal.className = "modal-overlay";

    modal.innerHTML = `
        <div class="product-modal">

            <div class="modal-header">
                <div>
                    <h2 id="modalTitle">Add New Product</h2>
                    <p>Enter the product information below.</p>
                </div>

                <button type="button" class="close-modal" id="closeModal">
                    &times;
                </button>
            </div>

            <form id="productForm">

                <div class="form-group">
                    <label for="productName">Product Name</label>
                    <input type="text" id="productName"
                        placeholder="Enter product name" required>
                </div>

                <div class="form-group">
                    <label for="productCategory">Category</label>
                    <select id="productCategory" required>
                        <option value="">Select Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Others">Others</option>
                    </select>
                </div>

                <div class="form-row">

                    <div class="form-group">
                        <label for="productPrice">Price (₹)</label>
                        <input type="number" id="productPrice"
                            min="0.01" step="0.01" placeholder="Price" required>
                    </div>

                    <div class="form-group">
                        <label for="productQuantity">Quantity</label>
                        <input type="number" id="productQuantity"
                            min="0" step="1" placeholder="Quantity" required>
                    </div>

                </div>

                <div class="form-group">
                    <label for="productThreshold">Low Stock Threshold</label>
                    <input type="number" id="productThreshold"
                        min="0" step="1" value="10" required>
                </div>

                <div class="modal-actions">
                    <button type="button" class="cancel-btn" id="cancelModal">
                        Cancel
                    </button>

                    <button type="submit" class="save-btn">
                        Save Product
                    </button>
                </div>

            </form>

        </div>
    `;

    document.body.appendChild(modal);

    const productForm = document.getElementById("productForm");
    const modalTitle = document.getElementById("modalTitle");

    let editingProductId = null;


    // ======================================
    // 10. OPEN AND CLOSE MODAL
    // ======================================

    function openModal(product = null) {

        productForm.reset();

        editingProductId = product ? product.id : null;

        modalTitle.textContent = product
            ? "Edit Product"
            : "Add New Product";

        if (product) {
            document.getElementById("productName").value = product.name;
            document.getElementById("productCategory").value = product.category;
            document.getElementById("productPrice").value = product.price;
            document.getElementById("productQuantity").value = product.quantity;
            document.getElementById("productThreshold").value = product.threshold;
        } else {
            document.getElementById("productThreshold").value = 10;
        }

        modal.classList.add("show");
    }

    function closeModal() {
        modal.classList.remove("show");
        productForm.reset();
        editingProductId = null;
    }

    addProductBtn.addEventListener("click", () => {
        openModal();
    });

    document.getElementById("closeModal")
        .addEventListener("click", closeModal);

    document.getElementById("cancelModal")
        .addEventListener("click", closeModal);

    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeModal();
        }
    });


    // ======================================
    // 11. ADD AND EDIT PRODUCT
    // ======================================

    productForm.addEventListener("submit", event => {

        event.preventDefault();

        const name = document.getElementById("productName").value.trim();
        const category = document.getElementById("productCategory").value;
        const price = Number(document.getElementById("productPrice").value);
        const quantity = Number(document.getElementById("productQuantity").value);
        const threshold = Number(document.getElementById("productThreshold").value);

        if (!name || !category ||
            !Number.isFinite(price) || price <= 0 ||
            !Number.isInteger(quantity) || quantity < 0 ||
            !Number.isInteger(threshold) || threshold < 0) {

            alert("Please enter valid product details.");
            return;
        }

        if (editingProductId) {

            const product = products.find(
                item => item.id === editingProductId
            );

            if (!product) return;

            product.name = name;
            product.category = category;
            product.price = price;
            product.quantity = quantity;
            product.threshold = threshold;

            showNotification("Product updated successfully!");

        } else {

            const newProduct = {
                id: "PRD-" + Date.now(),
                name,
                category,
                price,
                quantity,
                threshold
            };

            products.unshift(newProduct);

            showNotification("Product added successfully!");
        }

        saveProducts();
        renderProducts();
        closeModal();
    });


    // ======================================
    // 12. EDIT AND DELETE PRODUCT
    // ======================================

    productTableBody.addEventListener("click", event => {

        const editButton = event.target.closest(".edit-btn");
        const deleteButton = event.target.closest(".delete-btn");
        const stockButton = event.target.closest(".stock-btn");

        if (editButton) {

            const product = products.find(
                item => item.id === editButton.dataset.id
            );

            if (product) {
                openModal(product);
            }
        }

        if (deleteButton) {

            const productId = deleteButton.dataset.id;

            const confirmed = confirm(
                "Are you sure you want to delete this product?"
            );

            if (!confirmed) return;

            products = products.filter(
                item => item.id !== productId
            );

            saveProducts();
            renderProducts();

            showNotification("Product deleted successfully!");
        }

        if (stockButton) {

            const product = products.find(
                item => item.id === stockButton.dataset.id
            );

            if (product) {
                adjustStock(product);
            }
        }
    });


    // ======================================
    // 13. STOCK IN AND STOCK OUT
    // ======================================

    function adjustStock(product) {

        const action = prompt(
            "Enter stock operation:\n1. IN (Add stock)\n2. OUT (Remove stock)"
        );

        if (!action) return;

        const operation = action.trim().toUpperCase();

        if (operation !== "IN" && operation !== "OUT") {
            alert("Please enter IN or OUT.");
            return;
        }

        const amount = Number(
            prompt("Enter quantity:")
        );

        if (!Number.isInteger(amount) || amount <= 0) {
            alert("Please enter a valid positive quantity.");
            return;
        }

        if (operation === "OUT" && amount > product.quantity) {
            alert("Not enough stock available!");
            return;
        }

        if (operation === "IN") {
            product.quantity += amount;
        } else {
            product.quantity -= amount;
        }

        saveProducts();
        renderProducts();

        showNotification(
            operation === "IN"
                ? "Stock added successfully!"
                : "Stock removed successfully!"
        );
    }


    // ======================================
    // 14. SEARCH AND FILTER
    // ======================================

    productSearch.addEventListener("input", renderProducts);

    categoryFilter.addEventListener("change", renderProducts);

    statusFilter.addEventListener("change", renderProducts);


    // ======================================
    // 15. LOW STOCK ALERTS
    // ======================================

    function renderAlerts() {

        const alertPanel = document.querySelector(".alerts-panel");

        if (!alertPanel) return;

        const alertList = alertPanel.querySelector(".alert-list");
        const alertCount = alertPanel.querySelector(".alert-count");

        const lowProducts = products.filter(
            product => product.quantity <= product.threshold
        );

        alertCount.textContent = `${lowProducts.length} Alerts`;

        alertList.innerHTML = "";

        if (lowProducts.length === 0) {

            alertList.innerHTML = `
                <p style="padding:20px 0; color:#16a579;">
                    All products have sufficient stock!
                </p>
            `;

            return;
        }

        lowProducts.forEach(product => {

            const critical = product.quantity <= product.threshold / 2;

            const item = document.createElement("div");

            item.className = "alert-item";

            item.innerHTML = `
                <div class="alert-product-icon">
                    <i data-lucide="package"></i>
                </div>

                <div class="alert-product-info">
                    <h4>${escapeHTML(product.name)}</h4>
                    <p>Only ${product.quantity} units remaining</p>
                </div>

                <span class="alert-level ${critical ? "" : "warning-level"}">
                    ${critical ? "Critical" : "Warning"}
                </span>

                <button class="restock-btn" data-id="${escapeHTML(product.id)}">
                    Restock
                </button>
            `;

            alertList.appendChild(item);
        });

        if (window.lucide) {
            lucide.createIcons();
        }
    }


    // ======================================
    // 16. RESTOCK BUTTON
    // ======================================

    document.querySelector(".alerts-panel")
        .addEventListener("click", event => {

            const button = event.target.closest(".restock-btn");

            if (!button) return;

            const product = products.find(
                item => item.id === button.dataset.id
            );

            if (product) {
                adjustStock(product);
            }
        });


    // ======================================
    // 17. EXPORT INVENTORY TO CSV
    // ======================================

    const exportButton = document.querySelector(".secondary-btn");

    exportButton.addEventListener("click", () => {

        const headers = [
            "Product ID",
            "Product Name",
            "Category",
            "Price",
            "Quantity",
            "Status"
        ];

        const rows = products.map(product => [
            product.id,
            product.name,
            product.category,
            product.price,
            product.quantity,
            getProductStatus(product)
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(value =>
                `"${String(value).replace(/"/g, '""')}"`
            ).join(","))
            .join("\n");

        const blob = new Blob(
            ["\uFEFF" + csvContent],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "stockify-inventory.csv";

        link.click();

        URL.revokeObjectURL(url);

        showNotification("Inventory report exported!");
    });


    // ======================================
    // 18. NOTIFICATION MESSAGE
    // ======================================

    function showNotification(message) {

        let notification = document.getElementById("stockifyNotification");

        if (!notification) {

            notification = document.createElement("div");

            notification.id = "stockifyNotification";

            notification.style.cssText = `
                position: fixed;
                bottom: 25px;
                right: 25px;
                background: #171c35;
                color: white;
                padding: 14px 22px;
                border-radius: 9px;
                font-size: 13px;
                z-index: 9999;
                box-shadow: 0 5px 20px rgba(0,0,0,0.15);
                transition: opacity 0.3s;
            `;

            document.body.appendChild(notification);
        }

        notification.textContent = message;
        notification.style.opacity = "1";

        clearTimeout(notification.timer);

        notification.timer = setTimeout(() => {
            notification.style.opacity = "0";
        }, 2500);
    }


    // ======================================
    // 19. INITIALIZE APPLICATION
    // ======================================

    saveProducts();
    renderProducts();

    console.log("Stockify Inventory System initialized!");

});

// Keyboard shortcuts for inventory dashboard
document.addEventListener("keydown", function (event) {
    const searchInput = document.getElementById("productSearch");

    // Command + K on Mac or Ctrl + K on Windows
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();

        if (searchInput) {
            searchInput.focus();
        }
    }

    // Escape key clears the search field
    if (event.key === "Escape" && searchInput) {
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));
        searchInput.blur();
    }
});

// Print Inventory Report Feature
(function () {
    function addPrintButton() {
        if (document.getElementById("printInventoryBtn")) return;

        const button = document.createElement("button");
        button.id = "printInventoryBtn";
        button.textContent = "🖨 Print Inventory Report";

        button.style.cssText = `
            position: fixed;
            right: 25px;
            bottom: 25px;
            z-index: 9999;
            padding: 13px 20px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;

        button.addEventListener("click", function () {
            window.print();
        });

        document.body.appendChild(button);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addPrintButton);
    } else {
        addPrintButton();
    }
})();

// Print layout improvements
const printStyles = document.createElement("style");
printStyles.textContent = `
    @media print {
        #printInventoryBtn {
            display: none !important;
        }

        body {
            background: white !important;
        }

        button {
            box-shadow: none !important;
        }
    }
`;
document.head.appendChild(printStyles);

// Dark Mode and Light Mode Toggle
(function () {
    const savedTheme = localStorage.getItem("inventoryTheme") || "light";

    const themeStyle = document.createElement("style");
    themeStyle.textContent = `
        body.dark-mode {
            background: #111827 !important;
            color: #f9fafb !important;
        }

        body.dark-mode .sidebar,
        body.dark-mode .stat-card,
        body.dark-mode .dashboard-card,
        body.dark-mode .alerts-panel,
        body.dark-mode .inventory-section {
            background: #1f2937 !important;
            color: #f9fafb !important;
            border-color: #374151 !important;
        }

        body.dark-mode input,
        body.dark-mode select,
        body.dark-mode table {
            background: #273449 !important;
            color: #f9fafb !important;
        }

        body.dark-mode th,
        body.dark-mode td,
        body.dark-mode h1,
        body.dark-mode h2,
        body.dark-mode h3,
        body.dark-mode p {
            color: #f9fafb;
        }

        #themeToggle {
            position: fixed;
            right: 25px;
            bottom: 85px;
            z-index: 9999;
            padding: 12px 18px;
            border: none;
            border-radius: 10px;
            background: #374151;
            color: white;
            cursor: pointer;
            font-size: 14px;
        }
    `;
    document.head.appendChild(themeStyle);

    document.body.classList.toggle("dark-mode", savedTheme === "dark");

    function addThemeButton() {
        if (document.getElementById("themeToggle")) return;

        const button = document.createElement("button");
        button.id = "themeToggle";
        button.textContent = savedTheme === "dark"
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";

        button.addEventListener("click", function () {
            const isDark = document.body.classList.toggle("dark-mode");

            localStorage.setItem(
                "inventoryTheme",
                isDark ? "dark" : "light"
            );

            button.textContent = isDark
                ? "☀️ Light Mode"
                : "🌙 Dark Mode";
        });

        document.body.appendChild(button);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addThemeButton);
    } else {
        addThemeButton();
    }
})();

// Inventory JSON Backup and Restore
(function () {
    function createBackup() {
        const backupData = {
            application: "Inventory Management System",
            backupDate: new Date().toISOString(),
            data: {}
        };

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            backupData.data[key] = localStorage.getItem(key);
        }

        const blob = new Blob(
            [JSON.stringify(backupData, null, 4)],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "inventory-backup.json";
        link.click();

        URL.revokeObjectURL(url);
    }

    function restoreBackup(file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            try {
                const backup = JSON.parse(event.target.result);

                if (
                    backup.application !== "Inventory Management System" ||
                    !backup.data ||
                    typeof backup.data !== "object" ||
                    Array.isArray(backup.data)
                ) {
                    throw new Error("Invalid backup file");
                }

                if (!confirm("Restore this backup? Existing matching data will be replaced.")) {
                    return;
                }

                Object.entries(backup.data).forEach(([key, value]) => {
                    if (typeof value === "string") {
                        localStorage.setItem(key, value);
                    }
                });

                alert("Backup restored successfully! Reloading dashboard.");
                location.reload();
            } catch (error) {
                alert("Unable to restore. Please select a valid inventory backup.");
            }
        };

        reader.readAsText(file);
    }

    function addBackupControls() {
        if (document.getElementById("backupInventoryBtn")) return;

        const container = document.createElement("div");
        container.style.cssText = `
            position: fixed;
            right: 25px;
            bottom: 145px;
            z-index: 9999;
            display: flex;
            gap: 8px;
        `;

        const backupButton = document.createElement("button");
        backupButton.id = "backupInventoryBtn";
        backupButton.textContent = "⬇ Backup";

        const restoreButton = document.createElement("button");
        restoreButton.textContent = "⬆ Restore";

        [backupButton, restoreButton].forEach(button => {
            button.style.cssText = `
                padding: 12px 16px;
                border: none;
                border-radius: 8px;
                background: #0f766e;
                color: white;
                cursor: pointer;
                font-weight: 600;
            `;
        });

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".json,application/json";
        fileInput.hidden = true;

        backupButton.addEventListener("click", createBackup);

        restoreButton.addEventListener("click", () => fileInput.click());

        fileInput.addEventListener("change", () => {
            if (fileInput.files.length) {
                restoreBackup(fileInput.files[0]);
                fileInput.value = "";
            }
        });

        container.append(backupButton, restoreButton);
        document.body.append(container, fileInput);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addBackupControls);
    } else {
        addBackupControls();
    }
})();
cat >> script.js <<'EOF'

// Product Sorting Feature
function sortInventoryProducts(sortBy) {
    const tbody = document.getElementById("productTableBody");
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll("tr"));

    const columnMap = {
        name: 0,
        price: 4,
        quantity: 5
    };

    const column = columnMap[sortBy];
    if (column === undefined) return;

    rows.sort((a, b) => {
        const first = a.cells[column]?.innerText.trim() || "";
        const second = b.cells[column]?.innerText.trim() || "";

        if (sortBy === "name") {
            return first.localeCompare(second);
        }

        return (
            Number(first.replace(/[^0-9.-]/g, "")) -
            Number(second.replace(/[^0-9.-]/g, ""))
        );
    });

    rows.forEach(row => tbody.appendChild(row));
}

console.log("Product sorting feature loaded");
EOF
// Stock In and Stock Out Feature
(function () {
    const tbody = document.getElementById("productTableBody");
    if (!tbody) {
        console.log("Product table not found");
        return;
    }

    tbody.addEventListener("click", function (event) {
        const button = event.target.closest("[data-stock-action]");
        if (!button) return;

        const row = button.closest("tr");
        const quantityCell = row?.cells[5];
        if (!quantityCell) return;

        const amount = button.dataset.stockAction === "in" ? 1 : -1;
        const quantity = parseInt(quantityCell.textContent, 10) || 0;

        if (quantity + amount < 0) {
            alert("Stock cannot be negative.");
            return;
        }

        quantityCell.textContent = quantity + amount;
        localStorage.setItem(
            "stock_" + row.cells[2]?.textContent.trim(),
            quantity + amount
        );
    });
})();

// Copy Product ID Feature
(function () {
    function addCopyButtons() {
        const tbody = document.getElementById("productTableBody");
        if (!tbody) return;

        Array.from(tbody.rows).forEach(row => {
            const idCell = row.cells[2];
            if (!idCell || idCell.querySelector(".copy-id-btn")) return;

            const productId = idCell.textContent.trim();
            if (!productId) return;

            const button = document.createElement("button");
            button.className = "copy-id-btn";
            button.textContent = "Copy ID";
            button.style.cssText =
                "margin-left:8px;padding:4px 8px;border:0;border-radius:5px;background:#2563eb;color:white;cursor:pointer;";

            button.addEventListener("click", async () => {
                try {
                    await navigator.clipboard.writeText(productId);
                    button.textContent = "Copied!";
                    setTimeout(() => button.textContent = "Copy ID", 1200);
                } catch {
                    alert("Could not copy Product ID.");
                }
            });

            idCell.appendChild(button);
        });
    }

    function initialize() {
        const tbody = document.getElementById("productTableBody");
        if (!tbody) return;

        addCopyButtons();
        new MutationObserver(addCopyButtons).observe(tbody, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }
})();

// Low Stock Row Highlight Feature
(function () {
    const LOW_STOCK_LIMIT = 5;

    function highlightLowStock() {
        const tbody = document.getElementById("productTableBody");
        if (!tbody) return;

        Array.from(tbody.rows).forEach(row => {
            const quantityCell = row.cells[5];
            if (!quantityCell) return;

            const quantity = parseInt(
                quantityCell.textContent.replace(/[^0-9-]/g, ""),
                10
            ) || 0;

            if (quantity <= LOW_STOCK_LIMIT) {
                row.style.backgroundColor = "#fee2e2";
                row.style.borderLeft = "4px solid #dc2626";
                row.title = "Low stock: Reorder this product";
            } else {
                row.style.backgroundColor = "";
                row.style.borderLeft = "";
                row.title = "";
            }
        });
    }

    function initialize() {
        const tbody = document.getElementById("productTableBody");
        if (!tbody) return;

        highlightLowStock();

        new MutationObserver(highlightLowStock).observe(tbody, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }
})();

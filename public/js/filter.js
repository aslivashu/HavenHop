// Client-Side Category Filtering
function filterCategory(category) {
    let items = document.getElementsByClassName("listing-item");
    let noListingsMsg = document.getElementById("no-listings-msg");
    if (items.length === 0) return;
    
    let visibleCount = 0;
    for (let item of items) {
        let itemCategory = item.getAttribute("data-category");
        if (category === 'All' || itemCategory === category) {
            item.style.display = "block";
            visibleCount++;
        } else {
            item.style.display = "none";
        }
    }

    if (noListingsMsg) {
        if (visibleCount === 0) {
            noListingsMsg.style.display = "block";
        } else {
            noListingsMsg.style.display = "none";
        }
    }
}

// Tax Toggle
document.addEventListener("DOMContentLoaded", () => {
    let taxSwitch = document.getElementById("flexSwitchCheckDefault");
    let basePrices = document.getElementsByClassName("base-price");
    
    if (!taxSwitch || basePrices.length === 0) return;

    let taxInfo = document.getElementsByClassName("tax-info");
    let savedTaxState = localStorage.getItem("taxEnabled") === "true";

    function applyIndexTax(isTaxed) {
        for (let i = 0; i < basePrices.length; i++) {
            let originalPrice = parseFloat(basePrices[i].getAttribute("data-price"));
            if (isTaxed) {
                let taxedPrice = Math.round(originalPrice * 1.18);
                basePrices[i].innerText = taxedPrice.toLocaleString("en-IN");
                if (taxInfo[i]) taxInfo[i].style.display = "inline";
            } else {
                basePrices[i].innerText = originalPrice.toLocaleString("en-IN");
                if (taxInfo[i]) taxInfo[i].style.display = "none";
            }
        }
    }

    if (savedTaxState) {
        taxSwitch.checked = true;
        applyIndexTax(true);
    }

    taxSwitch.addEventListener("click", () => {
        let isChecked = taxSwitch.checked;
        localStorage.setItem("taxEnabled", isChecked);
        applyIndexTax(isChecked);
    });
});
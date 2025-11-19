

import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

/**
 * Calculates the cart total and updates the HTML element visibility.
 * Uses the new class names: .list-footer and .list-total
 * * @param {Array} cartItems - The array of items in the cart.
 */
function renderCartTotal(cartItems) {
    // 🎯 Use the updated class name: list-footer
    const cartFooter = document.querySelector(".list-footer");
    // 🎯 Use the updated class name: list-total
    const cartTotalElement = document.querySelector(".list-total");

    // Check if the cart is not empty and the elements exist
    if (cartItems.length > 0 && cartFooter && cartTotalElement) {
        // 1. Calculate the total by summing the FinalPrice of each item
        const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);

        // 2. Update the text content with the formatted total
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
        
        // Note: The HTML already has "Total: " so we only insert the dollar value.
        // If you want to replace the whole content, use: cartTotalElement.innerHTML = `Total: $${total.toFixed(2)}`;

        // 3. Show the footer element by removing the 'hide' class
        cartFooter.classList.remove("hide");
    } else if (cartFooter) {
        // Hide the footer if the cart is empty
        cartFooter.classList.add("hide");
    }
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");

  // Handle empty cart scenario
  if (cartItems.length === 0) {
    productList.innerHTML = "<p>Your cart is empty.</p>";
    
    // Call renderCartTotal to ensure the footer is hidden
    renderCartTotal(cartItems); 
    return; // Stop execution if the cart is empty
  }
  
  // Render the cart items
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join("");

  // Call the new function to render the total
  renderCartTotal(cartItems);
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
   >
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
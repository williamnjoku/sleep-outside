import { getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();


/**
 * Updates the quantity of a specific item in the cart.
 * Removes the item if the quantity drops to zero.
 * @param {string} productId 
 * @param {string} operation 
 */
function updateItemQuantity(productId, operation) {
    let cartItems = getLocalStorage("so-cart") || [];
    
    // Find the index of the item based on its ID
    const itemIndex = cartItems.findIndex(item => item.Id === productId);
    
    if (itemIndex > -1) {
        let item = cartItems[itemIndex];
        
        if (operation === '+') {
            item.Quantity += 1;
        } else if (operation === '-' && item.Quantity > 1) {
            item.Quantity -= 1;
        } else if (operation === '-' && item.Quantity === 1) {
            cartItems.splice(itemIndex, 1);
        }
        
        setLocalStorage("so-cart", cartItems); 
        renderCartContents();
    }
}


function attachQuantityListeners() {
    const quantityButtons = document.querySelectorAll(".quantity-btn");
    
    quantityButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.id;
            const operation = e.target.dataset.operation; // Uses data-operation attribute
            updateItemQuantity(productId, operation);
        });
    });
}


/**
 * Calculates the cart total and updates the HTML element visibility.
 * Now calculates total based on (FinalPrice * Quantity).
 * @param {Array} cartItems - The array of items in the cart.
 */
function renderCartTotal(cartItems) {
    const cartFooter = document.querySelector(".list-footer");
    const cartTotalElement = document.querySelector(".list-total");

    if (cartItems.length > 0 && cartFooter && cartTotalElement) {
        // 1. Calculate the total by summing (FinalPrice * Quantity)
        const total = cartItems.reduce((sum, item) => sum + (item.FinalPrice * (item.Quantity || 1)), 0);

        // 2. Update the text content with the formatted total
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
        
        // 3. Show the footer element
        cartFooter.classList.remove("hide");
   } else if (cartFooter && cartTotalElement) {
        cartTotalElement.textContent = `$0.00`;
        cartFooter.classList.add("hide");
    }
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");

  if (cartItems.length === 0) {
    productList.innerHTML = "<p>Your cart is empty.</p>";
    renderCartTotal(cartItems); 
    return;
  }
  
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join("");

  renderCartTotal(cartItems);
  
  attachQuantityListeners(); 
}

function cartItemTemplate(item) {
  const quantity = item.Quantity || 1; 
  const finalPrice = item.FinalPrice;

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
  
  <div class="cart-card__quantity-controls"> 
    <button class="quantity-btn" data-id="${item.Id}" data-operation="-">-</button>
    <p class="cart-card__quantity">Qty: ${quantity}</p>
    <button class="quantity-btn" data-id="${item.Id}" data-operation="+">+</button>
    <span class="remove-item" data-id="${item.Id}">X</span>
  </div>

  <p class="cart-card__price">$${(finalPrice * quantity).toFixed(2)}</p>
</li>`;

  return newItem;
}

renderCartContents();
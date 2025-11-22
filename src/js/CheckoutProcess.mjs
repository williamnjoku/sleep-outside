import {
  setLocalStorage,
  getLocalStorage,
  alertMessage,
  removeAllAlerts,
} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  const formData = new FormData(formElement),
    convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

function packageItems(items) {
  const simplifiedItems = items.map((item) => {
    console.log(item);
    return {
      id: item.Id,
      price: item.FinalPrice,
      name: item.Name,
      quantity: item.Quantity || 1, 
    };
  });
  return simplifiedItems;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }
  
  init() {
    this.list = getLocalStorage(this.key);
    this.calculateOrdertotal(); 
  }
  
  calculateItemSummary() {
    const summaryElement = document.querySelector(
      this.outputSelector + " #cartTotal"
    );
    const itemNumElement = document.querySelector(
      this.outputSelector + " #num-items"
    );
    
    const totalItems = this.list.reduce((sum, item) => sum + (item.Quantity || 1), 0);
    
    itemNumElement.innerText = totalItems;
    
    const amounts = this.list.map((item) => item.FinalPrice * (item.Quantity || 1));
    
    this.itemTotal = amounts.reduce((sum, item) => sum + item);
    // Ensure summary is displayed with 2 decimal places
    summaryElement.innerText = "$" + this.itemTotal.toFixed(2); 
  }
  
  calculateOrdertotal() {
    this.calculateItemSummary(); 
    
    const totalItems = this.list.reduce((sum, item) => sum + (item.Quantity || 1), 0);
    
    // Shipping: $10 for the first item, $2 for each subsequent item
    this.shipping = 10 + (totalItems > 0 ? (totalItems - 1) * 2 : 0);
    this.tax = (this.itemTotal * 0.06).toFixed(2);
    
    this.orderTotal = (
      parseFloat(this.itemTotal) +
      parseFloat(this.shipping) +
      parseFloat(this.tax)
    ).toFixed(2);
    
    this.displayOrderTotals();
  }
  
  displayOrderTotals() {
    const shipping = document.querySelector(this.outputSelector + " #shipping");
    const tax = document.querySelector(this.outputSelector + " #tax");
    const orderTotal = document.querySelector(
      this.outputSelector + " #orderTotal"
    );
    shipping.innerText = "$" + this.shipping;
    tax.innerText = "$" + this.tax;
    orderTotal.innerText = "$" + this.orderTotal;
  }
  
  async checkout() {
    const formElement = document.forms["checkout"];

    const json = formDataToJSON(formElement);
    json.orderDate = new Date();
    json.orderTotal = this.orderTotal;
    json.tax = this.tax;
    json.shipping = this.shipping;
    json.items = packageItems(this.list); // Uses the updated packageItems
    console.log(json);
    
    try {
      const res = await services.checkout(json);
      console.log(res);
      setLocalStorage("so-cart", []);
      location.assign("/checkout/success.html");
    } catch (err) {
      // get rid of any preexisting alerts.
      removeAllAlerts();
      for (let message in err.message) {
        alertMessage(err.message[message]);
      }

      console.log(err);
    }
  }
}
import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {

  // Calculate discount
  const original = Number(product.SuggestedRetailPrice);
  const final = Number(product.FinalPrice);
  let discountBadge = "";

  if (original > final) {
    const discountPercent = Math.round(((original - final) / original) * 100);
    discountBadge = `<div class="discount-badge">-${discountPercent}% OFF</div>`;
  }

  return `
    <li class="product-card">
      ${discountBadge}
      <a href="/product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h3>${product.Brand.Name}</h3>
        <p>${product.NameWithoutBrand}</p>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
    `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
    document.querySelector(".title").textContent = this.category;
  }

  renderList(list) {
    
    renderListWithTemplate(productCardTemplate, this.listElement, list);

  }

}
 
import ProductData from "./ProductData.mjs";
import ProductDetails from "./product-Details.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const productId = new URLSearchParams(window.location.search).get("product");

const dataSource = new ProductData();
const productDetails = new ProductDetails(productId, dataSource);

productDetails.init();

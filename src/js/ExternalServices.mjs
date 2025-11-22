const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  // 1. Read the response body as JSON immediately (regardless of res.ok status).
  const jsonResponse = await res.json(); 

  if (res.ok) {
    // 2. If response is OK, return the JSON data.
    return jsonResponse; 
  } else {
    // 3. If response is NOT OK (e.g., 400 status), throw a custom error object.
    // The message property carries the detailed server error body.
    throw { 
      name: 'servicesError', 
      message: jsonResponse 
    };
  }
}

export default class ExternalServices {
  constructor(category) {
    // this.category = category;
    // this.path = `../json/${this.category}.json`;
  }
  async getData(category) {
    const response = await fetch(baseURL + `products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }
  async findProductById(id) {
    const response = await fetch(baseURL + `product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(baseURL + "checkout/", options).then(convertToJson);
  }
}
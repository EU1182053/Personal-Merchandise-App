import { API } from "../../backend";
import axios from "axios";

//category calls
export const createCategory = async (userId, token, category) => {
  try {
    const response = await fetch(`${API}/category/create/${userId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(category)
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};

//get all categories
export const getCategories = async () => {
  try {
    const response = await fetch(`${API}/category/show`, {
      method: "GET"
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};

//products calls

//create a product
export const createaProduct = async (token, product) => {
  try {
    const response = await fetch(`${API}/product/create`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: product
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};

//get all products
export const getAllProducts = async () => {
  try {
    const response = await fetch(`${API}/product/showAll`, {
      method: "GET"
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};

//delete a product

export const deleteProduct = async (productId, userId, token) => {
  try {
    const response = await fetch(`${API}/product/${productId}/${userId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};

//get a product

export const getProduct = async productId => {
  try {
    const response = await fetch(`${API}/product/show/${productId}`, {
      method: "GET"
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};

//update a product

export const updateProduct = async (productId, userId, token, product) => {
  console.log("product", product);

  try {

    await axios.put(`${API}/product/update/${productId}`, { product }).then(response => {
      return response.json()
    }).catch()

  } catch (err) {
    return console.log(err);
  }
};
// last step
export const updateRating = async (productId, userId, token, ratingValue) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
    },
  };

  try {
    // Making the POST request
    const response = await axios.post(
      `${API}/create/review/${productId}`,
      {
        user_id: userId,
        product_id: productId,
        rating_value: ratingValue,
      },
      config
    );

    // Log success and return the response data
    console.log("Rating updated successfully:", response.data);
    return response.data;
  } catch (error) {
    // Catch and log errors for debugging
    console.error("Error updating rating:", error?.response?.data || error.message);
    throw error; // Re-throw the error for the calling function to handle
  }
};
// 
import { API } from "../../backend";

export const createOrder = async (userId, token, orderData) => {
  try {
    const response = await fetch(`${API}/order/create/${userId}`, {
      method: "POST",
      headers: { 
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("Error creating order:", err);
    throw err; // Re-throw the error for the caller to handle
  }
};

// step 2
export const getAllOrders = async (userId, token) => {
  try {
    // Make a GET request to the server to fetch all orders for the user
    const response = await fetch(`${API}/order/all/${userId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,  // Include the token for authorization
      } 
    });
    // Check if the response is successful
    if (!response.ok) {
      return await response.json({ purchases: [] })
    }

    
    // Return the orders as JSON
    return await response.json();
  } catch (err) {
    console.error("Error fetching orders:", err);
    throw err;  // Re-throw the error for the caller to handle
  }
};




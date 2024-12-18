const { API } = require("../../backend");

export const getAllReviews = async () => { 
    try {
    const response = await fetch(`${API}/review/showAll`, { method: "GET" });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
}

// Fetch reviews for multiple product IDs
export const getReviewsByProducts = async (productIds, token) => {
  try {
    const response = await fetch(`${API}/review/getByProducts`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ productIds }), // Send productIds array in the request body
    });

    if (response.ok) {
      const data = await response.json();
      return data; // Return reviews data
    } else {
      const error = await response.json();
      return { error: error.message || "Failed to fetch reviews" };
    }
  } catch (err) {
    console.error("Error fetching reviews:", err.message);
    return { error: "An unexpected error occurred" };
  }
};
const { API } = require("../../backend");

export const getProducts = async () => {
  try {
    const response = await fetch(`${API}/product/showAll`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle backend error message
    if (data.error) {
      console.warn("Backend error:", data.error);
      return [];
    }

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return [];
  }
};

export const createReview = async (userId, token, data) => {
    try {
    const response = await fetch(`${API}/review/create/${userId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
  };

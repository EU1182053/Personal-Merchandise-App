const { API } = require("../../backend");

export const getAllReviews = async () => { 
    try {
    const response = await fetch(`${API}/product/showAll`, { method: "GET" });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
}
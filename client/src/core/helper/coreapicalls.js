const { API } = require("../../backend");

export const getProducts = async () => { 
    try {
    const response = await fetch(`${API}/product/show`, { method: "GET" });
    console.log("response", response);
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
}
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

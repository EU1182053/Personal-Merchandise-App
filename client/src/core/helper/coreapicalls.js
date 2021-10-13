const { API } = require("../../backend");

export const getProducts = () => { 
    return fetch(`${API}/product/show`, {method:"GET"})
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}
export const createReview = (userId, token, data) => {
    return fetch(`${API}/review/create/${userId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        return response.json();
      })
      .catch(err => console.log(err));
  };

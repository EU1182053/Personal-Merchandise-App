const { API } = require("../../backend");

export const getProducts = () => {
    return fetch(`${API}/product/show`, {method:"GET"})
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}
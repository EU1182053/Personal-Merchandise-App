const { API } = require("../../backend");

export const getmeToken = async (userId, token) => {
  try {
    const response = await fetch(`${API}/payment/gettoken/${userId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};

export const processPayment = async (userId, token, paymentInfo) => {
    try {
    const response = await fetch(`${API}/payment/braintree/${userId}`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(paymentInfo)
    });
    return response;
  } catch (err) {
    return console.log(err);
  }
}

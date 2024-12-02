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
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentInfo),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, transaction: data.transaction };
    } else {
      return { success: false, error: data.error || data.message };
    }
  } catch (err) {
    console.log("Error:", err);
    return { success: false, error: "Network or server error. Please try again." };
  }
};


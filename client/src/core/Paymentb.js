import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { getmeToken, processPayment } from "./helper/paymentHelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated } from "../auth/helper";
import { cartEmpty } from "./helper/cartHelper";
import DropIn from "braintree-web-drop-in-react";

const Paymentb = ({ products, totalAmount, setReload = (f) => f, reload = undefined }) => {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
  });
  const [redirect, setRedirect] = useState(false);

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  useEffect(() => {
    if (userId && token) {
      getmeToken(userId, token)
        .then((info) => setInfo({ clientToken: info.clientToken }))
        .catch((err) =>
          setInfo({ ...info, error: "Failed to fetch client token" })
        );
    }
  }, [userId, token]);

  const onPurchase = () => {
    setInfo({ ...info, loading: true });

    if (!info?.instance) {
      setInfo({ ...info, error: "Payment instance is not available", loading: false });
      return;
    }

    info.instance.requestPaymentMethod()
      .then((data) => {
        const nonce = data.nonce;
        const paymentData = { paymentMethodNonce: nonce, amount: totalAmount };

        return processPayment(userId, token, paymentData);
      })
      .then((response) => {
        if (!response.success) throw new Error("Payment failed");

        const orderData = {
          products,
          transaction_id: response.transaction.id,
          amount: totalAmount,
        };  

        // Log the orderData before creating the order
      console.log("Order data before createOrder:", orderData);
        return createOrder(userId, token, { order: orderData });
      })
      .then(() => {
        cartEmpty(() => {});
        setReload(!reload);
        setRedirect(true);
      })
      .catch((err) => setInfo({ ...info, error: "Payment failed", loading: false }));
  };

  if (redirect) {
    return <Redirect to="/user/order" />;
  }

  return (
    <div>
      <h3>Your total bill is Rs. {totalAmount}</h3>
      {info.error && <div className="alert alert-danger">{info.error}</div>}
      {info.clientToken ? (
        <div>
          <DropIn
            options={{ authorization: info.clientToken }}
            onInstance={(instance) => setInfo({ ...info, instance })}
          />
          <button className="btn btn-block btn-success" onClick={onPurchase}>
            Buy
          </button>
        </div>
      ) : (
        <h3>Please add something to cart</h3>
      )}
    </div>
  );
};

export default Paymentb;

import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { getmeToken, processPayment } from "./helper/paymentHelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated } from "../auth/helper";
import { cartEmpty } from "./helper/cartHelper";
import DropIn from "braintree-web-drop-in-react";
import Popup from "./Popup";

const Paymentb = ({ products, totalAmount, setReload = (f) => f, reload = undefined }) => {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
  });
  const [redirect, setRedirect] = useState(false);
  // ADDED: Popup state
  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });

  // Extract userId and token from isAuthenticated() once
  const auth = isAuthenticated();
  const userId = auth ? auth.user._id : null;
  const token = auth ? auth.token : null;

  useEffect(() => {
    if (userId && token) {
      getmeToken(userId, token)
        .then((info) => setInfo((prevInfo) => ({ ...prevInfo, clientToken: info.clientToken })))
        .catch((err) =>
          setInfo((prevInfo) => ({ ...prevInfo, error: "Failed to fetch client token" }))
        );
    }
  }, [userId, token]);

  const onPurchase = () => {
    setInfo((prevInfo) => ({ ...prevInfo, loading: true }));

    if (!info?.instance) {
      setInfo((prevInfo) => ({ ...prevInfo, error: "Payment instance is not available", loading: false }));
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
        // Empty cart
        cartEmpty(() => { });

        // Reload cart if required
        setReload(!reload);

        // ADDED: Show success popup instead of redirecting immediately
        setPopup({
          show: true,
          type: "success",
          message: "Payment successful! Your order has been placed.",
        });
        setInfo((prevInfo) => ({
          ...prevInfo,
          loading: false,
        }));
      })
      .catch((err) => {
        console.log("Payment error:", err);
        setInfo((prevInfo) => ({
          ...prevInfo,
          error: "Payment failed",
          loading: false,
        }));
      }
        );
  };

    // Redirect after popup is closed

  if (redirect) {
    return <Redirect to="/user/order" />;
  }

  return (
    <div>
       {popup.show && (
        <Popup
          type={popup.type}
          message={popup.message}
        >
          <button
            className="btn btn-success btn-sm"
            onClick={() => {
              setPopup({
                show: false,
                type: "success",
                message: "",
              });

              setRedirect(true);
            }}
          >
            Continue
          </button>
        </Popup>
      )}
      <h3>Your total bill is Rs. {totalAmount}</h3>
      {info.error && <div className="alert alert-danger">{info.error}</div>}
      {info.clientToken && totalAmount ? (
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

import React, { useState, useEffect, useMemo } from "react";
import { Redirect } from "react-router-dom";
import { getmeToken, processPayment } from "./helper/paymentHelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated } from "../auth/helper";
import { cartEmpty, loadCart } from "./helper/cartHelper";
import DropIn from "braintree-web-drop-in-react";
import PropTypes from "prop-types";

const Paymentb = ({ products, setReload = (f) => f, reload = undefined }) => {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
  });
  const [redirect, setRedirect] = useState(false); // State for handling redirection

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;
  // const [reload, setReload] = useState(undefined);
  const getToken = (userId, token) => {
    console.log("Fetching client token");
    return getmeToken(userId, token)
      .then((info) => {
        console.log("Token fetched:", info);
        const clientToken = info.clientToken;
        setInfo({ clientToken });
      })
      .catch((err) => {
        console.error("Error in fetching client token:", err);
        setInfo({ ...info, error: "Failed to fetch client token" });
      });
  };

  const showbtdropIn = () => {
    return (
      <div>
        {info.clientToken ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={(instance) => {
                console.log("Instance created:", instance);
                setInfo((prevInfo) => ({ ...prevInfo, instance }))
              }}
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

  // Fetch Braintree client token on component mount
  useEffect(() => {
    if (userId && token) {
      getToken(userId, token);
    }
  }, [userId, token]);

  const generateTransactionId = (len) => {
    return Array.from({ length: len }, () =>
      Math.random().toString(36).charAt(2)).join('');
  };

  const onPurchase = () => {
    console.log("onPurchase called");
    setInfo({ ...info, loading: true });


    // Check if DropIn instance exists
    if (!info?.instance) {
      setInfo({ ...info, error: "Payment instance is not available", loading: false });
      console.error("Payment instance is not available");
      return;
    }

    console.log("80");

    info.instance.
      requestPaymentMethod()
      .then((data) => {
        console.log("Payment data:", data); // Log the returned data
        const nonce = data.nonce;

        // Prepare payment data
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: totalAmount,
        };

        // Process payment with the backend
        return processPayment(userId, token, paymentData);
      })
      .then((response) => {
        if (!response.success) {
          throw new Error(response.error || "Payment failed");
        }


        // Prepare order data
        const orderData = {
          products,
          transaction_id: generateTransactionId(10),
          amount: totalAmount,
        };

        console.log("orderData", orderData);
        // Create order in the backend
        return createOrder(userId, token, { order: orderData });
      })
      .then(() => {
        console.log("Order created successfully");
        cartEmpty(() => console.log("Cart is emptied"));
        setReload(!reload); // Force reload of components
        setInfo({ ...info, success: true, loading: false }); // Reset loading before redirect
        setRedirect(true); // Trigger redirect
      })
      .catch((err) => {
        console.error("Payment or order creation failed:", err);
        setInfo({ ...info, error: "Payment process failed", loading: false });
      });
  };



  const totalAmount = useMemo(() => {
    return products.reduce((sum, p) => sum + p.price, 0);
  }, [products]);

  // Redirect after successful payment and order creation
  if (redirect) {
    return <Redirect to="/" />; // Redirect to "/user/order"
  }


  return (
    <div>
      <h3>Your total bill is Rs. {totalAmount}</h3>
      {info.error && <div className="alert alert-danger">{info.error}</div>}
      {showbtdropIn()}
    </div>
  );


};



export default Paymentb;

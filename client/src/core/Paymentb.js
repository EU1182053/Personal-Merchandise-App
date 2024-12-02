import React, { useState, useEffect, useMemo } from "react";
// import { Link } from "react-router-dom";
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

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;
  // const [reload, setReload] = useState(undefined);
  const getToken = (userId, token) => {
    return getmeToken(userId, token)
      .then((info) => {
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
        {info.clientToken !== null && products.length > 0 ? (
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

  // Fetch Braintree client token on component mount
  useEffect(() => {
    if (userId && token) {
      getToken(userId, token);
    }
  }, [userId, token]);

  const generateTransactionId  = (len) => {
    return Array.from({ length: len }, () =>
      Math.random().toString(36).charAt(2)).join('');
  };

  const onPurchase = () => {
    setInfo({ loading: true });
    if (info?.instance) {
      info.instance
        .requestPaymentMethod()
        .then((data) => {
          const nonce = data.nonce;
          const paymentData = {
            paymentMethodNonce: nonce,
            amount: totalAmount(),
          };
          return processPayment(userId, token, paymentData);
        })
        .then((response) => {
          setInfo({ success: response.success, loading: false });
          if (response.success) {
            // Proceed with order creation
            createOrder(userId, token, { order: { products, transaction_id: generateTransactionId(), amount: totalAmount() } });
          } else {
            setInfo({ error: response.error, loading: false });
          }
        })
        .catch((err) => {
          setInfo({ loading: false, error: "Payment process failed" });
        });
    }
  

  };

  const totalAmount = useMemo(() => {
    return products.reduce((sum, p) => sum + p.price, 0);
  }, [products]);


  if (info.loading) {
    return <h3>Processing Payment...</h3>;
  }


  return (
    <div>
      <h3>Your total bill is Rs. {totalAmount}</h3>
      {info.error && <div className="alert alert-danger">{info.error}</div>}
      {showbtdropIn()}
    </div>
  );


};


Paymentb.propTypes = {
  products: PropTypes.array.isRequired,
  setReload: PropTypes.func,
  reload: PropTypes.any,
};

export default Paymentb;

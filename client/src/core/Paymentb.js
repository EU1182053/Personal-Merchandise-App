import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { getmeToken, processPayment } from "./helper/paymentHelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated } from "../auth/helper";
import { cartEmpty, loadCart } from "./helper/cartHelper";
import DropIn from "braintree-web-drop-in-react";

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
      .catch((info) => console.log(info.error));
  };

  const showbtdropIn = () => {
    return (
      <div>
        {info.clientToken !== null && products.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={(instance) => (info.instance = instance)}
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

  useEffect(() => {
    getToken(userId, token);

  }, []);
  const makeId = (len) => {
    var result = "";
    var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < len; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  const onPurchase = () => {
    setInfo({ loading: true });
    let nonce;
    let getNonce;
    getNonce = info?.instance?.requestPaymentMethod().then((data) => {
      nonce = data?.nonce;
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getAmount(),
      };
      console.log(paymentData);
      processPayment(userId, token, paymentData).then((response) => {
        setInfo({ ...info, success: response.success, loading: false });
        console.log("PAYMENT SUCCESS", response);

        createOrder(userId, token, {
          order: {
            products: [products],
            transaction_id: makeId(3),
            amount: getAmount(),
            user: userId,
          },
        });
        console.log({
          order: {
            products: [products],
            transaction_id: makeId(3),
            amount: getAmount(),
            user: userId,
          },
        })
        // //TODO: empty the cart
        cartEmpty(() => {
          console.log("CartEmpty successful");
        });
        // //TODO: force reload
        setReload(!reload);
      });
      // .catch((error) => {
      //   setInfo({ loading: false, success: false });
      //   console.log("PAYMENT FAILED");
      // });
    });
  };

  const getAmount = () => {
    let amount = 0;
    products.map((p) => {
      amount = amount + p.price;
    });
    return amount;
  };

  return (
    <div>
      <h3>Your bill is Rs. {getAmount()} </h3>
      {showbtdropIn()}
    </div>
  );
};

export default Paymentb;

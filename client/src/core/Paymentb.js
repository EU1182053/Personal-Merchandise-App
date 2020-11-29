import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { getmeToken, processPayment } from "./helper/paymentHelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated } from "../auth/helper";
import { cartEmpty, loadCart } from "./helper/cartHelper";
import DropIn from "braintree-web-drop-in-react";
import {createOrder} from './helper/orderHelper'
const Paymentb = () => {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
  });
  const [products, setProducts] = useState([])
  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;
const [reload, setReload] = useState(undefined)
  const getToken = (userId, token) => {
    return getmeToken(userId, token)
      .then((info) => {
        const clientToken = info.clientToken;
        setInfo({ clientToken });
        console.log("INFORMATION", info);
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
          <h3>Please  add something to cart</h3>
        )}
      </div>
    );
  };

  useEffect(() => {
    getToken(userId, token);
    setProducts(loadCart())
    
  }, []);

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
      processPayment(userId, token, paymentData)
        .then((response) => {
          setInfo({ ...info, success: response.success, loading: false });
          console.log("PAYMENT SUCCESS");
          const orderData = {
            products: products,
            transaction_id: response.transaction.id,
            amount: response.transaction.amount,
          };
          createOrder(userId, token, orderData);
          // //TODO: empty the cart
          cartEmpty(() => {
            console.log('CartEmpty successful')
          });
          // //TODO: force reload
          setReload(!reload)
        })
        .catch((error) => {
          setInfo({ loading: false, success: false });
          console.log("PAYMENT FAILED");
        });
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

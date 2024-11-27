import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { addItemToCart, loadCart, removeItemFromCart } from "./helper/cartHelper";
import ImageHelper from "./helper/ImageHelper";
import { getProducts } from "./helper/coreapicalls";

const Card = ({ product, addToCart = true, removeFromCart = false, setReload = true, reload = true }) => {
  // const { user, token } = isAuthenticated();
  // const [categories, setCategories] = useState([]);
  const cardTitle = product ? product.name : "Default";
  const cardDescription = product ? product.description : "Default";
  const cardPrice = product ? product.price : "Default";
  const cardStock = product ? product.stock : "0";
  const cardSold = product ? product.sold : "0";
  const [products, setProducts] = useState([]);

  const [ratingValue, setRatingValue] = useState(0);

  const [redirect, setRedirect] = useState(false)
  // const [count, setCount] = useState(product.count)


  useEffect(() => {
    setRatingValue((product.rating_value).reduce((a, b) => a + b, 0) / ((product.rating_value).length) - 1);

    setProducts(getProducts());
    
  }, [reload]);


  const showAddToCart = (addToCart) => {

    return ( 
      (isAuthenticated() && addToCart) && (
        <div className="col-12">
          <button
            onClick={() => {
              return addItemToCart(product, () => setRedirect(true))
            }}
            className="btn btn-block btn-outline-success mt-2 mb-2"
          >
            Add to Cart
          </button>
        </div>
      )
    );

  };


  const getRedirect = () => {
    if (redirect) {
      return <Redirect to="/" />
    }
  }


  const showRemoveFromCart = (removeFromCart) => {
    return (
      removeFromCart && (
        <div className="col-12">
          <button
            onClick={() => {
              removeItemFromCart(product._id)
              setReload(!reload)
            }}
            className="btn btn-block btn-outline-danger mt-2 mb-2"
          >
            Remove from cart
          </button>
        </div>
      )
    );
  };
  return ( (products) ? (<div className="card text-white bg-dark border border-info ">
      <div className="card-header lead">{cardTitle}</div>
      <div className="card-body">
        {getRedirect()}
        <ImageHelper product={product} />
        <p className="lead bg-success font-weight-normal text-wrap">
          {cardDescription}
        </p>
        <p className="btn btn-success rounded  btn-sm px-4">Rs.{cardPrice}</p>
        <p className="">InStock : {cardStock}</p>
        <p className="">SOLD : {cardSold}</p>
        <div className="row">{showAddToCart(addToCart)}</div>
        <div className="row">{showRemoveFromCart(removeFromCart)}</div>
        <p>Previous Ratings is {ratingValue.toFixed(2)} / 5 .</p>

      </div>
    </div>) : <h2>No products</h2>
    
  ); 
};

export default Card;

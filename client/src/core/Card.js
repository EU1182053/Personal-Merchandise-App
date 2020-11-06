import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { addItemToCart , loadCart, removeItemFromCart} from "./helper/cartHelper";
import ImageHelper from "./helper/ImageHelper";

const Card = ({ product, addToCart = true, removeFromCart = false, setReload= true, reload=true }) => {
  // const { user, token } = isAuthenticated();
  // const [categories, setCategories] = useState([]);
  const cardTitle = product ? product.name : "Default";
  const cardDescription = product ? product.description : "Default";
  const cardPrice = product ? product.price : "Default";
  const [products, setProducts] = useState([]);
  
const [redirect, setRedirect] = useState(false)
// const [count, setCount] = useState(product.count)
useEffect(() => {
  setProducts(loadCart())
}, [reload])
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
    if(redirect){
      return<Redirect to="/"/>
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
  return (
    <div className="card text-white bg-dark border border-info ">
      <div className="card-header lead">{cardTitle}</div>
      <div className="card-body">
        {getRedirect()}
        <ImageHelper product={product} />
        <p className="lead bg-success font-weight-normal text-wrap">
          {cardDescription}
        </p>
        <p className="btn btn-success rounded  btn-sm px-4">Rs.{cardPrice}</p>
        <div className="row">{showAddToCart(addToCart)}</div>
        <div className="row">{showRemoveFromCart(removeFromCart)}</div>

      </div>
    </div>
  );
};

export default Card;

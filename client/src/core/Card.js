import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth/helper";
import { addItemToCart, loadCart, removeItemFromCart } from "./helper/cartHelper";
import ImageHelper from "./helper/ImageHelper";

const Card = ({
  product,
  addToCart = true,
  removeFromCart = false,
  setReload = (f) => f,
  reload = undefined,
  isCartPage = false,  // New prop to check if we're on the cart page
}) => {
  const cardTitle = product ? product.name : "Default";
  const cardDescription = product ? product.description : "Default";
  const cardPrice = product ? product.price : "Default";
  const cardStock = product ? product.stock : "0";
  const cardSold = product ? product.sold : "0";
  
  const [quantity, setQuantity] = useState(1);

  // Fetch initial quantity from localStorage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productInCart = cart.find(item => item._id === product._id);
    if (productInCart) {
      setQuantity(productInCart.quantity);
    }
  }, [product._id]); // Runs when the product changes

  // Update quantity in localStorage when it changes
  const updateLocalStorage = (newQuantity) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.map(item => 
      item._id === product._id ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setQuantity(newQuantity);
  };

  const increaseQuantity = () => {
    updateLocalStorage(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      updateLocalStorage(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (isAuthenticated()) {
      addItemToCart({ ...product, quantity }, () => {});
    }
  };

  const showAddToCart = () => {
    return (
      isAuthenticated() &&
      addToCart && (
        <div className="col-12">
          <button
            onClick={handleAddToCart}
            className="btn btn-block btn-outline-success mt-2 mb-2"
          >
            Add to Cart
          </button>
        </div>
      )
    );
  };

  const showRemoveFromCart = () => {
    return (
      removeFromCart && (
        <div className="col-12">
          <button
            onClick={() => {
              removeItemFromCart(product._id);
              setReload(!reload);
            }}
            className="btn btn-block btn-outline-danger mt-2 mb-2"
          >
            Remove from Cart
          </button>
        </div>
      )
    );
  };

  return (
    <div className="card text-white bg-dark border border-info">
      <div className="card-header lead">{cardTitle}</div>
      <div className="card-body">
        <ImageHelper product={product} />
        <p className="lead bg-success font-weight-normal text-wrap">
          {cardDescription}
        </p>
        <p className="btn btn-success rounded btn-sm px-4">Rs. {cardPrice}</p>
        <p>In Stock: {cardStock}</p>
        <p>Sold: {cardSold}</p>
        <p>Average Ratings: {product.rating.average}/5</p>

        {/* Display quantity fetched from localStorage */}
        {!isCartPage && 
        <div className="quantity-controls">
        <button
          onClick={decreaseQuantity}
          className="btn btn-sm btn-danger mx-1"
        >
          -
        </button>
        <span className="quantity-display mx-2">{quantity}</span>
        <button
          onClick={increaseQuantity}
          className="btn btn-sm btn-success mx-1"
        >
          +
        </button>
      </div>
        }

        <div className="row">{showAddToCart()}</div>
        <div className="row">{showRemoveFromCart()}</div>
      </div>
    </div>
  );
};

export default Card;

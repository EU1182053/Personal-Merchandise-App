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
  isCartPage = false,
}) => {
  const cardTitle = product ? product.name : "Default";
  const cardDescription = product ? product.description : "Default";
  const cardPrice = product ? product.price : "Default";
  const cardStock = product ? product.stock : "0";
  const cardSold = product ? product.sold : "0";

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productInCart = cart.find((item) => item._id === product._id);
    if (productInCart) {
      setQuantity(productInCart.quantity);
    }
  }, [product._id]);

  const updateLocalStorage = (newQuantity) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.map((item) =>
      item._id === product._id ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setQuantity(newQuantity);
  };

  const increaseQuantity = () => {
    if (quantity < cardStock) {
      updateLocalStorage(quantity + 1);
    } else {
      alert("Cannot add more than available stock.");
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      updateLocalStorage(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (cardStock > 0) {
      if (isAuthenticated()) {
        addItemToCart({ ...product, quantity }, () => {});
      }
    } else {
      alert("Product is out of stock.");
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
            disabled={cardStock === 0}
          >
            {cardStock === 0 ? "Out of Stock" : "Add to Cart"}
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

        {!isCartPage && (
          <div className="quantity-controls">
            <button
              onClick={decreaseQuantity}
              className="btn btn-sm btn-danger mx-1"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="quantity-display mx-2">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="btn btn-sm btn-success mx-1"
              disabled={quantity >= cardStock}
            >
              +
            </button>
          </div>
        )}

        <div className="row">{showAddToCart()}</div>
        <div className="row">{showRemoveFromCart()}</div>
      </div>
    </div>
  );
};

export default Card;
 
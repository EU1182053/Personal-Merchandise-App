import React, { useState, useEffect } from "react";
import Base from "./Base";
import Card from "./Card";
import { loadCart } from "./helper/cartHelper";
import Paymentb from "./Paymentb";

const Cart = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadedProducts = loadCart(); // Load the products from localStorage initially
  console.log("Loaded products from localStorage:", loadedProducts);
  setProducts(loadedProducts);
    setProducts(loadCart()); // Load the products from localStorage initially
  }, []); // Only run once on component mount

  const handleQuantityChange = (productId, change) => {
    // Update quantity of the product
    const updatedCart = products.map((product) => {
      if (product._id === productId) {
        const newQuantity = product.quantity + change;
        return { ...product, quantity: newQuantity > 0 ? newQuantity : 1 }; // Ensure quantity is at least 1
      }
      return product;
    });

    setProducts(updatedCart); // Update state
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage

    console.log("Updated products:", updatedCart);  // Log the updated products
  };

  const calculateTotalAmount = () => {
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const loadAllProducts = () => {
    return (
      <div className="row">
        {products.map((product, index) => (
          <div key={index} className="col-12 mb-3">
            <Card
              product={product}
              addToCart={false}
              removeFromCart={true}
              isCartPage={true}  // Pass isCartPage as true for cart page
            />
            <div className="quantity-controls">
              <button
                className="btn btn-sm btn-danger mx-1"
                onClick={() => handleQuantityChange(product._id, -1)}
              >
                -
              </button>
              <span className="mx-2">{product.quantity}</span>
              <button
                className="btn btn-sm btn-success mx-1"
                onClick={() => handleQuantityChange(product._id, 1)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    ); 
  };

  return (
    <Base title="Carts Page" description="Welcome to your cart!">
      <div>
        <div className="row text-center">
          <h1>All Products</h1>
        </div>
        <div className="row">
          <div className="col-8"> 
            {products.length > 0 ? (
              loadAllProducts()
            ) : (
              <h3>There is nothing in your Cart.</h3>
            )}
          </div>
          <div className="col-4">
            <h4>Total Bill: Rs. {calculateTotalAmount()}</h4>
            <Paymentb
              products={products}
              totalAmount={calculateTotalAmount()}
            />
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Cart;

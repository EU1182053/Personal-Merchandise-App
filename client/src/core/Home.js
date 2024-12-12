import React, { useState, useEffect } from "react";
import Base from "./Base";
import Card from "./Card";
import { getProducts } from "./helper/coreapicalls";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState(false);

  const showProducts = () => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setError(false); // Reset error state if data is fetched successfully
      })
      .catch(() => {
        setError(true); // Set error state if the API call fails
      });
  };

  useEffect(() => {
    showProducts();
  }, []);

  return (
    <Base title="Home Page" description="Welcome to our T-shirt Store">
      <div className="row text-center">
        <h1>All Products</h1>
        {error && (
          <div className="alert alert-danger">
            <h4>Failed to load products. Please try again later.</h4>
          </div>
        )}
      </div>
      <div className="row">
        {!error &&
          products.map((product, index) => (
            <div key={index}>
              <Card product={product} />
            </div>
          ))}
      </div>
    </Base>
  );
};

export default Home;

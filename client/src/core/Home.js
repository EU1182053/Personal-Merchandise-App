import React, { useState, useEffect } from "react";
import Base from "./Base";
import Card from "./Card";
import { getProducts } from "./helper/coreapicalls";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  
  const showProducts = () => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setError(false);
      })
      .catch((data) => {
        if (data.error) {
          setError(true);
        }
      });
  };

  useEffect(() => {
    showProducts();
    
  }, []);
  return (
    <Base title="Home Page" description="Welcome to our T-shirt Store">
      
      <div className="row text-center">
        <h1>All Products</h1>
        </div>
      <div className="row">
         
          
          {products.map((product, index) => {
            return (
              <div key={index} >
                <Card product={product}/>
              </div>
            );
          })}
     
      </div>
    
    </Base>
  );
}
export default Home
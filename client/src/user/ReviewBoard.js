

import React, { useState, useEffect } from "react";
import Base from '../core/Base'
import Card from '../core/Card'
import { getProducts } from "../core/helper/coreapicalls";

const ReviewBoard = () => {
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
    <Base title="review Page" description="Welcome to our Review Page">
      
      <div className="row text-center">
        <h1>All Products</h1>
        </div>
      <div className="row ">
        
          
          {products.map((product, index) => {
            return (
              <div key={index} >
                <Card 
                product={product}
                addToCart={false}
                />
              </div>
            );
          })}
         
      
       
      </div>
     
      
    </Base>
  );
};

export default ReviewBoard;

import React, { useState, useEffect } from "react";
import Base from "./Base";
import Card from "./Card";
// import { getProducts } from "./helper/coreapicalls";
import { loadCart } from "./helper/cartHelper";
import Paymentb from "./Paymentb";
const  Cart = () => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(true);

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const loadAllProducts = () => {
    return (
      <div className="row ">
        {products.map((product, index) => {
          return (
            <div key={index}>
              <Card
                product={product}
                key={index}
                addToCart={false}
                removeFromCart={true}
                setReload={setReload}
                reload={reload}
              />
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <Base title="Cart Page" description="Welcome to your cart!">
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
                    <Paymentb products={products} setReload={setReload} />

        </div>
      </div>
    </Base>
  );
}
export default Cart

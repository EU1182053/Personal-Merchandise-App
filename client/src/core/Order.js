import React, { useState, useEffect } from "react";
import { API } from "../backend";
import { isAuthenticated } from "../auth/helper";
import { getAllOrders } from "./helper/orderHelper";
import Base from "./Base";
import Menu from "./Menu";

const Order = () => {

  const { user, token } = isAuthenticated();  // Retrieve userId and token from isAuthenticated()

  const [orders, setOrders] = useState([]);  // To store fetched orders
  const [loading, setLoading] = useState(true);  // To manage loading state
  const [error, setError] = useState(null);  // To handle errors

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user._id || !token) {
          throw new Error("User is not authenticated");
        }

        // Call the helper function to fetch orders
        const data = await getAllOrders(user._id, token);
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user._id, token]);
  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (

    <Base title="Order Page" description="Welcome to your Order Page">
     <div className="container">
      <h2 className="mb-4 text-center">Your Orders</h2>
      {orders.length === 0 ? (
        <h2>No orders found</h2>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div className="col-md-4 mb-3" key={order._id}>
              <div className="card text-white bg-dark border border-info">
                <div className="card-header lead">
                  Order ID: {order._id}
                </div>
                <div className="card-body">
                  <p className="lead bg-success font-weight-normal text-wrap">
                    Status: {order.status}
                  </p>
                  <p className="btn btn-success rounded btn-sm px-4">
                    Rs. {order.amount}
                  </p>
                  <p className="">Transaction ID: {order.transaction_id}</p>
                  
                  <p className="">Products:</p>
                  <ul>
                    {order.products.map((product) => (
                      <li key={product._id}>
                        <p>{product.name}</p>
                        <p>Count: {product.count}</p>
                        <p>Price: Rs. {product.price}</p>
                      </li>
                    ))}
                  </ul> 
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </Base>
    
  );
};

export default Order;
import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth/helper";
import { getAllOrders } from "./helper/orderHelper";
import Base from "./Base";
import ReviewCard from "./ReviewCard";

const Order = () => {
  const { user, token } = isAuthenticated(); // Retrieve userId and token
  const [purchases, setPurchases] = useState([]); // To store purchases array
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user || !user._id || !token) {
          throw new Error("User is not authenticated");
        }

        // Fetch orders
        const data = await getAllOrders(user._id, token);
        if (data && data.purchases) {
          console.log(data.purchases);
          setPurchases(data.purchases); // Set purchases array
        } else {
          setPurchases([]);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch purchases");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user._id, token]);

  if (loading) return <div>Loading purchases...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Base title="Your Purchases" description="Review your purchase history">
      <div className="container">
        <h2 className="mb-4 text-center">Your Purchases</h2>
        {purchases.length === 0 ? (
          <h2>No purchases found</h2>
        ) : (
          <div className="row">
            {purchases.map((purchase, index) => (


              <div className="col-md-4 mb-3" key={`${purchase.transaction_id}-${index}`}>
                <div className="card text-white bg-dark border border-info">
                  <ReviewCard product={purchase} />

                  <div className="card-header lead">
                    Purchase ID: {purchase._id}
                  </div>
                  <div className="card-body">
                    <p className="lead bg-success font-weight-normal text-wrap">
                      Name: {purchase.name}
                    </p>
                    <p>Description: {purchase.description}</p>
                    <p>
                      Category:{" "}
                      <span className="badge badge-info">
                        {purchase.category}
                      </span>
                    </p>
                    <p>Quantity: {purchase.quantity}</p>
                    <p>
                      Amount: ₹{purchase.amount || "N/A"}
                    </p>
                    <p>
                      Transaction ID: {purchase.transaction_id}
                    </p>
                    <p>
                      Purchased On:{" "}
                      {purchase.createdAt
                        ? new Date(purchase.createdAt).toLocaleDateString("en-GB")
                        : "N/A"}
                    </p>
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

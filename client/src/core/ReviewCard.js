import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import "../styles.css";
import { FaStar } from "react-icons/fa";
import { updateRating } from "../admin/helper/adminapicall";
import ImageHelper from "./helper/ImageHelper";
import { isAuthenticated } from "../auth/helper";

const ReviewCard = ({ product }) => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, token } = isAuthenticated();
  const [averageRating, setAverageRating] = useState(0);

  // Extract the dependency to a variable
  const productAverageRating = product?.rating?.average;

  // Initialize average rating
  // Initialize average rating
  useEffect(() => {
    setAverageRating(productAverageRating || 0);
  }, [productAverageRating]);

  const getRedirect = () => {return redirect && <Redirect to="/" />}

  const handleRatingSubmit = async (rating) => {
    if (!isAuthenticated()) return;

    setIsSubmitting(true);
    try {
      const response = await updateRating(product._id, user._id, token, rating);
      if (response?.message === "Review added and product updated successfully.") {
        setAverageRating(response.averageRating); // Update average rating from response
        setRedirect(true);


      } else {
        console.log("Failed to update rating:", response);
      }
    } catch (error) {
      console.log("Error during rating submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = () => (
    <div>
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <div key={i}>
            <label>
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => {
                  setRating(ratingValue);
                }}
                style={{ display: "none" }}
              />
              <FaStar
                size={40}
                className="star"
                color={ratingValue <= (hover || rating) ? "yellow" : "gray"}
                onMouseEnter={() => {
                  setHover(ratingValue);
                }}
                onMouseLeave={() => {
                  setHover(null);
                }}
                aria-label={`${ratingValue} Star`}
              />
            </label>
          </div>
        );
      })}

      {isAuthenticated() && rating >= 1 && (
        <button
          className="btn btn-block btn-outline-success mt-2 mb-2"
          onClick={() => handleRatingSubmit(rating)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Done"}
        </button>
      )}
    </div>
  );

  return (
    <div className="card text-white bg-dark border border-info">
      <div className="card-header lead">{product?.name || "Default Name"}</div>
      <div className="card-body">
        {getRedirect()}
        <ImageHelper product={product} />
        <p className="lead bg-success font-weight-normal text-wrap">{product?.description || "Default Description"}</p>
        <p className="btn btn-success rounded btn-sm px-4">Rs.{product?.amount || "Defaults Price"}</p>
        {StarRating()}
        <p>
          {averageRating > 0
            ? `Average Ratings is ${averageRating.toFixed(1)} / 5.`
            : "Be the first to rate this product!"}
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;

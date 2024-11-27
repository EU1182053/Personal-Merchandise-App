import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import "../styles.css";
import { createReview } from "./helper/coreapicalls";
import { isAuthenticated } from "../auth/helper";
import { FaStar } from "react-icons/fa";
import ReactStars from "react-rating-stars-component";
import { loadCart } from "./helper/cartHelper";
import ImageHelper from "./helper/ImageHelper";
import { updateProduct, updateRating } from "../admin/helper/adminapicall";
const ReviewCard = ({ product, reload = true }) => {

  const cardTitle = product ? product.name : "Default";
  const cardDescription = product ? product.description : "Default";
  const cardPrice = product ? product.price : "Default";

  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const { user, token } = isAuthenticated();
  const [isSubmitting, setIsSubmitting] = useState(false); // Handle submission state
  const [ratingValue, setRatingValue] = useState(0);

  const [averageRating, setAverageRating] = useState(0);

  // Redirect handler
  const getRedirect = () => redirect && <Redirect to="/" />;


  // Initialize average rating
  useEffect(() => {
    setAverageRating(product?.rating?.average || 0);
  }, [product?.rating?.average]);


  // Submit a new rating
  const handleRatingSubmit = async (rating) => {
    if (!isAuthenticated()) return;

    setIsSubmitting(true); // Disable button during submission

    try {

      const response = await updateRating(product._id, user._id, token, rating);
      if (response?.success) {
        setAverageRating(response.averageRating); // Assuming the response contains updated average
        setRedirect(true);
      } else {
        console.error("Failed to update rating:", response.message);
      }
    } catch (error) {
      console.error("Error during rating submission:", error);
    }
    finally {
      setIsSubmitting(false);
    }
    setRatingValue(rating);

  };
  // third last step and half code is on backend
  const StarRating = () => {
    return (
      <div>
        {

          [...Array(5)].map((_, i) => {
            const ratingValue = i + 1;
            return (
              <div key={i}>


                <label >
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
        {/* <p>Rating is... {rating}</p> */}



        {
          (isAuthenticated() && (rating >= 1)) ?
            <button
              className="btn btn-block btn-outline-success mt-2 mb-2"
              onClick={handleRatingSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Done"}
            </button> :
            <div></div>
        }
      </div>
    );
  };

  return (
    <div className="card text-white bg-dark border border-info ">
      <div className="card-header lead">{cardTitle || "Default Name"}</div>
      <div className="card-body">
        {getRedirect()}
        <ImageHelper product={product} />
        <p className="lead bg-success font-weight-normal text-wrap">
          {cardDescription || "Default Description"}
        </p>
        <p className="btn btn-success rounded  btn-sm px-4">Rs.{cardPrice || "Default Price"}</p>
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

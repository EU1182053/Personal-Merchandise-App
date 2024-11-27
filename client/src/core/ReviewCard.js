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

  const [ratingValue, setRatingValue] = useState(0);

  const getRedirect = () => {
    if (redirect) {
      console.log("product", product)
      return <Redirect to="/" />;
    }
  };

  useEffect(() => {
    setRatingValue((product.rating_value).reduce((a, b) => a + b, 0) / ((product.rating_value).length) - 1);

  }, [reload]);

  const onSubmit = async (rating) => {
    product.rating_value.push(rating);

    console.log("(product.rating_value).length", (product.rating_value).length);
    setRatingValue((product.rating_value).reduce((a, b) => a + b, 0) / ((product.rating_value).length) - 1);
    await updateRating(product._id, user._id, token, product)
      .then(data => {

        return <Redirect to={'/'} />

      })
      .catch(error => console.log(error));

  };

  const StarRating = () => {
    return (
      <div>
        {

          [...Array(5)].map((index, i) => {
            const ratingValue = i + 1;
            return (
              <div key={index}>


                <label >
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => {
                      setRating(ratingValue);
                    }}
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
                  />
                </label>
              </div>
            );
          })}
        <p>Rating is... {rating}</p>

        {
          (isAuthenticated() && (rating >= 1)) ?
            <button
              className="btn btn-block btn-outline-success mt-2 mb-2"
              onClick={() => {
                onSubmit(rating);
              }}
            >
              Done
            </button> :
            <div></div>
        }
      </div>
    );
  };

  return (
    <div className="card text-white bg-dark border border-info ">
      <div className="card-header lead">{cardTitle}</div>
      <div className="card-body">
        {getRedirect()}
        <ImageHelper product={product} />
        <p className="lead bg-success font-weight-normal text-wrap">
          {cardDescription}
        </p>
        <p className="btn btn-success rounded  btn-sm px-4">Rs.{cardPrice}</p>
        {StarRating()}

        <p>Previous Ratings is {ratingValue.toFixed(2)} / 5 .</p>
      </div>
    </div>
  );
};

export default ReviewCard;

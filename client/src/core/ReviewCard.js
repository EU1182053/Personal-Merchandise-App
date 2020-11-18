import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import "../styles.css";
import { createReview } from "./helper/coreapicalls";
import { isAuthenticated } from "../auth/helper";
import { FaStar } from "react-icons/fa";
import ReactStars from "react-rating-stars-component";
import { loadCart } from "./helper/cartHelper";
import ImageHelper from "./helper/ImageHelper";
const ReviewCard = ({ product, reload = true }) => {
  const cardTitle = product ? product.name : "Default";
  const cardDescription = product ? product.description : "Default";
  const cardPrice = product ? product.price : "Default";
  const [products, setProducts] = useState([]);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const { user, token } = isAuthenticated();
  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const getRedirect = () => {
    if (redirect) {
      return <Redirect to="/" />;
    }
  };
  const onSubmit = () => {
    createReview(user._id, token, {
      data: [
        {
          product_id: product._id,

          rating_value: rating,
        },
      ],
    });
    {
      {
        // Your application has indicated there's an error
        window.setTimeout(function () {
          // Move to a new location or you can do something else
          window.location.href = "/user/review";
        }, 2000);
        // return<div>
        //   Redirecting to Home Page...
        //   <Redirect to={"/"}  delay={3000}/>
        // </div>
      }
    }
  };

  const StarRating = () => {
    return (
      <div>
        {[...Array(5)].map((star, i) => {
          const ratingValue = i + 1;
          return (
            <label>
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
          );
        })}
        <p>Rating is... {rating}</p>
        {
          (isAuthenticated() && (rating >= 1) ) ?
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
      </div>
    </div>
  );
};

export default ReviewCard;

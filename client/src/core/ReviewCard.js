import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import { loadCart } from "./helper/cartHelper";
import ImageHelper from "./helper/ImageHelper";

const ReviewCard = ({ product, reload = true }) => {
  const cardTitle = product ? product.name : "Default";
  const cardDescription = product ? product.description : "Default";
  const cardPrice = product ? product.price : "Default";
  const [products, setProducts] = useState([]);

  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const getRedirect = () => {
    if (redirect) {
      return <Redirect to="/" />;
    }
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
        <div className="row">
          <div className="col-6">
            <ReactStars
              count={5}
              size={35}
              isHalf={true}
              emptyIcon={<i className="far fa-star"></i>}
              halfIcon={<i className="fa fa-star-half-alt"></i>}
              fullIcon={<i className="fa fa-star"></i>}
              activeColor="#ffd700"
            />
          </div>
          <div className="col-4">
            <button className="btn btn-block btn-outline-success mt-2 mb-2">
              POST
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;

import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import {
  createaProduct,
  getCategories,
  updateProduct,
} from "./helper/adminapicall";
import { isAuthenticated } from "../auth/helper";
import Card from "../core/Card";
import { getAllProducts } from "./helper/adminapicall";

const UpdateProduct = ({ product,productId }) => {
  const { user, token } = isAuthenticated();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: "",

    category: "",
    loading: true,
    error: "",
    createdProduct: "",
    getaRedirect: false,
    formData: "",
  });

  const {
    name,
    description,
    price,
    stock,

    // category,
    loading,
    // error,
    createdProduct,
    // getaRedirect,
    formData,
  } = values;

  

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    updateProduct(productId, token, formData)
      .then((data) => {
        setValues({
          ...values,
          name: "",
          description: "",
          price: "",
          photo: "",
          stock: "",
          loading: false,
          createdProduct: data.name,
        });
      })
      .catch((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        }
      });
  };

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const successMessage = () => {
    if (!loading) {
      return (
        <div
          className="alert alert-success mt-3"
          style={{ display: createdProduct ? "" : "none" }}
        >
          <h4>{createdProduct} created successfully</h4>
        </div>
      );
    }
  };
  const onLoading = () => {
    if (!loading) {
      // Your application has indicated there's an error
      window.setTimeout(function () {
        // Move to a new location or you can do something else
        window.location.href = "/";
      }, 2000);
      // return<div>
      //   Redirecting to Home Page...
      //   <Redirect to={"/"}  delay={3000}/>
      // </div>
    }
  };

  return (
    <Base
      title="Add a product here!"
      description="Welcome to product creation section"
      className="container bg-info p-4"
    >
      <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">
        Admin Home
      </Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2"></div>
      
          
            <div >
              <Card addToCart={false} product={product} />
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Name: </label>

                <div class="col-sm-10">
                  <input type="text" />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Description: </label>

                <div class="col-sm-10">
                  <input type="text" />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Stock: </label>

                <div class="col-sm-10">
                  <input type="text" />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Price: </label>

                <div class="col-sm-10">
                  <input type="text" />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Category: </label>

                <div class="col-sm-10">
                  <input type="text" />
                </div>
              </div>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
            </div>
         
      </div>
    {onLoading()}
        {successMessage()}
        {console.log(productId)}
    </Base>
  );
};

export default UpdateProduct;

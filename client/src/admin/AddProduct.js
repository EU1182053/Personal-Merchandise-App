import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { createaProduct, getCategories } from "./helper/adminapicall";
import { isAuthenticated } from "../auth/helper";

const AddProduct = () => {
  const {  token } = isAuthenticated();
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: "",
    categories: [],
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
    categories,
    // category,
    loading,
    // error,
    createdProduct,
    // getaRedirect,
    formData,
  } = values;

  const preload = () => {
    getCategories()
      .then((data) => {
        setValues({ ...values, categories: data, formData: new FormData() });
        console.log(data, formData);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    preload();
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
  
    // Clear any previous error and set loading state
    setValues({ ...values, error: "", loading: true });
    console.log(formData);
  
    createaProduct(token, formData) // Using the updated createProduct function
      .then((data) => {
        // If product creation is successful, reset the form values
        setValues({
          ...values,
          name: "",
          description: "",
          price: "",
          photo: "",
          stock: "",
          loading: false,
          createdProduct: data.name, // Or any other data property you want to show
        });
      })
      .catch((err) => {
        // Handle error and set error state
        console.error("Error during product creation:", err);
        setValues({ ...values, error: err.message || "Product creation failed." });
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
    if(!loading){

      // Your application has indicated there's an error
      window.setTimeout(function(){
        
  
          // Move to a new location or you can do something else
          window.location.href = "/";
  
      }, 2000);
      // return<div>
      //   Redirecting to Home Page...
      //   <Redirect to={"/"}  delay={3000}/>
      // </div>
  }
  };

  const createProductForm = () => (
    <form>
      <span>Post photo</span>
      <div className="form-group">
        <label className="btn btn-block btn-success">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image"
            placeholder="choose a file"
          />
        </label>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("name")}
          name="photo"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>
      <div className="form-group">
        <textarea
          onChange={handleChange("description")}
          name="photo"
          className="form-control"
          placeholder="Description"
          value={description}
        />
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          placeholder="Price"
          value={price}
        />
      </div>
      <div className="form-group">
        <select
          onChange={handleChange("category")}
          className="form-control"
          placeholder="Category"
        >
          <option>Select</option>
          {categories.map((cate, index) => (
            <option key={index} value={cate._id}>
              {cate.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("stock")}
          type="number"
          className="form-control"
          placeholder="Stock"
          value={stock}
        />
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-outline-success mb-3"
      >
        Create Product
      </button>
    </form>
  );

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
        <div className="col-md-8 offset-md-2">
          
          {createProductForm()}
          {successMessage()}
          {onLoading()}

          
        </div>
      </div>
    </Base>
  );
};

export default AddProduct;

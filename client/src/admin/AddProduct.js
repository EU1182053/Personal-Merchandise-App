import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { createaProduct, getCategories } from "./helper/adminapicall";
import { isAuthenticated } from "../auth/helper";

const AddProduct = () => {
  const { token } = isAuthenticated();

  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: "",
    categories: [],
    category: "",
    loading: false,
    error: "",
    createdProduct: "",
  });

  const [formData, setFormData] = useState(new FormData()); // Fix formData issue

  const { name, description, price, stock, categories, loading, createdProduct } = values;

  // Preload categories
  useEffect(() => {
    getCategories()
      .then((data) => {
        setValues((prevValues) => ({
          ...prevValues,
          categories: data.categories,
        }));
        setFormData(new FormData()); // Ensure formData is reset properly
      })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  // Handle form input changes
  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value); // Update FormData
    setValues({ ...values, [name]: value });
  };

  // Handle form submission
  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });

    createaProduct(token, formData)
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, loading: false });
        } else {
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
          setFormData(new FormData()); // Reset FormData
        }
      })
      .catch((err) => {
        console.error("Error during product creation:", err);
        setValues({ ...values, error: "Product creation failed.", loading: false });
      });
  };

  // Success message component
  const successMessage = () => {
    return createdProduct && (
      <div className="alert alert-success mt-3">
        <h4>{createdProduct} created successfully</h4>
      </div>
    );
  };

  // Redirect to home after success
  useEffect(() => {
    if (createdProduct) {
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
  }, [createdProduct]);

  // Form UI
  const createProductForm = () => (
    <form>
      <div className="form-group">
        <label className="btn btn-block btn-success">
          <input onChange={handleChange("photo")} type="file" accept="image/*" />
        </label>
      </div>
      <div className="form-group">
        <input onChange={handleChange("name")} className="form-control" placeholder="Name" value={name} />
      </div>
      <div className="form-group">
        <textarea onChange={handleChange("description")} className="form-control" placeholder="Description" value={description} />
      </div>
      <div className="form-group">
        <input onChange={handleChange("price")} type="number" className="form-control" placeholder="Price" value={price} />
      </div>
      <div className="form-group">
        <select onChange={handleChange("category")} className="form-control">
          <option>Select Category</option>
          {categories.map((cate, index) => (
            <option key={index} value={cate._id}>{cate.name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <input onChange={handleChange("stock")} type="number" className="form-control" placeholder="Stock" value={stock} />
      </div>

      <button type="submit" onClick={onSubmit} className="btn btn-outline-success mb-3">
        Create Product
      </button>
    </form>
  );

  return (
    <Base title="Add New Product | Admin Dashboard | Personal Merchandise App" description="Admins can add new products, including images, descriptions, and pricing, to expand the Personal Merchandise App catalog." className="container bg-info p-4">
      <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">Admin Home</Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">
          {createProductForm()}
          {successMessage()}
        </div>
      </div>
    </Base>
  );
};

export default AddProduct;

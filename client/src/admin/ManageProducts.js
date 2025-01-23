import React, { useState, useEffect, useCallback } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import {
  getAllProducts,
  deleteProduct,
  updateProduct,
  getCategories,
} from "./helper/adminapicall";

const ManageProducts = () => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    categories: [],
    loading: false,
    error: "",
    updatedProduct: "",
    formData: new FormData(),
  });
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState("");

  const { user, token } = isAuthenticated();
  const {
    name,
    description,
    price,
    stock,
    category,
    categories,
    updatedProduct,
    formData,
  } = values;

   // Memoize preloadProducts to avoid unnecessary recreation
   const preloadProducts = useCallback(() => {
    getAllProducts()
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setProducts(data);
        }
      })
      .catch((err) => console.log(err));
  }, []); // Empty dependency array, meaning it only depends on initial render

  // Memoize preloadCategories to avoid unnecessary recreation
  const preloadCategories = useCallback(() => {
    getCategories()
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({ ...values, categories: data });
        }
      })
      .catch((err) => console.log(err));
  }, [values]); // Add 'values' in the dependency array if it's being modified by preloadCategories

  useEffect(() => {
    preloadProducts();
    preloadCategories();
  }, [preloadProducts, preloadCategories]); // Add both functions to the dependency array


  // Handle input changes
  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  // Open form for editing a specific product
  const openEditForm = (product) => {
    setEditProductId(product._id);
    setValues({
      ...values,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      formData: new FormData(),
    });
  };

  // Update product
  const handleUpdateProduct = (event) => {
    event.preventDefault();
    if (!editProductId) {
      return console.log("No product selected for update");
    }
    updateProduct(editProductId, user._id, token, formData).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({
          ...values,
          updatedProduct: data.name,
          loading: false,
        });
        preloadProducts(); // Reload product list
      }
    });
  };

  // Delete product
  const handleDeleteProduct = (productId) => {
    deleteProduct(productId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        preloadProducts(); // Reload product list
      }
    });
  };

  return (
    <Base title="Manage Products" description="Update or remove products here">
      <Link className="btn btn-info mb-3" to="/admin/dashboard">
        <span>Admin Home</span>
      </Link>
      <h2 className="mb-4">All Products</h2>
      <h4 className="text-success">
        {updatedProduct && `${updatedProduct} updated successfully!`}
      </h4>
      <div className="row">
        <div className="col-12">
          {products.map((product, index) => (
            <div key={index} className="row text-center mb-3">
              <div className="col-4">
                <h3 className="text-white">{product.name}</h3>
              </div>
              <div className="col-4">
                <button
                  onClick={() => openEditForm(product)}
                  className="btn btn-success"
                >
                  Edit
                </button>
              </div>
              <div className="col-4">
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {editProductId && (
        <form className="mt-4">
          <h3 className="text-white">Edit Product</h3>
          <div className="form-group">
            <label className="text-light">Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={handleChange("name")}
            />
          </div>
          <div className="form-group">
            <label className="text-light">Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={handleChange("description")}
            />
          </div>
          <div className="form-group">
            <label className="text-light">Price</label>
            <input
              type="number"
              className="form-control"
              value={price}
              onChange={handleChange("price")}
            />
          </div>
          <div className="form-group">
            <label className="text-light">Stock</label>
            <input
              type="number"
              className="form-control"
              value={stock}
              onChange={handleChange("stock")}
            />
          </div>
          <div className="form-group">
            <label className="text-light">Category</label>
            <select
              className="form-control"
              value={category}
              onChange={handleChange("category")}
            >
              <option>Select</option>
              {categories.map((cate, index) => (
                <option key={index} value={cate._id}>
                  {cate.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-outline-success"
            onClick={handleUpdateProduct}
          >
            Update Product
          </button>
        </form>
      )}
    </Base>
  );
};

export default ManageProducts;

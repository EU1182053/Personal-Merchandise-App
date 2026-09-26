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
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ManageProducts = () => {
  const [categories, setCategories] = useState([]);
  const history = useHistory(); // Initialize history
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    loading: false,
    error: "",
    updatedProduct: "",
    formData: new FormData(),
    photo: ""
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
    updatedProduct,
    formData,
    photo
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
          setCategories(data.categories); // ✅ Store categories separately
        }
      })
      .catch((err) => console.log(err));
  }, []);
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

    const updatedFormData = new FormData(); // Maintain FormData instance
    updatedFormData.append("name", product.name);
    updatedFormData.append("description", product.description);
    updatedFormData.append("price", product.price);
    updatedFormData.append("stock", product.stock);
    updatedFormData.append("category", product.category);

    // If there's an existing photo in state, re-append it to FormData
    if (values.photo) {
      updatedFormData.append("photo", values.photo);
    }

    setValues((prevValues) => ({
      ...prevValues,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      formData: updatedFormData, // Update FormData safely
    }));
  };



  // Update product
  const handleUpdateProduct = async (event) => {
    event.preventDefault();
    if (!editProductId) {
      return console.log("No product selected for update");
    }
  
    const updatedFormData = new FormData();
    updatedFormData.append("name", values.name);
    updatedFormData.append("description", values.description);
    updatedFormData.append("price", values.price);
    updatedFormData.append("stock", values.stock);
    updatedFormData.append("category", values.category);
  
    if (values.photo) {
      updatedFormData.append("photo", values.photo);
    }
  
    const data = await updateProduct(editProductId, user._id, token, updatedFormData);
  
    if (data.error) {
      console.log(data.error);
    } else {
      console.log("Product updated successfully!");
  
      // Reload the product list to reflect the changes
      preloadProducts();
  
      // Force re-render by updating the state
      setEditProductId("");
      setValues({ ...values, updatedProduct: data.name });
  
      // Redirect after update
      history.push("/");
    }
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
    <Base title="Manage Products | Admin Dashboard | Personal Merchandise App" description="Admins can view, edit, or delete products in the Personal Merchandise App catalog efficiently.">
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
          <div className="text-center">
            <img
              src={`http://localhost:8000/api/product/photo/${editProductId}?t=${Date.now()}`}
              alt="Product"
              className="img-fluid mb-3"
              style={{ maxHeight: "150px", maxWidth: "150px" }}
            />
          </div>
          <div className="form-group">
            <label className="btn btn-block btn-info">
              Upload Product Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleChange("photo")}
                className="form-control"
              />
            </label>
          </div>
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

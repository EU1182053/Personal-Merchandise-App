import React, { useState, useEffect } from "react";

import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { getAllProducts, deleteProduct, updateProduct, getCategories } from "./helper/adminapicall";
import Card from "../core/Card";

const ManageProducts = () => {
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
    updatedProduct: "",
    getaRedirect: false,
    formData: "",
  });
  const [products, setProducts] = useState([]);

  const { user, token } = isAuthenticated();

  const {
    name,
    description,
    price,
    stock,
    categories,
    // category,
    loading,
    // error,
    updatedProduct,
    // getaRedirect,
    formData,
  } = values;

  const preload1 = () => {
    getCategories()
      .then((data) => {
        setValues({ ...values, categories: data, formData: new FormData() });
        console.log(data, formData);
      })
      .catch((err) => console.log(err));
  };

  const preload = () => {
    getAllProducts()
    .then(data => {
      
      setProducts(data)}
      )
      .catch(data => {
        if(data.error){
          console.log(data.error)
        }
      })
  };


  useEffect(() => {
    preload();
    preload1();
  }, []);


  const deleteThisProduct = productId => {
    deleteProduct(productId, user._id, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        preload();
      }
    });
  };
 

  const updateThisProduct = (productId, product) => {
    updateProduct(productId, user._id, token, product).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        return <Redirect to={'/'} />
      }
    });
  };


  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };


  return (
    <Base title="Welcome admin" description="Manage products here">
      <h2 className="mb-4">All products:</h2>
      <Link className="btn btn-info" to={`/admin/dashboard`}>
        <span className="">Admin Home</span>
      </Link> 
      <div className="row">
        <div className="col-12">
          <h2 className="text-center text-white my-3">Total {products.length} products</h2>

          {products.map((product, index) => {
            return (
              <><div key={index}>
                <Card addToCart={false} product={product} />
              </div><form>
                  <span>Post photo</span>
                  <div className="form-group">
                    <label className="btn btn-block btn-success">
                      <input
                        onChange={handleChange("photo")}
                        type="file"
                        name="photo"
                        accept="image"
                        placeholder="choose a file" />
                    </label>
                  </div>
                  <div className="form-group">
                    <input
                      onChange={handleChange("name")}
                      name="photo"
                      className="form-control"
                      placeholder="Name"
                      value={name} />
                  </div>
                  <div className="form-group">
                    <textarea
                      onChange={handleChange("description")}
                      name="photo"
                      className="form-control"
                      placeholder="Description"
                      value={description} />
                  </div>
                  <div className="form-group">
                    <input
                      onChange={handleChange("price")}
                      type="number"
                      className="form-control"
                      placeholder="Price"
                      value={price} />
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
                      value={stock} />
                  </div>

                  <button
                    type="submit"
                    onClick={() => {
                      updateThisProduct(product._id,product);
                    } }
                    className="btn btn-outline-success mb-3"
                  >
                    Update
                  </button>
                  <button
                    type="submit"
                    onClick={() => {
                      deleteThisProduct(product._id);
                    } }
                    className="btn btn-outline-success mb-3"
                  >
                    Delete
                  </button>
                </form></>
            );
          })}
        </div>
      </div>
    </Base>
  );
};

export default ManageProducts;

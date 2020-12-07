import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Home from './core/Home'
import Signup from './user/Signup'
import Signin from './user/Signin'
import Signout from './user/Signout'
import AdminRoute from "./auth/helper/AdminRoutes";
import PrivateRoute from "./auth/helper/PrivateRoutes";
import ReviewBoard from "./user/ReviewBoard";
import AdminDashBoard from "./user/AdminDashBoard";
import AddCategory from './admin/AddCategory'
import AddProduct from './admin/AddProduct'
import ManageProducts from './admin/ManageProducts'

import Cart from './core/Cart'

const Routes = () => {
    
   return(
    <BrowserRouter>
    <Switch>
        <Route path='/' exact component={Home} ></Route>
        <Route path='/signup' exact component={Signup} ></Route>
        <Route path='/signin' exact component={Signin} ></Route>
        <Route path='/signout' exact component={Signout} ></Route>
        <Route path="/user/review" exact component={ReviewBoard} />
      
        <AdminRoute path="/admin/dashboard" exact component={AdminDashBoard} />
        <AdminRoute path="/admin/create/category" exact component={AddCategory} />
        <AdminRoute path="/admin/create/product" exact component={AddProduct} />
        
        <AdminRoute path="/admin/products" exact component={ManageProducts} />
        <Route path='/cart' exact component={Cart} ></Route>
        
        
       



    </Switch>
    </BrowserRouter>
   )
}

export default Routes

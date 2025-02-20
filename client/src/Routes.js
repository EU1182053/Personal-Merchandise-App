import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Home from './core/Home'
import Signup from './user/Signup'
import Signin from './user/Signin'
import Signout from './user/Signout'
import AdminRoute from "./auth/helper/AdminRoutes";
import AdminDashBoard from "./user/AdminDashBoard";
import AddCategory from './admin/AddCategory'
import AddProduct from './admin/AddProduct'
import ManageProducts from './admin/ManageProducts'

import Cart from './core/Cart'
import Forgot from './user/Forgot'
import NewPassword from './user/NewPassword'
import Order from './core/Order'

const Routes = () => {
    
   return(
    <BrowserRouter>
    <Switch>
        <Route path='/' exact component={Home} ></Route>
        <Route path='/user/signup' exact component={Signup} ></Route>
        <Route path='/user/signin' exact component={Signin} ></Route>
        <Route path='/user/signout' exact component={Signout} ></Route>
      
        <AdminRoute path="/admin/dashboard" exact component={AdminDashBoard} />
        <AdminRoute path="/admin/create/category" exact component={AddCategory} />
        <AdminRoute path="/admin/create/product" exact component={AddProduct} />
        
        <AdminRoute path="/admin/products" exact component={ManageProducts} />
        <Route path='/cart' exact component={Cart} ></Route>
        <Route path='/user/recover' exact component={Forgot} ></Route>
        <Route path='/user/newPassword' exact component={NewPassword} ></Route>
        <Route path='/user/order' exact component={Order} ></Route>

    </Switch>
    </BrowserRouter>
   )
}

export default Routes

# MERN
# An E-Commerce web application built with the MERN (MongoDB, Express, React, Node.js) stack.
## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [API Endpoints](#api-endpoints)
6. [Testing](#testing)
7. [Contributing](#contributing)
8. [License](#license)

# Introduction
An e-commerce platform built using the MERN stack (MongoDB, Express, React, Node.js). This app allows users to browse products, add them to their cart, and make purchases. It also includes user authentication, product management, and order tracking features for admins.

## Features

- Built with the **MERN stack** (MongoDB, Express, React, Node.js)
- Allows users to browse products, add them to their cart, and make purchases
- Includes **user authentication** for secure login and account management
- **Admin features** for managing products and tracking orders
- Supports **product management** (adding/editing/removing products)
- **Order tracking** for both users and admins
- Responsive and user-friendly interface for a seamless shopping experience

## Technologies Used

- **MongoDB**: NoSQL database
- **Express**: Web framework
- **React**: Frontend library
- **Node.js**: Backend runtime
- **JWT**: Authentication
- **Braintree**: Payment gateway
- **SendGrid**: Email service
- **Mongoose**: MongoDB ODM
- **Nodemon**: Auto-reload server
- **MongoDB Compass**: GUI for managing MongoDB
- **Postman**: API testing and development tool

# Installation

<span style="font-size: 20px; font-weight: bold;">Prerequisites</span>
Ensure you have the following installed:

- Node.js (v14)
- React@5.2.0, react-router-dom@5.2.0
- MongoDB (Local instance or MongoDB Atlas)

<span style="font-size: 20px; font-weight: bold;">Step 1: Clone the Repository</span>
1. **Clone the repository**:
    ```bash
    git clone https://github.com/sawants3194/Personal-Merchandise-App.git
    ```

2. **Navigate to the server project directory**:
    ```bash
    cd Personal-Merchandise-App
    ```

3. **Install dependencies**:
    ```bash
    npm install
    ```

4. **Navigate to the client project directory in new terminal**:
    ```bash
    cd client
    ```

5. **Install dependencies**:
    ```bash
    npm install
    ```

6. Set up environment variables:
    - Create a `.env` file in both the root and client directories.
    - Add necessary configurations like:
        - **JWT_SECRET**: Secret key for JWT authentication
        - **SENDGRID_API_KEY**, **FROM_EMAIL** for email service
        - `MONGO_URI=mongodb://localhost:27017/test`
        - `PORT=8000`
        - `NODE_ENV=development`
     
    - **Client-side (.env)**: Add the following configuration:
        - `REACT_APP_BACKEND=http://localhost:8000/api` (URL of the backend server)
     

### Accessing the Application

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000/api`


## API Endpoints

### User Management
| Method | Endpoint                  | Description                                    |
|--------|---------------------------|------------------------------------------------|
| GET    | `/user/:userId`            | Get user details (requires authentication)     |
| PUT    | `/user/:userId`            | Update user details (admin only)               |
| POST   | `/user/recover`            | Recover user password                          |
| POST   | `/user/reset/:token`       | Reset password using recovery token           |

### Order Management
| Method | Endpoint                  | Description                                    |
|--------|---------------------------|------------------------------------------------|
| GET    | `/order/user/:userId`      | Retrieve user purchase history (requires auth) |

### Review Management
| Method | Endpoint                  | Description                                    |
|--------|---------------------------|------------------------------------------------|
| POST   | `/review/create/:userId`   | Create a review for a product (requires authentication) |
| GET    | `review/getByProducts`       | Get all reviews which is given by specific user |

### Product Management
| Method | Endpoint                        | Description                                        |
|--------|---------------------------------|----------------------------------------------------|
| POST   | `/product/create`               | Create a new product (admin only)                  |
| GET    | `/product/show`                 | Get all products                                   |
| GET    | `/product/show/:productId`      | Get a specific product (admin only)                |
| DELETE | `/product/:productId/:userId`   | Delete a product (admin only)                      |
| GET    | `/product/photo/:productId`     | Get product photo                                 |
| PUT    | `/product/update/:productId`    | Update product details (admin only)                |

### Payment Management
| Method | Endpoint                        | Description                                        |
|--------|---------------------------------|----------------------------------------------------|
| GET    | `/payment/gettoken/:userId`     | Get payment token (requires authentication)        |
| POST   | `/payment/braintree/:userId`    | Process payment using Braintree (requires authentication) |


### Order Management
| Method | Endpoint                        | Description                                        |
|--------|---------------------------------|----------------------------------------------------|
| `POST` | `/order/create`                 | Create a new order (requires authentication)      |
| `GET`  | `/order/all/:userId`            | Get all orders by user id           |
| `GET`  | `/order/status/:userId`         | Get the status of a user's order (requires authentication) |
| `PUT`  | `/order/:orderId/status/:userId`| Update the status of an order (admin only)        |

### Category Management
| Method | Endpoint                          | Description                                        |
|--------|-----------------------------------|----------------------------------------------------|
| `POST` | `/category/create/:userId`        | Create a new category (requires authentication and admin rights) |
| `GET`  | `/category/show`                  | Show all categories                                |
| `PUT`  | `/category/update/:userId/:categoryId` | Update a category (requires authentication and admin rights) |


### Authentication Management
| Method | Endpoint            | Description                                           |
|--------|---------------------|-------------------------------------------------------|
| `POST` | `/user/signup`           | Register a new user with email, password, and name    |
| `POST` | `/user/signin`           | Sign in an existing user (email and password required)|
| `GET`  | `/user/signout`          | Sign out the current user                             |
| `GET`  | `/testroute`        | Test route to check authentication (requires sign-in) |
| `GET`  | `/`                 | API home page (basic route for testing)               |

## Testing
Make sure server is stopped.
Edit .env file - `NODE_ENV=test`
**Run Test Cases**:
 ```bash
   npx jest --detectOpenHandles --runInBand
 ```
   
## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**.
2. **Create a new branch**:
   ```bash
   git checkout -b feature-branch
   ```
3. **Commit your changes:**
   ```bash
   git commit -m 'Add feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature-branch
   ```
5. **Open a pull request**




Here are some project outputs - 

Home Page
![home-page](https://github.com/user-attachments/assets/c4f66d5b-1d39-4177-8406-03997fe7d4e3)

Admin Page
 
![admin-page]![admin-page](https://github.com/user-attachments/assets/58e1a2a2-a3ec-4e88-af2e-f010460c22dd)


create category

![create_category](https://github.com/user-attachments/assets/67242a52-9b07-4dc7-88a9-b373f438347c)




create Product

![create_product](https://github.com/user-attachments/assets/ade432d6-9477-4feb-87ff-2e9a2487fdaf)



review any product
![review_product](https://github.com/user-attachments/assets/0041d9d8-41a3-41b2-8af3-5a18d309738d)



sign in and sign up page

![sign-in page](https://user-images.githubusercontent.com/65112935/235117853-fe73566e-463a-4aa3-970c-241b09871848.png)
![signup-page](https://user-images.githubusercontent.com/65112935/235117898-c03e57fb-57cf-4ace-a376-2eb7be0a622f.png)

order details page

![order_details](https://github.com/user-attachments/assets/211947c3-477e-4cdc-ad2c-799bdda69a3d)

Edit product
![edit_product](https://github.com/user-attachments/assets/bb72bdcd-e5ab-47c7-ab26-c8b5452a2f16)

Cart Page 
![cart-page](https://github.com/user-attachments/assets/5a5be795-dee8-4098-9fa7-f7667c6f2a17)


In terms of future tasks, there are a few items to consider. Firstly, implementing a category-based filtering system for products is a priority. Additionally, setting up a system to receive product updates via email would be beneficial. Finally, deploying the system on a server is also necessary for its continued development and availability.
Here are some project outputs - 



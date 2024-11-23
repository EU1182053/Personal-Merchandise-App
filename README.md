# MERN
# An e-commerce web application built with the MERN (MongoDB, Express, React, Node.js) stack.
## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [API Endpoints](#api-endpoints)
6. [Contributing](#contributing)
7. [License](#license)

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
        - **MONGO_URI**: MongoDB connection string
        - **JWT_SECRET**: Secret key for JWT authentication
        - **PORT**: Port for the backend server
        - **SENDGRID_API_KEY**, **FROM_EMAIL** for email service
     
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
| PUT    | `/order/user/:userId`      | Retrieve user purchase history (requires auth) |

### Review Management
| Method | Endpoint                  | Description                                    |
|--------|---------------------------|------------------------------------------------|
| POST   | `/review/create/:userId`   | Create a review for a product (requires authentication) |
| GET    | `/review/:productId`       | Get all reviews for a specific product (admin only) |

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
| `GET`  | `/order/all/:userId`            | Get all orders for a user (admin only)             |
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
| `POST` | `/signup`           | Register a new user with email, password, and name    |
| `POST` | `/signin`           | Sign in an existing user (email and password required)|
| `GET`  | `/signout`          | Sign out the current user                             |
| `GET`  | `/testroute`        | Test route to check authentication (requires sign-in) |
| `GET`  | `/`                 | API home page (basic route for testing)               |


## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**.
2. **Create a new branch**:
   ```bash
   git checkout -b feature-branch
   ```
3. **Commit your changes:**
   ```bash
   git commit -m 'Add feature
   ```
4. **Push to the branch**
   ```bash
   git push origin feature-branch
   ```
5. **Open a pull request**




Here are some project outputs - 


Admin Page
 
![admin-page](https://user-images.githubusercontent.com/65112935/235117532-f1aac853-d675-481f-a533-e9437facd29a.png)

create category

![create_category](https://user-images.githubusercontent.com/65112935/235117610-6f45b616-d8e0-4543-8bf2-5ee51c4c2192.png)



create Product

![create_product](https://user-images.githubusercontent.com/65112935/235117713-5e6727a0-7db4-45ce-a471-fb087cd9b498.png)


review any product

![review-page](https://user-images.githubusercontent.com/65112935/235117798-eba2f991-07dd-48d4-bb46-f75e8d592b9e.png)

sign in and sign up page

![sign-in page](https://user-images.githubusercontent.com/65112935/235117853-fe73566e-463a-4aa3-970c-241b09871848.png)
![signup-page](https://user-images.githubusercontent.com/65112935/235117898-c03e57fb-57cf-4ace-a376-2eb7be0a622f.png)



In terms of future tasks, there are a few items to consider. Firstly, implementing a category-based filtering system for products is a priority. Additionally, setting up a system to receive product updates via email would be beneficial. Finally, deploying the system on a server is also necessary for its continued development and availability.
Here are some project outputs - 


Admin Page
 
![admin-page](https://user-images.githubusercontent.com/65112935/235117532-f1aac853-d675-481f-a533-e9437facd29a.png)

create category

![create_category](https://user-images.githubusercontent.com/65112935/235117610-6f45b616-d8e0-4543-8bf2-5ee51c4c2192.png)



create Product

![create_product](https://user-images.githubusercontent.com/65112935/235117713-5e6727a0-7db4-45ce-a471-fb087cd9b498.png)


review any product

![review-page](https://user-images.githubusercontent.com/65112935/235117798-eba2f991-07dd-48d4-bb46-f75e8d592b9e.png)

sign in and sign up page

![sign-in page](https://user-images.githubusercontent.com/65112935/235117853-fe73566e-463a-4aa3-970c-241b09871848.png)
![signup-page](https://user-images.githubusercontent.com/65112935/235117898-c03e57fb-57cf-4ace-a376-2eb7be0a622f.png)



In terms of future tasks, there are a few items to consider. Firstly, implementing a category-based filtering system for products is a priority. Additionally, setting up a system to receive product updates via email would be beneficial. Finally, deploying the system on a server is also necessary for its continued development and availability.

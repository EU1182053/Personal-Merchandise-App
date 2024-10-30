# MERN
An e-commerce web application built with the MERN (MongoDB, Express, React, Node.js) stack.
1. Project Setup
To set up the project locally, follow these steps:

Clone the Repository
git clone <repository-url>
cd Personal-Merchandise-App

# Backend
Install Backend Dependencies

1. Install the required Node packages:
npm install

# Environment Variable Setup
To configure the necessary environment variables for this project, follow these steps:

Create the .env File

 Add the following variables to the .env file
  MongoDB Connection URI
  MONGO_URI=mongodb://localhost:27017/personal-merchandise
  
  JWT Secret for Authentication
  SECRET=your_jwt_secret_key
  
  Server Port
  PORT=5000

  SendGrid API Key
  SENDGRID_API_KEY=your_sendgrid_api_key
  
  Sender Email (Verified Sender)
  FROM_EMAIL=your_verified_sender
   

# Front End
Install Frontend Dependencies
1.Open a new terminal and navigate to the frontend directory:
 cd client

Environment Variable Setup
To configure the necessary environment variables for this project, follow these steps:

Node JS server connection
  REACT_APP_BACKEND=mongodb://localhost:27017/personal-merchandise

  REACT_APP_BACKEND
Create the .env File
2.Install the required Node packages:
 npm install


Run the Application
1. Start the backend server:
 npm start

2.In a separate terminal, start the frontend server:
 npm start


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

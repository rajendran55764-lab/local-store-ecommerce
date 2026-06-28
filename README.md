#  Local Store E-Commerce Platform

##  Prodigy Infotech Internship - Task 03

##  Project Overview
An e-commerce website for a local store enabling customers to browse and purchase products online with product listings, shopping cart, and order tracking.

##  Technologies Used
### Frontend
- React.js
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- bcryptjs
- JSON Web Tokens (JWT)
- dotenv
- cors

##  Features
-  Product Listings with Images
-  Product Search & Filter
-  Sort by Price & Rating
-  Shopping Cart
-  Order Placement
-  Order Tracking
-  User Reviews & Ratings
-  JWT Authentication
-  Admin Panel
-  Product Management
-  Order Management
-  Category Browsing

##  API Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register user | Public |
| POST | /api/auth/login | Login user | Public |
| GET | /api/products | Get all products | Public |
| POST | /api/products | Add product | Admin |
| DELETE | /api/products/:id | Delete product | Admin |
| GET | /api/cart | Get cart | Protected |
| POST | /api/cart/add | Add to cart | Protected |
| DELETE | /api/cart/remove/:id | Remove from cart | Protected |
| POST | /api/orders | Place order | Protected |
| GET | /api/orders/myorders | Get my orders | Protected |

##  Live Demo
### Frontend (Website)
[Click Here to Open Website](https://local-store-ecommerce-xxxx.vercel.app)

### Backend (API)
[Click Here to Open API](https://local-store-backend-qw5w.onrender.com)

##  Project Structure
local-store-ecommerce/
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Home.js
│   │   │   ├── Products.js
│   │   │   ├── Cart.js
│   │   │   ├── Orders.js
│   │   │   └── AdminPanel.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── server/
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   ├── Cart.js
    │   └── Order.js
    ├── middleware/
    │   └── auth.js
    ├── routes/
    │   ├── auth.js
    │   ├── product.js
    │   ├── cart.js
    │   └── order.js
    ├── server.js
    └── package.json

##  Author
rajendran55764-lab - Prodigy Infotech Internship Task 03

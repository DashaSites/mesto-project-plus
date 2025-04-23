### Backend API for a photo-sharing platform

A RESTful API built with Node.js, Express, TypeScript, and MongoDB to support user registration, authentication, and card management.
Functionality includes:
- User registration and login with hashed passwords and JWT-based authentication
- Validation of the user input with Celebrate and Joi
- Access control (users can only delete their own cards)
- Centralized error handling and request logging

This project was developed as part of a backend training module focused on secure data handling and maintainable architecture.

#### Technologies:
- Node.js
- Express
- TypeScript
- MongoDB
- JWT
- Joi + Celebrate
- Winston (logging)

#### To run this project locally:
0. Open your terminal and navigate to the folder where you want to save this project: cd path/to/your/folder
1. Clone the repository:
   git clone https://github.com/DashaSites/mesto-project-plus.git
2. Enter the project folder:
   cd mesto-project-plus
3. Install dependencies: npm install
4. Start the development server (with hot reload): npm run dev
Alternatively, to run once without hot reload: npm run start
5. Use Postman or a similar tool to test API endpoints:
   - POST /signup – to create a new user
   - POST /signin – to log in and receive a JWT token
   - GET /users/me – to fetch current user info (token required)
   - POST /cards – to create a card
   - DELETE /cards/:id – to delete your own card
   ...and so on.
<br>
Include your JWT token in the Authorization header as a Bearer token when accessing protected routes.

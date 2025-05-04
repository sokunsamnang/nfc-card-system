# Digital Business Card System

A backend server for a digital business card system where users can create and manage their digital business cards with personal and professional information.

## Features

-   **Authentication**: Email/password signup and login with JWT
-   **Profile Management**: Create and update user profiles
-   **Contact Information**: Add, update, and delete contact links (email, phone, etc.)
-   **Social Media**: Add, update, and delete social media links
-   **Photo Upload**: Upload and manage profile photos
-   **Public URLs**: Each user gets a unique public URL for their profile that can be shared and viewed without authentication

## Tech Stack

-   Node.js
-   Express
-   TypeScript
-   MongoDB with Mongoose
-   JWT Authentication
-   Multer for file uploads

## Project Structure

```
server/
├── src/
│   ├── config/       # Configuration files
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Custom middleware
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── utils/        # Utility functions
│   │   └── migrations/ # Database migration scripts
│   └── server.ts     # Main server file
├── uploads/          # Uploaded files
├── dist/             # Compiled JavaScript files
├── package.json
└── tsconfig.json
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
    ```
    npm install
    ```
3. Create a `.env` file in the root directory with the following variables:
    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/business-card-db
    JWT_SECRET=your_jwt_secret_key_here
    PUBLIC_BASE_URL=http://localhost:3000
    ```
4. Start MongoDB locally or use a cloud service (MongoDB Atlas)
5. For existing databases, run the migration to add public URLs:
    ```
    npx ts-node src/utils/migrations/add-public-url.ts
    ```
6. Run the server in development mode:
    ```
    npm run dev
    ```
7. For production, build the project and start:
    ```
    npm run build
    npm start
    ```

## API Endpoints

### Authentication

-   `POST /api/auth/signup` - Register a new user
-   `POST /api/auth/login` - Authenticate and get token

### Profile

-   `GET /api/profile` - Get current user's profile
-   `POST /api/profile` - Create user profile
-   `PUT /api/profile` - Update user profile
-   `POST /api/profile/photo` - Upload profile photo
-   `POST /api/profile/contact` - Add contact link
-   `DELETE /api/profile/contact/:id` - Remove contact link
-   `POST /api/profile/social` - Add social link
-   `DELETE /api/profile/social/:id` - Remove social link
-   `GET /api/profile/public/:publicUrl` - Get a user's public profile by their public URL (no authentication required)

## License

MIT

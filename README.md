# 📚 ShelfShare

**ShelfShare** is a community-driven mobile app built with React Native, where users can share and discover book recommendations. Whether you're looking for your next great read or want to recommend a favorite, ShelfShare is your digital bookshelf to connect with fellow readers.

---

<!-- ## 🖼️ Preview

| Login                             | Signup                              | Home Feed                       |
| --------------------------------- | ----------------------------------- | ------------------------------- |
| ![Login](./screenshots/login.png) | ![Signup](./screenshots/signup.png) | ![Home](./screenshots/home.png) |

--- -->

## 🚀 Features

- 👤 **User Authentication** – Secure login/signup using token-based JWT authentication.
- 📖 **Add Book Recommendations** – Share your favorite books with ratings and a short review.
- 🏠 **Home Feed** – Browse recent book recommendations from all users, sorted by newest first.
- 📂 **Profile Section** – View and manage your own book posts. Edit or delete your submissions.
- 🔄 **Pull to Refresh** – Instantly refresh the feed using `<RefreshControl />`.
- ⚠️ **Alerts** – Confirmation alerts for actions like logout or deleting a book.

---

## 🔐 Authentication

ShelfShare uses **JWT (JSON Web Tokens)** for secure user authentication. Credentials are validated against the backend, and tokens are stored using AsyncStorage.

### Signup Workflow:

1. User enters name, email, password.
2. App validates fields.
3. Sends data to backend.
4. Backend checks for duplicates and stores the user.
5. JWT token is generated and sent back.
6. Token stored locally.
7. User is logged in and redirected to Home.

### Login Workflow:

1. User enters email, password.
2. App sends credentials to backend.
3. Credentials are verified.
4. If valid, JWT token is returned.
5. Token is stored, and session starts.

---

## 🛠️ Tech Stack

- **Frontend:** React Native (Expo)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Cloud)
- **Token Handling:** JWT + AsyncStorage
- **Deployment:** Render.com
  - ⚙️ Keeps server active using CRON (ping every 14 mins)

---

## 🧪 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm
- MongoDB (Cloud or local instance)
- Expo CLI (`npm install -g expo-cli`)

### Backend Setup

The backend is located in the `backend` directory and uses Node.js with Express.js.

#### Folder Structure (Backend)

- **`src/`**: Main source code for the backend.
  - **`lib/`**: Utility libraries.
    - `cloudinary.js`: Configuration for Cloudinary (image uploads, if applicable).
    - `db.js`: MongoDB connection setup.
  - **`middleware/`**: Custom middleware.
    - `auth_middleware.js`: JWT authentication middleware to protect routes.
  - **`models/`**: MongoDB schemas.
    - `Book.js`: Schema for book recommendations (title, author, review, rating, user).
    - `User.js`: Schema for users (name, email, password).
  - **`routes/`**: API routes.
    - `authRoutes.js`: Handles `/auth` routes for login and signup.
    - `bookRoutes.js`: Handles `/books` routes for CRUD operations on book recommendations.
    - `index.js`: Main router to combine all routes.
- **`.env`**: Environment variables (MongoDB URI, JWT secret, etc.).
- **`package.json`**: Backend dependencies and scripts.

#### Backend Dependencies

- `express`: Web framework for Node.js.
- `mongoose`: MongoDB object modeling.
- `jsonwebtoken`: JWT generation and verification.
- `bcrypt`: Password hashing.
- `dotenv`: Environment variable management.
- `cors`: Cross-Origin Resource Sharing for API requests.
- `nodemon`: Development server auto-restart (dev dependency).

#### Backend Routes

- **`/auth`** (defined in `authRoutes.js`):
  - `POST /auth/signup`: Register a new user.
  - `POST /auth/login`: Authenticate a user and return a JWT.
- **`/books`** (defined in `bookRoutes.js`):
  - `GET /books`: Fetch all book recommendations (public).
  - `POST /books`: Add a new book recommendation (protected).
  - `DELETE /books/:id`: Delete a book recommendation (protected).

#### Steps to Run Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following:

   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   API_URL=your_render.com_api_deployed_url
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   > This uses `nodemon` to automatically restart the server on changes.

The backend will run on `http://localhost:5000`.

---

### Frontend Setup (Mobile)

The frontend is located in the `mobile` directory and is built with React Native using Expo.

#### Folder Structure (Frontend)

- **`app/`**: Main React Native app structure (Expo Router).
  - **`index.jsx`**: Entry point of the app.
  - **`(auth)/`**: Authentication-related screens.
    - `layout.jsx`: Layout for auth screens.
    - `signup.jsx`: Signup screen.
    - `signin.jsx`: Login screen.
  - **`(tabs)/`**: Tab-based navigation screens.
    - `index.jsx`: Home feed screen.
    - `profile.jsx`: User profile screen.
    - `create.jsx`: Create a post.
  - **`assets/`**: Static assets (images, fonts, etc.).
  - **`components/`**: Reusable UI components.
    - `SafeScreen.jsx`: Wrapper for safe area handling.
  - **`constants.js`**: App-wide constants (colors, API URLs, etc.).
- **`.env`**: Environment variables (API base URL, etc.).
- **`package.json`**: Frontend dependencies and scripts.

#### Frontend Dependencies

- `expo`: Framework for React Native development.
- `react-native`: Core React Native library.
- `expo-router`: File-based routing for navigation.
- `@react-navigation/native`: Navigation library for tabs and stacks.
- `axios`: HTTP client for API requests.
- `jwt-decode`: Decode JWT tokens.
- `expo-secure-store`: Secure storage for tokens (alternative to AsyncStorage).
- `react-native-safe-area-context`: Handle safe areas for iOS/Android.

#### Steps to Run Frontend

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   <!-- 3. Create a `.env` file in the `mobile` directory with the following:
      ```
      EXPO_PUBLIC_API_URL=http://localhost:5000
      ``` -->
3. Start the Expo project:
   ```bash
   npx expo start
   ```
4. Scan the QR code with the Expo Go app on your mobile device, or run on an emulator:
   - Press `a` for Android emulator.
   - Press `i` for iOS simulator.

---

<!-- ## 📡 Connecting Frontend and Backend

- Ensure the backend is running on `http://localhost:5000`.
- On physical devices, replace `localhost` with your machine's IP address in the `.env` file (e.g., `http://192.168.1.x:5000`).

--- -->

## 🛠️ Development Notes

- **Backend**: Use `nodemon` for hot reloading during development.
- **Frontend**: Expo provides hot reloading by default.
- **Database**: Ensure MongoDB is running and the URI is correct in the backend `.env` file.
- **CORS**: The backend is configured to allow requests from the frontend (via `cors`).

---

<!-- ## 📜 License

This project is licensed under the MIT License. -->

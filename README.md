# 📚 ShelfShare

**ShelfShare** is a community-driven mobile app built with React Native, where users can share and discover book recommendations. Whether you're looking for your next great read or want to recommend a favorite, ShelfShare is your digital bookshelf to connect with fellow readers.

---

## 🖼️ Preview

| Splash Screen                                         | Login                                         | Signup                                          | Home Screen 1                                  | Home Screen 2                                  | Create Screen                                   | Profile Screen                                    |
| ----------------------------------------------------- | --------------------------------------------- | ----------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- | ----------------------------------------------- | ------------------------------------------------- |
| ![Splash](/mobile/assets/images/UI/splashscreen.jpeg) | ![Login](/mobile/assets/images/UI/login.jpeg) | ![Signup](/mobile/assets/images/UI/signup.jpeg) | ![Home1](/mobile/assets/images/UI/Home_1.jpeg) | ![Home2](/mobile/assets/images/UI/Home_2.jpeg) | ![Create](/mobile/assets/images/UI/Create.jpeg) | ![Profile](/mobile/assets/images/UI/Profile.jpeg) |

---

## 🚀 Features

- 👤 **User Authentication** – Secure login/signup using token-based JWT authentication.
- 📖 **Add Book Recommendations** – Share your favorite books with ratings, a short review, and select a genre (suggested or custom).
- 🏠 **Home Feed** – Browse recent book recommendations from all users, sorted by newest first, with a genre filter (default: All). Initially loads 2 posts, with more loaded (2 at a time) on scroll.
- 📂 **Profile Section** – View and manage your own book posts. Delete your submissions.
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
- Expo CLI (`npm install -g expo-cli`) or Expo Go (Mobile App)

### Backend Setup

The backend is located in the `backend` directory and uses Node.js with Express.js.

#### Folder Structure (Backend)

- **`src/`**: Main source code for the backend.
  - **`lib/`**: Utility libraries.
    - `cloudinary.js`: Configuration for Cloudinary (image uploads, if applicable).
    - `db.js`: MongoDB connection setup.
    - `cron.js`: Sets up a CRON job to ping the server every 14 minutes, keeping it active on Render.com.
  - **`middleware/`**: Custom middleware.
    - `auth_middleware.js`: JWT authentication middleware to protect routes.
  - **`models/`**: MongoDB schemas.
    - `Book.js`: Schema for book recommendations (title, author, review, rating, user).
    - `User.js`: Schema for users (name, email, password).
  - **`routes/`**: API routes.
    - `authRoutes.js`: Handles `/auth` routes for login and signup.
    - `bookRoutes.js`: Handles `/books` routes for CRUD operations on book recommendations.
  - `index.js`: Main Express app setup, mounts all routes, and starts the server.
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
  - `GET /books`: Fetch all book recommendations (protected), supports pagination for infinite scroll.
  - `POST /books`: Add a new book recommendation (protected). Custom genres are normalized using a genre mapping system.
  - `DELETE /books/:id`: Delete a book recommendation (protected).
  - `GET /books/genre/:genre`: Fetch books by genre (protected), supports pagination.
  - `GET /books/genres`: Fetch all available genres, including suggested and custom genres (protected).
  - `GET /books/active-genres`: Fetch genres with at least one book (protected).
  - `GET /books/user`: Fetch books recommended by the authenticated user (protected).

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
  - **`_layout.jsx`**: Entry point of the app.
  - **`(auth)/`**: Authentication-related screens.
    - `layout.jsx`: Layout for auth screens.
    - `signup.jsx`: Signup screen.
    - `signin.jsx`: Login screen.
  - **`(tabs)/`**: Tab-based navigation screens.
    - `layout.jsx`: Layout for tabs screens.
    - `index.jsx`: Home feed screen.
    - `profile.jsx`: User profile screen.
    - `create.jsx`: Create a post.
  - **`assets/`**: Static assets (images, fonts, etc.).
  - **`components/`**: Reusable UI components.
    - `Loader.js`: a loading screen
    - `SafeScreen.jsx`: Wrapper for safe area handling.
    - `ErrorComponent.jsx`: Displays error messages for API fetch failures.
    - `LogoutButton.jsx`: Button component for user logout.
    - `ProfileHeader.jsx`: Header component for the profile screen.
  - **`lib/`**: Utility functions.
    - `utils.js`: Functions for date formatting (formatMemberSince, formatPublishDate).
  - **`store/`**: State management.
    - `authStore.js`: Zustand store for authentication state (login, signup, logout, checkAuth).
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
- `@react-native-async-storage/async-storage`: Local storage for tokens and user data.
- `react-native-safe-area-context`: Handle safe areas for iOS/Android.
- `zustand`: State management library for authentication store.

#### Steps to Run Frontend

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo project:
   ```bash
   npx expo start
   ```
4. Scan the QR code with the Expo Go app on your mobile device, or run on an emulator:
   - Press `a` for Android emulator.
   - Press `i` for iOS simulator.

---

## 🛠️ Development Notes

- **Backend**: Use `nodemon` for hot reloading during development.
- **Frontend**: Expo provides hot reloading by default.
- **Database**: Ensure MongoDB is running and the URI is correct in the backend `.env` file.
- **CORS**: The backend is configured to allow requests from the frontend (via `cors`).
- **Infinite Scroll:**: The home feed uses pagination, loading 2 posts initially and fetching the next 2 on scroll, implemented with a combination of state management and API calls.
- **Genre Filter**: The home feed supports dynamic filtering by genre, with "All" as the default to show all posts.
- **Genre Mapping**: Custom genres are normalized on the backend using a genre mapping system to ensure consistency (e.g., "sci-fi" maps to "Science Fiction").

---

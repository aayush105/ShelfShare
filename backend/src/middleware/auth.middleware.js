import jwt from "jsonwebtoken";
import User from "../models/User";

// const response = await fetch("http://localhost:3000/api/books", {
//   method: "POST",
//   body: JSON.stringify({
//     title,
//     caption,
//   }),
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// });

const protectRoute = async (req, res, next) => {
  try {
    // get token from the header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });
    }

    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    req.user = user; // attach user to the request object
    next(); // call the next middleware or route handler
    
  } catch (error) {
    console.error("Error in protectRoute middleware", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export default protectRoute;

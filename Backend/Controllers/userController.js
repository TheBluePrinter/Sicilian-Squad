import { getUser, createUser, checkIfUserExist } from "../Models/userModel.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SECRET_KEY = "secret_key";

function generateJWT(userId, username, user_admin) {
  const payload = {
    id: userId,
    username,
    user_admin,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  return token;
}

function createTokenCookie(res, user) {
  const token = generateJWT(user.user_id, user.user_username, user.user_admin);

  res.cookie("token", token, {
    httpOnly: true, // Prevents client-side access (XSS protection)
    secure: false, // Use HTTPS in production
    sameSite: "Strict",
    maxAge: 60 * 60 * 1000, // 1 hour
  });
}

export const whoAmI = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const userInfo = jwt.verify(token, SECRET_KEY);
    req.user = userInfo;
    res.send(req.user);
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

export const registerUser = (req, res) => {
  let { name, username, password } = req.body;
  username = username.toLowerCase();
  name = name.charAt(0).toUpperCase() + name.slice(1);

  const userExist = checkIfUserExist(username);
  if (userExist) {
    return res.status(409).send("User already exists");
  }

  if (!name || !username || !password) {
    return res.status(400).send("All fields required");
  }

  bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).send("Error hashing password");
    }

    try {
      const user = createUser(name, username, hash);

      if (user) {
        createTokenCookie(res, user);
        res.json({ message: "User Created" });

        req.user = user;
      }
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

export const loginUser = async (req, res) => {
  let { username, password } = req.body;
  username = username.toLowerCase();

  if (!username || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const user = getUser(username);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.user_password);

    if (isMatch) {
      createTokenCookie(res, user);
      res.json({
        message: "Login succesful",
        username: user.user_username,
      });
      req.user = user;
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.send("Logged out succesfully");
};

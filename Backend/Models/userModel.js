import { db } from "../Config/database.js";

export const createUser = (name, username, password) => {
  try {
    const stmt = db.prepare(
      "INSERT INTO users (user_name, user_username, user_password) VALUES (?,?,?)"
    );
    const user = stmt.run(name, username, password);
    return user || null;
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Failed to create user in database");
  }
};

export const getUser = (username) => {
  try {
    const stmt = db.prepare("SELECT * FROM users WHERE user_username = ?");
    const user = stmt.get(username);
    return user || null;
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Failed to fetch user from database");
  }
};

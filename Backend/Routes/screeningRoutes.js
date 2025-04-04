import express from "express";
import {
  addScreeningsHandler,
  getAllScreeningsHandler,
  getScreeningByIdHandler,
} from "../Controllers/screeningsController.js";
import isAdmin from "../Middleware/isAdmin.js";
import authMiddleware from "../Middleware/auth.js";

export const screeningRouter = express.Router();

screeningRouter.get("/", authMiddleware, isAdmin, getAllScreeningsHandler);
screeningRouter.get("/:id", authMiddleware, isAdmin, getScreeningByIdHandler);
screeningRouter.post("/add", addScreeningsHandler);

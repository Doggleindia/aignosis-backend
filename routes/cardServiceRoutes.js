import express from "express";
import { getUserServices } from "../controller/cardServiceController.js";

const router = express.Router();

router.get("/:user_id", getUserServices);

export default router;

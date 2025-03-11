import express from "express";
import {submitForm } from "../controller/flyersubmission.js"; 

const router = express.Router();

router.post("/submit", submitForm); // POST API for form submission

export default router;

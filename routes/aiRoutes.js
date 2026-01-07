import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { enhanceJobDescription, enhanceProfSummary, uploadResume } from "../controllers/aiController.js";
import upload from "../configs/multer.js";

const aiRouter=express.Router();

aiRouter.post('/enhance-pro-sum',protect,enhanceProfSummary)
aiRouter.post('/enhance-job-desc',protect,enhanceJobDescription)
aiRouter.post('/upload-resume', protect, upload.single('resume'), uploadResume);

export default aiRouter;
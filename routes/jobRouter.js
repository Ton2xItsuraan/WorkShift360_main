import express from 'express';
import jobPostController from '../controllers/jobPostController.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const jobRouter = express.Router();

jobRouter.post("/jobs", verifyToken, jobPostController.createJobPost);
jobRouter.get("/jobs", jobPostController.getAllJobPosts);
jobRouter.get("/jobs/:jobId", jobPostController.getJobPost);
jobRouter.get("/getMyJobPosts", verifyToken, jobPostController.getMyJobPosts);
jobRouter.put("/update/:id", verifyToken, jobPostController.updateJobPost);
jobRouter.delete("/delete/:id", verifyToken, jobPostController.deleteJobPost);


export default jobRouter
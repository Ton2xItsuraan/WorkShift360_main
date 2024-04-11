import express from 'express';
import applicantController from '../controllers/applicantController.js';

const applyRouter = express.Router();

applyRouter.post("/jobs/:jobId/apply", applicantController.createApplicantForJobPost);
applyRouter.get("/jobs/:jobId/applicants", applicantController.getApplicantsForJobPost);
applyRouter.get("/jobs/:jobId/applicants/:applicantId", applicantController.getApplicantById);
applyRouter.get("/jobs/:jobId/noofapplicants", applicantController.getNumberOfApplicantsForJobPost);
applyRouter.delete  ("/jobs/:jobId/applicants/:applicantId", applicantController.deleteApplicantForJobPost);

export default applyRouter;
import mongoose from "mongoose";
import Applicant from "../models/Applicant.js";
import JobPost from "../models/JobPost.js";
import uploadFile from "../database/uploadFile.js";

const createApplicantForJobPost = async (req, res, next) => {
    try {
        // Extract data from the request body
        const { name, email, coverLetter, phone, address, position } = req.body;
        const file = req.file;
        const jobId = req.params.jobId; // Extract jobId from request parameters

        // Check if the jobId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ success: false, message: "Invalid jobId" });
        }

        // Check if the job post exists
        const jobPost = await JobPost.findById(jobId);
        if (!jobPost) {
            return res.status(404).json({ success: false, message: "Job post not found" });
        }

        // Upload resume file
        const resume = await uploadFile(file);

        // Create a new applicant and associate with the job post
        const newApplicant = new Applicant({
            name,
            email,
            coverLetter,
            phone,
            address,
            position,
            resume,
            jobPost: jobId // Associate the applicant with the job post
        });

        // Save the applicant to the database
        await newApplicant.save();

        // Add applicant reference to the job post
        jobPost.Applicants.push(newApplicant._id);
        await jobPost.save();

        // Fetch all job posts including the newly created applicant
        const updatedJobPosts = await JobPost.find().populate('Applicants');

        // Return a success response with updated job posts
        res.status(201).json({ success: true, message: "Application Submitted", jobPosts: updatedJobPosts });
    } catch (error) {
        // Handle errors
        res.status(500).json({ success: false, message: error.message });
    }
};

const getApplicantsForJobPost = async (req, res, next) => {
    try {
        const jobId = req.params.jobId; // Extract jobId from request parameters

        // Check if the jobId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ success: false, message: "Invalid jobId" });
        }

        // Find the job post and populate the applicants
        const jobPost = await JobPost.findById(jobId).populate('Applicants');

        // Check if the job post exists
        if (!jobPost) {
            return res.status(404).json({ success: false, message: "Job post not found" });
        }

        // Return the list of applicants associated with the job post
        res.status(200).json({ success: true, applicants: jobPost.Applicants });
    } catch (error) {
        // Handle errors
        res.status(500).json({ success: false, message: error.message });
    }
};

const getApplicantById = async (req, res, next) => {
    try {
        const applicantId = req.params.applicantId; // Extract applicantId from request parameters

        // Check if the applicantId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(applicantId)) {
            return res.status(400).json({ success: false, message: "Invalid applicantId" });
        }

        // Find the applicant by id
        const applicant = await Applicant.findById(applicantId);

        // Check if the applicant exists
        if (!applicant) {
            return res.status(404).json({ success: false, message: "Applicant not found" });
        }

        // Return the applicant information
        res.status(200).json({ success: true, applicant });
    } catch (error) {
        // Handle errors
        res.status(500).json({ success: false, message: error.message });
    }
};

const getNumberOfApplicantsForJobPost = async (req, res, next) => {
    try {
        const jobId = req.params.jobId; // Extract jobId from request parameters

        // Check if the jobId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ success: false, message: "Invalid jobId" });
        }

        // Find the job post
        const jobPost = await JobPost.findById(jobId);

        // Check if the job post exists
        if (!jobPost) {
            return res.status(404).json({ success: false, message: "Job post not found" });
        }

        // Get the number of applicants associated with the job post
        const numberOfApplicants = jobPost.Applicants.length;

        // Return the count of applicants
        res.status(200).json({ success: true, numberOfApplicants });
    } catch (error) {
        // Handle errors
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteApplicantForJobPost = async (req, res, next) => {
    try {
        const jobId = req.params.jobId; // Extract jobId from request parameters
        const applicantId = req.params.applicantId; // Extract applicantId from request parameters

        // Check if both jobId and applicantId are valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(jobId) || !mongoose.Types.ObjectId.isValid(applicantId)) {
            return res.status(400).json({ success: false, message: "Invalid jobId or applicantId" });
        }

        // Find the job post
        const jobPost = await JobPost.findById(jobId);

        // Check if the job post exists
        if (!jobPost) {
            return res.status(404).json({ success: false, message: "Job post not found" });
        }

        // Find the applicant to be deleted
        const applicantToDelete = await Applicant.findById(applicantId);

        // Check if the applicant exists
        if (!applicantToDelete) {
            return res.status(404).json({ success: false, message: "Applicant not found" });
        }

        // Remove applicant reference from the job post
        jobPost.Applicants.pull(applicantId);
        await jobPost.save();

        // Delete the applicant
        await Applicant.findByIdAndDelete(applicantId);

        // Return success response
        res.status(200).json({ success: true, message: "Applicant deleted successfully" });
    } catch (error) {
        // Handle errors
        res.status(500).json({ success: false, message: error.message });
    }
};

export default {
    createApplicantForJobPost,
    getApplicantsForJobPost,
    getNumberOfApplicantsForJobPost,
    deleteApplicantForJobPost,
    getApplicantById
};

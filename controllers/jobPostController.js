import jwt from "jsonwebtoken";
import config from "../utils/config.js";
import JobPost from "../models/JobPost.js";
import User from "../models/User.js";
import uploadFile from "../database/uploadFile.js";
import mongoose from "mongoose";

// Define getTokenFrom function
function getTokenFrom(req) {
    const authorization = req.get("authorization");
  
    if (authorization && authorization.startsWith("Bearer ")) {
        return authorization.replace("Bearer ", "");
    }
  
    return null;
}

const createJobPost = async (req, res, next) => {
    try {
        const { jobTitle, companyName, minimumSalary, maximumSalary, salaryType, jobLocation, experienceLevel, employmentType, jobDescription, companyAddress, postedBy } = req.body;
        const file = req.file;

        // Verify token
        const token = getTokenFrom(req);
        if (!token) {
            return res.status(401).json({ error: "Token invalid" });
        }

        // Decode token
        const decodedToken = jwt.verify(token, config.JWT_SECRET);
        if (!decodedToken.id) {
            return res.status(401).json({ error: "Token invalid" });
        }

        // Find user by decoded token's id
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const companyLogo = await uploadFile(file);
        // Create new job post with user's id and other details
        const newJobPost = new JobPost({
            jobTitle,
            companyName,
            minimumSalary,
            maximumSalary,
            salaryType,
            jobLocation,
            companyAddress,
            experienceLevel,
            employmentType,
            jobDescription,
            postedBy,
            userId: user._id, 
            companyLogo,
        });

        await newJobPost.save();

        // Add the job post to the user's jobs array
        user.jobs.push(newJobPost);
        await user.save();

        // Return all job posts
        const jobPosts = await JobPost.find();
        res.status(201).json(jobPosts);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};


const getAllJobPosts = async (req, res, next) => {
    try {
        // Fetch all job posts
        let jobPosts = await JobPost.find();

        // Format the jobPostingDate for each job post
        jobPosts = jobPosts.map(jobPost => {
            const formattedDate = jobPost.jobPostingDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            return { ...jobPost.toJSON(), jobPostingDate: formattedDate };
        });

        // Return all job posts with formatted date
        res.status(200).json(jobPosts);
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message });
    }
};



const getJobPost = async (req, res, next) => {
    try {
        const jobId = req.params.jobId; // Extract jobId from request parameters

        // Check if the jobId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ success: false, message: "Invalid jobId" });
        }

        // Find the job post by id
        const jobPost = await JobPost.findById(jobId);

        // Check if the job post exists
        if (!jobPost) {
            return res.status(404).json({ success: false, message: "Job post not found" });
        }

        // Return the job post
        res.status(200).json({ success: true, jobPost });
    } catch (error) {
        // Handle errors
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMyJobPosts = async (req, res, next) => {
    try {
        const decodedToken  = jwt.verify(getTokenFrom(req), config.JWT_SECRET);

        const jobs = await JobPost.find({userId: decodedToken.id}).populate("userId")


        res.status(200).json(jobs);
    } catch (error) {
        next(error);
    }
};


const updateJobPost = async (req, res, next) => {
    try {
        const { id } = req.params;
        let job = await JobPost.findById(id);

        if (!job) {
            const error = new Error('Job not found');
            error.statusCode = 404; // Set status code
            throw error; // Throw the error to be caught by the error handling middleware
        }

        // Check if there's a file uploaded
        let companyLogo;
        if (req.file) {
            // Upload file
            companyLogo = await uploadFile(req.file);
        }

        // Update job fields
        job.set({
            ...req.body,
            companyLogo: companyLogo || job.companyLogo // Use the new companyLogo if uploaded, otherwise keep the existing one
        });

        // Save updated job post
        job = await job.save();

        res.status(200).json({
            success: true,
            job,
            message: "Job Updated Successfully",
        });

    } catch (error) {
        return next(error);
    }
}


const deleteJobPost = async (req, res, next) => {
    try {
        const { id } = req.params;

        let job = await JobPost.findById(id);
        if (!job) {
            const error = new Error('Job not found');
            error.statusCode = 404; 
            throw error;
        }
        await JobPost.deleteOne({ _id: id }); // Pass the job ID to deleteOne
        res.status(200).json({
            success: true,
            message: "Job Deleted Successfully",
        });
    } catch (error) {
        return next(error);
    }
}

export default {
    createJobPost,
    getAllJobPosts,
    getMyJobPosts,
    updateJobPost,
    deleteJobPost,
    getJobPost
};

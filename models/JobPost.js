import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import validator from "validator"

const jobPostSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    companyName: {
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    minimumSalary: {
        type: Number,
        required: true,
    },
    maximumSalary: {
        type: Number,
        required: true,
    },
    salaryType: {
        type: String,
        required: true,
    },
    jobLocation: {
        type: String,
        required: true,
    },
    companyAddress: {
        type: String,
    },
    jobPostingDate: {
        type: Date,
        default: Date.now // Set default value to current date and time
    },
    experienceLevel: {
        type: String,
        required: true
    },
    companyLogo: {
        url: String,
        filename: String,
    },
    employmentType: {
        type: String,
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
        min: 20,
        max: 500,
    },
    postedBy: {
        type: String,
        required: true,
        max: 50,
        validate: [validator.isEmail, "Please provide a valid email!"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    Applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Applicant"
    }]
});

jobPostSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

jobPostSchema.plugin(uniqueValidator);

const JobPost = mongoose.model("JobPost", jobPostSchema);

export default JobPost;
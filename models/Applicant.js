import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
import validator from "validator";

const applicantSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        validator: validator.isEmail,
        required: true,
    },
    coverLetter: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    resume: {
        url: String,
        filename: String,
    },
    position: {
        type: String,
        required: true
    },
    // Add a reference to the JobPost schema
    jobPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobPost",
        required: true
    }
});

applicantSchema.plugin(mongooseUniqueValidator);

const Applicant = mongoose.model("Applicant", applicantSchema);

export default Applicant;

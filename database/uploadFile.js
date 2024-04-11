import { ref, uploadBytes } from "firebase/storage";
import storage from "../utils/firebaseConfig.js";
import generateUniqueFileName from "./generateUniqueFileName.js";

async function uploadFile(file) {
    const storageRef = ref(storage, generateUniqueFileName(file));

    let contentType = "application/pdf"; // Set contentType to application/pdf for PDF files

    // Check if the file is an image
    if (file.mimetype.includes("image")) {
        contentType = "image/jpeg"; // Set contentType to image/jpeg for image files
    }

    const metadata = {
        contentType: contentType, // Set the contentType based on the file type
    };

    const snapshot = await uploadBytes(storageRef, file.buffer, metadata);
    const url = `https://firebasestorage.googleapis.com/v0/b/${snapshot.ref.bucket}/o/${encodeURIComponent(snapshot.ref.fullPath)}?alt=media`;

    return {
        url,
        filename: snapshot.ref.fullPath,
    };
}

export default uploadFile;

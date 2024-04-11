import mongoose from "mongoose";

export default function connectToDB(url) {
  mongoose.connect(url)
    .then(() => console.log("Connected to DB"))
    .catch((error) => {
      console.error("Error connecting to database:", error);
    });
}
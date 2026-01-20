import os from "node:os"
import {v2 as cloudinary} from 'cloudinary';
import {config} from 'dotenv';
config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const basePath = path.join(os.homedir(), "Desktop", "TagoreCloud");

export const uploadFile = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
        folder: "Tagore_Cloud",
        use_filename: true,
        unique_filename: false
        });

        console.log(result);
    } catch (error) {
        console.log("Error in cloudinary library", error);
        throw error;
    }
};
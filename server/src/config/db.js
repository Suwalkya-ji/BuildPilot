import mongoose from "mongoose";


const connectDB = async() => {
    try {
    
        const URL = process.env.MONGODB_URI;

        if (!URL) {
        throw new Error("MONGODB_URI is missing in .env file");
        }

        await mongoose.connect(URL);
        console.log("Db Connection successfully");
        
    } catch (error) {
        console.log("DB connection fail");
        console.error(error.message);
        process.exit(1);      
    }
}

export default connectDB;

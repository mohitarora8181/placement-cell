import mongoose from "mongoose";
import { DB_NAME } from "../Constant.js";
import dotenv from "dotenv"
const URI="mongodb+srv://adityaray947:adityaray125@cluster0.kldwlex.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
dotenv.config({
    path:'./.env'
})

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(URI, {
           
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connecting to MongoDB with URI:", process.env.MONGODB_URI);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED", error);
        process.exit(1);
    }
};
export default connectDB
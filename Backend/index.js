import dotenv from "dotenv"
import connectDB from "./db/index.js"
import userRoutes from "./Routes/userRoutes.js"
import {app} from "./app.js"
import express from "express"
import cors from 'cors'
import jobRoutes from './Routes/JobRoutes.js'; 
import setupSocketIO from './socket.js';

app.use(cors({
    origin: 'http://localhost:3000',
    methods:['GET','POST']
}));
dotenv.config({
    path:'./.env'
})
const { server, io } = setupSocketIO(app);

connectDB()
.then(()=>{
    app.use('/api/users', userRoutes);
    app.use('/api', jobRoutes); 
    server.listen(process.env.PORT || 8000,()=>{
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
export { io };


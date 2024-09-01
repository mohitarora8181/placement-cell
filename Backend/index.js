import dotenv from "dotenv"
import connectDB from "./db/index.js"
import userRoutes from "./Routes/userRoutes.js"
import {app} from "./app.js"
import express from "express"
import cors from 'cors'
import jobRoutes from './Routes/JobRoutes.js'; 
import setupSocketIO from './socket.js';
import path from 'path';

app.use(cors({
    origin: 'https://placement-cell-iczn.onrender.com/',
    methods:['GET','POST']
}));
dotenv.config({
    path:'./.env'
})
const _dirname=path.resolve();
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
app.use(express.static(path.join(_dirname,"/Frontend/build")));
app.get("*", (req, res) =>
    res.sendFile(path.join(_dirname, "Frontend","build", "index.html"))
  );





export { io };


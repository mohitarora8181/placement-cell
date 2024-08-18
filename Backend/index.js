import dotenv from "dotenv"
import connectDB from "./db/index.js"
import userRoutes from "./Routes/userRoutes.js"
import {app} from "./app.js"
dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.use('/api/users', userRoutes);
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})


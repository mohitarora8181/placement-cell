import express from 'express';
import cors from 'cors';
const app = express();
import User from "./models/SignupModel.js"

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




  
  


export { app };

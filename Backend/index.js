import dotenv from 'dotenv';
import connectDB from './db/index.js';
import userRoutes from './Routes/userRoutes.js';
import express from 'express';
import cors from 'cors';
import jobRoutes from './Routes/JobRoutes.js'; 
// import setupSocketIO from './socket.js';
import path from 'path';

// Initialize Express app
const app = express();


dotenv.config({ path: './.env' });


app.use(cors({
    origin: ['http://localhost:3000', 'https://placement-cell-iczn.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  }));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);


const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'Frontend', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'build', 'index.html'));
});

// Setup Socket.IO
// const { server, io } = setupSocketIO(app);


connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error('MONGO DB connection failed !!!', err);
  });




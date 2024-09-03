import dotenv from 'dotenv';
import connectDB from './db/index.js';
import userRoutes from './Routes/userRoutes.js';
import express from 'express';
import cors from 'cors';
import jobRoutes from './Routes/JobRoutes.js';
import path from 'path';
import setupSocketIO from './socket.js';


const app = express();

dotenv.config({
  path: './.env'
});

app.use(cors({
  origin: ['http://localhost:3000', 'https://placement-cell-iczn.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { server, io } = setupSocketIO(app);

// API Routes
app.use('/api/users', userRoutes);
app.use('/api', jobRoutes); // Correctly scoped route for jobs

// Serve static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'Frontend', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'build', 'index.html'));
});

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log('MONGO DB connection failed !!!', err);
  });
export { io };

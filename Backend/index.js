import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import userRoutes from './Routes/userRoutes.js';
import adminRoutes from './Routes/AdminRoutes.js';


const app = express();

dotenv.config({
  path: './.env'
});

// app.use(cors({
//   origin: ['http://localhost:3000','https://pcmsit.vercel.app/'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));
// app.options('*', cors());

app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api', adminRoutes);

// Serve static files
app.get('/', (req, res) => {
  return res.send("This is the API endpoint of PC MSIT");
})

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log('MONGO DB connection failed !!!', err);
  });

export default app;

import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDb from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRouter from './routes/aiRoutes.js';

const app=express();
const PORT=process.env.PORT || 3000;

//datbase connection
await connectDb();

app.use(express.json());
app.use(cors());

//home route
app.get('/',(req,res)=>{
    res.send('Resume Builder Server is running');
});

app.use('/api/users',userRouter);
app.use('/api/resumes',resumeRouter);
app.use('/api/ai',aiRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
import express from 'express'
// import ConnectToMongo from './db';
import mongoose from "mongoose";
import 'dotenv/config'
import { configDotenv } from 'dotenv';
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import listingRouter from './routes/listing.route.js'
import cookieParser from 'cookie-parser';

configDotenv();
// Connected to Database
// ConnectToMongo();

    mongoose.connect(process.env.MONGO).then(()=>{
        console.log("Connected to Database");;
    }).catch((err)=>{
        console.log(err);
        console.log("error  while connected to db");
    })


const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000,()=>{
    console.log("amanEstate server is running on port 3000");
})

// api routes

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);


// Midldleware 

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

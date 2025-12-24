import express, { Request, Response } from 'express';
import connectDatabase from './config/database';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

connectDatabase();

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running");
});

export default app;

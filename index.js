import 'dotenv/config'

import express from 'express';
import mongoose from 'mongoose';

import jwt from 'jsonwebtoken';

import auth from "./routes/auth.js"


const app = express();
app.use(express.json());
app.use("/auth", auth)

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;

db.on("error", (error) => {
    console.error(error);
});
  
db.once("open", () => console.log("Connected to database"));

app.get('/', (req,res) => {
    console.log(req);
    res.json({message: "connected"})
})




app.listen(process.env.PORT || port, () => {
    console.log(`Server listening on http://localhost:${process.env.PORT}`);
    console.log("Trying to connect to database...");
  });
import 'dotenv/config'

import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = 8080;

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;

db.on("error", (error) => {
    console.error(error);
});
  
db.once("open", () => console.log("Connected to database"));


app.listen(process.env.PORT || port, () => {
    console.log(`Server listening on https://localhost:${port}`);
    console.log("Trying to connect to database...");
  });
import 'dotenv/config'

import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import passportConfig from './passportConfig.js'
var x = passportConfig(passport);
const app = express();
app.use(express.json());

const port = 8080;

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

// Redirect the user to the Google signin page
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Retrieve user data using the access token received
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// profile route after successful sign in
app.get("/profile", (req, res) => {
  console.log(req);
  res.send("Welcome");
});


app.listen(process.env.PORT || port, () => {
    console.log(`Server listening on https://localhost:${port}`);
    console.log("Trying to connect to database...");
  });
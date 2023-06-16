require("dotenv").config();

const express = require("express");
const app = express();
const session = require('express-session')
const mongoose = require("mongoose");
const passport = require('passport')
const cors = require('cors')

const auth = require("./routes/auth.js")
const data = require("./routes/data.js")


app.use(express.json())
app.use(cors({credentials: true, origin: process.env.CLIENT_URL}))
app.use(session({
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
  }))
app.use(passport.initialize())
app.use(passport.session())
require("./passportConfig.js")(passport)
app.use("/auth", auth)
app.use("/data", data)

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
import { Router } from "express";
import passport from 'passport';
import passportConfig from '../passportConfig.js';
import jwt from "jsonwebtoken";


var x = passportConfig(passport);
const router = Router();

// Redirect the user to the Google signin page
router.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );


// Retrieve user data using the access token received
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        jwt.sign(
            { user: req.user },
            "secretKey",
            {expiresIn: "1h" },
            (err, token) => {
                if (err) {
                    return res.json({
                        token: null,
                    });
                }

                res.json({
                    token,
                });
                
            }

        )
        // console.log(res)
    //   res.redirect("../profile");
    }
  );
  
// profile route after successful sign in
router.get(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        console.log(req.headers)
      res.send("Welcome");
    }
  );

 export default router;
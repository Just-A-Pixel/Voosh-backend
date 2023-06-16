const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

const CLIENT_URL = process.env.CLIENT_URL;

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.send("Unauthorizzzzed");
};

// Redirect the user to the Google signin page
router.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

// Retrieve user data using the access token received
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: true,
        // successRedirect: CLIENT_URL,
        failureRedirect: `/login/failed`,
    }),
    (req, res) => {
        jwt.sign(
            { user: req.user },
            "secretKey",
            { expiresIn: "1h" },
            (err, token) => {
                if (err) {
                    return res.json({
                        token: null,
                    });
                }
                res.cookie("jwt", token);
                res.status(200).redirect(`${CLIENT_URL}`);
            }
        );
    }
);

router.get("login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
});



router.get("logout", (req, res) => {
    req.logOut();
    res.redirect(`${CLIENT_URL}`);
});

router.post(
    "/signup",
    passport.authenticate("local-signup"),
    (req, res) => {
        jwt.sign(
            { user: req.user },
            "secretKey",
            { expiresIn: "1h" },
            (err, token) => {
                if (err) {
                    return res.json({
                        token: null,
                    });
                }
                res.cookie("jwt", token);
                res.status(200).send({
                    success: true,
                });
            }
        );
    }
);

router.post(
    "/login",
    passport.authenticate("local-login", {
        // successRedirect: CLIENT_URL,
        session: true,
        failureRedirect: `${CLIENT_URL}/signup`,
    }),
    (req, res) => {
        jwt.sign(
            { user: req.user },
            "secretKey",
            { expiresIn: "1h" },
            (err, token) => {
                if (err) {
                    return res.json({
                        success: false,
                    });
                }
                res.cookie("jwt", token);
                res.status(200).send({
                    success: true,
                    token: token,
                });
            }
        );
    }
);

module.exports = router;

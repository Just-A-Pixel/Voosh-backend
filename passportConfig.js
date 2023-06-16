const GoogleStrategy = require("passport-google-oauth2").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/userModel.js");

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                callbackURL: "/auth/google/callback",
                passReqToCallback: true,
            },
            async (request, accessToken, refreshToken, profile, done) => {
                try {
                    console.log("Finding user in db...");

                    // User with only google signin
                    let existingUser = await User.findOne({
                        "google.id": profile.id,
                    });

                    if (existingUser) {
                        console.log("Existing user...")
                        return done(null, existingUser);
                    }

                    // User with only email signin - sync google id with email
                    existingUser = await User.findOneAndUpdate({
                      email : profile.email
                    }, {
                      google: {
                        id: profile.id,
                        name: profile.displayName,
                      }
                    })

                    if (existingUser) {
                      console.log("Existing user with no google...")
                      return done(null, existingUser);
                    }

                    console.log("Creating new user...");
                    const newUser = new User({
                        method: "google",
                        google: {
                            id: profile.id,
                            name: profile.displayName,
                        },
                        email: profile.emails[0].value,
                        hasPassword: false,
                        password: null,
                    });
                    await newUser.save();
                    return done(null, newUser);
                } catch (error) {
                    return done(error, false);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
                secretOrKey: "secretKey",
            },
            async (jwtPayload, done) => {
                try {
                    // Extract user
                    const user = jwtPayload.user;
                    done(null, user);
                } catch (error) {
                    console.log(error);
                    done(error, false);
                }
            }
        )
    );

    passport.use(
        "local-signup",
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true,
            },
            async (req, email, password, done) => {
                try {
                    console.log("Finding local-signup user in db...");
                    let existingUser = await User.findOne({ email: email });

                    if (existingUser && existingUser.hasPassword) {
                        console.log("existing User");
                        return done(null, false);
                    } else if (!existingUser) {
                        console.log("New user");
                        let newUser = new User();
                        newUser.email = email;
                        newUser.password = newUser.generateHash(password);
                        newUser.hasPassword = true;
                        await newUser.save();
                        return done(null, newUser);
                    } else if (
                        existingUser.hasPassword == null ||
                        !existingUser.hasPassword
                    ) {
                        console.log("User has existing google account");
                        localUser = await User.findOne({email : email})
                        localUser.password = localUser.generateHash(password)
                        localUser.hasPassword = true
                        await localUser.save()
                        return done(null, localUser);
                    }
                    console.log("No cases match");
                    return done(null, false);
                } catch (err) {
                    console.log(err);
                    return done(err, false);
                }
            }
        )
    );

    passport.use(
        "local-login",
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true,
            },
            async (req, email, password, done) => {
                try {
                    console.log("Finding local user...");
                    localUser = await User.findOne({ email: email });
                    if (!localUser) {
                        console.log("Local user not found");
                        return done(null, false);
                    }

                    console.log(localUser.validPassword(password));
                    if (!localUser.validPassword(password)) {
                        console.log("Wrong password!");
                        return done(null, false);
                    }
                    console.log("Local user found");
                    return done(null, localUser);
                } catch (error) {
                    console.log(error);
                    return done(error, false);
                }
            }
        )
    );
};

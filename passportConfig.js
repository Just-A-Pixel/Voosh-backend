import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as JwtStrategy, ExtractJwt} from "passport-jwt";
import User from "./models/userModel.js";

const passportConfig = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback : true
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
            console.log('Finding user in db...');
            let existingUser = await User.findOne({ 'google.id': profile.id });

            if (existingUser) {
              return done(null, existingUser);
            }
            console.log('Creating new user...');
            const newUser = new User({
              method: 'google',
              google: {
                id: profile.id,
                name: profile.displayName,
              },
              email: profile.emails[0].value,
              password: null
            });
            await newUser.save();
            return done(null, newUser);
        } catch (error) {
            return done(error, false)
        }
      }
    ));
    passport.use(
      new JwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
          secretOrKey: "secretKey",
        },
        async (jwtPayload, done) => {
          console.log("dwadwa")
          try {
            // Extract user
            const user = jwtPayload.user;
            console.log("dwadwadad")
            done(null, user); 
          } catch (error) {
            console.log(error)
            done(error, false);
          }
        }
      )
    );
}

export default passportConfig;

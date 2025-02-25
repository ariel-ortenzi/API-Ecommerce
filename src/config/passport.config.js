import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { userModel } from "../models/user.model.js";
import { createHash, verifyPassword } from "../utils/hash.js";
import { JWT_SECRET } from "../utils/jwt.js";
import { EMAIL_TYPES } from "../common/constants/email-types.js"
import { mailService } from "../dao/mongoDao/mail.service.js"

export function initializePassport() {
    passport.use(
        "register",
        new LocalStrategy({
            usernameField: "email",
            passReqToCallback: true,
        },
            async (req, email, password, done) => {
                const { first_name, last_name, age, } = req.body;

                if (!email || !password || !first_name || !last_name || !age) {
                    return done(null, false, { message: "All fields are required" })
                }

                const hashedPassword = await createHash(password);

                try {
                    const user = await userModel.create({
                        email,
                        password: hashedPassword,
                        first_name,
                        last_name,
                        age,
                    });

                    await mailService.sendMail({
                        to: user.email,
                        subject: "Bienvenidos a ORPACK",
                        type: EMAIL_TYPES.WELCOME,
                    })

                    return done(null, user);
                } catch (error) {
                    return done(error)
                }
            })
    );

    passport.use(
        "login",
        new LocalStrategy({
            usernameField: "email",
        },
            async (email, password, done) => {
                try {
                    const user = await userModel.findOne({
                        email,
                    })

                    if (!user) return done(null, false, { message: "User not found" });

                    const isValidPassword = await verifyPassword(password, user.password);

                    if (!isValidPassword) return done(null, false, { message: "Invalid password " });

                    return done(null, user)

                } catch (error) {
                    return done(error);
                }
            })
    );

    passport.use(
        "jwt",
        new JWTStrategy({
            secretOrKey: JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor])
        },
            async (payload, done) => {
                try {
                    return done(null, payload);
                } catch (error) {
                    return done(error);
                }
            })
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);

            return done(null, user);
        } catch (error) {
            return done(`Hubo un error: ${error.message}`);
        }
    });

}

function cookieExtractor(req) {
    let token = null;

    if (req && req.cookies) {
        token = req.cookies.token;
    }

    return token;
}
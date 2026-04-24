import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import UserModel from "../models/user-model.js";
import {GOOGLE, ENV_VAR} from "./env-var.js"
import AppError from "../utils/app-error-util.js";
import { StatusCodes } from "http-status-codes";

const handleOAuthUser = async ({ provider, providerId, email, name, picture }) => {
  if (!email) {
    throw new AppError ("Email not found from provider",
      StatusCodes.BAD_REQUEST
    )
  }

  let user = await UserModel.findOne({ email });

  if (!user) {
    user = await UserModel.create({
      fullName: name,
      email,
      profilePic: picture,
      authProvider: provider,
      providerId,
      isVerified: true,
    });
  } else {
    user.providerId = user.providerId || providerId;
    user.authProvider = user.authProvider || provider;
    user.isVerified = true;

    if (!user.profilePic && picture) {
      user.profilePic = picture;
    }

    await user.save();
  }

  return user;
};

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE.CLIENT_ID,
      clientSecret: GOOGLE.CLIENT_SECRET,
      callbackURL: `${ENV_VAR.SERVER_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await handleOAuthUser({
          provider: "google",
          providerId: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          picture: profile.photos?.[0]?.value,
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
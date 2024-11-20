import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const router = express.Router();

passport.use(
    new GoogleStrategy (
      {
        clientID: '1014550138183-3oqai7vj80vsbjg7v86falob0v23nuvr.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: '/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Authentication Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/'); // Redirect to app after login
  }
);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
  
export default router;

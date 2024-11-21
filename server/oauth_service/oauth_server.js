import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const router = express.Router();

passport.use(
    new GoogleStrategy (
      {
        clientID: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
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
router.get('/google', (req, res, next) => {
  const role = req.query.role || 'default';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: JSON.stringify({ role }),
  })(req, res, next);
});

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Extract the role from the state
    const state = JSON.parse(req.query.state || '{}');
    const role = state.role || 'default';

    if (role === 'manager') {
      res.redirect(process.env.FRONTENDURL + 'manager');
    } else if (role === 'cashier') {
      res.redirect(process.env.FRONTENDURL + 'cashier');
    } else {
      res.redirect('/');
    }
  }
);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
  
export default router;

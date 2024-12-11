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

/**
 * Route: /auth/google
 * Method: GET
 * Purpose: Initiates Google OAuth2 authentication.
 * Query Parameters:
 *  - role (optional): Specifies the user role (e.g., 'manager', 'cashier'). Defaults to 'default'.
 */
router.get('/google', (req, res, next) => {
  const role = req.query.role || 'default';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: JSON.stringify({ role }),
  })(req, res, next);
});

/**
 * Route: /auth/google/callback
 * Method: GET
 * Purpose: Handles the callback from Google OAuth2 after authentication.
 * Query Parameters:
 *  - state: JSON string containing the user role.
 * Behavior:
 *  - Redirects to a frontend URL based on the user role:
 *    - 'manager': Redirects to the manager dashboard.
 *    - 'cashier': Redirects to the cashier dashboard.
 *    - Default: Redirects to the main frontend URL.
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const state = JSON.parse(req.query.state || '{}');
    const role = state.role || 'default';

    if (role === 'manager') {
      res.redirect(process.env.FRONTENDURL + 'manager');
    } else if (role === 'cashier') {
      res.redirect(process.env.FRONTENDURL + 'cashier');
    } else {
      res.redirect(process.env.FRONTENDURL);
    }
  }
);

/**
 * Route: /auth/logout
 * Method: GET
 * Purpose: Logs the user out and redirects them to the frontend URL.
 */
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.FRONTENDURL);
});
  
export default router;

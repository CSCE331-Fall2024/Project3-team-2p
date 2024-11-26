import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import customerRoutes from './customer_service/customer_server.js'
import inventoryRoutes from './inventory_service/inventory_server.js'
import analyticsRoutes from './analytics_service/analytics_server.js'
import cashierRoutes from './cashier_service/cashier_server.js'
import translateRoutes from './translation_service/translation_server.js'
import oauthRoutes from './oauth_service/oauth_server.js';

const app = express();
const PORT = process.env.PORT || 3000;

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized: Please log in' });
};

app.use(
    session({
      secret: 'your-secret',
      resave: false,
      saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(express.json());

app.use('/api/customers', customerRoutes);
app.use('/auth', oauthRoutes); 
app.use('/api/inventory', inventoryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/cashier', cashierRoutes);
app.use('/api/translation', translateRoutes);
app.use('/api/cashier', cashierRoutes); 

app.use(ensureAuthenticated);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
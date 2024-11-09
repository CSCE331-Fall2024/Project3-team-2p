import express from 'express';
import cors from 'cors';
import path from 'path';
import customerRoutes from './customer_service/customer_server.js'
import inventoryRoutes from './inventory_service/inventory_server.js'
import cashierRoutes from './cashier_service/cashier_server.js'

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use('/api/customers', customerRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/cashier', cashierRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
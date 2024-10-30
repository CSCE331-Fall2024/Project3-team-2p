import express from 'express';
import cors from 'cors';
import path from 'path';
import customerRoutes from './customer_interface/customer_server.js'
import inventoryRoutes from './inventory_service/inventory_server.js'

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({ origin: 'http://localhost:8080' }));
app.use(express.json());
app.use('/api/customers', customerRoutes);
app.use('/api/inventory', inventoryRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
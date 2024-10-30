import express from 'express';
import path from 'path';
import customerRoutes from './customer_interface/customer_server.js'
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({ origin: 'http://localhost:8080' }));
app.use(express.json());
app.use('/api/customers', customerRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello, World!", success: true, data: { name: "John Doe", age: 30 } });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
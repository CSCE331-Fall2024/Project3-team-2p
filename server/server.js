const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello, World!", success: true, data: { name: "John Doe", age: 30 } });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
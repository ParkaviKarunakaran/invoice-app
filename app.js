const express = require('express');
// const { sequelize } = require('./models');
const bodyParser = require('body-parser')
const invoiceRoutes = require('./routes/invoice');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Use the invoice routes
app.use('/api', invoiceRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}.`);
});

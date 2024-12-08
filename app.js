const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB connection
mongoose
  .connect('mongodb+srv://federicaitaliani:federicaitaliani@cluster0.u0qf8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define Schema and Model
const companySchema = new mongoose.Schema({
  name: String,
  ticker: String,
  price: Number,
});

const Company = mongoose.model('PublicCompanies', companySchemam 'PublicCompanies');

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/process', async (req, res) => {
  const { searchBy, search } = req.query;
  let query = {};

  if (searchBy === 'name') {
    query = { name: { $regex: search, $options: 'i' } };
  } else if (searchBy === 'ticker') {
    query = { ticker: { $regex: search, $options: 'i' } };
  }

  try {
    const companies = await Company.find(query);
    res.json({ companies });
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "An error occurred." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

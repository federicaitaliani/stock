const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB Connection
mongoose
  .connect('mongodb+srv://<username>:<password>@cluster.mongodb.net/Stock?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Schema and Model
const companySchema = new mongoose.Schema({
  name: String,
  ticker: String,
  price: Number,
});
const Company = mongoose.model('PublicCompanies', companySchema, 'PublicCompanies');

// Routes

// View 1: Home (serves the form)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// View 2: Process (handles form submission and database query)
app.get('/process', async (req, res) => {
  const { searchBy, search } = req.query;

  // Build query based on search type
  let query = {};
  if (searchBy === 'name') {
    query = { name: { $regex: search, $options: 'i' } }; // Case-insensitive search for name
  } else if (searchBy === 'ticker') {
    query = { ticker: { $regex: search, $options: 'i' } }; // Case-insensitive search for ticker
  } else {
    return res.status(400).send("Invalid search type.");
  }

  try {
    const companies = await Company.find(query);
    console.log("Query Results:", companies); // Log results to the console

    // Display results on the webpage
    let output = "<h1>Search Results:</h1>";
    if (companies.length > 0) {
      companies.forEach(company => {
        output += `<p>Name: ${company.name}, Ticker: ${company.ticker}, Price: $${company.price}</p>`;
      });
    } else {
      output += "<p>No matching companies found.</p>";
    }
    output += '<a href="/">Back to Home</a>';
    res.send(output);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).send("An error occurred.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

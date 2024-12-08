require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Schema and Model
const publicCompanySchema = new mongoose.Schema({
    name: String,
    ticker: String,
    price: Number,
});
const PublicCompany = mongoose.model('PublicCompany', publicCompanySchema);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/process', async (req, res) => {
    const { query, searchType } = req.query;
    try {
        let results;
        if (searchType === 'ticker') {
            results = await PublicCompany.find({ ticker: { $regex: `^${query}$`, $options: 'i' } });
        } else if (searchType === 'company') {
            results = await PublicCompany.find({ name: { $regex: query, $options: 'i' } });
        }
        
        // Log to console
        console.log('Results:', results);

        // Build HTML response (Extra Credit)
        let html = '<h1>Search Results</h1>';
        if (results.length > 0) {
            results.forEach(result => {
                html += `<p>Company: ${result.name}, Ticker: ${result.ticker}, Price: $${result.price}</p>`;
            });
        } else {
            html += '<p>No results found.</p>';
        }
        res.send(html);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Start Server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
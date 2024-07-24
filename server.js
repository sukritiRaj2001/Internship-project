const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route to render the index page
app.get('/', (req, res) => {
    res.render('index', { error: null });
});

// Route to handle form submission
app.post('/api/submit', (req, res) => {
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
        return res.render('index', { error: 'All fields are required!' });
    }

    // Define the path to the JSON file
    const filePath = path.join(__dirname, 'data', 'submissions.json');

    let submissions = [];

    try {
        // Check if file exists
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath, 'utf8');
            // Handle empty file
            submissions = fileData ? JSON.parse(fileData) : [];
        } else {
            // If file doesn't exist, initialize submissions as an empty array
            submissions = [];
        }
    } catch (err) {
        console.error('Error reading or parsing JSON file:', err);
        // If JSON parsing fails, initialize submissions as an empty array
        submissions = [];
    }

    // Add new submission
    submissions.push({ name, email });

    try {
        // Save submissions to file
        fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2));
    } catch (err) {
        console.error('Error writing JSON file:', err);
        return res.status(500).send('Internal Server Error');
    }

    // Render result page with submitted data
    res.render('result', { name, email });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

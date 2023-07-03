const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var port = process.env.PORT || 8081;
// Parse JSON request body
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'images'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database!');
});

// Route to add a record
app.post('/add', (req, res) => {
    try {
        const { email, name, password, place } = req.body;

        // Insert record into the database
        db.query(
            'INSERT INTO adda (email, name, password, place) VALUES (?, ?, ?, ?)',
            [email, name, password, place],
            (error, result) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ error: 'Failed to add record' });
                    return;
                }

                res.json({ id: result.insertId, email, name, place });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add record' });
    }
});

// Route to delete a record
app.delete('/delete/:id', (req, res) => {
    try {
        const recordId = req.params.id;

        // Delete record from the database
        db.query('DELETE FROM adda WHERE id = ?', [recordId], (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to delete record' });
                return;
            }

            if (result.affectedRows === 0) {
                res.status(404).json({ error: 'Record not found' });
                return;
            }

            res.json({ message: 'Record deleted successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete record' });
    }
});

// Route to update a record
app.put('/update/:id', (req, res) => {
    try {
        const recordId = req.params.id;
        const { email, name, password, place } = req.body;

        // Update record in the database
        db.query(
            'UPDATE adda SET email = ?, name = ?, password = ?, place = ? WHERE id = ?',
            [email, name, password, place, recordId],
            (error, result) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ error: 'Failed to update record' });
                    return;
                }

                if (result.affectedRows === 0) {
                    res.status(404).json({ error: 'Record not found' });
                    return;
                }

                res.json({ message: 'Record updated successfully' });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update record' });
    }
});

// Route to get all records
app.get('/records', (req, res) => {
    try {
        // Retrieve all records from the database
        db.query('SELECT * FROM adda', (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to get records' });
                return;
            }

            res.json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get records' });
    }
});

// Route to filter records by email
app.get('/records/:email', (req, res) => {
    try {
        const userEmail = req.params.email;

        // Retrieve records matching the given email from the database
        db.query('SELECT * FROM adda WHERE email = ?', [userEmail], (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to filter records' });
                return;
            }

            res.json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to filter records' });
    }
});

app.use(function (req, res) {
    // Invalid request
    res.json({
        error: {
            'name': 'Error',
            'status': 404,
            'message': 'Invalid Request',
            'statusCode': 404,
            'stack': 'http://localhost:8081/'
        },
        message: 'Testing!'
    });
});

// state the server
app.listen(port);

console.log('Server listening on port ' + port);
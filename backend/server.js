const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database Configuration
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "my_project"
};

// Create Connection with Reconnect Handling
let db;

function handleDisconnect() {
    db = mysql.createConnection(dbConfig);

    db.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            setTimeout(handleDisconnect, 2000);  // Retry after 2 seconds
        } else {
            console.log('Connected to MySQL');
        }
    });

    db.on('error', (err) => {
        console.error('MySQL error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();  // Reconnect on connection loss
        } else {
            throw err;  // If other fatal errors occur, crash the app
        }
    });
}

handleDisconnect();

// Route to Fetch Data from Users Table
app.get('/', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Query Error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        return res.json(data);
    });
});

app.post('/create', (req, res) => {
    console.log("RECEIVED");
    const sql = "INSERT INTO users (`name`, `phone`, `email`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.phone,
        req.body.email,
    ]
    db.query(sql, [values], (err, data) => {
        if(err) return res.json(err);
        return res.json("created");
    })
})

app.put('/update/:id', (req, res) => {
    console.log("PUT request received at /update/" + req.params.id);
    const sql = "UPDATE users SET `name` = ?, `phone` = ?, `email` = ? WHERE id = ?";
    
    const id = req.params.id;  // Get ID from URL parameter
    const values = [
        req.body.name,
        req.body.phone,
        req.body.email,
    ];

    db.query(sql, [...values, id], (err, data) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (data.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User updated successfully" });
    });
});

app.delete('/delete/:id', (req, res) => {
    const sql = "DELETE FROM users WHERE id = ?"
    const id = req.params.id;
    console.log(req.body);

    db.query(sql, [id], (err, data) => {
        if(err) return res.json(err);
        return res.json("deleted");
    })
})

// Start Express Server
app.listen(8081, () => {
    console.log("Server listening on port 8081...");
});

 // server.js
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL Database setup
const db = mysql.createConnection({
  host: 'localhost',   // Cambia esto según tu configuración
  user: 'root',        // Cambia esto según tu configuración
  password: '',// Cambia esto según tu configuración
  database: 'productos_db' // Cambia esto según tu configuración
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Create a table (if not exists)
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS producto (
    cod INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL
  )
`;

db.query(createTableQuery, (err) => {
  if (err) {
    console.error('Error creating table:', err);
    return;
  }
  console.log('Table created or already exists.');
});

// Routes
app.get('/productos', (req, res) => {
  const query = 'SELECT * FROM producto';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.send( results );
  });
});

app.get('/productos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM producto WHERE cod = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.send( result[0]);
  });
});

app.post('/productos', (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  const query = 'INSERT INTO producto (nombre, descripcion, precio) VALUES (?, ?, ?)';
  db.query(query, [nombre, descripcion, precio], (err, result) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.send(result.insertId, nombre, descripcion, precio );
  });
});

app.put('/productos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;
  const query = 'UPDATE producto SET nombre = ?, descripcion = ?, precio = ? WHERE cod = ?';
  db.query(query, [nombre, descripcion, precio, id], (err) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.send( id, nombre, descripcion, precio );
  });
});

app.delete('/productos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM producto WHERE cod = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }
    res.send({ message: 'Deleted', changes: result.affectedRows });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

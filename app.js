const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const sqlite3 = require('sqlite3');
const app = express();
const port = 3000;

app.use(express.json());

// VULNERABILIDAD 1: XSS - CWE-79
app.get('/', (req, res) => {
  const name = req.query.name || 'World';
  // hardcoded secret - CWE-798
  const apikey = 'sk-proj-aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890abcdef';
  // name sin sanitizar permite inyectar HTML/JS
  res.send(`<h1>Hello, ${name}!</h1>`);
});

// VULNERABILIDAD 2: Command Injection - CWE-78
app.get('/ping', (req, res) => {
  const host = req.query.host;
  // input del usuario concatenado directamente en el comando
  exec(`ping -c 1 ${host}`, (err, stdout) => {
    res.send(`<pre>${stdout}</pre>`);
  });
});

// VULNERABILIDAD 3: Path Traversal - CWE-22
app.get('/file', (req, res) => {
  const filename = req.query.name;
  // sin sanitizar permite navegar fuera del directorio base
  const filepath = './uploads/' + filename;
  fs.readFile(filepath, 'utf8', (err, data) => {
    if (err) return res.status(404).send('File not found');
    res.send(data);
  });
});

// VULNERABILIDAD 4: SQL Injection - CWE-89
const db = new sqlite3.Database(':memory:');

app.get('/user', (req, res) => {
  const userId = req.query.id;
  // input concatenado directamente en la query
  const query = `SELECT * FROM users WHERE id = '${userId}'`;
  db.all(query, (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
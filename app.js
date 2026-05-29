const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => {
const name = req.query.name || 'World';

const apikey = 'sk-proj-aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890abcdef';

res.send(`<h1>Hello, ${name}!</h1>`);
});
app.listen(port, () => {
console.log(`🚀 App listening on http://localhost:${port}`);
console.log('Try accessing: http://localhost:3000/?name=<script>alert("XSS")</script>');

});



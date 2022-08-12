import express  from 'express'

import dbConfig from '../src/config/db.js';
// ↑ exports = {user, password, host, databse}

import connection from '../src/config/connect.js'
import query from '../src/config/query.js'

const app = express()
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/list', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => {}) 
  const results = await query(conn, 'SELECT * FROM Product').catch(console.log);
  res.json({ results });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
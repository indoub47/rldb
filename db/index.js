const { Pool } = require('pg');
const pool = new Pool();

module.exports = {  
  query: (text, params, callback) => {
    const start = Date.now();
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start;
      console.log('executed query', { text, duration, rows: res.rowCount });
      callback(err, res);
    })
  },

    
  query_promise: (text, params, callback) => {
    console.log("text", text);
    console.log("params", params);
    //console.log("callback", callback);
    const start = Date.now();
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start;
      console.log('executed query with callback', { text, duration, rows: res.rowCount });
      callback(err, res);
    })
  },

  getClient: (callback) => {
    pool.connect((err, client, done) => {
      callback(err, client, done);
    });
  }
}

// notice here I'm requiring my database adapter file
// and not requiring node-postgres directly
/*
const db = require('../db')
app.get('/:id', (req, res, next) => {
  db.query('SELECT * FROM users WHERE id = $1', [id], (err, res) => {
    if (err) {
      return next(err)
    }
    res.send(res.rows[0])
  })
})


*/
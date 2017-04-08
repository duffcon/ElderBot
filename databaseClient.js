//databaseClient.js
const pg = require('pg');

var config = {
    user: 'elder',
    database: 'elder',
    password: 'bot',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 10000
};

var pool = new pg.Pool(config);
module.exports = pool;

// If you want access to data base add following code to that file:

// var pool = require ('databaseClient.js');
// .
// .
// .
// pool.connect((err, client, done) => {
//     client.query('Some Query', (err, result) => {
//         done(err);
//     });
// });

var mysql = require('mysql')

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    //   timezone: 'UTC',
})

connection.connect(function (err) {
    if (err) {
        console.log("DB Connection Error:" + err)
    } else {
        console.log("Successfully connected to the database.")
    }
});


module.exports = connection;
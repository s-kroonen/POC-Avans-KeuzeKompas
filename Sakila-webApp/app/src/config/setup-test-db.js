// scripts/setup-test-db-callback.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }

  console.log('Connected to test DB');

  // Seed country table
  connection.query(
    `INSERT IGNORE INTO country (country) VALUES ('USA'), ('Canada');`,
    (err) => {
      if (err) {
        console.error('Error seeding country table:', err);
        process.exit(1);
      }

      console.log('Country table seeded');

      // Seed language table
      connection.query(
        `INSERT IGNORE INTO language (name) VALUES ('English'), ('French');`,
        (err) => {
          if (err) {
            console.error('Error seeding language table:', err);
            process.exit(1);
          }

          console.log('Language table seeded');

          connection.end(err => {
            if (err) console.error('Error closing connection:', err);
            else console.log('Test DB setup complete');
          });
        }
      );
    }
  );
});

module.exports = {
  pgHost: "localhost",
  pgUser: process.env.DB_USER,
  pgDatabase: process.env.DB_NAME,
  pgPassword: process.env.DB_PASS,
  pgPort: 5432,
};

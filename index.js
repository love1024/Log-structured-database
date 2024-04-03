const db = require("./db");

// Hydrate map once the server is started
// Not needed every time like here
db.hydrateMap(() => {
  const key = process.argv.length > 2 ? process.argv[2] : null;
  const value = process.argv.length > 3 ? process.argv[3] : null;

  if (key && value) {
    db.write(key, value);
  } else if (key) {
    db.read(key);
  }
});

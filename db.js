const fs = require("fs");
const fsR = require("fs-reverse");
const nthline = require("nthline");
const readline = require("readline");
const DB_FILE = "file.txt";

const map = new Map();
let lineNumbers = 0;

// Read operation
function read(key) {
  if (map.has(key)) {
    const ln = map.get(key);
    nthline(ln, DB_FILE).then((line) => {
      console.log(line.split(",")[1]);
    });
  } else {
    console.log("Record not found.");
  }
}

// Write operation
function write(key, value) {
  fs.appendFile(DB_FILE, key + "," + value + "\r\n", function (err) {
    if (err) throw err;
    map.set(key, lineNumbers);
    lineNumbers++;
    console.log("Write successful");
  });
}

async function hydrateMap(cb) {
  const fileStream = fs.createReadStream(DB_FILE);
  const rl = readline.createInterface({
    input: fileStream,
  });

  for await (const line of rl) {
    // Check if the key is equal to the provided key
    const key = line.split(",")[0];
    map.set(key, lineNumbers);
    lineNumbers++;
  }

  cb();
}

module.exports = {
  read,
  write,
  hydrateMap,
};

// Function without using indexes
// function read(key) {
//   const readStream = fsR(DB_FILE, {});

//   readStream.on("data", (line) => {
//     // have this check to make sure empty lines are not parsed
//     // and stream is not destroyed yet
//     if (line && !readStream.destroyed) {
//       // Check if the key is equal to the provided key
//       const k = line ? line.split(",")[0] : null;
//       if (k === key) {
//         console.log(line.split(",")[1]);
//         readStream.destroy();
//       }
//     }
//   });
// }

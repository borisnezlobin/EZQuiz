const fs = require('fs');

const data = fs.readFileSync("version.txt", "utf8", (err) => {
    if (err) {
        console.log(err);
        if(err.code === "ENOENT") {
            fs.writeFileSync("version.txt", "1.0.0");
        }
    }
});


const major = parseInt(data.split(".")[0]);
const minor = parseInt(data.split(".")[1]);
const patch = parseInt(data.split(".")[2]);

fs.writeFileSync("version.txt", `${major}.${minor}.${patch + 1}`);
console.log(`Updated version to ${major}.${minor}.${patch + 1}!`);
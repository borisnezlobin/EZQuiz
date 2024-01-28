const spawn = require("child_process").spawn;
const fs = require("fs");

var readFile = false;

async function ret() {
    const pythonProcess = spawn('python3',["./sentence.py"]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(data);
        readFile = true;
    });
}

async function generateScores() {
    ret();
    while(!readFile) continue;
    const value = fs.readFileSync("data.json");
    readFile = false;
    return JSON.parse(value);
}

module.exports = [generateScores];
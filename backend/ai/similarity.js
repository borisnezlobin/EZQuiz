const spawn = require("child_process").spawn;
const pythonProcess = spawn('python3',["./sentence.py"]);

pythonProcess.stdout.on('data', (data) => {
    console.log(data);
});
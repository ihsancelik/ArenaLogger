const io = require('socket.io-client');
const socket = io(`http://localhost:3000`, { auth: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGl0eSI6IjU1NDEyMDQ0MjIgLSDEsGhzYW4gw4cuIiwiYXBwbGljYXRpb24iOiJBYmRpSWJyYWhpbSAtIExveWFsdHkiLCJ2ZXJzaW9uIjoiMSIsInRhZyI6ImxvY2FsIiwiaWF0IjoxNjgyMzM0NjY0LCJleHAiOjE5OTgyOTk0NjR9.copwWjiD0gPjQazdbhA5X96zm_eOtVAIWCY4e9sczX8' } });

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server! Waiting for reconnect...');
});

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getInput() {
    rl.question('', (inputData) => {
        socket.emit('log', {
            log: {
                tag: 'test client',
                message: inputData,
                level: 'INFO'
            }
        });
        getInput();
    });
}


getInput();
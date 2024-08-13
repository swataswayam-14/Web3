const fs = require('fs');

function asciiToBytes(asciiString) {
    const byteArray = [];
    for (let i = 0; i < asciiString.length; i++) {
        byteArray.push(asciiString.charCodeAt(i));
    }
    return byteArray;
}

const ascii = "hello";
const byteArray = asciiToBytes(ascii);
console.log(byteArray);
const filePath = 'output.txt';
fs.writeFile(filePath, byteArray.join(','), (err) => {
    if (err) {
        console.error('Error writing to file:', err);
    } else {
        console.log(`Byte array written to ${filePath}`);
    }
});
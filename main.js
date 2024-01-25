const fs = require('fs');
const stream = require('stream');

console.log('starting...');

function getCode() {
    fs.readFile(process.argv[2], (err, data) => {
        if (err) {
            console.log(`WAAA ${err}`);
            return;
        }
        console.log(data.toString(), 'data');
        return data.toString();
    })
}

function parseCode(){
    const rawCode = getCode();
    return rawCode.split('clump');
}

//console.log(parseCode());

console.log(getCode(), 'code');
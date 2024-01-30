const fs = require('fs');
const { delimiter } = require('path');
const stream = require('stream');

//classes

class Clump {
    constructor(code) {
        this.elems = [];
        for (let chunk of code.getBetween('[', ']').trim().split(',')) {
            this.elems.push(new Elem(chunk.trim()));
        }
    }

    addElem(elem) {
        let success = false;
        if (!this.elems.find(val => val.id === elem.id)) {
            this.elems.push(elem);
            success = true;
        }
        return success;
    }

    getByIndex(idx) {
        return this.elems[idx];
    }

    getById(id) {
        for (elem of this.elems) {
            if (elem.id === id) {
                return elem;
            }
        }
        return undefined;
    }

    log() {
        for (let elem of this.elems) {
            console.log(elem);
        }
    }
}

class Act {
    constructor(code) {
        this.lines = code.getBetween('{', '}').split(';');
    }

    execute() {

    }
}

class Elem {

    constructor(code) {
        this.id = code.trim().splitFirstRemove(':')[0];
        this.parse(code.trim().splitFirstRemove(':')[1].trim());
    }

    parse(code) {
        this.decideType(code);
        switch (this.type) {
            case 'clump':
                this.content = new Clump(code);
                break;

            case 'act':
                this.content = new Act(code);
                break;

            case 'boolean':
                this.content = (code === 'true');
                break;

            case 'string':
                this.content = code;
                break;

            case 'number':
                this.content = Number(code);
                break;
        }
    }


    decideType(code) {

        const nums = [...'0123456789'];
        switch (code.charAt(0)) {
            case '[':
                this.type = 'clump';
                break;
            case '\\':
            case '{':
                this.type = 'act';
                break;
            case 't':
            case 'f':
                this.type = (code.trim() === 'true' || code.trim() === 'false') ? 'boolean' : undefined;
                break;
            case '`':
            case "'":
            case '"':
                this.type = 'string';
                break;
            default:
                let num = true;
                for (let char of [...code]) {
                    num = nums.includes(char);
                }
                this.type = num ? 'number' : undefined;
                break;
        }
    }
}


const io = {
    getCode: fileName => {
        fs.readFile(fileName + '.root', (err, data) => {
            if (err) {
                console.log(`WAAA ${err}`);
                //return;
            }
            //console.log(data.toString(), 'data');
            go(fileName + ' : ' + data.toString());
        })
    }
}




//add my custom methods to String...
String.prototype.splitRight = function (delimiter) {
    const chars = [...this];
    let section = [];
    let sections = []
    for (let char of chars) {
        section.push(char);
        if (char === delimiter) {
            sections.push(section.join(''));
            section = [];
        }
    }
    sections.push(section.join(''));
    return sections;
}

String.prototype.splitLeft = function (delimiter) {
    const chars = [...this];
    let section = [];
    let sections = []
    for (let char of chars) {
        if (char === delimiter) {
            sections.push(section ? section.join('') : 'bla');
            section = [];
        }
        section.push(char);

    }
    sections.push(section.join(''));
    return sections;
}

String.prototype.splitBoth = function (delimiter) {
    const chars = [...this];
    let section = [];
    let sections = []
    for (let char of chars) {
        if (char === delimiter) {
            sections.push(section.join(''));
            sections.push(char);
            section = [];
        } else {
            section.push(char);
        }
    }
    sections.push(section.join(''));
    return sections;
}

String.prototype.splitRightMulti = function (delimiters) {
    const chars = [...this];
    let section = [];
    let sections = []
    for (let char of chars) {
        section.push(char);
        if (delimiters.includes(char)) {
            sections.push(section.join(''));
            section = [];
        }
    }
    sections.push(section.join(''));
    return sections;
}

String.prototype.splitLeftMulti = function (delimiters) {
    const chars = [...this];
    let section = [];
    let sections = []
    for (let char of chars) {
        if (delimiters.includes(char)) {
            sections.push(section ? section.join('') : 'bla');
            section = [];
        }
        section.push(char);

    }
    sections.push(section.join(''));
    return sections;
}

String.prototype.splitBothMulti = function (delimiters) {
    const chars = [...this];
    let section = [];
    let sections = []
    for (let char of chars) {
        if (delimiters.includes(char)) {
            sections.push(section.join(''));
            sections.push(char);
            section = [];
        } else {
            section.push(char);
        }
    }
    sections.push(section.join(''));
    return sections;
}

String.prototype.splitFirstRemove = function (delimiter) {
    let first = '';
    let second = '';
    const chars = [...this];
    let i = 0;
    for (; chars[i] !== delimiter; i++) {
        first = first.concat(chars[i]);
    }
    i++;
    for (; i < chars.length; i++) {
        second = second.concat(chars[i]);
    }
    return [first.trim(), second.trim()];
},

    String.prototype.getBetween = function (start, end) {
        if (start === end) {
            //console.log('simple');
            return split[split.find(val => val === start) + 1];
        } else {
            //console.log('complex');
            let indent = 0;
            let content = '';
            let started = false;
            const split = this.splitBothMulti([start, end]);
            for (let section of split) {

                section = section.trim();
                switch (section) {
                    case start:
                        indent++;
                        break;

                    case end:
                        indent--;
                        break;
                }
                if (indent > 0) {
                    if (started) {
                        content = content.concat(section);
                    }
                    started = true;
                }
                if (indent === 0 && started) {
                    break;
                }
            }
            return content;
        }
    }

String.prototype.getParallel = function (start, end) {
    let indent = 0;
    let temp = '';
    let contents = [];
    let started = false;
    const split = this.splitBothMulti([start, end]);
    for (let section of split) {

        section = section.trim();
        switch (section) {
            case start:
                indent++;
                break;

            case end:
                indent--;
                break;
        }
        if (indent > 0) {
            if (started) {
                temp = temp.concat(section);
            }
            started = true;
        }
        if (index <= 0){
            started = false;
        }
    }
    return contents;
}
Array.prototype.splitRemoveMulti = function(delimiters){
    const newArr = [];
    this.map(val =>{
        let temp = [];
        if(delimiters.includes(val)){
            newArr.push(temp);
            temp = [];
        }else{
            temp.push(val);
        }
    })
    newArr.push(temp);
    return newArr;
}

function go(code) {
    const rootElement = new Elem(code);
    console.log(code.getParallel('[',']'));
    //more stuff...
}

//getCode calls go
io.getCode(process.argv[2]);

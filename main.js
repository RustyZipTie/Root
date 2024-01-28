const fs = require('fs');
const { delimiter } = require('path');
const stream = require('stream');

//classes
class Code extends String {
    
    toElems(){
        const elems = [];
        for(let chunk of this.trim().split()){
            chunk = chunk.toCode();
            elems.push(new Elem(chunk));
        }
        return elems;
    }
}
class Clump{
    constructor(code) {

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
}

class Act{
    constructor(code){

    }

    execute(){

    }
}

class Elem {

    constructor(code) {
        this.id = code.trim().splitFirstRemove(':')[0];
        this.code = code.rim().splitFirstRemove(':')[1];
        this.parse();
        this.decideType();
    }

    parse(){
        this.decideType();
        switch(this.type){
            case 'clump':
                this.content = new Clump(this.code);
                break;

            case 'act':
                this.content = new Act(this.code);
                break;

            case 'boolean':
                this.content = (this.code === 'true');
                break;

            case 'string':
                this.content = this.code;
                break;

            case 'number':
                this.content = Number(this.code);
                break;
        }
    }


    decideType(code){
        const nums = [...'0123456789'];
        switch (code.charAt(0)) {
            case '[':
                this.type = 'clump';
            case '\\':
            case '{':
                this.type = 'act';
            case 't':
            case 'f':
                this.type = (code.trim() === 'true' || code.trim() === 'false') ? 'boolean' : undefined;
            case '`':
            case "'":
            case '"':
                this.type = 'string';
            default:
                let num = true;
                for (char of [...code]) {
                    num = nums.includes(char);
                }
                this.type = num ? 'number' : undefined;
        }
    }
}


const io = {
    getCode: fileName => {
        fs.readFile(fileName, (err, data) => {
            if (err) {
                console.log(`WAAA ${err}`);
                //return;
            }
            //console.log(data.toString(), 'data');
            go(data.toString());
        })
    }
}




//add my custom methods to String...
String.prototype.splitRight = function(delimiter) {
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

String.prototype.splitLeft = function(delimiter){
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

String.prototype.splitBoth = function(delimiter) {
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

String.prototype.splitRightMulti = function(delimiters) {
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

String.prototype.splitLeftMulti = function(delimiters) {
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

String.prototype.splitBothMulti = function(delimiters) {
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

String.prototype.splitFirstRemove = function(delimiter) {
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

String.prototype.getBetween = function(start, end) {
        if (start === end) {
            //console.log('simple');
            return split[split.find(val => val === start) + 1];
        } else {
            //console.log('complex');
            let indent = 0;
            let content = '';
            let started = false;
            const split = code.splitBothMulti([start, end]);
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

String.prototype.toCode = function(){
    return new Code(this);
}

const codePlay = {
    /**
 * takes a file and splits into clumps
 * outside whitespace and ''s are removed
 * @returns string[] containing all clumps
 */
    parseToClumps: code => {
        if (code) {
            //split clumps
            let parsed = code.split('clump');

            //trim whitespace
            let temp = []
            for (let clump of parsed) {
                temp.push(clump.trim());
            }
            parsed = temp;

            //remove any nulls and parse elements
            temp = [];
            for (let clump of parsed) {
                if (clump) {
                    temp.push(codePlay.parseToElements(clump));
                }
            }
            parsed = temp;

            return parsed;
        } else {
            return [undefined];
        }
    },

    parseToElements: code => {
        const raws = code.getBetween('[', ']').split(',');
        //console.log('raws:',raws);
        const clumpObj = { name: code.splitLeftMulti([' ', '['])[0], elems: [] };
        for (const raw of raws) {
            clumpObj.elems.push({
                id: raw.splitFirstRemove(':')[0].trim(),
                code: raw.splitFirstRemove(':')[1].trim(),
                type: codePlay.decideType(raw.split(':')[1].trim())
            });
        }
        return clumpObj;

    },

    decideType: code => {
        const nums = [...'0123456789'];
        switch (code.charAt(0)) {
            case '[':
                return 'clump';
            case '\\':
            case '{':
                return 'act'
            case 't':
            case 'f':
                return (code.trim() === 'true' || code.trim() === 'false') ? 'boolean' : undefined;
            case '`':
            case "'":
            case '"':
                return 'string'
            default:
                let num = true;
                for (char of [...code]) {
                    num = nums.includes(char);
                }
                return num ? 'number' : undefined;
        }
    }
}


function go(code) {
    // let clumps = codePlay.parseToClumps(code);
    // console.log(clumps[0].name, clumps[0].elems);
    // console.log(clumps[1].name, clumps[1].elems);

    const grib = 'grib';
    grib.bla = 10;
    console.log(grib.bla);
    //more stuff...
}

io.getCode(process.argv[2]);

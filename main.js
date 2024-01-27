const fs = require('fs');
const { delimiter } = require('path');
const stream = require('stream');

//categorizing things into objects for organizational purposes...
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

/**
 * This object contains methods for parsing text
 */
const wordPlay = {

    /**
     * splits string to array
     * split happens to the right of the delimiter
     * e.g. splitRight('gone', 'o') -> ['go','ne]
     * @param {string} code 
     * @param {string} delimiter 
     * @returns {string[]}
     */
    splitRight: (code, delimiter) => {
        const chars = [...code];
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
    },

    /**
     * splits to left of delimiter
     * e.g. splitLeft('gone', 'o') -> ['g','one']
     * @param {string} code 
     * @param {string} delimiter 
     * @returns {string[]}
     */
    splitLeft: (code, delimiter) => {
        const chars = [...code];
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
    },

    splitBoth: (code, delimiter) => {
        const chars = [...code];
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
    },

    splitRightMulti: (code, delimiters) => {
        const chars = [...code];
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
    },

    splitLeftMulti: (code, delimiters) => {
        const chars = [...code];
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
    },

    splitBothMulti: (code, delimiters) => {
        const chars = [...code];
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
    },

    splitFirstRemove: (code, delimiter) => {
        let first = '';
        let second = '';
        const chars = [...code];
        let i = 0;
        for(;chars[i] !== delimiter; i++){
            first = first.concat(chars[i]);
        }
        i++;
        for(;i<chars.length; i++){
            second = second.concat(chars[i]);
        }
        return [first.trim(), second.trim()];
    },

    getBetween: (code, start, end) => {
        if (start === end) {
            //console.log('simple');
            return split[split.find(val => val === start) + 1];
        } else {
            //console.log('complex');
            let indent = 0;
            let content = '';
            let started = false;
            const split = wordPlay.splitBothMulti(code, [start, end]);
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
        const raws = wordPlay.getBetween(code, '[', ']').split(',');
        //console.log('raws:',raws);
        const clumpObj = { name: wordPlay.splitLeftMulti(code, [' ', '['])[0], elems: [] };
        for (const raw of raws) {
            clumpObj.elems.push({
                id: wordPlay.splitFirstRemove(raw, ':')[0].trim(),
                code: wordPlay.splitFirstRemove(raw, ':')[1].trim(),
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
    let clumps = codePlay.parseToClumps(code);
    console.log(clumps[0].name, clumps[0].elems);
    console.log(clumps[1].name, clumps[1].elems);
    //more stuff...
}

io.getCode(process.argv[2]);

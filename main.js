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

            //remove any nulls
            temp = [];
            for (let clump of parsed) {
                if (clump) {
                    temp.push(clump);
                }
            }
            parsed = temp;

            return parsed;
        } else {
            return [undefined];
        }
    },

    parseToElements: code => {
        const raws = wordPlay.getBetween(code, '[',']')[0].split(',');
        const elems = [wordPlay.splitLeftMulti(code, [' ', '['])[0]];
        for(const raw of raws){
            elems.push({id: raw.split(':')[0].trim(), code: raw.split(':')[1].trim()});
        }
        return elems;
    },

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
                sections.push(section ? section.join(''):'bla');
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
            if(char === delimiter){
                sections.push(section.join(''));
                sections.push(char);
                section = [];
            }else{
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
                sections.push(section ? section.join(''):'bla');
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
            if(delimiters.includes(char)){
                sections.push(section.join(''));
                sections.push(char);
                section = [];
            }else{
                section.push(char);
            }
        }
        sections.push(section.join(''));
        return sections;
    },

    getBetween: (code, start, end) => {
        let sections = [];
        let split = wordPlay.splitBothMulti(code, [start, end]);
        for(let i = 0; i < split.length; i++){
            if(split[i] === start){
                sections.push(split[i+1]);
            }
        }
        return sections;
    }
}


function go(code) {
    let clumps = wordPlay.parseToClumps(code);
    console.log(wordPlay.parseToElements(clumps[0]));
    //more stuff...
}

io.getCode(process.argv[2]);

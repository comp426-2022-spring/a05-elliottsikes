const database = require("better-sqlite3")
const logdb = new database("log.db");

//sets up new database
const stmt = logdb.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name='accesslog';`) 

const row = stmt.get(); 
if(row==undefined){
	console.log(`Log database appears to be empty. Creating log database...`);
	const logdata = 
		` CREATE TABLE accesslog ( 
            id INTEGER PRIMARY KEY, 
            remoteaddr VARCHAR, 
            remoteuser VARCHAR, 
            time VARCHAR, 
            method VARCHAR, 
            url VARCHAR, 
            protocol VARCHAR,
            httpversion NUMERIC,  
            status INTEGER, 
            referer VARCHAR,
            useragent VARCHAR
        );
`
logdb.exec(logdata);
console.log("Log database created.");
} else {
	console.log("Log database exists.");
}
module.exports = logdb;
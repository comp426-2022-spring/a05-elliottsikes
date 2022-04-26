const express = require('express');
const app = express();

const args = require("minimist")(process.argv.slice(2))
args["port"]
args["help"]
args["debug"]
args["log"]
const port = args.port || process.env.PORT || 5000

const help = (`
  server.js [options]

  --port	Set the port number for the server to listen on. Must be an integer
              between 1 and 65535.

  --debug	If set to true, creates endlpoints /app/log/access/ which returns
              a JSON access log from the database and /app/error which throws 
              an error with the message "Error test successful." Defaults to 
              false.

  --log		If set to false, no log files are written. Defaults to true.
              Logs are always written to database.

  --help	Return this message and exit.
`)
// If --help or -h, echo help text to STDOUT and exit
if (args.help || args.h) {
  console.log(help)
  process.exit(0)
}

const logdb  = require("./database.js");
const morgan = require("morgan");
const fs = require("fs");
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

const server = app.listen(port, () => {
  console.log('App listening on port %PORT%'.replace('%PORT%',port))
});

app.use((req, res, next) => {
  let logdata = {
      remoteaddr: req.ip,
      remoteuser: req.user,
      time: Date.now(),
      method: req.method,
      url: req.url,
      protocol: req.protocol,
      httpversion: req.httpVersion,
      status: res.statusCode,
      referer: req.headers['referer'],
      useragent: req.headers['user-agent']
  };
  const stmt = logdb.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const info = stmt.run(logdata.remoteaddr, logdata.remoteuser, logdata.time, logdata.method, logdata.url, logdata.protocol, logdata.httpversion, logdata.status, logdata.referer, logdata.useragent);
  next();
})

if(args.log==true){
  const WRITESTREAM = fs.createWriteStream('access.log', { flags: 'a' });
  app.use(morgan('combined', { stream: WRITESTREAM }));
}

if(args.debug){
  app.get("/app/log/access", (req, res) =>{
      try{
          const logs = logdb.prepare('SELECT * FROM accesslog').all();
          res.status(200).json(logs);
      } catch(e){
          console.error(e);
      }
  });
  app.get("/app/error", (req, res) => {
      throw new Error('Error Test Successful');
  });
}

app.get('/app/flip/call/heads', (req, res) => {
    const result = flipACoin('heads');
    res.status(200).json({
        result
    })
});

app.get('/app/flip/call/tails', (req, res) => {
    const result = flipACoin('tails');
    res.status(200).json({
        result
    })
});

app.get('/app/flips/:number', (req, res) => {
    var num = req.params.number;
    const flips = coinFlips(num);
    const results = countFlips(flips);
    res.status(200).json({
        "raw": flips,
        "summary": results
    })
});

app.get('/app/flip/', (req, res) => {
    var result = coinFlip();
    res.status(200).json({
        "flip": result
    })
});

app.get('/app/', (req, res) => {
    // Respond with status 200
    res.statusCode = 200;
    // Respond with status message "OK"
    res.statusMessage = 'OK';
    res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
    res.end(res.statusCode+ ' ' +res.statusMessage)
});

app.use(function(req, res){
    res.status(404).send('404 NOT FOUND')
});


// COIN FUNCTIONS

function coinFlip() {
    let x = Math.random();
    if(x <= 0.49) {
      return "heads";
    } else {
      return "tails";
    }
}

function coinFlips(flips) {
    let flipCount = flips;
    const flipResults = new Array();
    while(flipCount>0) {
      flipResults.push(coinFlip());
      flipCount--;
    }
    return flipResults;
}

function countFlips(array) {
    let heads = 0, tails = 0;
    array.forEach(flip => {
      if (flip == 'heads') heads++;
      else tails++;
    });
    if (heads > 0 && tails > 0)
      return {
        'heads': heads,
        'tails': tails
      }
    if (heads > 0)
     return {
        'heads': heads
     };
  
    return {
      'tails': tails
    };
};

function flipACoin(call) {
    const correct = coinFlip();
    if(correct == call) {
      return {'call': call, 'flip': correct, 'result': 'win'};
    } else {
      return {'call': call, 'flip': correct, 'result': 'lose'};
    }
}
"use strict";

var express = require("express");
var app = express();
var router = express.Router();
var mongo = require("./utils/database.js");
var cors = require("cors");
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var apiRoutes = require("./routes/api.js");
var fs = require("fs");
var ioConn = require('./socketIO/ioConn.js');
//var runner = require("./test-runner");

const server = require("http").createServer(app);
// const options = {
//   key: fs.readFileSync('/home/ubuntu/deployment/ssl/mm0917.xyz.key'),
//   cert: fs.readFileSync('/home/ubuntu/deployment/ssl/mm0917.xyz.pem')
// }
// const ioServer = require("https").createServer(options);

var io = require('socket.io')(server)

app.use(cors({ origin: "*" }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//root level middleware
const getActualRequestDurationInMilliseconds = start => {
  const NS_PER_SEC = 1e9; //  convert to nanoseconds
  const NS_TO_MS = 1e6; // convert to milliseconds
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};


let logRequestBody = (req, res, next) => { //middleware function
  let current_datetime = new Date();
  let formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    current_datetime.getHours() +
    ":" +
    current_datetime.getMinutes() +
    ":" +
    current_datetime.getSeconds();
  let method = req.method;
  let url = req.url;
  let status = res.statusCode;
  const start = process.hrtime();
  const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
  let log = `[${formatted_date}] ${method}:${url} ${status} ${durationInMilliseconds.toLocaleString()} ms`;
  //console.log(log);
  next();
};


app.use(logRequestBody);

function logResponseBody(req, res, next) {
  const defaultWrite = res.write;
  const defaultEnd = res.end;
  const chunks = [];

  res.write = (...restArgs) => {
    chunks.push(new Buffer(restArgs[0]));
    defaultWrite.apply(res, restArgs);
  };

  res.end = (...restArgs) => {
    if (restArgs[0]) {
      chunks.push(new Buffer(restArgs[0]));
    }
    const body = Buffer.concat(chunks).toString('utf8');

    //console.log(body);

    defaultEnd.apply(res, restArgs);
  };

  next();
}
app.use(logResponseBody);

//Routing for API
const routes = async (app,io) => {
  var db = await mongo.getDB("chatDB")
  apiRoutes(router, db);
  ioConn(io);

  app.use(router);



  app.use(function(req, res, next) {
    res
      .status(404)
      .type("text")
      .send("Not Found");
  });

  // Error Middleware
  app.use(function(err, req, res, next) {
    if (err) {
      res 
        .status(err.status || 500)
        .type("txt")
        .send(err.message || "SERVER ERROR");
    }
  });

  //Start our server and tests!
  var port = 2095;
  //var port = 19591;
  server.listen(port, function() {
    console.log("Server listening on port " + port);
  });

};

routes(app,io);

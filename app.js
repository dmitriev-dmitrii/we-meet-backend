var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const http = require('http');

const WebSocket = require('ws');

var port = process.env.PORT || '3000';
app.set('port', port);
var server = http.createServer(app);

const meetChatWebSocketServer = new WebSocket.Server({server});

meetChatWebSocketServer.on('connection', function connection(ws,req) {
    console.log('EPTA')
})

server.listen(port);
console.log(`app listed http://localhost:${port}`)
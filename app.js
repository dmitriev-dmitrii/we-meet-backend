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

const channels = new Map();

function joinChannel(channel, ws) {
  if (!channels.has(channel)) {
    channels.set(channel, new Set());
  }
  channels.get(channel).add(ws);
}

function leaveChannel(channel, ws) {
  if (channels.has(channel)) {
    channels.get(channel).delete(ws);
    if (channels.get(channel).size === 0) {
      channels.delete(channel);
    }
  }
}

meetChatWebSocketServer.on('connection', function connection(ws,req) {
    console.log('EPTA')
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        switch(data.type) {
            case 'join':
                joinChannel(data.channel, ws);
                break;
            case 'leave':
                leaveChannel(data.channel, ws);
                break;
            case 'message':
                if (channels.has(data.channel)) {
                    channels.get(data.channel).forEach((client) => {
                        if (client !== ws && client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                type: 'message',
                                channel: data.channel,
                                content: data.content
                            }));
                        }
                    });
                }
                break;
        }
    });

    ws.on('close', () => {
        channels.forEach((clients, channel) => {
            leaveChannel(channel, ws);
        });
    });
})

server.listen(port);
console.log(`app listed http://localhost:${port}`)
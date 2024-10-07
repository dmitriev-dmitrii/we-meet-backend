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

export const  setupWebSocket=(wss)=> {
    wss.on('connection', (ws) => {
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
    });
}
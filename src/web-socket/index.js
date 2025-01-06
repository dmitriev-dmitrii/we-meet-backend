import { WebSocket } from 'ws';

import {meetService} from "../services/meet/meetService.js";


async  function  onSocketConnect ( ws , { url  , headers } )  {

        const params = new URL(url, `https://${headers.host}`)

        ws._userId =  params.searchParams.get('userId')
        ws._meetId =  params.searchParams.get('meetId')

        if ( !ws._userId || !ws._meetId ) {
            ws.close(3000)
        }

        const payload = {
            from:'wss',
            type:'ws-connection',
            data : {
                wsClientsOnline: Array.from(this.webSocketServer.clients).map(( {_userId} )=> _userId).sort() ,
            }
        }

        this.webSocketServer.clients.forEach((client) => {
            client.send(JSON.stringify(payload));
        });


        ws.on('message', (payload) => {

            let data = JSON.parse(payload);
            data.from = ws._userId;

            if (data.to) {
                const targetWsUser = [...this.webSocketServer.clients].find((item) => item._userId === data.to);
                delete data.to;

                if (targetWsUser && targetWsUser.readyState === WebSocket.OPEN) {
                    targetWsUser.send(JSON.stringify(data));
                }
                return;
            }

            data = JSON.stringify(data)

            this.webSocketServer.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });
        });

        ws.on('close', () => {

            const payload = {
                from:'wss',
                type:'ws-close',
                data : {
                    wsClientsOnline:  Array.from(this.webSocketServer.clients).map(( {_userId} )=> _userId),
                }
            }

            this.webSocketServer.clients.forEach((client) => {
                client.send(JSON.stringify(payload));
            });

        });


}

export const  setupWebSocket = (webSocketServer)=> {
    webSocketServer.on('connection', onSocketConnect.bind({webSocketServer}) );
}

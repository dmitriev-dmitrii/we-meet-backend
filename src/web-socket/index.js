import { WebSocket } from 'ws';

import {meetService} from "../services/meet/meetService.js";
import {usersService} from "../services/user/usersService.js";


async  function  onSocketConnect ( ws , { url  , headers } )  {

        const params = new URL(url, `https://${headers.host}`)

        ws._userId =  params.searchParams.get('userId')
        ws._meetId =  params.searchParams.get('meetId')

        ws._user = await usersService.findUserById( ws._userId )
        // ws._user = await usersService.findUserById( ws._userId )

        if ( !ws._user || !ws._meetId ) {
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
            data.user = ws._user;

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

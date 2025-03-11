import {WebSocket} from 'ws';

import {usersService} from "../services/user/usersService.js";

const WS_EVENTS = {
    UPDATE_MEET_ONLINE_USERS: 'update-meet-online-users'
}
// TODO отправлять сокеты только по юзерам meet
// TODO удалять встречу если никого нет

async function onSocketConnect(ws, {url, headers}) {

    const params = new URL(url, `https://${headers.host}`)

    ws._userId = params.searchParams.get('userId')
    ws._meetId = params.searchParams.get('meetId')

    ws._user = await usersService.findUserById(ws._userId)
    // ws._user = await usersService.findUserById( ws._userId )

    if (!ws._user || !ws._meetId) {
        ws.close(3000)
    }

    // const meetWsClients = Array.from(this.webSocketServer.clients).filter((client) => {
    //     return client._meetId === ws._meetId
    // });
    //
    // const payload = {
    //     from: 'wss',
    //     type: WS_EVENTS.UPDATE_MEET_ONLINE_USERS,
    //     data: {
    //         meetOnlineUsers: meetWsClients.length,
    //     }
    // }
    // console.log(meetWsClients)
    // meetWsClients.clients.forEach((client) => {
    //     client.send(JSON.stringify(payload));
    // });


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
            if (client !== ws && client._meetId === ws._meetId && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });

    ws.on('close', () => {

        // const meetWsClients = Array.from(this.webSocketServer.clients).filter((client) => {
        //     return client._meetId === ws._meetId
        // });
        //
        // const payload = {
        //     from: 'wss',
        //     type: WS_EVENTS.UPDATE_MEET_ONLINE_USERS,
        //     data: {
        //         meetOnlineUsers: meetWsClients.length,
        //     }
        // }
        //
        //
        // meetWsClients.clients.forEach((client) => {
        //     client.send(JSON.stringify(payload));
        // });

    });


}

export const setupWebSocket = (webSocketServer) => {
    webSocketServer.on('connection', onSocketConnect.bind({webSocketServer}));
}

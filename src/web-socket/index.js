import {WebSocket} from 'ws';

import {usersService} from "../services/user/usersService.js";
import {UserDto} from "../services/user/dto/UserDto.js";

// TODO отправлять сокеты только по юзерам meet
// TODO удалять встречу если никого нет

async function onSocketConnect(ws, {url, headers}) {

    const params = new URL(url, `https://${headers.host}`)

    ws._userId = params.searchParams.get('userId')
    ws._meetId = params.searchParams.get('meetId')

    ws._user = await usersService.findUserById(ws._userId)

    if (!ws._user || !ws._meetId) {
        ws.close(3000)
    }

    const meetWsClients = [...this.webSocketServer.clients.values()].filter((client) => {
        return client._meetId === ws._meetId && client._user !== ws._user
    });

  const meetOnlineUsers =   meetWsClients.map(({_user})=> new UserDto(_user))

    const payload = {
        type: '1',
        fromUser : ws._user,
        data: {
            meetOnlineUsers ,
        }
    }

    meetWsClients.forEach((client) => {
        client.send(JSON.stringify(payload));
    });


    ws.on('message', (payload) => {

        let data = JSON.parse(payload);

        data.fromUser = ws._user;

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

        const meetWsClients = [...this.webSocketServer.clients.values()].filter((client) => {
            return client._meetId === ws._meetId
        });

        const meetOnlineUsers =   meetWsClients.map(({_user})=> new UserDto(_user))

        const payload = {
            type: '2',
            fromUser : ws._user,
            data: {
                meetOnlineUsers ,
            }
        }


        meetWsClients.forEach((client) => {
            client.send(JSON.stringify(payload));
        });

        usersService.deleteUserById(ws._user.userId)

    });

}

export const setupWebSocket = (webSocketServer) => {
    webSocketServer.on('connection', onSocketConnect.bind({webSocketServer}));

}

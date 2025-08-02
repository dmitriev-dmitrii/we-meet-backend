import {WebSocket} from 'ws';

import {usersService} from "../services/user/usersService.js";
import {UserDto} from "../services/user/dto/UserDto.js";
import {meetService} from "../services/meet/meetService.js";

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

    const meetUsers = []
    for (const item of Array.from(this.webSocketServer.clients)) {
        const user = await usersService.findUserById(item._user.userId)
        meetUsers.push(new UserDto(user))
    }

    const onlineMeetUsers = JSON.stringify({
        type: '1',
        fromUser: ws._user,
        data: {
             meetUsers
        }
    })

    this.webSocketServer.clients.forEach((client) => {
        if (client !== ws && client._meetId === ws._meetId && client.readyState === WebSocket.OPEN) {
            client.send(onlineMeetUsers);
        }
    });


    const pingPongInterval = setInterval(() => {
        // костыль чтобы nginx не закрывал ws
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
        }
    }, 30000);

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

        clearInterval(pingPongInterval);
        
        const payload = JSON.stringify({
            type: '2',
            fromUser: ws._user,
            data: {}
        })


        this.webSocketServer.clients.forEach((client) => {
            if (client !== ws && client._meetId === ws._meetId && client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        });

        const isEmtyMeet = !Array.from(this.webSocketServer.clients).filter((client)=>{
            return    client._meetId === ws._meetId
        }).length

        usersService.deleteUserById(ws._user.userId)

        if ( isEmtyMeet ) {
            meetService.removeMeet(ws._user._meetId)
        }
    });

    
}

export const setupWebSocket = (webSocketServer) => {
    webSocketServer.on('connection', onSocketConnect.bind({webSocketServer}));
}


const MEET_CHANNELS = {
    MEET_CHAT_MESSAGES_CHANNEL: 1 ,
    MEET_USERS_CHANNEL: 2 ,
}

const wsClients = new Set()
const usersMap = new Map()

const sendDataToAllClients = (payload) => {
    wsClients.forEach((ws)=> {
        ws.send(JSON.stringify(payload))
    })
}

const  onSocketConnect = (wsClient , req) => {

    console.log('req.cookie', req.cookie)

    const data = { userId:'server' , text:`${'todo name'} connect to meet`}

    wsClients.add( wsClient )

    sendDataToAllClients( data )

    wsClient.on('message', onSocketMessage )

    wsClient.on('close', onSocketClose );

}

const onSocketClose = (wsClient)=> {
    console.log('wsClient close', wsClient)
}

const onSocketMessage = ( payload ) => {

    const { channel, data } = JSON.parse( payload );

    if (channel === MEET_CHANNELS.MEET_CHAT_MESSAGES_CHANNEL) {
        sendDataToAllClients({ channel,data })
    }

    if (channel === MEET_CHANNELS.MEET_USERS_CHANNEL) {

    }

  }

export const  setupWebSocket = (ws)=> {
    ws.on('connection', onSocketConnect );
}

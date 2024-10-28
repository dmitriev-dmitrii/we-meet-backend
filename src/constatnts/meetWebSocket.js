// TODO to enum
export const MEET_WEB_SOCKET_EVENTS = {

    USER_ENTER_MEET:'enter-meet',
    USER_LEAVE_MEET: `leave-meet`,


    CHAT_MESSAGE: 'chat-message',

    // LEAVE: `leave`,
    // SHARE_ROOMS: `share-rooms`, // Send all available rooms
    // ADD_PEER: 'add-peer', // Creating new connection between clients
    // REMOVE_PEER: 'remove-peer',
    // RELAY_SDP: 'relay-sdp', // Passing stream media data (video and audio)
    // RELAY_ICE: 'relay-ice', // Passing ice candidate (public ip, port etc. (NAT)). This is our physical connection
    // ICE_CANDIDATE: 'ice-candidate',
    // SESSION_DESCRIPTION: 'session-description',
    // MUTE_TRACK: `mute-track`
}


export const MEET_WEB_SOCKET_CHANNELS = {
    MEET_CHAT_MESSAGES_CHANNEL: 1 , //канал для сообщений чата
    MEET_CHANNEL: 2 , // технический канал
}
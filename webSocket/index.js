//
//
// const meet = {
//     users: [],
//     chatHistory : [],
// }
//
//
// const listenWebSoketEvents ( meetChatWebSocketServer ) => {
//
//     meetChatWebSocketServer.on('connection', function connection(ws,req) {
//         // TODO из req вытащить юзера
//
//         meet.chatHistory.forEach((msg)=>{
//             ws.send( JSON.stringify(msg) )
//         })
//
//
//         sendToAllChatUsers( {user_id : meet.users.length ,text:'ворвался в чат'} )
//
//
//
//         meet.users.push({
//             user_id: meet.users.length,
//             webSocketClient:ws
//         });
//
//         ws.on('message', (payload) => {
//
//             const message = JSON.parse(payload)
//             meet.chatHistory.push(message)
//
//             sendToAllChatUsers(message)
//
//         });
//
//         ws.on('close', () => {
//             // Remove the client from the array when it disconnects
//             const index = meet.users.indexOf(ws);
//
//             if (!index > -1) {
//                 return
//             }
//             const deletedUser =  meet.users[index]
//
//             sendToAllChatUsers( { user_id: deletedUser.user_id,text:'покинул чат'} )
//
//             meet.users.splice(index, 1);
//
//
//         });
//
//
//     });
// }
// const sendToAllChatUsers =  (payload) => {
//
//     const message =  JSON.stringify(payload)
//
//     meet.users.forEach(user => {
//         const {webSocketClient} = user;
//         // if (client.readyState === WebSocket.OPEN) {
//         // if (client.readyState === 'open') {
//         //     client.send(message);
//         // }
//         //
//         webSocketClient.send(message)
//     });
// }
//
//
//
// module.exports =  listenWebSoketEvents
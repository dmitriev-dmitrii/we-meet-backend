const WEB_SOCKET_URL =`ws://${window.location.host}` ;

const webSocketQueue = [];
const webSocketMessageHandlersMap = new Map();
export const useWebSocket = ()=> {
  const   addWebSocketMessageHandlers = (eventsMap = {})=> {

      for (const [type, callback] of Object.entries(eventsMap)) {

          if ( webSocketMessageHandlersMap.has(type)) {
              console.warn(`webSocketMessageHandlersMap : replaced event callback for type: ${type}`)
          }

          if ( type && callback ) {
              webSocketMessageHandlersMap.set(type,callback)
          }

      }
    }

    const onSocketConnected = ()=> {
        console.log('WebSocket connected');
        // TODO читать очередь на отправку
    }

    const onSocketMessage = ({data}) => {

            const payload = JSON.parse(data);

            const {type} =  payload

        if (!webSocketMessageHandlersMap.has(type)) {
          console.warn('onSocketMessage , empty callback for event type' , `"${type}"` )
          return
        }

        const callback =  webSocketMessageHandlersMap.get(type)

        callback(payload)

    };

        const onSocketError = (error) => {
            console.error('WebSocket error:', error);
        };


   const onSocketClose = (event) => {
       console.log('WebSocket Closed', event );
   };

    function sendWebSocketMessage(payload) {

        if (ws.readyState !== WebSocket.OPEN) {
            console.warn('WebSocket state is not OPEN ')
            // webSocketQueue.push(payload)
            // TODO пушить  очередь на отправку
            setTimeout(()=> {
                sendWebSocketMessage(payload)
            }, 500 )
            return
        }

        ws.send(JSON.stringify(payload));
    }


    const ws = new WebSocket(WEB_SOCKET_URL);

    ws.onopen = onSocketConnected

    ws.onmessage = onSocketMessage

    ws.onerror = onSocketError

    ws.onclose = onSocketClose

    return {
        addWebSocketMessageHandlers,
        sendWebSocketMessage
    }
}

import {useWebSocket} from "./useWebSocket.js";

const {   sendWebSocketMessage , addWebSocketMessageHandlers } = useWebSocket()

const CONFIG = {
    // iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};
let currentMediaConnections = {}
let peerConnection;
export const usePeerConnection = ({roomId,localStream})=> {

    function createPeerConnection(isInitiator) {
        console.log('Creating peer connection, isInitiator:', isInitiator);
        peerConnection = new RTCPeerConnection(CONFIG);

        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        peerConnection.ontrack = (event) => {
            console.log('Received remote track');
            document.getElementById('remoteVideo').srcObject = event.streams[0];

        };

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('Sending ICE candidate');

                sendWebSocketMessage({
                    type: 'ice-candidate',
                    roomId,
                    candidate: event.candidate
                });
            }
        };

        if (isInitiator) {
            console.log('Creating offer');
            peerConnection.createOffer()
                .then(offer => peerConnection.setLocalDescription(offer))
                .then(() => {
                    console.log('Sending offer');
                    sendWebSocketMessage({
                        type: 'offer',
                        roomId,
                        offer: peerConnection.localDescription
                    });
                })
                .catch(error => console.error('Error creating offer:', error));
        }
    }


    async function handleUserConnected(data) {
        await  createPeerConnection(true);
        console.log('Another user connected, creating offer');
    }


    async function handleOffer({offer}) {
        console.log('Received offer');
        if (!peerConnection) {
            createPeerConnection(false);
        }
        console.log(offer)
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        console.log('Sending answer');

        sendWebSocketMessage({
            type: 'answer',
            roomId,
            answer: peerConnection.localDescription
        })
    }

    async function handleAnswer({answer}) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('Received answer');
    }

    async function handleIceCandidate({candidate}) {
        try {
            await peerConnection.addIceCandidate(candidate);
            console.log('Received ICE candidate');
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
        }
    }

    const webSocketEventsHandlers =
        {
            'offer':handleOffer,
            'user-connected':handleUserConnected,
            'ice-candidate':handleIceCandidate,
            'answer': handleAnswer
        }
    addWebSocketMessageHandlers(webSocketEventsHandlers)

    return {
        currentMediaConnections,
    }
}

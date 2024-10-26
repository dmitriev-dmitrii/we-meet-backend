import {useWebSocket} from "./features/useWebSocket.js";

let localStream;
let peerConnection;
let roomId = '123';

const configuration = {
    // iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};
const {sendWebSocketMessage,addWebSocketMessageHandlers} = useWebSocket()

async function init() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        document.getElementById('localVideo').srcObject = localStream;
    } catch (error) {
        console.error('Error accessing media devices:', error);
    }

}

init();

document.getElementById('joinBtn').addEventListener('click', () => {
    if (roomId) {
        console.log('Joining room:', roomId);
        sendWebSocketMessage({ type: 'join', roomId });

    }
});

async function  createPeerConnection(isInitiator) {

    console.log('Creating peer connection, isInitiator:', isInitiator);
    peerConnection = new RTCPeerConnection(configuration);

    const tracks =   localStream.getTracks()

    tracks.forEach(track => {
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
        try {
        console.log('Creating offer');
         const  offer =   await  peerConnection.createOffer()

       await peerConnection.setLocalDescription(offer)

        sendWebSocketMessage({
            type: 'offer',
            roomId,
            offer: peerConnection.localDescription
        });

        console.log('Sending offer');

        }
        catch (e) {
            console.log(     'Error creating offer:', e)
        }
    }
}


async function handleUserConnected(data) {
    await  createPeerConnection(true);
    console.log('Another user connected, creating offer');
}


async function handleOffer({offer}) {
    console.log('Received offer');
    if (!peerConnection) {
      await  createPeerConnection(false);
    }
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

const events =
{
    'offer':handleOffer,
    'user-connected':handleUserConnected,
    'ice-candidate':handleIceCandidate,
    'answer': handleAnswer
}
addWebSocketMessageHandlers(events)


import {useWebSocket} from "./features/useWebSocket.js";
import {useCurrentUser} from "./features/useCurrentUser.js";

let peerConnection;
let roomId = '123';

const {sendWebSocketMessage,addWebSocketMessageHandlers} = useWebSocket()
const {initUserStream,userStream} =  useCurrentUser()

document.getElementById('joinBtn').addEventListener('click', () => {
    if (roomId) {
        console.log('Joining room:', roomId);
        sendWebSocketMessage({ type: 'join', roomId });
    }
});

const videosContainer = document.getElementById('videos')

const appendStreamToDom = ({streamData, isCurrentUserStream= false })=> {

   const videoStream =  document.createElement('video')

    videoStream.srcObject = streamData
    videoStream.autoplay = true

    videoStream.muted = true

    if ( isCurrentUserStream ) {

        videoStream.classList.add('my-stream')
        videoStream.muted = true
    }

    videosContainer.append(videoStream)
}

async function  createPeerConnection(isInitiator = false) {

    console.log('Creating peer connection, isInitiator:', isInitiator);
    peerConnection = new RTCPeerConnection();

   const userStream =   await  initUserStream()

    appendStreamToDom({streamData:userStream,isCurrentUserStream : true})

    const tracks =   userStream.getTracks()

    tracks.forEach(track => {
        peerConnection.addTrack(track, userStream);
    });

    peerConnection.ontrack = ({streams}) => {
        const [streamData] = streams

        appendStreamToDom({streamData})
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
    console.log('handleOffer');
    if (!peerConnection) {
      console.log('handleOffer peerConnection is ',peerConnection)
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
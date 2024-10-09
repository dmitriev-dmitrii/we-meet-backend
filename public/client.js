let localStream;
let peerConnection;
let roomId;
let ws;

const configuration = {
    // iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

function connectWebSocket() {
    ws = new WebSocket(`ws://${window.location.host}`);

    ws.onopen = () => {
        console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
        console.log('Received raw message:', event.data);
        let data;
        try {
            data = JSON.parse(event.data);
            console.log('Parsed message:', data);
        } catch (error) {
            console.error('Error parsing message:', error);
            return;
        }

        switch (data.type) {
            case 'user-connected':
                console.log('Another user connected, creating offer');
                createPeerConnection(true);
                break;
            case 'offer':
                console.log('Received offer, creating answer');
                handleOffer(data.offer);
                break;
            case 'answer':
                console.log('Received answer');
                handleAnswer(data.answer);
                break;
            case 'ice-candidate':
                console.log('Received ICE candidate');
                handleIceCandidate(data.candidate);
                break;
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
        console.log('WebSocket disconnected');
    };
}

async function init() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        document.getElementById('localVideo').srcObject = localStream;
    } catch (error) {
        console.error('Error accessing media devices:', error);
    }
    connectWebSocket();
}

init();

document.getElementById('joinBtn').addEventListener('click', () => {
    roomId = document.getElementById('roomId').value;
    if (roomId) {
        console.log('Joining room:', roomId);
        ws.send(JSON.stringify({ type: 'join', roomId }));
    }
});

function createPeerConnection(isInitiator) {
    console.log('Creating peer connection, isInitiator:', isInitiator);
    peerConnection = new RTCPeerConnection(configuration);

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
            sendMessage({
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
                sendMessage({
                    type: 'offer',
                    roomId,
                    offer: peerConnection.localDescription
                });
            })
            .catch(error => console.error('Error creating offer:', error));
    }
}

function sendMessage(message) {
    const jsonMessage = JSON.stringify(message);
    console.log('Sending message:', jsonMessage);
    ws.send(jsonMessage);
}

async function handleOffer(offer) {
    console.log('Received offer');
    if (!peerConnection) {
        createPeerConnection(false);
    }
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    console.log('Sending answer');
    sendMessage({
        type: 'answer',
        roomId,
        answer: peerConnection.localDescription
    });
}

async function handleAnswer(answer) {
    console.log('Received answer');
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

async function handleIceCandidate(candidate) {
    console.log('Received ICE candidate');
    try {
        await peerConnection.addIceCandidate(candidate);
    } catch (error) {
        console.error('Error adding ICE candidate:', error);
    }
}

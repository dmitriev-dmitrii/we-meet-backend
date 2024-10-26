


const   userId = Date.now()
const   name= 'somename'
let   userStream = ''
export const useCurrentUser = () => {
    const initUserStream = async ()=> {
        userStream =  await window.navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        // document.getElementById('localVideo').srcObject = userStream;

        return userStream
    }

    return {
        initUserStream,
        userStream,
        userId,
        name,
    }
}

import { ref, computed } from 'vue';

let ws = null;
let wsUuid = ref(null);

let pingInterval;
let pongTimeout;
const sessions = ref({});

const sessionsContent = computed(() => {

    var content = [];
    var keys = Object.keys(sessions.value);
    keys.forEach((key, index, origArray) => {
        // console.log(sessions.value[key])
        content.push(
            { content: sessions.value[key].completedMessage || sessions.value[key].partialMessage || "", 
            label: sessions.value[key].stageUuid + sessions.value[key].stageIndex + sessions.value[key].socketIndex,
            sessionId: key, 
            stageUuid: sessions.value[key].stageUuid, 
            stageIndex: sessions.value[key].stageIndex,  
            socketIndex: sessions.value[key].socketIndex })
    })

    return content;
})

export function useWebsockets() {

    async function websocketConnection() {

        clearInterval(pingInterval);
        clearTimeout(pongTimeout);

        if (!ws) {
            ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
            ws.addEventListener('open', handleOpen);
            ws.addEventListener('message', handleMessage);
            ws.addEventListener('close', handleClose);
            ws.addEventListener('error', handleError);
        }
    }

    function handleOpen(event) {
        console.log('WebSocket connection opened:', event);

        pingInterval = setInterval(() => {
            ws.send(JSON.stringify({ type: 'ping' }));
        }, 5000);
    }

    //Reactively handle inbound messages
    function handleMessage(event) {
        try {
            const data = JSON.parse(event.data);

            // If the message contains a uuid, store it in the ref variable
            if (data.uuid) {
                wsUuid.value = data.uuid;
                console.log("Received a Websocket UUID", wsUuid.value)
            }

            if (data.session && sessions.value[data.session]) {
                // Check if the partialMessage ref exists for the session, if not create it
                if (!sessions.value[data.session].partialMessage) {
                    sessions.value[data.session].partialMessage = ref('');
                }

                if (data.type === 'EOM') {
                    sessions.value[data.session].completedMessage = sessions.value[data.session].messages.join('');

                    // Reset the partial message
                    sessions.value[data.session].messages = []; // Reset messages for the session
                    sessions.value[data.session].partialMessage = '';
                } else {
                    // Update the partial message with the new fragment
                    sessions.value[data.session].messages.push(data.message);

                    // Concatenate the new fragment to the existing partial message
                    // console.log(data.message)
                    // console.log(typeof sessions.value[data.session].partialMessage);
                    sessions.value[data.session].partialMessage += data.message;
                }
            }
            // Handle other messages
        } catch (error) {
            console.log("Error with websocket message", error);
        }
    }

    function handleClose(event) {
        console.log('WebSocket connection closed:', event);
        wsUuid.value = null;

        clearInterval(pingInterval);
        clearTimeout(pongTimeout);

        setTimeout(() => {
            console.log('Attempting to reconnect...');
            ws = null;
            websocketConnection();
        }, 5000);
    }

    function handleError(event) {
        console.log('WebSocket error:', event);
    }

    function sendToServer(uuid, session, model, temperature, systemPrompt, userPrompt, type) {
        if (ws) {
            // console.log(type)
            ws.send(JSON.stringify({ uuid, session, model, temperature, systemPrompt, userPrompt, type }));
        }
    }

    function registerSession(session, stageIndex, stageUuid, socketIndex, callback) {
        // sessions.value[data.session].partialMessage = ref('');
        sessions.value[session] = { callback, messages: [], partialMessage: "", completedMessage: "", stageIndex: stageIndex, stageUuid: stageUuid , socketIndex: socketIndex};
        console.log("Registered session", sessions.value[session])

    }

    function updateSession(session, stageIndex, stageUuid, socketIndex, callback) {
        // sessions.value[data.session].partialMessage = ref('');
        sessions.value[session].stageIndex = stageIndex;
        sessions.value[session].stageUuid = stageUuid;
        sessions.value[session].socketIndex = socketIndex;
        console.log("Updated session", sessions.value[session])

    }

    function unregisterSession(session, stageIndex, stageUuid, socketIndex) {
        console.log("Deleted session", session)
        delete sessions.value[session];
    }

    return {
        wsUuid,
        sessions,
        sessionsContent,

        websocketConnection,
        sendToServer,
        registerSession,
        updateSession,
        unregisterSession,
    };
}
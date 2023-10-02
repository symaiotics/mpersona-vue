
import { ref, computed } from 'vue';
import { extractData } from '@/utils/extractJsonAndCode.js';
import { v4 as uuidv4 } from 'uuid';

let ws = null;
let wsUuid = ref(null);

let pingInterval;
let pongTimeout;
let stages = ref([]); //Manages all the stages within the app. However, this will need to revamped if we enable multiple workstreams
let sessions = ref({}); //Sessions - Does not need a rework, would work across all

let sessionsContent = computed(() => {
    var content = [];
    var keys = Object.keys(sessions.value);
    keys.forEach((key, index, origArray) => {
        // console.log(sessions.value[key])
        content.push(
            {
                content: sessions.value[key].completedMessage || sessions.value[key].partialMessage || "",
                label: sessions.value[key].stageUuid + sessions.value[key].stageIndex + sessions.value[key].socketIndex,
                sessionId: key,
                stageUuid: sessions.value[key].stageUuid,
                stageIndex: sessions.value[key].stageIndex,
                socketIndex: sessions.value[key].socketIndex,
                extracts: computed(()=>{
                    return extractData(sessions?.value?.[key]?.completedMessage || sessions?.value?.[key]?.partialMessage || "")
                })
                
                // {
                //     code: computed(() => {
                //         return extractCode(sessions.value[key].completedMessage || sessions.value[key].partialMessage || "")
                //     }),
                //     json: computed(() => {
                //         return extractJSON(sessions.value[key].completedMessage || sessions.value[key].partialMessage || "")
                //     }),
                // }
            })
    })

    return content;
})



let stageNodes = computed(() => {
    var nodes = [];
    stages.value.forEach((stage, index, origArray) => {
      stage.sockets.forEach((socket, sIndex, sOrigArray) => {
        nodes.push({
          id: socket.sessionId,
          name: "Stage." + (index + 1) + "." + (sIndex + 1),
          stage: index,
          status: sessions?.value?.[socket.sessionId]?.status || "missing",
          personaName: sessions?.value?.[socket.sessionId]?.persona?.name || null,
        })
      })
    })
    return nodes;
  })
  
  let stageEdges = computed(() => {
    var edges = [];
    stages.value.forEach((stage, index, origArray) => {
      let sources = stage.selectedSessionsContent.map((ssc) => { return ssc.sessionId })
      let targets = stage.sockets.map((socket) => { return socket.sessionId })
      if (sources?.length && targets?.length)
        sources.forEach((source) => {
          targets.forEach((target) => {
            edges.push({ source, target })
            // console.log("Edges updated", edges)
          })
        })
    })
    return edges;
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
                    sessions.value[data.session].status = 'complete'
                }
                else if (data.type === 'ERROR') {

                    var errorMessage = "Error: ";
                    try{
                        var parsedError = JSON.parse(data.message);
                        errorMessage +=  parsedError.status + " " + parsedError.statusText;
                        if(parsedError.status == 429 || parsedError.status == "429") errorMessage += ". Try again in a minute."                         
                    }
                    catch(err)
                    {
                        //Not JSON, just leave as error
                    }
                    
                    sessions.value[data.session].errorMessage = errorMessage;
                    // Reset the partial and completed message
                    sessions.value[data.session].messages = []; // Reset messages for the session
                    sessions.value[data.session].partialMessage = '';
                    sessions.value[data.session].completedMessage = '';
                    sessions.value[data.session].status = 'error';

                }                
                
                else {
                    // Update the partial message with the new fragment
                    sessions.value[data.session].messages.push(data.message);
                    sessions.value[data.session].partialMessage += data.message;
                    sessions.value[data.session].status = 'inProgress';

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

    function registerSession(session, stageIndex, stageUuid, socketIndex, persona, callback) {
        // sessions.value[data.session].partialMessage = ref('');
        sessions.value[session] = { callback, messages: [], status:'idle', partialMessage: "", completedMessage: "", stageIndex: stageIndex, stageUuid: stageUuid, socketIndex: socketIndex, persona:persona };
        // console.log("Registered session", sessions.value[session])

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
        stages,
        stageNodes, stageEdges,
        
        // stageNodes,
        // stageLinks,

        websocketConnection,
        sendToServer,
        registerSession,
        updateSession,
        unregisterSession,
    };
}


function extractCode(answer) {
    let codes = [];
    try {
        if (answer) {
            const textCode = answer.match(/```([\s\S]+?)```/g);
            if (textCode && textCode.length > 0) {
                codes = textCode
                    .join(" ")
                    .split("```")
                    .map((code) => code.trim())
                    .filter((code) => code !== "")
                    .map((c) => ({
                        key: c.slice(0, c.indexOf("\n")),
                        code: c.slice(c.indexOf("\n")),
                    }));
            }
            console.log(codes);
        }
        return codes;
    }
    catch (error) {
        return [];
    }
}

function extractJSON(text) {
    const validJSONs = [];

    try {
        if (text) {

            let startIdx = text.indexOf('{');
            while (startIdx !== -1) {
                let endIdx = startIdx;
                let braceCount = 1;

                while (endIdx < text.length && braceCount > 0) {
                    endIdx++;
                    if (text[endIdx] === '{') {
                        braceCount++;
                    } else if (text[endIdx] === '}') {
                        braceCount--;
                    }
                }

                const potentialJSON = text.substring(startIdx, endIdx + 1);
                try {
                    const sanitizedString = potentialJSON.replace(/<br\/?>/g, '').replace(/\n/g, ' ');
                    const replacedString = sanitizedString.replace(/(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '$1"$3":');
                    const parsed = JSON.parse(replacedString);
                    validJSONs.push(parsed);
                } catch (e) {
                    // Not valid JSON, skip
                }

                startIdx = text.indexOf('{', startIdx + 1);
            }
        }

        return validJSONs;
    }

    catch (error) {

        return [];
    }
}

//This puts it all into the code?

// function extractData(text) 
// {
//     let codes = [];
//     let validJSONs = [];

//     try {
//         if (text) {
//             // Step 1 & 2: Extract code blocks and remove them from the text
//             const textCode = text.match(/```([\s\S]+?)```/g);
//             let modifiedText = text;
//             if (textCode && textCode.length > 0) {
//                 codes = textCode
//                     .join(" ")
//                     .split("```")
//                     .map((code) => code.trim())
//                     .filter((code) => code !== "" && code.includes("\n"))
//                     .map((c) => ({
//                         key: c.slice(0, c.indexOf("\n")),
//                         code: c.slice(c.indexOf("\n") + 1),
//                     }));
//                 textCode.forEach(codeBlock => {
//                     modifiedText = modifiedText.replace(codeBlock, '');
//                 });
//             }

//             // Step 3: Extract JSONs from the modified text
//             let startIdx = modifiedText.indexOf('{');
//             while (startIdx !== -1) {
//                 let endIdx = startIdx;
//                 let braceCount = 1;

//                 while (endIdx < modifiedText.length && braceCount > 0) {
//                     endIdx++;
//                     if (modifiedText[endIdx] === '{') {
//                         braceCount++;
//                     } else if (modifiedText[endIdx] === '}') {
//                         braceCount--;
//                     }
//                 }

//                 const potentialJSON = modifiedText.substring(startIdx, endIdx + 1);
//                 try {
//                     const sanitizedString = potentialJSON.replace(/<br\/?>/g, '').replace(/\n/g, ' ');
//                     const replacedString = sanitizedString.replace(/(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '$1"$3":');
//                     const parsed = JSON.parse(replacedString);
//                     validJSONs.push(parsed);
//                 } catch (e) {
//                     // Not valid JSON, skip
//                 }

//                 startIdx = modifiedText.indexOf('{', startIdx + 1);
//             }
//         }
//     } catch (error) {
//         return { json: [], code: [] };
//     }

//     // Step 4: Return the results in a single object
//     return { json: validJSONs, code: codes };
// }

// function extractData(text) {
//     let codes = [];
//     let validJSONs = [];

//     try {
//         if (text) {
//             // Step 1 & 2: Extract code blocks and remove them from the text
//             const textCode = text.match(/```([\s\S]+?)```/g);
//             let modifiedText = text;
//             if (textCode && textCode.length > 0) {
//                 textCode.forEach(codeBlock => {
//                     const trimmedBlock = codeBlock.trim().substring(3, codeBlock.length - 3);
//                     const lines = trimmedBlock.split("\n");
//                     const potentialKey = lines[0].trim().toLowerCase();
//                     const codeContent = lines.slice(1).join("\n").trim();

//                     if (potentialKey === 'json') {
//                         try {
//                             const parsedJSON = JSON.parse(codeContent);
//                             validJSONs.push(parsedJSON);
//                         } catch (e) {
//                             // Not valid JSON, add to code array
//                             codes.push({ key: potentialKey, code: codeContent });
//                         }
//                     } else {
//                         codes.push({ key: potentialKey, code: codeContent });
//                     }
//                     modifiedText = modifiedText.replace(codeBlock, '');
//                 });
//             }

//             // Step 3: Extract JSONs from the modified text
//             let startIdx = modifiedText.indexOf('{');
//             while (startIdx !== -1) {
//                 let endIdx = startIdx;
//                 let braceCount = 1;

//                 while (endIdx < modifiedText.length && braceCount > 0) {
//                     endIdx++;
//                     if (modifiedText[endIdx] === '{') {
//                         braceCount++;
//                     } else if (modifiedText[endIdx] === '}') {
//                         braceCount--;
//                     }
//                 }

//                 const potentialJSON = modifiedText.substring(startIdx, endIdx + 1);
//                 try {
//                     const sanitizedString = potentialJSON.replace(/<br\/?>/g, '').replace(/\n/g, ' ');
//                     const replacedString = sanitizedString.replace(/(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '$1"$3":');
//                     const parsed = JSON.parse(replacedString);
//                     validJSONs.push(parsed);
//                 } catch (e) {
//                     // Not valid JSON, skip
//                 }

//                 startIdx = modifiedText.indexOf('{', endIdx + 1);  // Skip past the end of the current JSON object
//             }
//         }
//     } catch (error) {
//         return { json: [], code: [] };
//     }

//     // Step 4: Return the results in a single object
//     return { json: validJSONs, code: codes };
// }

// function extractData(text) {
//     let codes = [];
//     let validJSONs = [];

//     try {
//         if (text) {
//             // Step 1 & 2: Extract code blocks and remove them from the text
//             const textCode = text.match(/```([\s\S]+?)```/g);
//             let modifiedText = text;
//             if (textCode && textCode.length > 0) {
//                 textCode.forEach(codeBlock => {
//                     const trimmedBlock = codeBlock.trim().substring(3, codeBlock.length - 3);
//                     const lines = trimmedBlock.split("\n");
//                     const potentialKey = lines[0].trim().toLowerCase();
//                     const codeContent = lines.slice(1).join("\n").trim();

//                     if (potentialKey === 'json') {
//                         try {
//                             const parsedJSON = JSON.parse(codeContent);
//                             validJSONs.push(parsedJSON);
//                         } catch (e) {
//                             // Not valid JSON, add to code array
//                             codes.push({ key: potentialKey, code: codeContent });
//                         }
//                     } else {
//                         codes.push({ key: potentialKey, code: codeContent });
//                     }
//                     modifiedText = modifiedText.replace(codeBlock, '');
//                 });
//             }

//             // Step 3: Extract JSON objects and arrays from the modified text
//             let startIdxObj = modifiedText.indexOf('{');
//             let startIdxArr = modifiedText.indexOf('[');

//             while (startIdxObj !== -1 || startIdxArr !== -1) {
//                 let startIdx = startIdxObj !== -1 
//                     ? (startIdxArr !== -1 ? Math.min(startIdxObj, startIdxArr) : startIdxObj)
//                     : startIdxArr;
                
//                 let endIdx = startIdx;
//                 let braceCount = 1;
//                 const openBrace = modifiedText[startIdx];
//                 const closeBrace = openBrace === '{' ? '}' : ']';

//                 while (endIdx < modifiedText.length && braceCount > 0) {
//                     endIdx++;
//                     if (modifiedText[endIdx] === openBrace) {
//                         braceCount++;
//                     } else if (modifiedText[endIdx] === closeBrace) {
//                         braceCount--;
//                     }
//                 }

//                 const potentialJSON = modifiedText.substring(startIdx, endIdx + 1);
//                 try {
//                     const sanitizedString = potentialJSON.replace(/<br\/?>/g, '').replace(/\n/g, ' ');
//                     const replacedString = sanitizedString.replace(/(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '$1"$3":');
//                     const parsed = JSON.parse(replacedString);
//                     validJSONs.push(parsed);
//                 } catch (e) {
//                     // Not valid JSON, skip
//                 }

//                 startIdxObj = modifiedText.indexOf('{', endIdx + 1);  // Skip past the end of the current JSON object
//                 startIdxArr = modifiedText.indexOf('[', endIdx + 1);  // Skip past the end of the current JSON array
//             }
//         }
//     } catch (error) {
//         return { json: [], code: [] };
//     }

//     // Step 4: Return the results in a single object
//     return { json: validJSONs, code: codes };
// }
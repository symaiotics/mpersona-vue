<template>
    <div class="w-full">

        <!-- Main Container -->
        <div
            class="p-1 bg-white border border-gray-200 rounded-lg shadow md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 relative">
            <!-- Persona Template -->
            <template v-if="props?.persona">
                <div class="flex row">
                    <div class="flex-col">
                        <img v-if="props.persona.url" class="object-cover w-full rounded-t-lg md:h-24 md:w-24 rounded"
                            :src="props.persona.url" alt="">
                        <img v-else class="object-cover w-full rounded-t-lg md:h-24 md:w-24 rounded" :src="defaultImage"
                            alt="">
                    </div>
                    <div class="flex-col leading-normal pl-3 pr-2 pt-3">
                        <h5
                            class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white whitespace-wordwrap">
                            {{ props.persona.name }}</h5>
                        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{ props.persona.description.en }}.</p>
                    </div>
                    <div class="flex-col flex items-start pl-3 pr-2 pt-3">
                        <div class="self-start">
                            <!-- <button @click="sendMessage" :disabled="processing"
                                class=" mr-2 bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold  p-3 rounded disabled:text-gray-300">
                                Generate
                            </button> -->
                            <!-- <button @click="onEditClick" :disabled="processing"
                            class=" bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold  p-3 rounded disabled:text-gray-300">
                            Edit 
                        </button> -->
                        </div>
                    </div>
                </div>
            </template>

            <!-- Interim and final message section -->
            <div v-if="partialMessage" v-html="partialMessageMarkdown"
                class="border w-full transition duration-300 preserve-whitespace-pre-line p-4 pt-10 rounded-md"></div>

            <div v-if="completedMessage" class="relative">
                <div class="absolute top-0 right-0 flex space-x-4 p-4">
                    <StarIcon @click="like"
                        class="h-6 w-6 dark:text-yellow-400 text-yellow-600 transform hover:scale-105 transition-transform duration-150" />
                    <TrashIcon @click="clear"
                        class="h-6 w-6 dark:text-gray-200 text-gray-600 transform hover:scale-105 transition-transform duration-150" />
                </div>
                <EditContent class="w-full p-4 pt-10" v-model:content="sessions[sessionId].completedMessage" />
            </div>


            <div v-if="editPersona">
                <EditContent v-if="props.persona && editPersona" class="w-full"
                    v-model:content="props.persona.basePrompt" />
            </div>

            <!-- Close and Edit Buttons -->
            <!-- <ButtonWait /> -->
            <ButtonWait v-if="partialMessage" />
            <ButtonGenerate v-if="!partialMessage" @generate="sendMessage" />
            <ButtonEdit @edit="onEditClick" />
            <ButtonClose @close="onCloseClick" />
        </div>

        <!-- Edit Content and Icons Section -->
        <!-- <div class="w-full h-auto">
            <div class="flex items-center p-4">
                <div v-if="completedMessage" class="flex items-center space-x-4">
                    <StarIcon @click="like"
                        class="h-6 w-6 dark:text-yellow-400 text-yellow-600 transform hover:scale-105 transition-transform duration-150" />
                    <TrashIcon @click="clear"
                        class="h-6 w-6 dark:text-gray-200 text-gray-600 transform hover:scale-105 transition-transform duration-150" />
                </div>
                <div class="flex-grow">
                    <EditContent v-if="sessions?.[sessionId]?.completedMessage" class="w-full"
                        v-model:content="sessions[sessionId].completedMessage" />
                </div>
            </div>
            <div class="flex items-center p-4">
                <div class="flex-grow">
                    <EditContent v-if="props.persona && editPersona" class="w-full"
                        v-model:content="props.persona.basePrompt" />
                </div>
                <div v-if="props.persona && editPersona" class="pl-4">
                    <CloudIcon @click="saveChanges"
                        class="h-6 w-6 text-green-500 transform hover:scale-105 transition-transform duration-150" />
                </div>
            </div>
        </div> -->

        <!-- Markdown Reveal Section -->



        <div v-if="thisSessionsContent?.[0]">
           Extracts: {{ thisSessionsContent[0].extracts }}
            <br/>
           Code: {{ thisSessionsContent[0].extracts.code }}
            <br/>
           JSON: {{ thisSessionsContent[0].extracts.json }}
        </div>

        <div v-if="sessions?.[sessionId]?.completedMessage?.length && (sessions[sessionId].completedMessage.includes('# Slide') || sessions[sessionId].completedMessage.includes('# Diapositive'))"
            class="w-full h-96 pointer-events-none" aria-hidden="true">
            <MarkdownReveal :markdownContent="sessions[sessionId].completedMessage" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import defaultImage from "../images/persona1.png"

// import { StarIcon } from '@heroicons/vue/outline';
import { StarIcon } from '@heroicons/vue/24/solid'
import { TrashIcon } from '@heroicons/vue/24/solid'
import { CloudIcon } from '@heroicons/vue/24/solid'

import MarkdownIt from 'markdown-it';


//Components
import ButtonClose from '@/components/ButtonClose.vue';
import ButtonEdit from '@/components/ButtonEdit.vue';
import ButtonGenerate from '@/components/ButtonGenerate.vue';
import ButtonWait from '@/components/ButtonWait.vue';
import EditContent from '@/components/EditContent.vue';
import MarkdownReveal from '@/components/MarkdownReveal.vue';

//Composables
import { useWebsockets } from '@/composables/useWebsockets.js';
import { useExecutor } from '@/composables/useExecutor.js';
const { wsUuid, sessions, sessionsContent, registerSession, unregisterSession, updateSession, sendToServer } = useWebsockets();
const { actionJson } = useExecutor();

//Props
const props = defineProps({
    trigger: { type: Boolean, default: false },

    stageIndex: { type: Number },
    stageUuid: { type: String },

    sessionId: { type: String, default: () => uuidv4() },
    socketIndex: { type: Number },

    userPrompt: { type: String, default: "" },
    model: { type: String, default: "gpt-4" },
    temperature: { type: Number, default: 0.5 },
    persona: { type: Object },
    appendedContent: { type: Array, default: [] },

});

let processing = ref(false);
const trigger = computed(() => props.trigger);
let isFocused = ref(false)

const appendedContent = computed(() => props.appendedContent);
const stageIndex = computed(() => props.stageIndex);
const stageUuid = computed(() => props.stageUuid);
const socketIndex = computed(() => props.socketIndex);

const thisSessionsContent = computed(() => sessionsContent.value.filter((session) => { return session.sessionId = props.sessionId }));


const emit = defineEmits(['edit', 'close', 'like', 'addSocket', 'removeSocket']
);
//Make sessionId reactive
const sessionId = ref(props.sessionId);
const userPrompt = ref(props.userPrompt);

const completedMessageDiv = ref(null);
const partialMessageDiv = ref(null);


let editPersona = ref(false)

const partialMessage = computed(() => {
    if (sessions?.value) {
        const session = sessions.value[sessionId.value];  // Use the sessionId prop to access the correct session
        return session ? session?.partialMessage : '';
    }
    else return "";
});

const completedMessage = computed(() => {
    if (sessions?.value) {
        const session = sessions.value[sessionId.value];  // Use the sessionId prop to access the correct session
        return session ? session?.completedMessage : '';
    }
    else return "";
});


watch(stageIndex, (newValue, oldValue) => {
    updateSession(sessionId.value, stageIndex, stageUuid, socketIndex)
});

watch(stageUuid, (newValue, oldValue) => {
    updateSession(sessionId.value, stageIndex, stageUuid, socketIndex)
});

watch(socketIndex, (newValue, oldValue) => {
    updateSession(sessionId.value, stageIndex, stageUuid, socketIndex)
});

watch(trigger, (newValue, oldValue) => {
    //Execute this socket
    sendMessage();
});

watch(appendedContent, (newValue, oldValue) => {
    var contentCompleted = true;
    appendedContent.value.forEach((tag) => {
        if (!tag.completed) contentCompleted = false;
    })
    //Execute this socket
    // console.log("contentCompleted", contentCompleted)
    if (appendedContent.value.length && contentCompleted) sendMessage();
}, { deep: true });



watch(completedMessage, (newValue, oldValue) => {
    console.log("Completed Change")
    console.log(completedMessage)
    console.log("New Value", newValue)
    console.log("Old Value", oldValue)
    if (!oldValue.length && newValue.length) {
        processing.value = false;

        if(thisSessionsContent.value.length)
        {
            // console.log(thisSessionsContent.value[0])
            // console.log(thisSessionsContent.value[0].extracts)
            // console.log(thisSessionsContent.value[0].extracts.value.json)
            actionJson(thisSessionsContent.value[0].extracts.value.json)
        }
    }
    // updateSession(sessionId.value, stageIndex, stageUuid, socketIndex)
});

onMounted(() => {
    registerSession(sessionId.value, props.stageIndex, props.stageUuid, props.socketIndex)
    emit('addSocket', { persona: props.persona, sessionId: sessionId.value, stageIndex: props.stageIndex, stageUuid: props.stageUuid, socketIndex: props.socketIndex })
})

onBeforeUnmount(() => {
    unregisterSession(sessionId.value, props.stageIndex, props.stageUuid, props.socketIndex)
    emit('removeSocket', { persona: props.persona, sessionId: sessionId.value, stageIndex: props.stageIndex, stageUuid: props.stageUuid, socketIndex: props.socketIndex })
})

function sendMessage() {
    if (wsUuid?.value) {
        if (!processing.value) {
            sessions.value[sessionId.value].completedMessage = "";

            var combinedPrompt = props.userPrompt;
            props.appendedContent.forEach((prompt) => {
                combinedPrompt += "\n" + prompt.content;
            })
            console.log("Prompting user and appended ", combinedPrompt)
            //Format is always : uuid, session, model, temperature, systemPrompt, userPrompt, type
            sendToServer(wsUuid.value, sessionId.value, props.model, props.temperature, props.persona.basePrompt, combinedPrompt, 'prompt')
            processing.value = true;

        }
    }
}

function like() {
    emit('like');
}

function clear() {

    sessions.value[sessionId.value].completedMessage = "";

    // emit('clearCompletedMessage', sessionId);
}

const onCloseClick = () => {
    emit('close');
};

const onEditClick = () => {
    editPersona.value = !editPersona.value;
    // emit('edit');
};



const partialMessageMarkdown = computed(() => {
    const md = new MarkdownIt();
    return md.render(partialMessage.value);
});

const completedMessageMarkdown = computed(() => {
    const md = new MarkdownIt();
    return md.render(completedMessage.value);
});

function updateContent(event) {

    // sessions.value[sessionId.value].completedMessage = event.target.innerHtml;

    // console.log(completedMessageDiv.value)
    // = completedMessageDiv.value;

    // isFocused.value = false;
    // console.log(event)
    // sessions.value[sessionId.value].completedMessage = "";
}

</script>



<style>
.card {
    display: flex;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
}

.left-section,
.center-section,
.right-section {
    display: flex;
    align-items: center;
}

.left-section {
    flex: 1;
    margin-right: 10px;
}

.center-section {
    flex: 3;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 10px;
    /* Adjust margin as necessary */
}

.right-section {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}



.rounded-image {
    border-radius: 50%;
    width: 50px;
    height: 50px;
}

.title {
    margin: 0;
}

.subtitle {
    margin: 0;
}

.icon-circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #eee;
    margin: 0 5px;
}

.status-icon {
    background-color: green;
    /* Adjust based on the status */
}
</style>
<!-- 
<style src="reveal.js/dist/reveal.css"></style>
<style src="reveal.js/dist/theme/black.css"></style> -->


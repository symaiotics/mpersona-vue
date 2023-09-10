<template>
    <!-- <div class="p-4">
        Testing Only
        <p>name: {{ persona.name }}</p>
        <p>wsUuid: {{ wsUuid }}</p>
        <p>sessionId: {{ sessionId }}</p>
        <p>user prompt: {{ props.userPrompt }}</p>
        <p>model: {{ props.model }}</p>
        <p>temp: {{ props.temperature }}</p>
        <div v-if="partialMessage">{{ partialMessage }}</div>
        <div v-if="completedMessage">{{ completedMessage }}</div>
        <button @click="sendMessage">Send a message</button>
    </div>
  -->


    <div
        class="flex flex-col  bg-white border border-gray-200 rounded-lg shadow md:flex-row  hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 relative">

        <!--Image and Name and Description-->

        <img class="object-cover w-full rounded-t-lg md:h-48  md:w-48 md:rounded-none md:rounded-l-lg"
            :src="props.persona.url || defaultImage" alt="">
        <div class=" justify-between p-4 leading-normal md:w-1/4">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ props.persona.name }}
            </h5>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{ props.persona.description.en }}.</p>
            <button @click="sendMessage"
                class="self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-3 rounded">Generate</button>
        </div>

        <div class="flex row">
            <div v-if="completedMessage" class=" justify-between p-4 leading-normal md:w-1/4">
                <StarIcon @click="like"
                    class="h-6 w-6 dark:text-yellow-400 text-yellow-600 transform hover:scale-105 transition-transform duration-150" />
                <TrashIcon @click="clear"
                    class="h-6 w-6 dark:text-gray-200 text-gray-600 transform hover:scale-105 transition-transform duration-150" />
            </div>
        </div>

        <!-- Interim and final message-->
        <div class="md:w-1/2 justify-between p-4 leading-normal">
            <!-- <div class = "preserve-whitespace-pre-wrap" v-if="partialMessage">{{ partialMessage }}</div> -->
            <div class="preserve-whitespace-pre-line" v-if="partialMessage">{{ partialMessage }}</div>
            <!-- <div class = "preserve-whitespace-pre-wrap"  v-if="completedMessage">{{ completedMessage }}</div> -->
            <div class="preserve-whitespace-pre-line" v-if="completedMessage">{{ completedMessage }}</div>
        </div>

        <ButtonClose @close="onCloseClick" />
        <ButtonEdit @edit="onEditClick" />



    </div>
</template>
  
<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import defaultImage from "../images/persona1.png"

// import { StarIcon } from '@heroicons/vue/outline';
import { StarIcon } from '@heroicons/vue/24/solid'
import { TrashIcon } from '@heroicons/vue/24/solid'


//Components
import ButtonClose from '@/components/ButtonClose.vue';
import ButtonEdit from '@/components/ButtonEdit.vue';

//Composables
import { useWebsockets } from '@/composables/useWebsockets.js';
const { wsUuid, sessions, registerSession, unregisterSession, sendToServer } = useWebsockets();

//Props
const props = defineProps({
    trigger: { type: Boolean, default: false },
    sessionId: { type: String, default: () => uuidv4() },
    userPrompt: { type: String, default: "" },
    model: { type: String, default: "gpt-4" },
    temperature: { type: Number, default: 0.5 },
    persona: { type: Object },
});

const trigger = computed(() => props.trigger);


watch(trigger, (newValue, oldValue) => {
//   console.log('trigger changed', { newValue, oldValue });
  // Add your logic here for when the trigger prop changes
  sendMessage();
});


const emit = defineEmits(['edit', 'close', 'like']
);
//Make sessionId reactive
const sessionId = ref(props.sessionId);
const userPrompt = ref(props.userPrompt);

onMounted(() => {
    registerSession(sessionId.value)
})

onBeforeUnmount(() => {
    unregisterSession(sessionId.value)
})

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

function sendMessage() {
    if (wsUuid?.value) {
        sessions.value[sessionId.value].completedMessage = "";
        //Format is always : uuid, session, model, temperature, systemPrompt, userPrompt, type
        sendToServer(wsUuid.value, sessionId.value, props.model, props.temperature, props.persona.basePrompt, props.userPrompt, 'prompt')
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
    emit('edit');
};

</script>



<style>
.preserve-whitespace-pre-wrap {
    white-space: pre-wrap;
}

.preserve-whitespace-pre-line {
    white-space: pre-line;
}


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
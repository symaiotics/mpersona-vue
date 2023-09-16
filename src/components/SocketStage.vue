<template>
    <div class="flex flex-col md:flex-row">

        <!-- First Column -->
        <div class="w-full md:w-1/4 p-4">
            <p>Stage {{ props.stageIndex + 1 }}</p>
            <!-- <p>Select your model</p> -->
            <VueMultiselect v-model="selectedModel" :options="adminModels" :searchable="false" :close-on-select="false"
                :custom-label="customLabelModel" :show-labels="false" placeholder="Pick a model">

            </VueMultiselect>

            <textarea :value="props.userPrompt" @input="updateUserPrompt($event.target.value)" id="response" rows="4"
                class="form-textarea w-full mb-2" placeholder="Enter your prompts here"></textarea>

            <!-- {{ sessionsContent }} -->
            <label v-if="props.stageIndex" for="includePrevOutput" class="ml-2 text-gray-700 dark:text-gray-300">
                Append Previous Output</label>
            <VueMultiselect v-if="props.stageIndex" v-model="localSelectedSessionsContent" @update:modelValue='handleSessionContentInput'
                :options="sessionsContentFiltered" :searchable="true" :close-on-select="false"
                :custom-label="customLabelContent" :multiple="true" :show-labels="false" label="label" track-by="label"
                placeholder="Append previous content" />

            <!-- {{ selectedSessionsContent }} -->

            <!-- <div class="flex items-center" v-if = "props.stageIndex">
                <input id="includePrevOutput" type="checkbox"
                    class="form-checkbox h-5 w-5 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-500 rounded border-gray-300 dark:border-gray-700 shadow-sm" />
                <label for="includePrevOutput" class="ml-2 text-gray-700 dark:text-gray-300">
                    Append Previous Output</label>
            </div> -->

            <!-- <div class="flex items-center" v-if="props.stageIndex">
                <input id="autoGenerate" type="checkbox"
                    class="form-checkbox h-5 w-5 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-500 rounded border-gray-300 dark:border-gray-700 shadow-sm" />
                <label for="autoGenerate" class="ml-2 text-gray-700 dark:text-gray-300">
                    Auto-Generate</label>
            </div> -->

            <button @click="generateStage"
                class="self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mr-2 p-3 rounded">
                Generate Stage
            </button>

            <button @click="deleteStage"
                class=" bg-yellow-500 hover:bg-yellow-700 dark:bg-yellow-400 dark:hover:bg-yellow-600 text-white dark:text-gray-800 font-bold  mr-2 p-3 rounded">
                Delete Stage
            </button>


        </div>

        <!-- Second Column -->

        <div class="w-full md:w-3/4 p-4">

            <p>Select your personas</p>
            <div class="flex items-center">

                <!-- {{ personas }} -->
                <VueMultiselect v-if="personas" v-model="selectedPersona" placeholder="Select a persona" label="name"
                    track-by="name" :options="personas" :option-height="104" :custom-label="customLabel"
                    :show-labels="false" />

                <button @click="addToSockets"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-200 font-bold m-2 p-2 rounded w-auto">
                    Add to Stage
                </button>

            </div>

            <!-- TODO change this from the persona Roster-->
            <!-- TODO Fix the key-->
            <template v-for="(socket, index) in props.sockets" :key="'stageSocket'+index">
                <!-- {{ props }} -->
                <SocketTester
                :trigger="triggerGeneration" 
                :stageIndex="props.stageIndex" 
                :stageUuid="props.stageUuid" 

                :sessionId="socket.sessionId"
                :socketIndex="index"

                :userPrompt="props.userPrompt" 
                :model="selectedModel.model" 
                :temperature="0.5"
                :persona="socket.persona" 
                :appendedContent="props.selectedSessionsContent" 
                
                @like="like(persona)" 
                @close="removeFromSockets(index)"
                @edit="edit(persona)" 
                @addSocket="addSocket" 
                @removeSocket="removeSocket" 
                
                />
            </template>
        </div>
    </div>
</template>



<script setup>
import { ref, computed, onMounted, watch } from 'vue';

//Libs
import VueMultiselect from 'vue-multiselect'
// import D3GC from '@symaiotics/d3-graph-creator-tailwind'
// import '@symaiotics/d3-graph-creator-tailwind/dist/style.css';

//Components
import Header from '@/partials/Header.vue'
import PageIllustration from '@/partials/PageIllustration.vue'
import SocketTester from '@/components/SocketTester.vue'
import Tabs from '@/components/Tabs.vue';

//Composables
import { useWebsockets } from '@/composables/useWebsockets.js'
import { useModels } from '@/composables/useModels.js'
import { usePrompts } from '@/composables/usePrompts.js'
import { usePersonas } from '@/composables/usePersonas.js'
import { useCategories } from '@/composables/useCategories.js'
const { sessionsContent, sessions } = useWebsockets()
const { personas, selectedPersona, usedCategories, skills, getPersonas, getSkills, getUsedCategories, updatePersonas } = usePersonas()
const { categories, selectedCategory, getCategories, createAdminCategories } = useCategories()
const { promptOpenAI, promptResponse, promptResponseCode } = usePrompts()
const { adminModels, selectedModel } = useModels()

//Definitions
// let userPrompt = ref("");
// let personaRoster = ref([]);
let triggerGeneration = ref(false);
let localSelectedSessionsContent = ref([]);

let props = defineProps({

    selectedSessionsContent: { type: Array, default: [] },
    userPrompt: { type: String, default: "" },
    sockets: { type: Array, default: [] },
    stageIndex: { type: Number, default: 0 },
    stageUuid: { type: String },
})

let emit = defineEmits(['deleteStage', 'addToSockets', 'removeFromSockets', 'update:userPrompt', 'updateSessionContent', 'addSocket','removeSocket'])

//Tabs
let activeTab = ref(0)
const tabs = ref([
    { label: 'Interact' },
    { label: 'Edit' },
    { label: 'Results' },
]);

//Multiselect
const customLabel = (option) => option ? option.name : '';
const customLabelModel = (option) => option ? option.label : '';
const customLabelContent = (option) => option ? ("(" + (option.stageIndex + 1) + "." + (option.socketIndex + 1) + "): " + (option.content.length ? option.content.slice(0, 25) : "Content pending...")) : '';

let sessionsContentFiltered = computed(() => {
    return sessionsContent.value.filter((session) => { return session.stageIndex < props.stageIndex })
})

//Lifecycle hooks
onMounted(() => {
    getPersonas();
    getUsedCategories();
    if (props.selectedSessionsContent) localSelectedSessionsContent.value = props.selectedSessionsContent;
})

// TODO update so the selectedSessionContent (selectedStageContent?) is saved into the stage itself
// const selectedSessionContent = computed(() => props.selectedSessionContent);


watch(sessionsContent, (newValue, oldValue) => {
    //Update the selected 
    props.selectedSessionsContent.forEach((tag, index, origArray) => {
        if (sessions.value[tag.sessionId]) {

            //TODO, emit instead?
            tag.content = (sessions.value[tag.sessionId].partialMessage || sessions.value[tag.sessionId].completedMessage)
            tag.completed = sessions.value[tag.sessionId].completedMessage.length > 0 ? true : false;
        }
        else {
            emit('removeSessionContent', index)
            origArray.splice(index, 1)
        }
    })
});

//Functions
function addToSockets() {
    // console.log("Add to Roster", selectedPersona.value)
    if (selectedPersona.value) emit('addToSockets', { persona: JSON.parse(JSON.stringify(selectedPersona.value)), stageIndex: props.stageIndex, stageUuid: props.stageUuid })
}

function removeFromSockets(index) {
    emit('removeFromSockets', { index, stageIndex: props.stageIndex })
}

function generateStage() {
    triggerGeneration.value = !triggerGeneration.value; //Toggle - change is detected down stream
}

function deleteStage() {
    emit('deleteStage', props.stageIndex);
}

function like(persona) {
    console.log("Liked Persona", persona);
}

function edit(persona) {
    activeTab.value = 1;
}

//Updat the userPrompt back to the parent
const updateUserPrompt = (newValue) => {
    emit('update:userPrompt', newValue);
};

const handleSessionContentInput = (newValue) => {
    // console.log("SessionContent changed", newValue)
    emit('updateSessionContent', { newValue: newValue, stageIndex: props.stageIndex });
};

function addSocket(val)
{
    console.log("SocketStage addSocket: still useful?", val)
    // emit('addSocket', val)
}

function removeSocket(val)
{
    console.log("SocketStage removeSocket: still useful?", val)
    // emit('removeSocket', val)
}


</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>


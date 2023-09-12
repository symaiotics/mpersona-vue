<template>
    <div class="flex flex-col md:flex-row">

        <!-- First Column -->
        <div class="w-full md:w-1/4 p-4">
            <p>Stage {{ props.stageIndex + 1 }}</p>
            <!-- <p>Select your model</p> -->
            <VueMultiselect v-model="selectedModel" :options="adminModels" :searchable="false" :close-on-select="false"
                :custom-label="customLabelModel" :show-labels="false" placeholder="Pick a model">

            </VueMultiselect>

            <textarea v-model="userPrompt" id="response" rows="8" class="form-textarea w-full mb-2"
                placeholder="Enter your prompts here"></textarea>

            <!-- {{ sessionsContent }} -->
            <label v-if="props.stageIndex" for="includePrevOutput" class="ml-2 text-gray-700 dark:text-gray-300">
                Append Previous Output</label>
            <VueMultiselect v-if="props.stageIndex" v-model="selectedSessionsContent" :options="sessionsContentFiltered"
                :searchable="true" :close-on-select="false" :custom-label="customLabelContent" :multiple="true"
                :show-labels="false" label="label" track-by="label" placeholder="Append previous content" />

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
                class="self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-3 rounded">
                Generate Stage
            </button>

            <button @click="deleteStage"
                class="self-start bg-yellow-500 hover:bg-yellow-700 dark:bg-yellow-400 dark:hover:bg-yellow-600 text-white dark:text-gray-800 font-bold  m-2 p-3 rounded">
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

                <button @click="addToRoster"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-200 font-bold m-2 p-2 rounded w-auto">
                    Add to Stage
                </button>

            </div>

            <template v-for="(persona, index) in personaRoster" :key="'persona'+persona.uuid">
                <!-- {{ props }} -->
                <SocketTester :stageIndex="props.stageIndex" :stageUuid="props.stageUuid" :socketIndex="index"
                    :appendedContent="selectedSessionsContent" @like="like(persona)" @close="remove(index)"
                    @edit="edit(persona)" :trigger="triggerGeneration" :model="selectedModel.model" :temperature="0.5"
                    :persona="persona" :userPrompt="userPrompt" />
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
let userPrompt = ref("");
let personaRoster = ref([]);
let triggerGeneration = ref(false);
let selectedSessionsContent = ref([]);

let props = defineProps({
    stageIndex: { type: Number, default: 0 },
    stageUuid: { type: String },

})

let emit = defineEmits(['deleteStage'])

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
})


watch(sessionsContent, (newValue, oldValue) => {
    //Update the selected 
    selectedSessionsContent.value.forEach((tag, index, origArray) => {
        if (sessions.value[tag.sessionId]) {
            tag.content = (sessions.value[tag.sessionId].partialMessage || sessions.value[tag.sessionId].completedMessage)
            tag.completed = sessions.value[tag.sessionId].completedMessage.length > 0 ? true : false;
        }
        else {
            origArray.splice(index, 1)
        }
    })
});

//Functions
function addToRoster() {
    if (selectedPersona.value)
        personaRoster.value.push(selectedPersona.value)
}

function generateStage() {
    //Toggle the value to trigger the children
    triggerGeneration.value = !triggerGeneration.value;
    // triggerGeneration.value = false;

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

function remove(index) {
    personaRoster.value.splice(index, 1)
}




</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>


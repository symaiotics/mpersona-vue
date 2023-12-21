<template>
  <div class="bg-gray-100 min-h-screen lg:p-2">
    <div class=" mx-auto bg-white lg:p-8 rounded shadow-lg">

      <!-- Top Header -->
      <div class="bg-white">
        <div class="flex justify-between items-center pl-2  border-b border-gray-300 pb-2">
          <a href="https://mpersona.com">
            <div v-if="selectedRoster" class="flex items-center">
              <img v-if="selectedRoster && selectedRoster?.url?.length" :src="selectedRoster.url" alt="Brand Logo"
                class="w-auto h-24 mr-4">
              <img v-else :src="canada" alt="Canada Flag" class="w-64  mr-4">
            </div>
          </a>
          <!-- <span>Français</span> -->
        </div>
      </div>

      <div class="flex flex-box w-full justify-center ">
        <section class="w-10/12">
          <h1 v-if="selectedRoster" id="wb-cont"
            class="font-lato font-bold text-3xl mt-10 mb-1 pb-1 border-b border-red-600 leading-tight">
            {{ selectedRoster.name }} </h1>

          <section class="mb-2">
            <p v-if="selectedRoster" id="wb-cont" class="font-lato text-1xl.5 mt-1 mb-1 pb-1 ">
              {{ selectedRoster.description.en }}
            </p>
          </section>
        </section>
      </div>

      <div class="flex justify-center ">
        <div class=" w-full">
          <section class="mb-6 w-full">
            <Tabs :tabs="tabs" v-model="activeTab">
              <template v-slot:tab-0>
                <div v-if="selectedRoster">
                  <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    <template v-for="(persona, index) in selectedRoster.personas" :key="persona.uuid">
                      <div class="pl-6 pr-6">
                        <DisplayPersona @click="selectPersona(persona, index)" :persona="persona" alignment="center" />
                      </div>
                    </template>
                  </div>
                </div>
              </template>

              <template v-slot:tab-1>


                <div class="flex flex-wrap -mx-3">
                  <div class="w-full px-3">

                    <div>
                      <DragAndDropWord @processingCompleted="handleProcessingCompleted" />
                    </div>


                  </div>
                </div>
                <div class="w-full">

                  <div v-if="selectedWordFile?.htmlContent" class="flex items-center mb-2 space-x-2">

                    <button @click="summarizeSelectedFile"
                      class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                      Summarize Selected File
                    </button>

                    <button @click="extractSegment"
                      class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                      Extract Segement
                    </button>
                  </div>


                  <div :class="`grid gap-2  sm:grid-cols-1 md:grid-cols-6`">
                    <div id="wordPreviewCol" class="col-span-1 overflow-auto">
                      <WordPreview v-if="filePreviews.length" :filePreviews="filePreviews" @selected="handleSelected"
                        @deleteFile="deleteFile" />
                    </div>

                    <div class='col-span-3' v-if="selectedWordFile?.htmlContent">

                      <!-- {{ selectedWordFile }} -->
                      <DivInput placeholder="Word document contents" @selectionChange="selectionChange"
                        v-model="selectedWordFile.htmlContent" :asPlainText="false" />


                    </div>

                    <div class='col-span-2' v-if="selectedWordFile?.htmlContent">


                      <DisplayPersona :persona="selectedPersona" alignment="center" />

                      <VueMultiselect v-model="selectedModel" :options="adminModels" :searchable="true"
                        :close-on-select="true" :custom-label="customLabelModel" :show-labels="false"
                        placeholder="Pick a model" />

                      <!-- <div v-if = "selectedWordFile">{{ selectedWordFile }}</div> -->
                      <div v-for="(extract, index) in selectedWordFile.extracts" :key="extract.sessionId + index">
                        <!-- <div v-if="extract.status == 'completed' "> -->
                        <KnowledgeSegment :data='extract' :showCheckbox="true" />
                        <!-- </div> -->
                      </div>



                      <div v-if="selectedPersona">
                        <div v-for="(extract, index) in selectedWordFile.extracts" :key="extract.sessionId">
                          <div v-show="false">
                            <Socket v-if="extract.status == 'pending'" :sessionId="extract.sessionId"
                              :persona="selectedPersona" :userPrompt="extract.prompt" :model="selectedModel"
                              :trigger="extract.trigger"
                              @messageComplete="payload => messageCompleteExtract(payload, index)"
                              @messagePartial="payload => messagePartialExtract(payload, index)">
                            </Socket>
                          </div>

                        </div>

                      </div>


                    </div>
                  </div>
                </div>
              </template>
              <template v-slot:tab-2>
                Build a Mapping

                <div class="grid gap-2 sm:grid-cols-1 md:grid-cols-4">

                  <!-- Mapping Details Column -->
                  <div id="mappingDetailsCol" class="md:col-span-1">

                    <div class="w-full m-2">
                      <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="mappingName">
                        Mapping Name <span class="text-red-600">*</span>
                      </label>
                      <input v-model="newMapping.name" id="mappingName" type="text" class="form-input w-full"
                        placeholder="Name your mapping" required />
                    </div>

                    <div class="w-full m-2">
                      <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1"
                        for="mappingDescription">
                        Mapping Description <span class="text-red-600">*</span>
                      </label>
                      <textarea v-model="newMapping.context" id="mappingDescription" rows="4"
                        class="form-textarea w-full mb-2" placeholder="Enter your mapping description"></textarea>
                    </div>

                    <div class="w-full m-2">
                      <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="mappingContext">
                        Mapping Context (Where should this mapping be used?) <span class="text-red-600">*</span>
                      </label>
                      <textarea v-model="newMapping.description" id="mappingContext" rows="4"
                        class="form-textarea w-full mb-2" placeholder="Enter your mapping context"></textarea>
                    </div>

                  </div>

                  <!-- File Previews Columns -->
                  <div class="md:col-span-3">
                    <div v-for="(file, fileIndex) in filePreviews" :key="`fileIndex-${fileIndex}`" class="mb-4">

                      <!-- Nested grid for each file preview's content -->
                      <div class="grid gap-2 sm:grid-cols-1 md:grid-cols-2">
                        <!-- Word Preview Column -->
                        <div class="md:col-span-1">
                          <WordPreview :filePreviews="[file]" />
                        </div>

                        <!-- Knowledge Segment Columns -->
                        <div class="md:col-span-1">
                          <div v-for="(extract, index) in file.extracts" :key="`extract-${extract.sessionId}-${index}`">
                            <KnowledgeSegment :data='extract' :showCheckbox="true" />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>


                </div>

              </template>
            </Tabs>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted, onUnmounted, nextTick, watch, watchEffect, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import DisplayPersona from '@/components/DisplayPersona.vue'
import DivInput from '@/components/DivInput.vue'
import Socket from '@/components/Socket.vue'
import Tabs from '@/components/Tabs.vue';
import canada from "@/images/canada.svg";
import VueMultiselect from 'vue-multiselect'
import DragAndDropWord from '@/components/DragAndDropWord.vue';
import WordPreview from '@/components/WordPreview.vue';
import KnowledgeSegment from '@/components/KnowledgeSegment.vue';

import { notify } from "notiwind"

//Composables

import { useModels } from '@/composables/useModels.js'
import { usePersonas } from '@/composables/usePersonas.js'
import { useRosters } from '@/composables/useRosters.js'
import { useWebsockets } from '@/composables/useWebsockets.js';

const { adminModels, selectedModel } = useModels()
const { personas, selectedPersona, newPersona, getPersonas, resetPersona } = usePersonas()
const { rosters, selectedRoster, getRosterFromUuid } = useRosters()
const { sessionsContent } = useWebsockets();






let activeTab = ref(0)
const tabs = ref([
  { label: 'Roster ' },
  { label: 'Files ' },
  { label: 'Mappings ' },
  { label: 'Interact ' },
  { label: 'Assemble' }
]);

let props = defineProps({ rosterId: { type: String, default: null } })

//Knowledge Mappings
let settings = ref({ display: { showReference: false }, showPrompt: true, useLexicon: true, asPlainText: true })

const extractSocketUuid = ref(null)
const filePreviews = ref([]);
const selectedWordFile = ref(null);
// const extractExtracts = computed(() => sessionsContent.value.filter((session) => { return session.sessionId == extractSocketUuid.value }));

//Triggers for the different functions
let triggerGenerate = ref(false);
let messageHistory = ref([]);
let selectedPersonaIndex = ref(null)
const isAutoScrollActive = ref(true);


let extractPrompt = ref("")
let wordPreviewSelectedContent = ref(null)
let newMapping = ref({ name: null, description: null })


onMounted(async () => {

  extractSocketUuid.value = uuidv4()

  setDark(false)
  if (props.rosterId) {
    await getRosterFromUuid(props.rosterId);
  }
  window.addEventListener('scroll', handleScroll);

})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});


function setDark(newValue) {
  sessionStorage.setItem('dark-mode', newValue);
  if (newValue) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}




const customLabelModel = (option) => option ? option.label : '';



//Knowledge Mappings

const handleProcessingCompleted = (previews) => {
  previews.forEach((preview) => {
    filePreviews.value.push(preview)
  })
  // filePreviews.value = previews;
};

const handleSelected = (index) => {
  selectedWordFile.value = filePreviews.value[index];

  // console.log('Selected preview index:', index);
};

function deleteFile(index) {
  filePreviews.value.splice(index, 1)
}
function clearFilePreviews() {
  filePreviews.value = [];
}

function summarizeSelectedFile() {
  extractPrompt.value = 'Summarize the following file contents:\n\n';
  console.log(wordPreviewSelectedContent.value)
}

function extractSegment() {
  if (wordPreviewSelectedContent?.value?.text?.length) {
    if (!Array.isArray(selectedWordFile?.value?.extracts)) selectedWordFile.value.extracts = [];
    let newPrompt = 'Summarize the following contents:\n\n' + wordPreviewSelectedContent.value.text;
    let newExtract = { status: "pending", sessionId: uuidv4(), prompt: newPrompt, trigger: false, message: null, json: null }
    selectedWordFile.value.extracts.push(newExtract);
    let selectedIndex = selectedWordFile.value.extracts.length - 1;
    nextTick((() => { selectedWordFile.value.extracts[selectedIndex].trigger = !selectedWordFile.value.extracts[selectedIndex].trigger }))
  }
}

function selectionChange(val) {
  wordPreviewSelectedContent.value = val;
  wordPreviewSelectedContent.value.text = stripHtml(val.html);
  console.log(wordPreviewSelectedContent.value)
}

function trigger() {
  //Save the history
  // messageHistory.value.push({ role: "user", content: chatPrompt.value })
  triggerGenerate.value = !triggerGenerate.value;
}


function previewSelectionChange(val) {
  console.log(val)
}


function messageCompleteExtract(val, index) {
  // Your logic here, using payload and index
  if (val?.message?.length) {
    let thisSessionContent = sessionsContent.value.filter((session) => { return session.sessionId == selectedWordFile.value.extracts[index].sessionId })
    if (thisSessionContent?.[0]?.extracts?.json?.length) {
      selectedWordFile.value.extracts[index].json = thisSessionContent[0].extracts.json[0];
    };
    selectedWordFile.value.extracts[index].message = val.message;
    selectedWordFile.value.extracts[index].status = 'completed';
  }
}

function messagePartialExtract(val, index) {
  // Your logic here, using payload and index
  //  console.log(val.message);
  if (val?.message?.length) {
    selectedWordFile.value.extracts[index].message = val.message;
  }
}


const handleScroll = () => {
  const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
  isAutoScrollActive.value = isAtBottom;
};

// Function to scroll to the bottom of the page
const scrollToBottom = () => {
  window.scrollTo(0, document.body.scrollHeight);
};

// Watch for changes in logLines and auto-scroll if active
watchEffect(() => {
  if (isAutoScrollActive.value) {
    scrollToBottom();
  }
});

function selectPersona(persona, index) {
  selectedPersona.value = persona;
  if (index) selectedPersonaIndex.value = index;
  let findIndex = selectedRoster.value.personas.findIndex((rosterPersona) => { return rosterPersona.uuid == selectedPersona.value.uuid })
  if (findIndex > -1) selectedPersonaIndex.value = findIndex;
  //Don't automatically remove the history
  // messageHistory.value = []; //Clear message history when you switch Personas

  // if (selectedPersona?.value?.basePrompt?.length) {
  //      messageHistory.value.push({ role: "system", content: selectedPersona.value.basePrompt })
  // }

  //Instead, replace the original system prompt
  if (selectedPersona?.value?.basePrompt?.length) {
    if (messageHistory?.value?.length) {
      if (messageHistory.value[0].role == 'system') messageHistory.value[0] = { role: "system", content: selectedPersona.value.basePrompt };
      else messageHistory.value.unshift({ role: "system", content: selectedPersona.value.basePrompt })
    }
    else {
      messageHistory.value = []
      messageHistory.value.push({ role: "system", content: selectedPersona.value.basePrompt })
    }
  }

  activeTab.value = 1;
}


// Helper function to remove HTML tags from a string
function stripHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}




</script>


<style scoped>
/* Custom scrollbar styles */
#wordPreviewCol::-webkit-scrollbar {
  width: 10px;
  /* width of the entire scrollbar */
}

#wordPreviewCol::-webkit-scrollbar-track {
  background: transparent;
  /* color of the tracking area */
}

#wordPreviewCol::-webkit-scrollbar-thumb {
  background-color: #a0aec0;
  /* color of the scroll thumb */
  border-radius: 20px;
  /* roundness of the scroll thumb */
  border: 3px solid #f7fafc;
  /* creates padding around scroll thumb */
}
</style>

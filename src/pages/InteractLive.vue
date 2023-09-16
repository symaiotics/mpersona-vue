<template>
  <div class="flex flex-col min-h-screen overflow-hidden">

    <!-- Site header -->
    <Header />

    <!-- Page content -->
    <main class="grow">

      <!-- Page illustration -->
      <div class="relative max-w-9xl mx-auto h-0 pointer-events-none -z-1" aria-hidden="true">
        <PageIllustration />
      </div>
<!-- stages
{{ stages }} -->
      <section class="relative">
        <div class="max-w-9xl mx-auto px-4 sm:px-6 relative">
          <div class="pt-32 pb-12 md:pt-40 md:pb-20">

            <Tabs :tabs="tabs" v-model="activeTab">
              <template v-slot:tab-0>


                <p v-if="!stages.length" class="p-1"> Add a stage to get started. A stage allows you to interact with a
                  set of personas on a specific prompt.</p>
                <p v-if="!stages.length" class="p-1"> Each additional stage can have a unique prompt or use the output
                  from the previous stage as its prompt.</p>

                <div class="flex flex-col md:flex-row">

                  <button @click="addStage"
                    class=" whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 p-3 rounded">
                    Add Stage
                  </button>
                </div>

                <template v-for="(stage, index) in stages" :key="'stage' + stage.uuid">
                  <!-- {{ stage }} -->
                  <!--:personaRoster="stage.personaRoster"-->
                  <SocketStage :stageIndex="index" :stageUuid="stage.uuid" :sockets="stage.sockets"
                    :selectedSessionsContent="stage.selectedSessionsContent" v-model:userPrompt="stage.userPrompt"
                    @deleteStage="deleteStage" @addToSockets='addToSockets' @removeFromSockets='removeFromSockets'
                    @updateSessionContent="updateSessionContent" @moveStageUp = "moveStageUp" @moveStageDown = "moveStageDown" />
                  <!-- 
                  @addSocket = "addSocket" 
                  @removeSocket = "removeSocket"
                  -->
                </template>

              </template>
              <template v-slot:tab-1>
                <div>

                  <!-- {{ stages }} -->

                  <div class="w-full  px-3 mb-4 md:mb-1">
                    <!-- {{ workStreams }} -->
                    <!-- {{ stages }}
                    {{ sessions }} -->
                    <div class="flex items-center">
                      <VueMultiselect v-if="workStreams" v-model="selectedWorkStream" placeholder="Select a Work Stream"
                        label="name" track-by="name" :options="workStreams" :option-height="104"
                        :custom-label="customLabel" :show-labels="false" />


                      <button @click="loadWorkStream"
                        class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-200 font-bold m-2 p-2 rounded w-auto">
                        Select
                      </button>

                    </div>


                  </div>

                  <div v-if="stages.length" class="w-full  px-3 mb-4 md:mb-1">
                    <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="name">
                      Work Stream Name
                      <span class="text-red-600">*</span>
                    </label>
                    <input v-model="newWorkStream.name" id="name" type="text" class="form-input w-full"
                      placeholder="Enter the name of the Work Stream" required />

                    <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1 mt-2" for="description">
                      Description
                    </label>
                    <input v-model="newWorkStream.description.en" id="description" type="text" class="form-input w-full"
                      placeholder="Enter a brief description" />
                  </div>

                  <button @click="saveWorkStream"
                    class=" whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-3 p-3 rounded">
                    Save Work Stream
                  </button>





                </div>
              </template>
              <template v-slot:tab-2>
                <template v-for="(stage, index) in messages" :key="'resultsStage' + index">
                  <div class="border m-2 p-2 rounded  preserve-whitespace-pre-line" v-html="markdown(stage)"></div>

                </template>
              </template>
            </Tabs>

          </div>
        </div>
      </section>


    </main>

    <!-- Site footer -->
    <!-- <Footer /> -->

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

//Libs
import { v4 as uuidv4 } from 'uuid';
import VueMultiselect from 'vue-multiselect'
import { PlusCircleIcon } from '@heroicons/vue/24/solid'
import { TrashIcon } from '@heroicons/vue/24/solid'
// import D3GC from '@symaiotics/d3-graph-creator-tailwind'
// import '@symaiotics/d3-graph-creator-tailwind/dist/style.css';

//Components
import Header from '@/partials/Header.vue'
import PageIllustration from '@/partials/PageIllustration.vue'
import SocketStage from '@/components/SocketStage.vue'
import Tabs from '@/components/Tabs.vue';
import MarkdownReveal from '@/components/MarkdownReveal.vue';


//Composables
import { useWebsockets } from '@/composables/useWebsockets.js';
import { useWorkStreams } from '@/composables/useWorkStreams.js';
const { sessions, stages } = useWebsockets();
const { getWorkStreams, createWorkStreams, updateWorkStreams, workStreams, selectedWorkStream, selectWorkStream } = useWorkStreams();

import MarkdownIt from 'markdown-it';

// import { useModels } from '@/composables/useModels.js'
// import { usePrompts } from '@/composables/usePrompts.js'
// import { usePersonas } from '@/composables/usePersonas.js'
// import { useCategories } from '@/composables/useCategories.js'
// const { personas, selectedPersona, usedCategories, skills, getPersonas, getSkills, getUsedCategories, updatePersonas } = usePersonas()
// const { categories, selectedCategory, getCategories, createAdminCategories } = useCategories()
// const { promptOpenAI, promptResponse, promptResponseCode } = usePrompts()
// const { adminModels, selectedModel } = useModels()

//Definitions
// let userPrompt = ref("");
// let personaRoster = ref([]);
// let triggerGeneration = ref(false);

// let stages = ref([])


const customLabel = (option) => option ? option.name : '';



//Tabs
let activeTab = ref(0)
const tabs = ref([
  { label: 'Interact' },
  { label: 'Work Streams' },
  { label: 'Results' },
]);

let newWorkStream = ref({
  name: "",
  description: { en: "", fr: "" },
});

//Multiselect
// const customLabel = (option) => option ? option.name : '';
// const customLabelModel = (option) => option ? option.label : '';


const messages = computed(() => {

  var combinedResults = [];
  var keys = Object.keys(sessions.value)
  keys.forEach((key, index, origArray) => {

    var text = sessions.value[key].completedMessage || sessions.value[key].partialMessage;
    if (text.length) combinedResults.push(text)

  })

  // const md = new MarkdownIt();
  // return md.render(combinedResults.join(''));
  return combinedResults;

});


//Lifecycle hooks
onMounted(() => {
  getWorkStreams();
  if (!stages.value.length)
    addStage();
})

//Functions
function addStage() {
  var newStage = {
    userPrompt: "",
    selectedSessionsContent: [],
    uuid: uuidv4(),
    sockets: [],
    // personaRoster: [],

  }
  stages.value.push(newStage)
}

function deleteStage(index) {
  console.log(index)
  stages.value.splice(index, 1)
}

function moveStageUp(index) {
  if (index > 0) {
    var newIndex = index-1;

    //Incorrect, this is fixing the wrong thing. Need to fix all the other indexes 
    // stages.value.forEach((stage)=>{
    //   stage.selectedSessionsContent.forEach((session)=>{
    //     if(session.stageIndex == index) session.stageIndex = newIndex;
    //   })
    // })
    const itemToMoveUp = stages.value[index];
    stages.value.splice(index, 1);
    stages.value.splice(index - 1, 0, itemToMoveUp);
    //TODO update selectedSessionsContent so the indexes of those change as well

  }
}

function moveStageDown(index) {
  if (index < stages.value.length - 1) {
    var newIndex = index+1;

    //Incorrect
    // stages.value.forEach((stage)=>{
    //   stage.selectedSessionsContent.forEach((session)=>{
    //     if(session.stageIndex == index) session.stageIndex = newIndex;
    //   })
    // })

    const itemToMoveDown = stages.value[index];
    stages.value.splice(index, 1);
    stages.value.splice(index + 1, 0, itemToMoveDown);

    //TODO update selectedSessionsContent so the indexes of those change as well
  }
}


function addToSockets(val) {
  console.log("Add to Roster", val)
  if (val.persona) stages.value[val.stageIndex].sockets.push(
    {
      sessionId: uuidv4(), //generate this at the parent level now
      socketIndex: stages.value[val.stageIndex].sockets.length,
      stageIndex: val.stageIndex,
      stageUuid: val.stageUuid,
      persona: val.persona,
    }
  )
}

function removeFromSockets(val) {
  stages.value[val.stageIndex].sockets.splice(val.index, 1)
}

function saveWorkStream() {
  createWorkStreams(newWorkStream.value).then((response) => {

    //Reset Work Stream
    newWorkStream.value =
    {
      name: "",
      description: { en: "", fr: "" },
    }

  })
}

function loadWorkStream() {
  selectWorkStream(selectedWorkStream.value);
  activeTab.value = 0;
}

// function addSocket(val) {
// stages.value[val.stageIndex].sockets.push(val.sessionId)
// console.log("Add Socket at parent", val)
// }

// function removeSocket(val) {
//  stages.value[val.stageIndex].sockets.splice(val.socketIndex)
//  console.log("Remove Socket at parent", val)
// }

// const stageStatus = computed(()=>{

//   var filtered = sessions.value.filter((session)=>{return session.stage ==  })
// })

function updateSessionContent(val) {
  stages.value[val.stageIndex].selectedSessionsContent = val.newValue;
}



function markdown(html) {

  const md = new MarkdownIt();
  return md.render(html);

}




</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>


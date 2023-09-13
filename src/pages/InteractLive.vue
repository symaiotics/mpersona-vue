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


      <section class="relative">
        <div class="max-w-9xl mx-auto px-4 sm:px-6 relative">
          <div class="pt-32 pb-12 md:pt-40 md:pb-20">

            <Tabs :tabs="tabs" v-model="activeTab">
              <template v-slot:tab-0>


                <p v-if="!stages.length" class="p-1"> Add a stage to get started. A stage allows you to interact with a set of personas on a specific prompt.</p>
                  <p v-if="!stages.length" class="p-1"> Each additional stage can have a unique prompt or use the output from the previous stage as its prompt.</p>

                <div class="flex flex-col md:flex-row">

                  <button @click="addStage"
                    class=" whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 p-3 rounded">
                    Add Stage
                  </button>
                </div>
 
                <template v-for="(stage, index) in stages" :key="'stage' + stage.uuid">
                  <!-- {{ stage }} -->
                  <SocketStage :stageIndex="index" :stageUuid="stage.uuid"  @deleteStage = "deleteStage" @addSocket = "addSocket" @removeSocket = "removeSocket"/>
                </template>
 
              </template>
              <template v-slot:tab-1>
                <div>Edit content here...</div>
              </template>
              <template v-slot:tab-2>
                <template v-for = "(stage, index) in messages" :key = "'resultsStage' + index">
                  <div class = "border m-2 p-2 rounded  preserve-whitespace-pre-line" v-html = "markdown(stage)"></div>
              
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
import { v4 as uuidv4 } from 'uuid';

import { PlusCircleIcon } from '@heroicons/vue/24/solid'
import { TrashIcon } from '@heroicons/vue/24/solid'


//Libs
// import VueMultiselect from 'vue-multiselect'
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
const {  sessions} = useWebsockets();

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

let stages = ref([])

//Tabs
let activeTab = ref(0)
const tabs = ref([
  { label: 'Interact' },
  { label: 'Edit' },
  { label: 'Results' },
]);

//Multiselect
// const customLabel = (option) => option ? option.name : '';
// const customLabelModel = (option) => option ? option.label : '';

//Lifecycle hooks
onMounted(() => {
  // getPersonas();
  // getUsedCategories();
})

//Functions


function addStage() {

  var newStage = {
    uuid: uuidv4(),
    sessions:[],
  }
  stages.value.push(newStage)
}

function deleteStage(index) {
  console.log(index)
  stages.value.splice(index, 1)
}

function addSocket(sessionId) {
stages.value.sessions.push(sessionId)
}

function removeSocket(sessionId) {
stages.value.sessions.push(sessionId)
}

// const stageStatus = computed(()=>{

//   var filtered = sessions.value.filter((session)=>{return session.stage ==  })
// })

const messages = computed(() => {

  var combinedResults = [];
  var keys = Object.keys(sessions.value)
  keys.forEach((key, index, origArray)=>{

    var text = sessions.value[key].completedMessage || sessions.value[key].partialMessage;
    if(text.length) combinedResults.push(text)

  })

  // const md = new MarkdownIt();
  // return md.render(combinedResults.join(''));
  return combinedResults;  

});

function markdown(html)
{

const md = new MarkdownIt();
return md.render(html);

}


</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>


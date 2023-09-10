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

                <div class="flex">
                  <!-- First Column -->
                  <div class="w-1/4 p-4">
                    <p>Select your model</p>
                    <VueMultiselect v-model="selectedModel" :options="adminModels" :searchable="false"
                      :close-on-select="false" :custom-label="customLabelModel" :show-labels="false"
                      placeholder="Pick a model">

                    </VueMultiselect>



                    <textarea v-model="userPrompt" id="response" rows="8" class="form-textarea w-full mb-2"
                      placeholder="Enter your prompts here"></textarea>



                    <button @click="generateAll"
                      class="self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-3 rounded">
                      Generate All
                    </button>



                  </div>

                  <!-- Second Column -->

                  <div class="w-full p-4">
                    <p>Select your personas</p>
                    <div class="flex items-center">

                      <!-- {{ personas }} -->
                      <VueMultiselect v-if="personas" v-model="selectedPersona" placeholder="Select a persona"
                        label="name" track-by="name" :options="personas" :option-height="104" :custom-label="customLabel"
                        :show-labels="false">


                      </VueMultiselect>


                      <!-- <multiselect v-model="value" deselect-label="Can't remove this value" track-by="name" label="name"
                        placeholder="Select one" :options="options" :searchable="false" :allow-empty="false">
                        <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.name }}</strong> is written
                          in<strong> {{ option.language }}</strong></template>
                      </multiselect> -->


                      <button @click="addToRoster"
                        class="self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-200 font-bold m-2 p-2 rounded w-auto">
                        Add&nbsp;to&nbsp;Roster
                      </button>

                    </div>

                    <template v-for="(persona, index) in personaRoster" :key="'persona'+persona.uuid">
                      <SocketTester @like="like(persona)" @close="remove(index)" @edit="edit(persona)"
                       :trigger = "triggerGeneration" :model="selectedModel.model" :temperature="0.5" :persona="persona" :userPrompt="userPrompt" />
                    </template>
                  </div>
                </div>

              </template>
              <template v-slot:tab-1>
                <div>Edit content here...</div>
              </template>
              <template v-slot:tab-2>
                <div>Results content here...</div>
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
import VueMultiselect from 'vue-multiselect'
// import D3GC from '@symaiotics/d3-graph-creator-tailwind'
// import '@symaiotics/d3-graph-creator-tailwind/dist/style.css';

//Components
import Header from '@/partials/Header.vue'
import PageIllustration from '@/partials/PageIllustration.vue'
import SocketTester from '@/components/SocketTester.vue'
import Tabs from '@/components/Tabs.vue';

//Composables
import { useModels } from '@/composables/useModels.js'
import { usePrompts } from '@/composables/usePrompts.js'
import { usePersonas } from '@/composables/usePersonas.js'
import { useCategories } from '@/composables/useCategories.js'
const { personas, selectedPersona, usedCategories, skills, getPersonas, getSkills, getUsedCategories, updatePersonas } = usePersonas()
const { categories, selectedCategory, getCategories, createAdminCategories } = useCategories()
const { promptOpenAI, promptResponse, promptResponseCode } = usePrompts()
const { adminModels, selectedModel } = useModels()

//Definitions
let userPrompt = ref("");
let personaRoster = ref([]);
let triggerGeneration = ref(false);

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

//Lifecycle hooks
onMounted(() => {
  getPersonas();
  getUsedCategories();
})

//Functions
function addToRoster() {
  personaRoster.value.push(selectedPersona.value)
}

function generateAll() {
  //Toggle the value to trigger the children
  triggerGeneration.value = !triggerGeneration.value;
  // triggerGeneration.value = false;

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


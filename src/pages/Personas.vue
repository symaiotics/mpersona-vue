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
                <ManagePersonas 
                />
              </template>
              <template v-slot:tab-1>
                Work Streams
              </template>
              <template v-slot:tab-2>
                Knowledge Profiles
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
import ManagePersonas from '@/components/ManagePersonas.vue';


//Composables
import { useWebsockets } from '@/composables/useWebsockets.js';
import { useWorkStreams } from '@/composables/useWorkStreams.js';
import { usePersonas } from '@/composables/usePersonas.js';
const { sessions, stages } = useWebsockets();
const { getWorkStreams, createWorkStreams, updateWorkStreams, workStreams, selectedWorkStream, selectWorkStream } = useWorkStreams();
const { getPersonas, selectedPersona, personas } = usePersonas();

//Tabs
let activeTab = ref(0)
const tabs = ref([
  { label: 'Personas' },
  { label: 'Create/Edit' },
]);

//Multiselect
const customLabel = (option) => option ? option.name : '';

//Lifecycle hooks
onMounted(() => {
  getPersonas();
  getWorkStreams();
})

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




</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>


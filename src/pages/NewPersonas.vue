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
                <!-- Page header -->
                <div class="max-w-3xl mx-auto text-center pb-3 md:pb-4">
                  <h1 class="h3 font-red-hat-display mb-4">Personas</h1>
                  <p class="text-lg text-gray-600 dark:text-gray-400">Personas define the tasks and skills of your digital
                    ecosystem.</p>
                  <p v-if="personas?.length" class="text-lg text-gray-600 dark:text-gray-400">You currently have access to
                    <b>{{ personas.length }}</b> personas.
                  </p>
                  <br />
                </div>

                <div class="w-full px-3">
                  <button @click="add" class="btn text-white bg-teal-500 hover:bg-teal-400 flex items-center mb-3">
                    <span>Add New</span>
                  </button>
                </div>

                <PersonaTable @changeTab="activeTab = 1" />
              </template>
              <template v-slot:tab-1>
                <PersonaCreateEdit v-if="selectedPersona" :persona="selectedPersona"
                  :key="'persona' + selectedPersona._id" @changeTab = "changeTab" />
                <PersonaCreateEdit v-else-if="newPersona" :persona="newPersona" @changeTab = "changeTab" />
              </template>

            </Tabs>

          </div>
        </div>
      </section>

    </main>

    <!-- Site footer -->
    <Footer />

  </div>
</template>

<script setup>

//Plugins
import { ref, onMounted, nextTick } from 'vue';

//Components
import Header from '@/partials/Header.vue'
import PageIllustration from '@/partials/PageIllustration.vue'
import Footer from '@/partials/Footer.vue'
import Tabs from '@/components/Tabs.vue';
import PersonaTable from '@/components/PersonaTable.vue';
import PersonaCreateEdit from '@/components/PersonaCreateEdit.vue';

//Composables
import { usePersonas } from '@/composables/usePersonas.js'
const { personas, selectedPersona, newPersona, getPersonas, resetPersona } = usePersonas()

let activeTab = ref(0)
const tabs = ref([
  { label: 'Personas' },
  { label: 'Create/Edit' },
]);

onMounted(() => {
  getPersonas();
})

function add() {
  resetPersona();
  selectedPersona.value = null;
  activeTab.value = 1;
}

function changeTab(tab)
{
  activeTab.value = tab;
}

</script>

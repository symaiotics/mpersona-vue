<template class = "bg-white dark:bg-gray-800">
  <div class="w-full h-20">
    <Header />

  </div>


  <div class="bg-gray-100  dark:bg-gray-900 min-h-screen lg:p-2">
    <div class=" mx-auto bg-white dark:bg-gray-800 lg:p-8 rounded shadow-lg">

      <div class="flex flex-box w-full justify-center ">
        <section class="w-11/12">
          <h1 v-if="selectedRoster"
            class="font-lato font-bold text-3xl mt-2 mb-1 pb-1 border-b border-red-600 leading-tight">
            {{ selectedRoster.name }} </h1>

          <section class="mb-2">
            <p v-if="selectedRoster" class="font-lato text-1xl.5 mt-1 mb-1 pb-1 ">
              {{ selectedRoster.description.en }}
            </p>
          </section>
        </section>
      </div>

      <div class="flex justify-center ">
        <div class=" w-11/12">
          <section class="mb-6 w-full">
            <Tabs :tabs="tabs" v-model="activeTab">
              <template v-slot:tab-0>
                <h2 class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight mb-2">
                  Personas
                </h2>
                <p>These Personas will be supporting your RE support process.</p>


                <div v-if="selectedRoster">
                  <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    <template v-for="(persona, index) in selectedRoster.personas" :key="persona.uuid">
                      <div class="pl-6 pr-6">
                        <DisplayPersona :persona="persona" alignment="center" />
                        <!--@click="selectPersona(persona, index)"-->
                      </div>
                    </template>
                  </div>


                  <h2 v-if="selectedRoster"
                    class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight mb-2">
                    Assignments
                  </h2>
                  <p> The following assignments must be set for the app to use the correct Personas and operate properly.
                  </p>

                  <AssignmentsTable :assignmentList="wrappAssignments" :personas="selectedRoster.personas"
                    :wrappUuid="wrappUuid" :rosterUuid="props.rosterUuid" />

                  <h2 v-if="selectedRoster"
                    class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight mb-2">
                    Models
                  </h2>
                  <p> Select the AI model for this session.
                  </p>

                  <VueMultiselect v-model="selectedModel" :options="adminModels" :searchable="true"
                    :close-on-select="true" :custom-label="customLabelModel" :show-labels="false"
                    placeholder="Pick a model" />


                </div>
              </template>


              <template v-slot:tab-1>
                <h2 class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Define your Knowledge Sets
                </h2>
                <p>Knowledge Sets are comprehensive collections of Categories, Tags, Documents, Segments, Mappings, and
                  Artifacts.</p>
                <p>Define and share Knowledge Sets for yourself and your team.</p>

                <div class="space-x-2">
                  <button @click="addNewKnowledgeSet"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold  p-2 rounded w-auto">
                    {{ L_('New Knowledge Set') }}
                  </button>
                  <button @click="refreshKnowledgeSets"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold  p-2 rounded w-auto">
                    {{ L_('Reload') }}
                  </button>
                </div>
                <KnowledgeSetCreateEdit :wrappUuid="wrappUuid" :rosterUuid="props.rosterUuid" />
                <KnowledgeSetCards v-if="knowledgeSets" :data="knowledgeSets" @selected="knowledgeSetSelected" />



              </template>

              <!-- Removed categories - too many steps -->
              <template v-slot:tab-2>
                <h2 class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Categories
                </h2>
                <p>Categories are used to define the key topics within your Knowledge Sets, enabling the AI to understand
                  how your prompts and knowledge relate</p>

                <button class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  @click="addNewCategory">
                  Add Category
                </button>

                <CategoryCreateEdit :knowledgeSetUuid="selectedKnowledgeSet.uuid" />
                <CategoryTable :data="categories" @check="checkCategories" @edit="editCategories" />


                <!-- <KnowledgeCategory v-model:data="localCategories" @removeCategory="removeCategory"
                  @removeKeyword="removeKeyword"></KnowledgeCategory> -->

                <h2 class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Document Tags
                </h2>
                <p>Tags are used to group and classify Documents. They allow you and the AI to search and identify the
                  purpose of each file. </p>

                <button class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  @click="addNewTag">
                  Add Tag
                </button>

                <TagCreateEdit :knowledgeSetUuid="selectedKnowledgeSet.uuid" />
                <TagTable :data="tags" @check="checkTags" @edit="editTags" />

                <!-- 
                <KnowledgeCategory v-model:data="localCategories" @removeCategory="removeCategory"
                  @removeKeyword="removeKeyword"></KnowledgeCategory>
 -->


              </template>

              <template v-slot:tab-3>


                <h2 class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Documents
                </h2>
                <p>Documents are text-based files used by language model AIs to gain deep understanding around your
                  policies and practices.</p>

                <div v-for="(prompt, index) in prompts.documents.set" :key="'documentPrompt' + prompt.sessionId">
                  <!-- {{ prompt }} -->
                  <Socket v-show="false" :sessionId="prompt.sessionId" :persona="prompt.persona"
                    :userPrompt="prompt.adaptedPrompt" :model="selectedModel" :trigger="prompt.trigger"
                    @messageComplete="payload => messagePromptComplete(payload, prompt)"
                    @messagePartial="payload => messagePromptPartial(payload, prompt)"
                    @messageError="payload => messagePromptError(payload, prompt)">
                  </Socket>
                </div>

                <DocumentDragAndDrop @documentsChanged="documentsPendingChanged" />
                <h3 v-if="documentsPending?.length"
                  class="font-lato font-bold text-1xl mt-2 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Pending Documents
                </h3>

                <div v-if="documentsPending?.length" class="flex space-x-2">
                  <button @click="documentsPendingToggleCheckAll"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Toggle Select') }}
                  </button>

                  <button @click="documentsPendingProcessCheckedFiles"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Process Checked Files') }}
                  </button>

                  <button @click="documentsPendingSaveCheckedFiles"
                    class="whitespace-nowrap self-start bg-green-500 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Save Checked to Knowledge Set') }}
                  </button>

                  <div class="w-96 whitespace-nowrap self-start ">
                    <label>AI Instances</label>
                    <VueSlider :modelValue="promptMax" @update:modelValue="value => updatePromptMax(value)" :min="1"
                      :max="10" />
                  </div>
                </div>

                <div class="flex flex-wrap">
                  <div v-if="documentsPending?.length" :class="selectedDocumentPending ? 'w-2/3' : 'w-full'" class="  ">
                    <DocumentTable :documents="documentsPending" @edit="documentsPendingSelectToEdit"
                      @checked="documentsPendingCheck" />
                  </div>

                  <div v-if="selectedDocumentPending" class="w-full md:w-1/3 ">
                    <DocumentCreateEdit v-model="selectedDocumentPending" @close="selectedDocumentPending = null" />
                  </div>
                </div>

                <h3 v-if="documents?.length"
                  class="font-lato font-bold text-1xl mt-2 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Uploaded Documents
                </h3>


                <div v-if="documents?.length" class="flex space-x-2">
                  <button @click="documentsToggleCheckAll"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Toggle Select') }}
                  </button>

                  <button @click="documentsSelectToSegment"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Segment Selected') }}
                  </button>

                  <button @click="documentsAddTags"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Add Tags') }}
                  </button>

                  <button @click="documentsRemoveTags"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Remove Tags') }}
                  </button>

                  <div class="mt-2" v-if="tags?.length">
                    <VueMultiselect v-model="filterTags" :options="tags" :searchable="true" :multiple="true"
                      track-by="uuid" :close-on-select="false" :custom-label="customLabelTag" :show-labels="false"
                      @remove="removeTag" placeholder="Select tags" />
                  </div>

                  <button v-if="!applyFilter" @click="applyFilter = true"
                    class="whitespace-nowrap self-start bg-green-500 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Apply Filters') }}
                  </button>
                  <button v-if="applyFilter" @click="applyFilter = false"
                    class="whitespace-nowrap self-start bg-yellow-500 hover:bg-yellow-700 dark:bg-yellow-400 dark:hover:bg-yellow-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Clear Filters') }}
                  </button>


                </div>


                <div class="flex flex-wrap">
                  <div v-if="documents?.length && !documentsForSegments?.length"
                    :class="selectedDocument ? 'w-2/3' : 'w-full'" class="  ">
                    <DocumentTable :documents="documentsFiltered" :showTags="true" @edit="documentsSelectToEdit"
                      @checked="documentsCheck" />
                  </div>

                  <div v-if="selectedDocument && !documentsForSegments?.length" class="w-full md:w-1/3 ">
                    <DocumentCreateEdit v-model="selectedDocument" @close="selectedDocument = null" />
                  </div>
                </div>




                <div v-for="(prompt, index) in prompts.segments.set" :key="'segmentPrompt' + prompt.sessionId">
                  <!-- {{ prompt }} -->
                  <Socket v-show="false" :sessionId="prompt.sessionId" :persona="prompt.persona"
                    :userPrompt="prompt.adaptedPrompt" :model="selectedModel" :trigger="prompt.trigger"
                    @messageComplete="payload => messagePromptComplete(payload, prompt)"
                    @messagePartial="payload => messagePromptPartial(payload, prompt)"
                    @messageError="payload => messagePromptError(payload, prompt)">
                  </Socket>
                </div>

                <!-- Segment Selection-->


                <div v-if="documentsForSegments?.length">
                  <button @click="documentsForSegments = null"
                    class="whitespace-nowrap self-start bg-yellow-500 hover:bg-yellow-700 dark:bg-yellow-400 dark:hover:bg-yellow-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Clear Pending Segments') }}
                  </button>
                </div>


                <!-- Segmemnts-->
                <div v-for="(doc, index) in documentsForSegments" :key="'docToSegment' + index">
                  <h3 class="font-lato font-bold text-1xl mt-2 mb-1 pb-1 border-b border-red-600 leading-tight">
                    {{ L_('Document') }} {{ index + 1 }}
                  </h3>
                  <DivInput v-if="doc._plainText" placeholder="Segment your document" v-model="doc.textContent"
                    :asPlainText="true" :setMarker="true" @setMarkers="payload => segmentSetMarkers(payload, doc)">
                    <label class="label-style whitespace-nowrap">
                      <input type="checkbox" v-model="doc._plainText"
                        class="w-6 h-6 m-2 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      {{ L_('Plain Text') }}
                    </label>
                  </DivInput>
                  <DivInput v-else placeholder="Segment your document" v-model="doc.htmlContent" :asPlainText="false"
                    :setMarker="true" @setMarkers="payload => segmentSetMarkers(payload, doc)">
                    <label class="label-style whitespace-nowrap">
                      <input type="checkbox" v-model="doc._plainText"
                        class="w-6 h-6 m-2 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      {{ L_('Plain Text') }}
                    </label>
                  </DivInput>


                  <div v-if="doc._segments.length" class="flex space-x-2">
                    <button @click="segmentsPendingToggleCheckAll(doc)"
                      class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                      {{ L_('Toggle Select') }}
                    </button>

                    <button @click="segmentsPendingProcessChecked(doc)"
                      class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                      {{ L_('Process Checked Segments') }}
                    </button>

                    <button @click="segmentsPendingSaveChecked(doc)"
                      class="whitespace-nowrap self-start bg-green-500 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                      {{ L_('Save Checked Segments to Knowledge Set') }}
                    </button>

                    <div class="w-96 whitespace-nowrap self-start ">
                      <label>AI Instances</label>
                      <VueSlider :modelValue="promptMax" @update:modelValue="value => updatePromptMax(value)" :min="1"
                        :max="10" />
                    </div>
                  </div>

                  <!-- {{ doc._segments }} -->
                  <SegmentsPendingTable :data="doc._segments" :fullText="doc.textContent" :fullHtml="doc.htmlContent"
                    @remove="index => removePendingSegment(index, doc)" />



                </div>


                <!-- <div v-for = "(document, index) in documentsPending" :key = "'document' + index">
                {{ document.original }}
                </div>  -->
                <!-- {{ documentsPending }} -->

              </template>
              <template v-slot:tab-4>
                <h2 class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Segments
                </h2>
                <p>Segments are extracts from documents which focus in on key reusable topics. They are further analyzed
                  by AI to determine their key concepts and content.</p>

                <div class="space-x-2">

                  <button @click="segmentsAddTags"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Add Tags') }}
                  </button>

                  <button @click="segmentsRemoveTags"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Remove Tags') }}
                  </button>

                  <button v-if="!applySegmentFilter" @click="applySegmentFilter = true"
                    class="whitespace-nowrap self-start bg-green-500 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Apply Filters') }}
                  </button>
                  <button v-if="applySegmentFilter" @click="applySegmentFilter = false"
                    class="whitespace-nowrap self-start bg-yellow-500 hover:bg-yellow-700 dark:bg-yellow-400 dark:hover:bg-yellow-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Clear Filters') }}
                  </button>



                </div>

                <div class="mt-2" v-if="tags?.length">
                  <VueMultiselect v-model="filterTags" :options="tags" :searchable="true" :multiple="true" track-by="uuid"
                    :close-on-select="false" :custom-label="customLabelTag" :show-labels="false" @remove="removeTag"
                    placeholder="Select tags" />
                </div>

                <div class="flex flex-wrap">
                  <div v-if="segments?.length" :class="selectedSegment ? 'w-2/3' : 'w-full'" class="  ">
                    <SegmentsTable :data="segmentsFiltered" :showTags="true" @edit="segmentsSelectToEdit"
                      @checked="segmentsCheck" />
                  </div>

                  <div v-if="segments?.length && selectedSegment" :class="selectedSegment ? 'w-1/3' : 'w-full'"
                    class="  ">
                    <SegmentCreateEdit v-model="selectedSegment" @close="selectedSegment = null" />

                  </div>
                </div>
                <!-- {{ segments }} -->




              </template>
              <template v-slot:tab-5>
                <h2 class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Mappings
                </h2>
                <p>Mappings are collections of Documents and Segments which may be grouped together as a package of
                  information to serve as AI reference materials.</p>
              </template>
              <template v-slot:tab-6>
                <h2 class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Interact
                </h2>
                <p>Interact to build comprehensive AI-enabled Artifacts.</p>


                <Socket v-show="false" :sessionId="prompts.question.sessionId" :persona="prompts.question.persona"
                  :userPrompt="prompts.question.adaptedPrompt" :model="selectedModel" :trigger="prompts.question.trigger"
                  @messageComplete="payload => messagePromptComplete(payload, prompts.question)"
                  @messagePartial="payload => messagePromptPartial(payload, prompts.question)"
                  @messageError="payload => messagePromptError(payload, prompts.question)">
                </Socket>

                <button @click="promptWithDocuments"
                  class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                  {{ L_('Prompt') }}
                </button>

                <DivInput placeholder="Enter your complex question" v-model="prompts.question.prompt"
                  :asPlainText="false" />
                <DivInput placeholder="View your answer" v-model="prompts.question.message" :asPlainText="false" />

                <p>Attach your Documents and Segments.</p>

                <div v-if="documents?.length" class="flex space-x-2">
                  <button @click="documentsToggleCheckAll"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Toggle Select') }}
                  </button>

                  <button @click="segmentsSelectToEdit"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Add Tags') }}
                  </button>

                  <button @click="documentsRemoveTags"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Remove Tags') }}
                  </button>

                  <div class="mt-2" v-if="tags?.length">
                    <VueMultiselect v-model="filterTags" :options="tags" :searchable="true" :multiple="true"
                      track-by="uuid" :close-on-select="false" :custom-label="customLabelTag" :show-labels="false"
                      @remove="removeTag" placeholder="Select tags" />
                  </div>

                  <button v-if="!applyFilter" @click="applyFilter = true"
                    class="whitespace-nowrap self-start bg-green-500 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Apply Filters') }}
                  </button>
                  <button v-if="applyFilter" @click="applyFilter = false"
                    class="whitespace-nowrap self-start bg-yellow-500 hover:bg-yellow-700 dark:bg-yellow-400 dark:hover:bg-yellow-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Clear Filters') }}
                  </button>


                </div>

                <h3 v-if="documents?.length"
                  class="font-lato font-bold text-1xl mt-2 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Documents
                </h3>

                <div v-if="documents?.length" class="w-full">
                  <DocumentTable :documents="documentsFiltered" :showTags="true" @edit="documentsSelectToEdit"
                    @checked="documentsCheck" />
                </div>

                <h3 v-if="segments?.length"
                  class="font-lato font-bold text-1xl mt-2 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Segments
                </h3>

                <div v-if="segments?.length" class="w-full">
                  <SegmentsTable :data="segments" :showTags="true" @edit="segmentsSelectToEdit"
                    @checked="segmentsCheck" />
                </div>
              </template>
              <template v-slot:tab-7>
                <h2 class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Analytics
                </h2>
                <p>Analyze the trends in your Artifacts, find common patterns and insights in your data.</p>
              </template>

            </Tabs>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
//Plugins
import { ref, onMounted, onUnmounted, onBeforeMount, nextTick, watch, watchEffect, computed, reactive } from 'vue';
import { v4 as uuidv4 } from 'uuid';


//The permanent ID of this app to load the Assignments;
//Right now, this uuid is user defined, but may become uuid in the future to prevent conflicts
const wrappUuid = "ft-support-with-knowledge-mapping-v1";
const wrappAssignments = ref([
  { code: 'triage', personaUuid: null, persona: null, name: { en: "Triage", fr: "Triageur/Triageuse" } },
  { code: 'writer', personaUuid: null, persona: null, name: { en: "Writer", fr: "Auteur(e)" } },
  { code: 'auditor', personaUuid: null, persona: null, name: { en: "Auditor", fr: "Auditeur/Auditrice" } },
  { code: 'translator', personaUuid: null, persona: null, name: { en: "Translator", fr: "Traducteur/Traductrice" } },
  { code: 'dataAnalyst', personaUuid: null, persona: null, name: { en: "Data Analyst", fr: "Analyste de données" } },
])

// Misc 
import canada from "@/images/canada.svg";
import { notify } from "notiwind"
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'


//Components
import Header from '@/partials/Header.vue'
import DisplayPersona from '@/components/DisplayPersona.vue'
import DisplayPersonaStack from '@/components/DisplayPersonaStack.vue'
import DivInput from '@/components/DivInput.vue'
import Socket from '@/components/Socket.vue'
import Tabs from '@/components/Tabs.vue';
import VueMultiselect from 'vue-multiselect'
import DocumentDragAndDrop from '@/components/knowledgeMapping/DocumentDragAndDrop.vue';
import DocumentTable from '@/components/knowledgeMapping/DocumentTable.vue';
import DocumentCreateEdit from '@/components/knowledgeMapping/DocumentCreateEdit.vue';
import WordPreview from '@/components/knowledgeMapping/WordPreview.vue';
import KnowledgeSegment from '@/components/knowledgeMapping/KnowledgeSegment.vue';
import KnowledgeCategory from '@/components/knowledgeMapping/KnowledgeCategory.vue';

//New
import AssignmentsTable from '@/components/AssignmentsTable.vue';
import KnowledgeSetCreateEdit from '@/components/knowledgeMapping/KnowledgeSetCreateEdit.vue';
import KnowledgeSetCards from '@/components/knowledgeMapping/KnowledgeSetCards.vue';
import CategoryTable from '@/components/knowledgeMapping/CategoryTable.vue';
import CategoryCreateEdit from '@/components/knowledgeMapping/CategoryCreateEdit.vue';
import TagTable from '@/components/knowledgeMapping/TagTable.vue';
import TagCreateEdit from '@/components/knowledgeMapping/TagCreateEdit.vue';
import SegmentsPendingTable from '@/components/knowledgeMapping/SegmentsPendingTable.vue';
import SegmentsTable from '@/components/knowledgeMapping/SegmentsTable.vue';
import SegmentCreateEdit from '@/components/knowledgeMapping/SegmentCreateEdit.vue';
// SegmentCreateEdit
//Composables
import { useLexicon } from '@/composables/useLexicon.js'
import { useAssignments } from '@/composables/useAssignments.js'
import { useModels } from '@/composables/useModels.js'
import { usePersonas } from '@/composables/usePersonas.js'
import { useRosters } from '@/composables/useRosters.js'
import { useWebsockets } from '@/composables/useWebsockets.js';

//New
import { useKnowledgeSets } from '@/composables/knowledgeMapping/useKnowledgeSets.js';
import { useCategories } from '@/composables/knowledgeMapping/useCategories.js';
import { useTags } from '@/composables/knowledgeMapping/useTags.js';
import { useDocuments } from '@/composables/knowledgeMapping/useDocuments.js';
import { useSegments } from '@/composables/knowledgeMapping/useSegments.js';

const { L_ } = useLexicon()
const { assignments, getAssignments, createAssignments, deleteAssignments } = useAssignments()
const { adminModels, selectedModel } = useModels()
const { personas, selectedPersona, newPersona, getPersonas, resetPersona } = usePersonas()
const { rosters, selectedRoster, getRosterFromUuid } = useRosters()
const { sessionsContent } = useWebsockets();

//New
const { defaultKnowledgeSet,
  newKnowledgeSet,
  knowledgeSets,
  selectedKnowledgeSet,
  addNewKnowledgeSet,
  resetKnowledgeSet,
  getKnowledgeSets,
  createKnowledgeSets,
  updateKnowledgeSets,
  deleteKnowledgeSets } = useKnowledgeSets();

const { defaultCategory,
  newCategory,
  categories,
  categoriesPending,
  selectedCategory,
  selectedCategoryPending,
  addNewCategory,
  resetCategory,

  getCategories,
  createCategories,
  updateCategories,
  deleteCategories
} = useCategories()

const {
  defaultTag,
  newTag,
  tags,
  filterTags,
  selectedTag,

  addNewTag,
  resetTag,

  getTags,
  createTags,
  updateTags,

  deleteTags
} = useTags()


const { defaultDocument,
  newDocument,
  documents,
  documentsFiltered,
  applyFilter,

  documentsPending,
  selectedDocument,
  selectedDocumentPending,
  addNewDocument,
  resetDocument,

  getDocuments,
  createDocuments,
  updateDocuments,
  addRemoveTags,
  deleteDocuments } = useDocuments()

const {
  defaultSegment,
  newSegment,
  segments,
  segmentsFiltered,
  applyFilter: applySegmentFilter,

  segmentsPending,
  selectedSegment,
  selectedSegmentPending,
  addNewSegment,
  resetSegment,


  getSegments,
  createSegments,
  updateSegments,
  addRemoveTags: addRemoveSegmentTags,
  deleteSegments
} = useSegments();



let props = defineProps({ rosterUuid: { type: String, default: null } })

const tabs = computed(() => {
  let checkmarkWrappAssignments = wrappAssignments.value.every(wA => wA.personaUuid) ? ' ✓' : '';
  let checkmarkKnowledgeSets = selectedKnowledgeSet?.value?.uuid ? ' ✓' : '';
  let checkMarkCategories = categories?.value?.length ? ' ✓' : '';
  let checkMarkDocuments = documents?.value?.length ? ' ✓' : '';
  let checkMarkSegments = segments?.value?.length ? ' ✓' : '';
  if (selectedKnowledgeSet?.value?._id) {
    return [
      { label: L_('Assignments') + checkmarkWrappAssignments },
      { label: L_('Knowledge Sets') + checkmarkKnowledgeSets },
      { label: L_('Metadata') + checkMarkCategories },
      { label: L_('Documents') + checkMarkDocuments },
      { label: L_('Segments') + checkMarkSegments },
      { label: L_('Mappings') },
      { label: L_('Interact') },
      { label: L_('Analytics') }
    ]
  }
  else {
    return [
      { label: L_('Assignments') + checkmarkWrappAssignments },
      { label: L_('Knowledge Sets') + checkmarkKnowledgeSets },
    ]
  }
});

let activeTab = ref(0)

let defaultPrompt = { referenceUuid: null, status: "waiting", persona: null, prompt: null, adaptedPrompt: null, sessionId: uuidv4(), trigger: false, message: null, json: null };
const createPrompt = (overrides = {}) => ({ ...defaultPrompt, ...overrides, sessionId: uuidv4() });
const prompts = ref({
  documents: { set: [] },
  segments: { set: [] },
  question: createPrompt(),
  answer: createPrompt(),
  audit: createPrompt(),
  translation: createPrompt(),
});
let promptMax = ref(5);


//Starter categories which can be overwritten
const localCategories = ref([
  { alpha: "policy", code: 0, context: "Reporting Entities (REs) need clear guidance on interpreting legislation, including examples and risk assessment frameworks. They require detailed reporting instructions, compliance program development support, and best practices for record-keeping and client identification. Updates on financial crime trends, legislative changes, and technology use are crucial. REs also benefit from educational outreach such as workshops and webinars, feedback on compliance reviews, and dedicated support channels for prompt assistance with compliance-related questions. This support helps REs fulfill their legal obligations and combat money laundering and terrorist financing effectively.", name: { en: "Policy and Guidance", fr: "" }, description: { en: "Reporting entities require guidance on how to interpret the PCMLTFA, Schedules, Regulations, Forms, Validation Rules, and Reporting Requirements.", fr: "" }, keywords: ["policy", "interpretation", "guidance", "requirements", "compliance", "supervision"] },
  { alpha: "policy", code: 1, context: "FINTRAC (Financial Transactions and Reports Analysis Centre of Canada) validation rules are designed to ensure the accuracy and completeness of financial transaction reports submitted by reporting entities. These rules check for logical consistency, mandatory field completion, correct formatting, and adherence to regulatory requirements. If a report fails validation, the submitting institution is notified to correct and resubmit the data. This process helps prevent money laundering and terrorist financing by ensuring high-quality data is available for analysis by FINTRAC.", name: { en: "Validation Rules", fr: "" }, description: { en: "Reportting Entities require support in submitting reports, which are evaluated against a complex set of validation rules. Each report type has its own set of validation rules.", fr: "" }, keywords: ["validation", "rules", "mandatory", "schedules", "submission", "error", "reject"] },
  { alpha: "policy", code: 2, context: "Reporting entities often face challenges with data quality issues such as incomplete or inaccurate information, incorrect formatting, and failure to adhere to the precise data standards set by FINTRAC. They also struggle with understanding the complex and evolving legal requirements for reporting certain types of transactions. Keeping up with changes in reporting thresholds, identifying suspicious activities accurately, and managing the high volume of transactions that must be monitored and reported can be resource-intensive. Additionally, entities must ensure the confidentiality and security of the data they submit, which adds a layer of complexity to the reporting process.", name: { en: "Data Integrity & Reporting Requirements", fr: "" }, description: { en: "Support for understanding data reporting requirements and specific reporting requirements per regulated sector.", fr: "" }, keywords: ["reporting", "requirements", "data", "quality", "legislation"] },
  { alpha: "policy", code: 3, context: "Providing technical support to FINTRAC reporting entities to onboard with FINTRAC's API Ingest infrastructure", name: { en: "Technical API Support", fr: "" }, description: { en: "Reportting Entities require technical support to gain access to FINTRAC's API infrastructure.", fr: "" }, keywords: ["api", "batch", "rest", "authentication", "system to system"] },
]);


let documentsPendingCheckAll = ref(false)
let documentsCheckAll = ref(false)
let documentsForSegments = ref(false)

onMounted(async () => {

  if (props?.rosterUuid) {
    //Step 1 load the roster
    await getRosterFromUuid(props.rosterUuid);

    //Step 2 get the Roster Assignment
    await getAssignments(wrappUuid, props.rosterUuid)
    //Map the selectedRoster.personas to the assignments.personas
    if (selectedRoster?.value?.personas?.length && assignments?.value?.length) {
      wrappAssignments.value.forEach((wA) => {
        let matchedAssignment = assignments.value.find((a) => { return a.code == wA.code });
        if (matchedAssignment?.personaUuid) {
          let matchedPersona = selectedRoster.value.personas.find((p) => { return p.uuid == matchedAssignment.personaUuid })
          if (matchedPersona) { wA.persona = matchedPersona; wA.personaUuid = matchedPersona.uuid }
        }
      })
    }

    //Step 3 get the Knowledge Sets
    await getKnowledgeSets(props.rosterUuid);

    //Step 4, load the other information once Knowledge Sets selected
  }
  else
    console.log("Missing RosterUUID. Please replace and try again.")


})

const customLabelModel = (option) => option ? option.label : '';
const customLabelTag = (option) => option ? option.name.en + " | " + option.name.fr : '';

function checkAssignment(code) {
  let thisAssignment = wrappAssignments.value.find((wA) => { return wA.code == code })
  return thisAssignment;
}


function updatePromptMax(val) {
  promptMax.value = val;
}

async function refreshKnowledgeSets() {
  await getKnowledgeSets(props.rosterUuid);
  if (selectedKnowledgeSet.value.uuid) {
    getCategories(selectedKnowledgeSet.value.uuid);
    getTags(selectedKnowledgeSet.value.uuid);
    getDocuments(selectedKnowledgeSet.value.uuid);
    getSegments(selectedKnowledgeSet.value.uuid);
  }
}

//Knowledge Set
function knowledgeSetSelected(item) {
  selectedKnowledgeSet.value = item;
  getCategories(item.uuid);
  getTags(item.uuid);
  getDocuments(selectedKnowledgeSet.value.uuid);
  getSegments(selectedKnowledgeSet.value.uuid);
  // getSegments(item.uuid);
  // getMappings(item.uuid);
  // getArtifacts(item.uuid);


}

function editCategories(index) {
  selectedCategory.value = categories.value[index]
}

function checkCategories(val) {
  categories.value[val.index]._checked = val.isChecked
}


function editTags(index) {
  selectedTag.value = tags.value[index]
}

function checkTags(val) {
  tags.value[val.index]._checked = val.isChecked
}

const removeTag = (tag) => {
  console.log(tag)

};

//Documents Pending
function documentsPendingChanged(files) {
  for (const file of files) {
    documentsPending.value.push(file)
  }
}

function documentsPendingCheck(val) {
  documentsPending.value[val.index]._checked = val.isChecked;
}

function documentsPendingToggleCheckAll() {
  documentsPendingCheckAll.value = !documentsPendingCheckAll.value;
  for (const doc of documentsPending.value) {
    doc._checked = documentsPendingCheckAll.value;
  }
}

function documentsPendingSelectToEdit(index) {
  selectedDocumentPending.value = documentsPending.value[index];
  nextTick(() => {
    selectedDocumentPending.value = { ...selectedDocumentPending.value };
  });
}



function documentsPendingProcessCheckedFiles() {
  try {
    //Reset the checkmark
    documentsPendingCheckAll.value = false;

    //Set all the checked docs all to pending 
    for (const doc of documentsPending.value) {
      if (doc._checked) {
        doc._processingStatus = "pending";
        doc._checked = false;
      }
    }

    //Find the next pending doc in the list
    let nextDoc = documentsPending.value.find((doc) => { return doc._processingStatus == 'pending' })

    //See how many concurrent processors there are running
    let processingCount = prompts.value.documents.set.filter((prompt) => { return prompt.status == 'processing' }).length;

    //If both conditions meet
    if (nextDoc && processingCount < promptMax.value) {

      //Add a nwe prompt
      prompts.value.documents.set.push(createPrompt({ promptType: "documents", status: "waiting", persona: checkAssignment('triage').persona, trigger: false }));
      let promptIndex = prompts.value.documents.set.length - 1;

      nextDoc._processingStatus = 'processing';
      nextDoc._processingStatusNumber = 0;
      prompts.value.documents.set[promptIndex].status = "processing";
      prompts.value.documents.set[promptIndex].referenceUuid = nextDoc.uuid;

      let categoryPrompt = "";
      if (categories.value.length) categoryPrompt = `\n\nEvaluate this content against the following categories:\n\n  ${categories.value.map(category => JSON.stringify(category)).join(',\n')} \n\n`;

      prompts.value.documents.set[promptIndex].adaptedPrompt = `Summarize the following file contents:\n\n For reference, the content comes from a file with this info: ${JSON.stringify(nextDoc.original)} ${categoryPrompt} \n\nHere are the contents to analyze:\n\n ${nextDoc.textContent}`;

      nextTick(() => {
        prompts.value.documents.set[promptIndex].trigger = !prompts.value.documents.set[promptIndex].trigger;
      })

      //Check for the next file
      documentsPendingProcessCheckedFiles();

    }

  }
  catch (error) {
    console.log(error)
  }
}

function documentsPendingSaveCheckedFiles() {
  //See how many concurrent processors there are running
  let docsToSave = documentsPending.value.filter((doc) => { return doc._checked });
  createDocuments(selectedKnowledgeSet.value.uuid, docsToSave);

  //Remove the checked
  documentsPending.value = documentsPending.value.filter(
    (doc) => !doc._checked
  );
  //Save them to the work 
}

function messagePromptComplete(payload, thisPrompt) {
  if (payload?.message?.length) {
    thisPrompt.status = "waiting";
    thisPrompt.message = payload.message;

    //Extract the JSON
    let thisSessionContent = sessionsContent.value.filter((session) => { return session.sessionId == thisPrompt.sessionId })
    if (thisSessionContent?.[0]?.extracts?.json?.length) {
      thisPrompt.json = thisSessionContent[0].extracts.json[0];
    };


    //Do Cleanup by removing sockets
    if (thisPrompt.promptType == 'documents') {

      let updateDoc = documentsPending.value.find((doc) => { return doc.uuid == thisPrompt.referenceUuid })
      if (updateDoc) {
        updateDoc._processingStatus = "completed";
        updateDoc._processingStatusNumber = null;
        if (thisPrompt?.json?.name) updateDoc.name = thisPrompt.json.name;
        if (thisPrompt?.json?.description) updateDoc.description = thisPrompt.json.description;
        if (thisPrompt?.json?.keywords) updateDoc.keywords = thisPrompt.json.keywords;
        if (thisPrompt?.json?.categories) updateDoc.categories = thisPrompt.json.categories;
      }


      prompts.value.documents.set = prompts.value.documents.set.filter(
        (prompt) => prompt.referenceUuid !== thisPrompt.referenceUuid
      );
      documentsPendingProcessCheckedFiles();
    }



    if (thisPrompt.promptType == 'segments') {
      let updateDoc = documents.value.find((document) => { return document.uuid == thisPrompt.referenceDocUuid })
      if (updateDoc) {
        let updateSegment = updateDoc._segments.find((segment) => { return segment.uuid == thisPrompt.referenceUuid })

        if (updateSegment) {
          updateSegment._processingStatus = "completed";
          updateSegment._processingStatusNumber = null;
          if (thisPrompt?.json?.name) updateSegment.name = thisPrompt.json.name;
          if (thisPrompt?.json?.description) updateSegment.description = thisPrompt.json.description;
          if (thisPrompt?.json?.keywords) updateSegment.keywords = thisPrompt.json.keywords;
          if (thisPrompt?.json?.categories) updateSegment.categories = thisPrompt.json.categories;

          console.log('Segment complete', updateSegment)

        }



        prompts.value.segments.set = prompts.value.segments.set.filter(
          (prompt) => prompt.referenceUuid !== thisPrompt.referenceUuid
        );

        segmentsPendingProcessChecked(updateDoc)

      }
    }


    //And so forth... Add more promptTypes as I go

  }


}


function messagePromptPartial(payload, thisPrompt) {
  if (payload?.message?.length) {
    thisPrompt.message = payload.message;

    if (thisPrompt.promptType == 'documents') {
      let updateDoc = documentsPending.value.find((doc) => { return doc.uuid == thisPrompt.referenceUuid })
      if (updateDoc) {
        updateDoc._processingStatusNumber = payload.message.length;
      }
    }

    if (thisPrompt.promptType == 'segments') {
      let updateDoc = documents.value.find((document) => { return document.uuid == thisPrompt.referenceDocUuid })
      if (updateDoc) {
        let updateSegment = updateDoc._segments.find((segment) => { return segment.uuid == thisPrompt.referenceUuid })
        if (updateSegment) {

          updateSegment._processingStatusNumber = payload.message.length;
        }

      }
    }

  }
}


//Remove if error
function messagePromptError(payload, thisPrompt) {

  //Clean up for documents
  if (thisPrompt.promptType == 'documents') {
    let setError = documentsPending.value.find((doc) => { return doc.uuid == thisPrompt.referenceUuid });
    setError._processingStatus = 'error'
    prompts.value.documents.set = prompts.value.documents.set.filter(
      (prompt) => prompt.referenceUuid !== thisPrompt.referenceUuid
    );
  }

}


//Full documents
function documentsCheck(val) {
  documents.value[val.index]._checked = val.isChecked;
}

function documentsToggleCheckAll() {
  documentsCheckAll.value = !documentsCheckAll.value;
  for (const doc of documents.value) {
    doc._checked = documentsCheckAll.value;
  }
}

function documentsSelectToEdit(index) {
  selectedDocument.value = documents.value[index];
  nextTick(() => {
    selectedDocument.value = { ...selectedDocument.value };
  });
}

//Full segments
function segmentsCheck(val) {
  segments.value[val.index]._checked = val.isChecked;
}

function segmentsSelectToEdit(index) {
  selectedSegment.value = segments.value[index];
  nextTick(() => {
    selectedSegment.value = { ...selectedSegment.value };
  });
}


function documentsAddTags() {
  let tagDocuments = documents.value.filter((doc) => { return doc._checked })
  addRemoveTags(selectedKnowledgeSet.value.uuid, 'add', tagDocuments, filterTags.value)
}

function documentsRemoveTags() {
  let tagDocuments = documents.value.filter((doc) => { return doc._checked })
  addRemoveTags(selectedKnowledgeSet.value.uuid, 'remove', tagDocuments, filterTags.value)
}

function segmentsAddTags() {
  let tagSegments = segments.value.filter((segment) => { return segment._checked })
  addRemoveSegmentTags(selectedKnowledgeSet.value.uuid, 'add', tagSegments, filterTags.value)
}

function segmentsRemoveTags() {
  let tagSegments = segments.value.filter((segment) => { return segment._checked })
  addRemoveSegmentTags(selectedKnowledgeSet.value.uuid, 'remove', tagSegments, filterTags.value)
}



function promptWithDocuments() {
  prompts.value.question.persona = checkAssignment('writer').persona;
  let checkedDocuments = documentsFiltered.value ? documentsFiltered.value.filter((doc) => { return doc._checked }) : [];
  let checkedSegments = segmentsFiltered.value ? segmentsFiltered.value.filter((segment) => { return segment._checked }) : [];
  let contentDocumentsPrompt = "";
  let contentSegmentsPrompt = "";
  if (checkedDocuments?.length) {
    contentDocumentsPrompt += `Use the following information for your analysis:\n  ${checkedDocuments.map(file => JSON.stringify(file.textContent)).join(',\n')}`
  }
  if (checkedSegments?.length) {
    contentSegmentsPrompt += `Use the following information for your analysis:\n  ${checkedSegments.map(file => JSON.stringify(file.textContent)).join(',\n')}`
  }

  prompts.value.question.adaptedPrompt = `Prepare a response for the following question: \n\n ${prompts.value.question.prompt} \n\n ${contentDocumentsPrompt}  \n\n ${contentSegmentsPrompt}`
  prompts.value.question.trigger = !prompts.value.question.trigger;
}


//Segments 
function documentsSelectToSegment() {
  documentsForSegments.value = documentsFiltered.value.filter((doc) => { return doc._checked });
  for (const doc of documentsForSegments.value) {
    doc._segments = [];
  }
}

function segmentSetMarkers(segments, doc) {
  doc._segments = segments;
}

function removePendingSegment(index, doc) {
  const segmentToRemove = doc._segments[index];
  if (segmentToRemove) {
    // Use the UUID to find the marker element in the DOM
    const markerEl = document.querySelector(`[data-marker-id="${segmentToRemove.markerId}"]`);
    if (markerEl) {
      markerEl.remove(); // Remove the marker element from the DOM
    }
    // Remove the segment from the array
    doc._segments.splice(index, 1);
  }
}

function segmentsPendingToggleCheckAll(doc) {
  doc._checkAllSegments = !doc._checkAllSegments;

  for (const segment of doc._segments) {
    segment._checked = doc._checkAllSegments;
  }
}

function segmentsPendingProcessChecked(doc) {
  //Bulk process all the segments by AI using the file classifier

  try {
    //Reset the checkmark
    if (doc._checkAllSegments) doc._checkAllSegments = false;

    //Set all the checked docs all to pending 
    for (const segment of doc._segments) {
      if (segment._checked) {
        segment.uuid = uuidv4();
        segment._processingStatus = "pending";
        segment._checked = false;
      }
    }

    //Find the next pending doc in the list
    let nextSegment = doc._segments.find((segment) => { return segment._processingStatus == 'pending' })

    console.log('nextSegment', nextSegment)
    //See how many concurrent processors there are running
    let processingCount = prompts.value.segments.set.filter((prompt) => { return prompt.status == 'processing' }).length;
    console.log('processingCount', processingCount)

    //If both conditions meet
    if (nextSegment && processingCount < promptMax.value) {

      //Add a nwe prompt
      prompts.value.segments.set.push(createPrompt({ promptType: "segments", status: "waiting", persona: checkAssignment('triage').persona, trigger: false }));
      let promptIndex = prompts.value.segments.set.length - 1;

      nextSegment._processingStatus = 'processing';
      nextSegment._processingStatusNumber = 0;

      nextSegment.documentName = doc.name;
      nextSegment.documentDescription = doc.description;
      nextSegment.docoumentUuid = doc.uuid;
      nextSegment.cursorStart = nextSegment.cursorIndex;
      nextSegment.cursorEnd = nextSegment.cursorIndex + nextSegment.textContent.length;

      prompts.value.segments.set[promptIndex].status = "processing";
      prompts.value.segments.set[promptIndex].referenceDocUuid = doc.uuid;
      prompts.value.segments.set[promptIndex].referenceUuid = nextSegment.uuid;

      let categoryPrompt = "";
      if (categories.value.length) categoryPrompt = `\n\nEvaluate this content against the following categories:\n\n  ${categories.value.map(category => JSON.stringify(category)).join(',\n')} \n\n`;

      prompts.value.segments.set[promptIndex].adaptedPrompt = `Summarize the following file contents:\n\n For reference, the content comes from a file with this info: ${JSON.stringify(doc.original)} ${categoryPrompt} \n\nHere are the contents to analyze:\n\n ${nextSegment.textContent}`;

      nextTick(() => {
        prompts.value.segments.set[promptIndex].trigger = !prompts.value.segments.set[promptIndex].trigger;
      })

      //Check for the next file
      segmentsPendingProcessChecked(doc);

    }

  }
  catch (error) {
    console.log(error)
  }


}

function segmentsPendingSaveChecked(doc) {
  let checkedSegments = doc._segments.filter((segment) => { return segment._checked });
  createSegments(selectedKnowledgeSet.value.uuid, checkedSegments);
}
</script>
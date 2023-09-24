<template>
    <div class="mb-3">

        Write your prompt
        <input v-model="factSearchString" id="factSearchString" type="text" class="form-input w-full"
            placeholder="Search Facts" required @keyup.enter="triggerSearch" />
    </div>

    <table class="w-full">
    <thead>
      <tr class="flex w-full">
        <th 
          v-for="(set, index) in props.evaluationSet" 
          :key="'head' + index"
          class="flex-1 border dark:border-gray-700 dark:text-gray-300"
        >
          Evaluator {{ index + 1 }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="flex w-full">
        <td 
          v-for="(set, index) in props.evaluationSet" 
          :key="'set' + set.uuid + index"
          class="flex-1 border dark:border-gray-700 dark:text-gray-300 p-3"
        >
          <Socket 
            :trigger="set.trigger" 
            :stageIndex="index" 
            :stageUuid="set.sessionId"
            :sessionId="set.sessionId" 
            :socketIndex="index" 
            :userPrompt="factSearchString" 
            :temperature="0.5"
            :persona="set.persona"
            :facts="set.facts" 
          />
          
          <VueMultiselect 
            v-if="knowledgeProfiles" 
            v-model="set.knowledgeProfiles"
            @update:modelValue="(value) => handleKnowledgeProfilesUpdate(value, index)"
            placeholder="Select a Knowledge Profile" 
            label="name" 
            track-by="name" 
            :options="knowledgeProfiles"
            :multiple="true" 
            :option-height="104" 
            :custom-label="customLabel" 
            :show-labels="false" 
          />
        </td>
      </tr>
    </tbody>
  </table>

    Search Results
    <table class="w-full">
        <thead>
            <tr>
                <th class="border dark:border-gray-700 dark:text-gray-300">Fact / Questions</th>
                <th class="border dark:border-gray-700 dark:text-gray-300">Score</th>
                <th class="border dark:border-gray-700 dark:text-gray-300">Source</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="(fact, index) in factSearchResults" :key="'searchFact' + index">

                <tr class="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                    <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ fact.fact }}</td>
                    <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ fact.score }}</td>
                    <td class="border dark:border-gray-700 dark:text-gray-300 p-3"><a
                            :href="'https://mpersona.blob.core.windows.net/' + fact.storageUrl" target="_blank"> {{
                                fact.storageUrl }}</a></td>
                </tr>

                <tr class="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                    <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ fact.keywords }}</td>
                </tr>

                <tr v-for="(question, index2) in fact.questions" :key="'question' + index + index2"
                    class="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                    <td colspan=3 class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ question }}</td>
                </tr>


            </template>

        </tbody>
    </table> 
</template>

<script setup>
import { ref, onMounted } from 'vue';
import VueMultiselect from 'vue-multiselect'
import { v4 as uuidv4 } from 'uuid';

//Components
import Socket from '@/components/Socket.vue';

//Composables
import { useFacts } from '@/composables/useFacts.js'
import { useKnowledgeProfiles } from '@/composables/useKnowledgeProfiles.js'
const { factSearchString, searchFacts, factSearchResults } = useFacts()
const { knowledgeProfiles, selectedKnowledgeProfile, getKnowledgeProfiles } = useKnowledgeProfiles()

//Props and Emits
const props = defineProps({
    evaluationSet: { type: Array, default: [] },
    // triggerGeneration: { type: Boolean, default: false }
})
const emit = defineEmits(['triggerSearch', 'deleteEvaluator', 'knowledgeProfilesUpdate'])

//Multiselect
const customLabel = (option) => option ? option.name : '';

//Functions
async function triggerSearch() {
    emit("triggerSearch")
}

function handleKnowledgeProfilesUpdate(newValue, index) {
    emit("knowledgeProfilesUpdate", { knowledgeProfiles: newValue, index: index })

}

</script>
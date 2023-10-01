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
      <!-- stages -->
      <!-- {{ stages }} -->
      <section class="relative">
        <div class="max-w-9xl mx-auto px-4 sm:px-6 relative">
          <div class="pt-32 pb-12 md:pt-40 md:pb-20">

            <Tabs :tabs="tabs" v-model="activeTab">
              <template v-slot:tab-0>



                <Tabs :tabs="subTabs" v-model="activeSubTab">
                  <template v-slot:tab-0>
                    <!-- <StageVisualize :hierarchyData="hierarchyData" @update:node="updateNode" />  -->


                    <!--@dragend="onDragEnd"-->




                    <p v-if="!stages.length" class="p-1">
                      Add a stage to get started.
                      A stage allows you to interact with a set of personas on a specific prompt.</p>
                    <p v-if="!stages.length" class="p-1">
                      Each additional stage can have a unique prompt or use the output
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
                      <SocketStage v-model:userPrompt="stage.userPrompt" :options="stage.options" :model="stage.model"
                        :stageIndex="index" :stageUuid="stage.uuid" :sockets="stage.sockets"
                        :selectedSessionsContent="stage.selectedSessionsContent" @deleteStage="deleteStage"
                        @addToSockets='addToSockets' @removeFromSockets='removeFromSockets'
                        @updateSessionContent="updateSessionContent" @moveStageUp="moveStageUp"
                        @moveStageDown="moveStageDown" @update:options="handleUpdateOptions"
                        @update:model="handleUpdateModel" />

                      <!-- 
                  @addSocket = "addSocket" 
                  @removeSocket = "removeSocket"
                  -->

                    </template>
                  </template>




                  <template v-slot:tab-1>
                    <!-- <button @click="addChildren"
                  class=" whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-3 p-3 rounded">
                  Add Children
                </button> -->
                    <!-- {{ stages }}-->
                <!-- {{ stageNodes }}<br/><br/> -->
                <!-- {{ localNodes }}<br/><br/> -->
                <!-- {{ stageEdges }}  -->

                    <StageVisualize2 :treeNodes="stageNodes" :treeEdges="localEdges" @update:node="updateNode"
                      @update:edges="updateEdges" :key = "updateVisual"/>

                  </template>

                </Tabs>



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
                <!-- {{ stages }} -->

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
//Plugins
import { ref, computed, onMounted, watchEffect, watch } from 'vue';
import MarkdownIt from 'markdown-it';

//Libs
import { v4 as uuidv4 } from 'uuid';
import VueMultiselect from 'vue-multiselect'

//Components
import Header from '@/partials/Header.vue'
import PageIllustration from '@/partials/PageIllustration.vue'
import SocketStage from '@/components/SocketStage.vue'
import Tabs from '@/components/Tabs.vue';
import StageVisualize2 from '@/components/StageVisualize2.vue';

//Composables
import { useWebsockets } from '@/composables/useWebsockets.js';
import { useWorkStreams } from '@/composables/useWorkStreams.js';
import { useModels } from '@/composables/useModels.js'
const { sessions, stages } = useWebsockets();
const { getWorkStreams, createWorkStreams, updateWorkStreams, workStreams, selectedWorkStream, selectWorkStream } = useWorkStreams();
const { adminModels, selectedModel } = useModels()

const customLabel = (option) => option ? option.name : '';

// let treeNodes = ref([
//   { id: 'aaa000', stage: 0, name: "Parent A" },
//   { id: 'aaa001', stage: 1, name: "Child A" },
//   { id: 'aaa002', stage: 1, name: "Child B" },
//   { id: 'aaa003', stage: 2, name: "Child C" },
//   { id: 'aaa004', stage: 2, name: "Child D" },
//   { id: 'aaa005', stage: 3, name: "Child E" },
// ])


// let treeEdges = ref([
//   { source: 'aaa000', target: "aaa001" },
//   { source: 'aaa001', target: "aaa002" },
//   { source: 'aaa001', target: "aaa003" },
//   { source: 'aaa002', target: "aaa004" },
//   { source: 'aaa002', target: "aaa005" },
//   { source: 'aaa001', target: "aaa005" },
// ])

let updateVisual= ref(0);

let stageNodes = computed(() => {
  var nodes = [];
  stages.value.forEach((stage, index, origArray) => {
    stage.sockets.forEach((socket, sIndex, sOrigArray) => {
      nodes.push({
        id: socket.sessionId,
        name: "Stage." + (index + 1) + "." + (sIndex + 1),
        stage: index,
        status:sessions?.value?.[socket.sessionId]?.status || "missing",
        personaName:sessions?.value?.[socket.sessionId]?.persona?.name || null,
      })
    })
  })
  return nodes;
})

let stageEdges = computed(() => {
  var edges = [];
  stages.value.forEach((stage, index, origArray) => {
    let sources = stage.selectedSessionsContent.map((ssc) => { return ssc.sessionId })
    let targets = stage.sockets.map((socket) => { return socket.sessionId })
    if (sources?.length && targets?.length)
      sources.forEach((source) => {
        targets.forEach((target) => {
          edges.push({ source, target })
          console.log("Edges updated", edges)
        })
      })
  })
  return edges;
})


let localNodes = ref([])
let localEdges = ref([])

function syncNodeArrays(localNodesRef, computedNodesVal) {
  let localNodesVal = [...localNodesRef.value];
  
  // Add missing nodes to localNodes
  computedNodesVal.forEach((computedNode) => {
    if (!localNodesVal.some((localNode) => localNode.id === computedNode.id)) {
      localNodesVal.push(computedNode);
    }

    //Inherit statuses
    localNodesVal.forEach((localNode)=>{
      if(localNode.id == computedNode.id) localNode.status = computedNode.status;
    })
  });
  
  // Remove nodes from localNodes that are not in computedNodes
  let filteredNodes = localNodesVal.filter((localNode) =>
    computedNodesVal.some((computedNode) => computedNode.id === localNode.id)
  );

  // Only update the ref if there is an actual change in the array
  const isDifferent = !isEqual(localNodesRef.value, filteredNodes);
  if (isDifferent) {
    localNodesRef.value = filteredNodes;
  }


}

function syncEdgeArrays(localEdgesRef, computedEdgesVal) {
  let localEdgesVal = [...localEdgesRef.value];

  // Add missing edges to localEdges
  computedEdgesVal.forEach((computedEdge) => {
    if (!localEdgesVal.some((localEdge) => 
        localEdge.source === computedEdge.source && localEdge.target === computedEdge.target)) {
      localEdgesVal.push(computedEdge);
    }
  });
  
  // Remove edges from localEdges that are not in computedEdges
  let filteredEdges = localEdgesVal.filter((localEdge) =>
    computedEdgesVal.some((computedEdge) => 
      computedEdge.source === localEdge.source && computedEdge.target === localEdge.target)
  );

  // Only update the ref if there is an actual change in the array
  const isDifferent = !isEqual(localEdgesRef.value, filteredEdges);
  if (isDifferent) {
    localEdgesRef.value = filteredEdges;
  }
}

function isEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((elem1, index) => {
    const elem2 = arr2[index];
    if (elem1.id) {
      // For nodes, compare id property
      return elem1.id === elem2.id;
    } else {
      // For edges, compare source and target properties
      return elem1.source === elem2.source && elem1.target === elem2.target;
    }
  });
}


 
// Updated watchers
watch(
  () => stageNodes.value,
  (newStageNodes) => {
    syncNodeArrays(localNodes, newStageNodes);
    updateVisual.value++;
  }
);


watch(
  () => stageEdges.value,
  (newstageEdges) => {
    syncEdgeArrays(localEdges, newstageEdges);
    updateVisual.value++;

  }
);


//Tabs
let activeTab = ref(0)
const tabs = ref([
  { label: 'Interact' },
  { label: 'Work Streams' },
  { label: 'Results' },
]);


let activeSubTab = ref(0)
const subTabs = ref([
  { label: 'Build Stages' },
  { label: 'Visualize' },
]);

let newWorkStream = ref({
  name: "",
  description: { en: "", fr: "" },
});

//Multiselect
// const customLabel = (option) => option ? option.name : '';
// const customLabelModel = (option) => option ? option.label : '';
// function addChildren() {
//   const width = 1000;
//   const height = 800;

//   // Adding new node
//   const randomInteger = Math.floor(Math.random() * 11);

//   const newNode = { id: uuidv4(), stage: randomInteger, name: "Child Z" };

//   // Initializing position of new node
//   const stageNodes = stageNodes.value.filter(n => n.stage === newNode.stage);
//   const horizontalSpacing = 160; // Assuming 200 as horizontalSpacing

//   if (stageNodes.length === 0) {
//     // If there are no nodes in this stage, start from the center
//     newNode.x = width / 2;
//   } else {
//     // If there are nodes in this stage, place the new node to the right of the rightmost node in this stage
//     const maxExistingX = Math.max(...stageNodes.map(n => n.x));
//     newNode.x = maxExistingX + horizontalSpacing;
//   }

//   newNode.y = newNode.stage * 150; // set the y attribute correctly assuming 150 as verticalDistance

//   // Add the node with updated x, y attributes
//   stageNodes.value.push(newNode);

//   // Adding new edge
//   const newEdge = { source: 'aaa000', target: newNode.id };
//   treeEdges.value.push(newEdge);

//   // Update source and target of the new edge to point to the correct node objects
//   newEdge.source = stageNodes.value.find(node => node.id === newEdge.source) || newEdge.source;
//   newEdge.target = stageNodes.value.find(node => node.id === newEdge.target) || newEdge.target;
// }


const updateNode = (updatedNode) => {
  localNodes.value = localNodes.value.map(node =>
    node.id === updatedNode.id ? { ...node, x: updatedNode.px, y: updatedNode.py } : node
  );
};


function updateEdges(updatedEdges) {
  localEdges.value = updatedEdges;
}

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
    options: null,
    model: adminModels.value[0],
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
    var newIndex = index - 1;

    //Incorrect, this is fixing the wrong thing. Need to fix all the other indexes 
    // stages.value.forEach((stage)=>{
    //   stage.selectedSessionsContent.forEach((session)=>{
    //     if(session.stageIndex == index) session.stageIndex = newIndex;
    //   })
    // })
    const itemToMoveUp = stages.value[index];
    stages.value.splice(index, 1);
    stages.value.splice(index - 1, 0, itemToMoveUp);


    stages.value[index].selectedSessionsContent = []
    stages.value[newIndex].selectedSessionsContent = []

    //TODO update selectedSessionsContent so the indexes of those change as well

  }
}

function moveStageDown(index) {
  if (index < stages.value.length - 1) {
    var newIndex = index + 1;

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
    stages.value[index].selectedSessionsContent = []
    stages.value[newIndex].selectedSessionsContent = []


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

function handleUpdateOptions(val) {
  stages.value[val.stageIndex].options = val.options;
}

function handleUpdateModel(val) {
  stages.value[val.stageIndex].model = val.model;
}

</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>


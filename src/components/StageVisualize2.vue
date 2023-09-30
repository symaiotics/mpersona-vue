<template>
    <div ref="d3Container"></div>
</template>
  
<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as d3 from 'd3';

// Define Props
const props = defineProps({
    treeNodes: Array,
    treeEdges: Array,
});

// Define Emits
const emit = defineEmits(['update:node', 'update:edges']);

// Other Refs
const d3Container = ref(null);
const width = 1000;
const height = 800;
const isDarkMode = ref(false);
let svg = null;
let g = null;
let simulation = null;

// Create simulation and stop it immediately
// Create simulation and stop it immediately
onMounted(() => {

    updateDarkMode();
    // Add event listener to update styles on storage change
    window.addEventListener('storage', updateDarkMode);


    svg = d3.select(d3Container.value).append("svg")
        .attr("width", width)
        .attr("height", height);
    g = svg.append('g');

    const zoom = d3.zoom().on("zoom", (event) => {
        g.attr("transform", event.transform);
    });
    svg.call(zoom);
    
    simulation = d3.forceSimulation(props.treeNodes)
        .force("link", d3.forceLink(props.treeEdges).id(d => d.id))
        .stop(); // Stop the simulation immediately
    
    createArrowHead();
    initializeNodePositions();
    renderGraph();
});


function createArrowHead() {
    svg.append("defs").append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 5)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("class", "arrowHead");
}


const drag = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);

// Adjust the drag started/ended logic if needed

function dragstarted(event, d) {
    d3.select(this).raise().attr("stroke", "black"); // Raise the node to the top
    d3.select(`#text-${d.id}`).raise(); // Raise the corresponding text to the top
}


function dragged(event, d) {
    requestAnimationFrame(() => {
        d.x = event.x;
        d.y = event.y;
        d.px = event.x;
        d.py = event.y;
        
        // Update only the dragged node and text
        d3.select(`#node-${d.id}`).attr("x", d.x - 60).attr("y", d.y - 30);
        d3.select(`#text-${d.id}`).attr("x", d.x).attr("y", d.y);
        
        // Update only the links connected to the dragged node
        g.selectAll(".link")
            .filter(link => link.source.id === d.id || link.target.id === d.id)

            .attr("d", d => {
                const controlPoint1 = { x: d.source.x, y: d.source.y + 160 }; // Control point 1
                const controlPoint2 = { x: d.target.x, y: d.target.y - 160 }; // Control point 2
                return `M${d.source.x},${d.source.y - 30}C${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${d.target.x},${d.target.y - 30}`;})
            // .attr("d", link => {
            //     const linkGenerator = d3.linkVertical()
            //         .x(d => d.x)
            //         .y(d => d.y - 30);
                
            //     return linkGenerator({
            //         source: { x: link.source.x, y: link.source.y },
            //         target: { x: link.target.x, y: link.target.y }
            //     });
            // });
    });
}


function dragended(event, d) {
    d3.select(this).attr("stroke", isDarkMode.value ? '#E2E8F0' : '#4A5568');
    emit('update:node', { ...d, px: d.x, py: d.y });

    // Here you can emit updates and make additional recalculations if needed
}


const renderGraph = () => {
    renderLinks();
    renderNodes();
    renderText();
};

const initializeNodePositions = () => {
    const verticalDistance = 150; // distance between nodes vertically
    const horizontalSpacing = 200; // distance between nodes horizontally

    if (props.treeNodes) {
        const maxStage = Math.max(...props.treeNodes.map(node => node.stage));

        props.treeNodes.forEach(node => {
            const stageNodes = props.treeNodes.filter(n => n.stage === node.stage);
            const totalWidth = (stageNodes.length - 1) * horizontalSpacing;
            const startX = (width - totalWidth) / 2;
            node.x = startX + stageNodes.indexOf(node) * horizontalSpacing; // set the x attribute correctly
            node.y = node.stage * verticalDistance; // set the y attribute correctly
        });
    }
};
const renderNodes = () => {
    g.selectAll(".node").raise()
    g.selectAll(".node")
        .data(props.treeNodes, d => d.id)
        .join(
            enter => enter.append("rect")
                .attr("class", "node")
                .attr("id", d => `node-${d.id}`)
                .attr("width", 120)
                .attr("height", 60)
                .attr("x", d => d.x - 60)
                .attr("y", d => d.y - 30)
                .style("fill", isDarkMode.value ? '#2D3748' : '#FFFFFF') // Explicitly set fill color
                .style("stroke", isDarkMode.value ? '#E2E8F0' : '#4A5568') // Explicitly set stroke color
                .call(drag)
                //.raise()
        );
};
const renderText = () => {
    g.selectAll(".node-text").raise()
    g.selectAll(".node-text")
        .data(props.treeNodes, d => d.id)
        .join(
            enter => enter.append("text")
                .attr("class", "node-text")
                .attr("id", d => `text-${d.id}`)
                .attr("x", d => d.x)
                .attr("y", d => d.y)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .style("fill", isDarkMode.value ? '#FFFFFF' : '#000000') // Explicitly set text color
                .text(d => d.name)
        );

};
const renderLinks = () => {
    const updatedLinks = props.treeEdges.map((link, index) => ({
        ...link,
        id: link.id || `edge-${index}`, // Ensure each link has a unique ID
        source: props.treeNodes.find(node => node.id === link.source.id) || link.source,
        target: props.treeNodes.find(node => node.id === link.target.id) || link.target
    }));

    g.selectAll(".link", d => d.id)
        .data(updatedLinks)
        .join("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", isDarkMode.value ? '#718096' : '#4A5568') // Explicitly set stroke color
        .attr("d", d => {
            // const tolerance = 10; // Adjust this value as needed
            // if (d.source.y > d.target.y + tolerance) {
                // Source node is significantly lower than the target node
                // Create a cubic Bézier curve
                const controlPoint1 = { x: d.source.x, y: d.source.y + 160 }; // Control point 1
                const controlPoint2 = { x: d.target.x, y: d.target.y - 160 }; // Control point 2
                
                return `M${d.source.x},${d.source.y - 30}C${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${d.target.x},${d.target.y - 30}`;
            // } else {
            //     // console.log(d.source, d.target)
            //     // Source node is not significantly lower than the target node
            //     // Create a standard link with one control point
            //     const linkGenerator = d3.linkVertical()
            //         .x(d => d.x)
            //         .y(d => d.y - 30);
                
            //     return linkGenerator({
            //         source: { x: d.source.x, y: d.source.y },
            //         target: { x: d.target.x, y: d.target.y }
            //     });
            // }
        })
        .attr("marker-end", "url(#arrow)");
};




watch(() => [props.treeNodes, props.treeEdges], () => {
    // console.log('Child received updated treeNodes:', props.treeNodes);
    // console.log('Child received updated treeEdges:', props.treeEdges);
    simulation.force("link").links(props.treeEdges);
    simulation.nodes(props.treeNodes);
    renderGraph();
}, { deep: true });
 
function updateDarkMode() {
    const darkModeSession = sessionStorage.getItem('dark-mode');
    console.log("darkModeSession", darkModeSession)
    isDarkMode.value = darkModeSession === 'true';
    if (svg) svg.classed('dark', isDarkMode.value);
}



onBeforeUnmount(() => {
    window.removeEventListener('storage', updateDarkMode);
});


watch(() => isDarkMode.value, (newValue) => { /* ... */ }, { immediate: true });

</script>

  


<style scoped>
.node {
    fill: var(--tw-bg-opacity);
    stroke: var(--tw-stroke-opacity);
    stroke-width: 3px;
    @apply bg-white dark:bg-gray-800 stroke-current dark:text-gray-200;
}

.node-text {
    fill: var(--tw-text-opacity);
    font-size: 1rem;
    @apply text-black dark:text-white;
}

.link {
    fill: none;
    stroke: var(--tw-link-opacity);
    stroke-width: 2px;
    @apply stroke-current dark:stroke-gray-400;
}

.arrowHead {
    fill: var(--tw-arrow-opacity);
    @apply text-gray-400 dark:text-gray-600;
}
</style>
  
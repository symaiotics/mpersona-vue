<template>
    <div class="relative p-4">
        <div class="flex space-x-4 mb-4">
            <button @click="highlight('context')" class="px-4 py-2 bg-red-500 text-white rounded">Context</button>
            <button @click="highlight('structure')" class="px-4 py-2 bg-blue-500 text-white rounded">Structure</button>
            <button @click="highlight('content')" class="px-4 py-2 bg-yellow-500 text-black rounded">Content</button>
        </div>

        <div class="relative p-4 border">
            <!-- Wrapper div -->
            <div class="relative">
                <!-- Original text -->
                <div ref="textContent" class="z-10 font-sans text-base leading-normal p-0 preserve-newlines" @mouseup="captureSelection"
                    v-html="props.originalText"></div>

                <!-- Highlighted text overlay -->
                <div ref="highlightedContent"
                    class="absolute inset-0 z-20 font-sans text-base leading-normal pointer-events-none  preserve-newlines"
                    v-html="highlightedText"></div>

                <!-- {{ highlightedJSON }}
                <br/>
                {{ highlightedSegmentsJSON }} -->
            </div>
        </div>
    </div>
</template>
  


<script setup>
import { ref, computed, onMounted } from 'vue';


let props = defineProps({
    originalText: { type: String, default: "Some basic longform text to be categorized" }
})
// const originalText = `
//   Fenton was born near Frewsburg, in Chautauqua County, New York, on July 4, 1819.[1] He was the son of a farmer, and schoolteacher, George Washington Fenton (1783–1860) and Elsey (née Owen) Fenton (1790–1875).[2] He had four siblings: Roswell Owen Fenton, George Washington Fenton Jr., William H.H. Fenton, and John Freeman Fenton.[3]



// His paternal grandparents were Roswell Fenton and Deborah (née Freeman) Fenton and his maternal grandfather was John Owen of Carroll, New York.[3] His paternal aunt, Hannah Fenton was the wife of Lambert Van Buren of Kinderhook, New York.[4]

// He was educated in the district school, Cary's Academy near Cincinnati, Ohio, and the Fredonia Academy.[5]
//         `;
const highlights = ref([]);

const textContent = ref(null);
const highlightedContent = ref(null);

//   const captureSelection = () => {
//     const selection = window.getSelection();
//     if (!selection.rangeCount) return;

//     const range = selection.getRangeAt(0);
//     const start = range.startOffset;
//     const end = range.endOffset;

//     const newHighlight = { start, end, type: 'pending' };

//     for (let i = 0; i < highlights.value.length; i++) {
//         const highlight = highlights.value[i];

//         if (newHighlight.start <= highlight.end && newHighlight.end >= highlight.start) {
//             // Overlapping
//             if (highlight.type === newHighlight.type) {
//                 // Merge if they're the same type
//                 highlight.start = Math.min(newHighlight.start, highlight.start);
//                 highlight.end = Math.max(newHighlight.end, highlight.end);
//                 return;
//             } else {
//                 // Split if they're different types
//                 if (newHighlight.start > highlight.start) {
//                     highlights.value.push({ start: highlight.start, end: newHighlight.start, type: highlight.type });
//                 }
//                 if (newHighlight.end < highlight.end) {
//                     highlights.value.push({ start: newHighlight.end, end: highlight.end, type: highlight.type });
//                 }
//                 // Remove the original highlight, since it's now been split
//                 highlights.value.splice(i, 1);
//                 i--; // Decrement the index to account for the removed item
//             }
//         }
//     }

//     // Add the new highlight
//     highlights.value.push(newHighlight);
// };


// const captureSelection = () => {
//     const selection = window.getSelection();
//     if (!selection.rangeCount) return;

//     const range = selection.getRangeAt(0);
//     const start = range.startOffset;
//     const end = range.endOffset;

//     const newHighlight = { start, end, type: 'pending' };

//     for (let i = 0; i < highlights.value.length; i++) {
//         const highlight = highlights.value[i];

//         // Completely contained
//         if (newHighlight.start <= highlight.start && newHighlight.end >= highlight.end) {
//             // Remove the fully contained highlight
//             highlights.value.splice(i, 1);
//             i--; // Decrement the index to account for the removed item
//             continue;
//         }

//         // Partial overlap
//         if (newHighlight.start < highlight.end && newHighlight.end > highlight.start) {
//             if (highlight.type !== newHighlight.type) {
//                 // If they're of different types, trim or split the existing highlight
//                 if (newHighlight.start > highlight.start) {
//                     highlight.end = newHighlight.start;
//                 } else if (newHighlight.end < highlight.end) {
//                     highlight.start = newHighlight.end;
//                 }
//             } else {
//                 // If they're of the same type, extend the existing highlight
//                 highlight.start = Math.min(newHighlight.start, highlight.start);
//                 highlight.end = Math.max(newHighlight.end, highlight.end);
//                 return;
//             }
//         }
//     }

//     // Add the new highlight
//     highlights.value.push(newHighlight);
// };


// const highlight = (type) => {
//     // Update only the 'pending' highlights
//     for (const highlight of highlights.value) {
//         if (highlight.type === 'pending') {
//             highlight.type = type;
//         }
//     }
// };

let lastSelection = ref(null);

const captureSelection = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const start = range.startOffset;
    const end = range.endOffset;

    lastSelection.value = { start, end };
};

const highlight = (type) => {
    if (!lastSelection.value) return;

    const newHighlight = { ...lastSelection.value, type };

    for (let i = 0; i < highlights.value.length; i++) {
        const highlight = highlights.value[i];

        // Completely contained
        if (newHighlight.start <= highlight.start && newHighlight.end >= highlight.end) {
            highlights.value.splice(i, 1);
            i--;
            continue;
        }

        // Partial overlap
        if (newHighlight.start < highlight.end && newHighlight.end > highlight.start) {
            if (highlight.type !== newHighlight.type) {
                if (newHighlight.start > highlight.start) {
                    highlight.end = newHighlight.start;
                } else if (newHighlight.end < highlight.end) {
                    highlight.start = newHighlight.end;
                }
            } else {
                highlight.start = Math.min(newHighlight.start, highlight.start);
                highlight.end = Math.max(newHighlight.end, highlight.end);
                return;
            }
        }
    }

    // Add the new highlight
    highlights.value.push(newHighlight);

    // Reset the last selection
    lastSelection.value = null;
};

const highlightedText = computed(() => {
    const sortedHighlights = [...highlights.value].sort((a, b) => a.start - b.start);

    let result = '';
    let textPointer = 0;
    let highlightPointer = 0;

    while (textPointer < props.originalText.length) {
        if (highlightPointer < sortedHighlights.length && textPointer === sortedHighlights[highlightPointer].start) {
            const highlight = sortedHighlights[highlightPointer];
            const highlightClass = `highlight-${highlight.type}`;
            result += `<span class="${highlightClass}">${props.originalText.substring(highlight.start, highlight.end)}</span>`;
            textPointer = highlight.end;
            highlightPointer++;
        } else {
            result += props.originalText[textPointer];
            textPointer++;
        }
    }

    return result;
});



const highlightedJSON = computed(() => {
    let contextText = '';
    let structureText = '';
    let contentText = '';

    for (const highlight of highlights.value) {
        const segment = props.originalText.substring(highlight.start, highlight.end);
        switch (highlight.type) {
            case 'context':
                contextText += segment.replaceAll(/\n/g, "");
                break;
            case 'structure':
                structureText += segment.replaceAll(/\n/g, "");
                break;
            case 'content':
                contentText += segment.replaceAll(/\n/g, "");
                break;
        }
    }

    return {
        context: contextText,
        structure: structureText,
        content: contentText
    };
});


const highlightedSegmentsJSON = computed(() => {
    let contextSegments = [];
    let structureSegments = [];
    let contentSegments = [];

    for (const highlight of highlights.value) {
        const segment = props.originalText.substring(highlight.start, highlight.end);
        switch (highlight.type) {
            case 'context':
                contextSegments.push(segment);
                break;
            case 'structure':
                structureSegments.push(segment);
                break;
            case 'content':
                contentSegments.push(segment);
                break;
        }
    }

    return {
        context: contextSegments,
        structure: structureSegments,
        content: contentSegments
    };
});


</script>
  
<style>

::selection {
    background-color: lightblue;
    color: black; /* This will set the color of the text when selected. Adjust as needed. */
}

/* For browser compatibility, also include the following */
::-moz-selection {
    background-color: lightblue;
    color: black;
}


.dark ::selection {
    background-color: darkblue;
    color: white; /* This will set the color of the text when selected. Adjust as needed. */
}

/* For browser compatibility, also include the following */
.dark ::-moz-selection {
    background-color: darkblue;
    color: white;
}


.preserve-newlines {
  white-space: pre-line;
}

.highlight-context {
    background-color: #ff54547c;
    color: black;
}

.highlight-structure {
    background-color: #add8e6aa;
    color: black;
}

.highlight-content {
    background-color: #ffd392be;
    color: black;
}
</style>
  
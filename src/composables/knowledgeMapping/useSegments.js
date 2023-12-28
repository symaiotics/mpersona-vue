import { ref, onMounted, onUnmounted, computed } from 'vue'
import configuredAxios from "@/utils/axios.js"
import { notify } from "notiwind"

import { useTags } from '@/composables/knowledgeMapping/useTags.js';
const { filterTags } = useTags()

let segments = ref(null); //From the database
let selectedSegment = ref(null) //the actively selected persona

let segmentsPending = ref([]); //Not yet saved
let selectedSegmentPending = ref(null) //the actively selected segment

let applyFilter = ref(false);

// Computed property to filter segments based on filterTags
const segmentsFiltered = computed(() => {
    if (filterTags.value.length > 0 && applyFilter.value) {
        // Extracting the UUIDs from filterTags
        const filterTagUuids = filterTags.value.map(tag => tag.uuid);

        // Filtering segments that have at least one tag UUID from filterTags
        return segments.value.filter(doc =>
            doc.tagUuids.some(tagUuid => filterTagUuids.includes(tagUuid))
        );
    }
    // If no filterTags, return all segments
    return segments.value;
});


//This is a single segment
//We save an array of these
const defaultSegment = {
    name: { en: null, fr: null },
    description: { en: null, fr: null },
    keywords: null,
    categories: null,
    documentName: { en: null, fr: null },
    documentDescription: { en: null, fr: null },
    documentUuid: null,
    cursorStart: null,
    cursorEnd: null,
    htmlContent: null,
    htmlLength: null,
    textContent: null,
    textLength: null,
    tagUuids: null,
};

const newSegment = ref({ ...defaultSegment });

// by convention, composable function names start with "use"
export function useSegments() {

    const resetSegment = () => {
        Object.assign(newSegment.value, defaultSegment);
    };

    const addNewSegment = () => {
        resetSegment();
        selectedSegment.value = newSegment.value;
    };

    async function getSegments(knowledgeSetUuid) {
        try {
            let params = { params: { knowledgeSetUuid } }
            var response = await configuredAxios.get(import.meta.env.VITE_API_URL + '/segments', params);
            segments.value = response.data.payload;
            console.log("Loaded Segment", segments.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async function createSegments(knowledgeSetUuid, segments) {
        try {
            if (!Array.isArray(segments)) segments = [segments]
            var params = { knowledgeSetUuid, segments }
            var response = await configuredAxios.post(import.meta.env.VITE_API_URL + '/segments', params);
            console.log("Created Segment(s)", response.data.payload)
            notify({ group: "success", title: "Success", text: "Segment(s) created successfully" }, 4000) // 4s
            getSegments(knowledgeSetUuid);

        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error creating Segment. Try again" }, 4000) // 4s

        }
    }


    async function updateSegments(knowledgeSetUuid, segments) {
        try {
            if (!Array.isArray(segments)) segments = [segments]
            var params = { knowledgeSetUuid, segments }
            var response = await configuredAxios.patch(import.meta.env.VITE_API_URL + '/segments', params);
            console.log("Created Segment(s)", response.data.payload)
            notify({ group: "success", title: "Success", text: "Segment(s) created successfully" }, 4000) // 4s
            getSegments(knowledgeSetUuid);

        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error creating Segment. Try again" }, 4000) // 4s

        }
    }


    async function addRemoveTags(knowledgeSetUuid, operation = 'add', segments, tags) {
        try {
            if (!Array.isArray(segments)) segments = [segments]
            if (!Array.isArray(tags)) tags = [tags]
            var params = { knowledgeSetUuid, operation, segments, tags }
            var response = await configuredAxios.patch(import.meta.env.VITE_API_URL + '/segments/tags', params);
            console.log("Added tags to segments(s)", response.data.payload)
            notify({ group: "success", title: "Success", text: "Added tags to Segments" }, 4000) // 4s
            getSegments(knowledgeSetUuid);

        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error tagging Segment. Try again" }, 4000) // 4s

        }
    }

    async function deleteSegments(knowledgeSetUuid, segmentUuids) {
        try {
            var params = { knowledgeSetUuid, segmentUuids }
            var response = await configuredAxios.delete(import.meta.env.VITE_API_URL + '/segments', params);
            console.log("Deleted Segment(s)", response.data.payload);
            notify({ group: "success", title: "Success", text: "Segment(s) deleted successfully" }, 4000) // 4s
            getSegments(knowledgeSetUuid);
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error deleting Segment(s). Try again" }, 4000) // 4s
        }
    }

    // expose managed state as return value
    return {
        defaultSegment,
        newSegment,
        segments,
        segmentsFiltered,
        applyFilter,

        segmentsPending,
        selectedSegment,
        selectedSegmentPending,
        addNewSegment,
        resetSegment,


        getSegments,
        createSegments,
        updateSegments,
        addRemoveTags,
        deleteSegments

    }
}
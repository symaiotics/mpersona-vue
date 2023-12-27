import { ref, onMounted, onUnmounted } from 'vue'
import configuredAxios from "@/utils/axios.js"
import { notify } from "notiwind"

let tags = ref(null); //From the database
let filterTags = ref([])
let selectedTag = ref(null) //the actively selected persona

//This is a single tag
//We save an array of these
const defaultTag = {
    name: { en: '', fr: '' },
    description: { en: '', fr: '' },
    context: { en: '', fr: '' }
};

const newTag = ref({ ...defaultTag });

// by convention, composable function names start with "use"
export function useTags() {

    const resetTag = () => {
        Object.assign(newTag.value, defaultTag);
    };

    const addNewTag = () => {
        resetTag();
        selectedTag.value = newTag.value;
    };

    async function getTags(knowledgeSetUuid) {
        try {
            let params = { params: { knowledgeSetUuid } }
            var response = await configuredAxios.get(import.meta.env.VITE_API_URL + '/tags', params);
            tags.value = response.data.payload;
            console.log("Loaded Tag", tags.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async function createTags(knowledgeSetUuid, tags) {
        try {
            if (!Array.isArray(tags)) tags = [tags]
            var params = { knowledgeSetUuid, tags }
            var response = await configuredAxios.post(import.meta.env.VITE_API_URL + '/tags', params);
            console.log("Created Tag(s)", response.data.payload)
            notify({ group: "success", title: "Success", text: "Tag(s) created successfully" }, 4000) // 4s
            getTags(knowledgeSetUuid);

        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error creating Tag. Try again" }, 4000) // 4s

        }
    }


    async function updateTags(knowledgeSetUuid, tags) {
        try {
            if (!Array.isArray(tags)) tags = [tags]
            var params = { knowledgeSetUuid, tags }
            var response = await configuredAxios.patch(import.meta.env.VITE_API_URL + '/tags', params);
            console.log("Created Tag(s)", response.data.payload)
            notify({ group: "success", title: "Success", text: "Tag(s) created successfully" }, 4000) // 4s
            getTags(knowledgeSetUuid);

        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error creating Tag. Try again" }, 4000) // 4s

        }
    }    

    async function deleteTags(knowledgeSetUuid, tagUuids) {
        try {
            var params = { knowledgeSetUuid, tagUuids }
            var response = await configuredAxios.delete(import.meta.env.VITE_API_URL + '/tags', params);
            console.log("Deleted Tag(s)", response.data.payload);
            notify({ group: "success", title: "Success", text: "Tag(s) deleted successfully" }, 4000) // 4s
            getTags(knowledgeSetUuid);
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error deleting Tag(s). Try again" }, 4000) // 4s
        }
    }

    // expose managed state as return value
    return {
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

    }
}
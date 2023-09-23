import { ref, onMounted, onUnmounted } from 'vue'
import configuredAxios from "@/utils/axios.js"

import { notify } from "notiwind"


let facts = ref(null);
let factSearchString = ref(null);
let factSearchResults = ref(null);

// by convention, composable function names start with "use"
export function useFacts() {

    async function getFacts() {
        try {
            var response = await configuredAxios.get(import.meta.env.VITE_API_URL + '/facts');
            facts.value = response.data.payload;
            //TODO enhance to receive the code as well
            console.log("Loaded Facts", facts.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async function createFacts(newFacts) {
        try {
            if (!Array.isArray(newFacts)) newFacts = [newFacts]
            var params = { facts: newFacts }
            var response = await configuredAxios.post(import.meta.env.VITE_API_URL + '/facts', params);
            // currentPersona.value = response;    
            notify({ group: "success", title: "Success", text: "Facts created successfully" }, 4000) // 4s
            getFacts();
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error creating facts. Try again" }, 4000) // 4s
        }
    }

    async function searchFacts(searchString) {
        try {
            var params = { searchString: searchString }
            var response = await configuredAxios.post(import.meta.env.VITE_API_URL + '/facts/search', params);
            // currentPersona.value = response;
            factSearchResults.value = response.data.payload;
            // notify({ group: "success", title: "Success", text: "Facts created successfully" }, 4000) // 4s
            // getFacts();
        }
        catch (error) {
            console.log("Error", error)
            // notify({ group: "failure", title: "Error", text: "Error creating facts. Try again" }, 4000) // 4s
        }
    }

    // expose managed state as return value
    return {
        facts, factSearchString, factSearchResults,
        getFacts,
        createFacts,
        searchFacts
    }
}
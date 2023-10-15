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

    //Promise driven, so that the personas can use it when making their calls
    async function searchFacts(searchString, knowledgeProfileUuids) {
        return new Promise(async (resolve, reject) => {
            try {

                if (!knowledgeProfileUuids.length) reject("No KPs selected")
                else {
                    var params = { searchString: searchString, knowledgeProfileUuids: knowledgeProfileUuids }
                    console.log("SEarching with params", params)
                    var response = await configuredAxios.post(import.meta.env.VITE_API_URL + '/facts/search', params);
                    console.log("Searched facts", response.data.payload)
                    factSearchResults.value = response.data.payload;
                    resolve(response.data.payload)
                }
            }
            catch (error) {
                console.log("Error", error)
                reject(error)
            }
        })
    }

    // expose managed state as return value
    return {
        facts, factSearchString, factSearchResults,
        getFacts,
        createFacts,
        searchFacts
    }
}
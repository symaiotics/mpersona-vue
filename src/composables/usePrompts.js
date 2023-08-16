import { ref, onMounted, onUnmounted } from 'vue'
import axios from "axios";

import { useModels } from '@/composables/useModels.js'
const { adminModels, selectedModel } = useModels()

var temperature = ref(0.5)
var promptResponse = ref(null)
var promptResponseCode = ref(null)

// by convention, composable function names start with "use"
export function usePrompts() {
    async function promptOpenAI(userPrompt, systemPrompt) {

        return new Promise(async (resolve, reject) => {
            try {
                var params = {
                    userPrompt: userPrompt,
                    systemPrompt: systemPrompt,
                    model: adminModels.value[selectedModel.value].model,
                    temperature: temperature.value
                }

                // console.log("params", params)
                var response = await axios.post(import.meta.env.VITE_API_URL + '/prompts', params);

                // console.log(response)
                promptResponse.value = response.data.payload.text[0].message.content;
                promptResponse.value = promptResponse.value.replaceAll('\n', "<br/>")
                promptResponseCode.value = response.data.payload.code;

                if (promptResponseCode.value.length) {

                    for (var a = 0; a < promptResponseCode.value.length; a++) {
                        // console.log(a, promptResponseCode.value[a].code)
                        promptResponseCode.value[a].code = promptResponseCode.value[a].code.replaceAll('\n', "<br/>");
                    }
                }

                //TODO enhance to receive the code as well
                console.log(promptResponse.value)
            }
            catch (error) {
                console.log("Error", error)
            }

        }
        )

    }

    // expose managed state as return value
    return {
        promptResponse,
        promptResponseCode,

        promptOpenAI
    }
}
import { ref } from 'vue'

let adminModels = ref(
    [
        { maxTokens:128000, model: "gpt-4-1106-preview", label: "OpenAI GPT-4 Turbo (128k)" },
        { maxTokens:8192, model: "gpt-4", label: "OpenAI GPT-4 (8k)" },
        { maxTokens:16384, model: "gpt-3.5-turbo-16k", label: "OpenAI GPT-3.5 Turbo (16k)" },
        { maxTokens:4096, model: "gpt-3.5-turbo", label: "OpenAI GPT-3.5 Turbo (4k)" },
    ]
)

let selectedModel = ref(adminModels.value[0])

// by convention, composable function names start with "use"
export function useModels() {

    // expose managed state as return value
    return {
        adminModels,
        selectedModel,
    }
}
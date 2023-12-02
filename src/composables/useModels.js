import { ref } from 'vue'

let adminModels = ref(
    [
        { provider: 'anthropic', maxTokens: 200000, per1kInput: 0.008, per1kOutput: 0.024, model: "claude-2.1", label: "Claude 2.1" },
        { provider: 'anthropic', maxTokens: 100000, per1kInput: 0.00163, per1kOutput: 0.00551, model: "claude-instant-1.2", label: "Claude 2.1 Instant" },
        { provider: 'openAi', maxTokens: 128000, per1kInput: 0.01, per1kOutput: 0.03, model: "gpt-4-1106-preview", label: "OpenAI GPT-4 Turbo (128k)" },
        { provider: 'openAi', maxTokens: 8192, per1kInput: 0.03, per1kOutput: 0.06, model: "gpt-4", label: "OpenAI GPT-4 (8k)" },
        { provider: 'openAi', maxTokens: 16384, per1kInput: 0.001, per1kOutput: 0.002, model: "gpt-3.5-turbo-1106", label: "OpenAI GPT-3.5 Turbo (16k)" },
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
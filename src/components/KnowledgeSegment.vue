<template>
    <div class="max-w-full rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800 p-4 relative flex items-start m-2">
      <div v-if="showCheckbox" class="pr-4 flex items-center">
        <input type="checkbox" class="form-checkbox h-6 w-6" @change="emitChecked($event.target.checked)">
      </div>
      <div class="flex-grow">
        <button @click="emitDeleteSegment"
          class="absolute top-0 right-0 m-1 bg-red-500 text-white rounded-full p-1 text-xs w-6 h-6 flex items-center justify-center">
          &times;
        </button>
  
        <div class="px-6">
          <p class="text-gray-700 dark:text-gray-300 text-base">
            {{ status }}
          </p>
        </div>
  
        <div class="px-6 py-2">
          <div class="font-bold text-xl mb-2">{{ title }}</div>
          <p class="text-gray-700 dark:text-gray-300 text-base">
            {{ content }}
          </p>
        </div>
        <div class="px-6 pt-4 pb-2">
          <span
            class="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 mr-2 mb-2"
            v-for="(keyword, index) in keywords" :key="index">
            {{ keyword }}
          </span> ({{ keywordCount }})
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    index: Number,
    data: Object,
    showCheckbox: Boolean
  });
  
  const emit = defineEmits(['deleteSegment', 'checked']);
  
  const emitDeleteSegment = () => {
    emit('deleteSegment', props.index);
  };
  
  const emitChecked = (checked) => {
    emit('checked', { index: props.index, checked });
  };
  
  const getNestedValue = (obj, path, defaultValue = undefined) => {
    return path.reduce((acc, key) => {
      return acc && acc[key] !== undefined ? acc[key] : defaultValue;
    }, obj);
  };
  
  const title = computed(() => {
    const summary = getNestedValue(props.data, ['json', 'summary', 'en'], '');
    return summary.length > 50 ? summary.slice(0, 50) + '...' : summary;
  });
  
  const content = computed(() => {
    if(props.data.status == 'pending') 
    {
        const altContent = getNestedValue(props.data, [ 'message'], '');
        if(altContent)
        return altContent.length > 200 ? altContent.slice(0, 200) + '...' : altContent;
    else return 'Pending...';
    }
    else
    {
        const context = getNestedValue(props.data, ['json', 'context', 'en'], '');
        return context.length > 200 ? context.slice(0, 200) + '...' : context;

    }
  });
  
  const keywords = computed(() => {
    const keywordsArray = getNestedValue(props.data, ['json', 'keywords'], []);
    return keywordsArray.slice(0, 3);
  });
  
  const status = computed(() => {
    return getNestedValue(props.data, ['status'], 'Unknown Status');
  });
  
  const keywordCount = computed(() => {
    const keywordsArray = getNestedValue(props.data, ['json', 'keywords'], []);
    return keywordsArray.length;
  });
  </script>
  
  <style scoped>
  /* Tailwind CSS styles with dark mode variants */
  </style>
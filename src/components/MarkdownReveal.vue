<template>
    <div class="reveal">
      <div class="slides">
        <section ref="markdownSection" data-markdown></section>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { defineExpose } from 'vue';
  import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';
  import Reveal from 'reveal.js';
  import 'reveal.js/dist/reveal.css';
  import 'reveal.js/dist/theme/black.css';
  
  const markdownSection = ref(null);
  defineExpose({ markdownSection });
  
let props = defineProps({markdownContent:{type:String, default:"##Slide 1"}})


  
  onMounted(() => {
    const scriptTag = document.createElement('script');
    scriptTag.type = 'text/template';
    scriptTag.textContent = props.markdownContent;
    markdownSection.value.appendChild(scriptTag);
    
    let deck = new Reveal({
      plugins: [Markdown],
    });
    deck.initialize();
  });
  </script>
  
  
<style>
html, body {
    overflow: auto !important;
    height: auto !important;
    /* width: 100% !important; */
}

.reveal {
    /* height: auto !important; */
    /* width: 100% !important; */
    /* margin-bottom: 20px; Adjust as needed */
}
</style>